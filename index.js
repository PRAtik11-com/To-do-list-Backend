const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;
const db_file = "db.json";

app.use(cors());
app.use(bodyParser.json());


const readDatabase = () => {
    const data = fs.readFileSync(db_file);
    return JSON.parse(data);
};


const writeDatabase = (data) => {
    fs.writeFileSync(db_file, JSON.stringify(data, null, 2));
};

// Get 
app.get("/tasks", (req, res) => {
    const data = readDatabase();
    res.json(data.tasks);
});

// Get a single task by ID
app.get("/tasks/:id", (req, res) => {
    const data = readDatabase();
    const task = data.tasks.find(t => t.id === parseInt(req.params.id));
    task ? res.json(task) : res.status(404).json({ message: "Task not found" });
});

// Add task
app.post("/tasks", (req, res) => {
    const data = readDatabase();
    const newTask = { id: Date.now(), text: req.body.text };
    data.tasks.push(newTask);
    writeDatabase(data);
    res.status(201).json(newTask);
});

// Update task
app.put("/tasks/:id", (req, res) => {
    const data = readDatabase();
    const index = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        data.tasks[index].text = req.body.text;
        writeDatabase(data);
        res.json(data.tasks[index]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
    const data = readDatabase();
    const filteredTasks = data.tasks.filter(t => t.id !== parseInt(req.params.id));
    if (filteredTasks.length !== data.tasks.length) {
        data.tasks = filteredTasks;
        writeDatabase(data);
        res.json({ message: "Task deleted" });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
