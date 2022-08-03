const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
require("dotenv").config();

// It parses incoming JSON request and puts the parsed data in req
app.use(express.json());

// Need this cors very important idk why
app.use(cors());

// Mongoose connect from .env
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Imported Schemas from models folder
const Todo = require("./models/Todo");

// Display all the todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

// Make a new Todo
app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

// Delete items
app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json(result);
});

// Marks as Completed
app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

// Update the id
app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
