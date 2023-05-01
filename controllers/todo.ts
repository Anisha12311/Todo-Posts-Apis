import { Request, Response } from "express";
const User = require("../models/user.ts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Todo = require("../models/todo");

interface CustomRequest extends Request {
  session: any;
  userId: string;
  isAdmin: any;
}
module.exports.createTodo = async (req: CustomRequest, res: Response) => {
  const { title, description } = req.body;

  if (!(title && description)) {
    return res.status(400).send("All inputs are required");
  }

  try {
    const newTodo = new Todo({
      title,
      description,
      userid: req.userId,
      completed: false,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.getTodos = async (req: CustomRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let todos: any;
    if (req.isAdmin === "admin") {
      todos = await Todo.find().skip(startIndex).limit(limit);
    } else {
      todos = await Todo.find({ userid: req.userId })
        .skip(startIndex)
        .limit(limit);
    }
    const total = await Todo.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: endIndex < total,
    };
    res.json({ todos, pagination });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports.updateTodo = async (req: CustomRequest, res: Response) => {
  const { title, description, completed } = req.body;
  const id = req.params.id;

  try {
    const todo = await Todo.findById({ _id: id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.isAdmin === "user" && todo.userid !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed || todo.completed;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deleteTodo = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;

  try {
    const todo = await Todo.findById({ _id: id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.isAdmin === "user" && todo.userid !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await todo.deleteOne();

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.markTodoAsComplete = async (
  req: CustomRequest,
  res: Response
) => {
  const id = req.params.id;
  console.log(req.isAdmin);
  try {
    const todo = await Todo.findById({ _id: id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.isAdmin === "user" && todo.userid !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    todo.completed = true;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
