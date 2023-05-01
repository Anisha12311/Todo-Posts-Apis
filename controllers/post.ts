import { Request, Response } from "express";

const { Post, Comment } = require("../models/posts");

interface CustomRequest extends Request {
  session: any;
  userId: string;
  isAdmin: any;
}
module.exports.createPosts = async (req: CustomRequest, res: Response) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).send("Text is required");
  }

  try {
    const newPost = new Post({
      text,
      userid: req.userId,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPosts = async (req: CustomRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const posts = await Post.find().skip(startIndex).limit(limit);
    const total = await Post.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: endIndex < total,
    };
    res.json({ posts, pagination });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.createComment = async (req: CustomRequest, res: Response) => {
  const { text } = req.body;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      text,
      userid: req.userId,
    });

    post.comments.push(newComment);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
