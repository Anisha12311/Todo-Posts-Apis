import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
   userid: {
        type: String,
        required: true
      },  
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
