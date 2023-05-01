import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userid: {
    type: String,
    required: true
  }, 
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userid: {
    type: String,
    required: true
  },  
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
});

const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { Comment, Post };