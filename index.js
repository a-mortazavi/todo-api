const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

// آرایه‌ی اصلی برای نگهداری داده‌ها
const todos = [];
let nextId = 1;

// 📍 تست اتصال
app.get('/ping', (req, res) => {
    res.send('pong');
});

// ➕ اضافه کردن آیتم جدید
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'عنوان الزامی است' });
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

// 📥 دریافت همه‌ی آیتم‌ها
app.get('/todos', (req, res) => {
    res.json(todos);
});

// 📄 دریافت یک آیتم خاص
app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }
    res.json(todo);
});

// ✏️ ویرایش آیتم
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { title, description, isCompleted } = req.body;
    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.isCompleted = isCompleted;
    todo.updatedAt = new Date();

    res.json(todo);
});

// ❌ حذف آیتم
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === todoId);
    if (index === -1) {
        return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }

    const deleted = todos.splice(index, 1);
    res.json({ message: 'آیتم حذف شد', deleted: deleted[0] });
});

// 🚀 راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`سرور روی http://localhost:${PORT} اجرا شد`);
});
