const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

// Main array to store todos
const todos = [];
let nextId = 1;

// 📍 Ping test
app.get('/ping', (req, res) => {
    res.send('pong');
});

// ➕ Add a new todo item
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
        id: nextId++,
        title,
        description: description || '',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 📥 Get all todo items
app.get('/todos', (req, res) => {
    res.json(todos);
});

// 📄 Get a specific todo item
app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ error: 'Todo item not found' });
    }
    res.json(todo);
});

// ✏️ Update a todo item
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { title, description, isCompleted } = req.body;
    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ error: 'Todo item not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.isCompleted = isCompleted;
    todo.updatedAt = new Date();

    res.json(todo);
});

// ❌ Delete a todo item
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === todoId);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo item not found' });
    }

    const deleted = todos.splice(index, 1);
    res.json({ message: 'Todo item deleted', deleted: deleted[0] });
});

// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});