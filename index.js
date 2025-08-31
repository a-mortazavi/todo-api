const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 8000;

app.use(express.json());

// اتصال به PostgreSQL با متغیرهای محیطی
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydb',
});

// Ping test
app.get('/ping', (req, res) => res.send('pong'));

// Add a new todo
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const result = await pool.query(
      `INSERT INTO todos (title, description, isCompleted, createdAt, updatedAt)
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [title, description || '', false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           isCompleted = COALESCE($3, isCompleted),
           updatedAt = NOW()
       WHERE id = $4 RETURNING *`,
      [title, description, isCompleted, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
