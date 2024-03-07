import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;
  if (userId !== req.user.id) {
    return next(errorHandler(403, "You are not allowed to create this comment"));
  }
  if (!content) {
    return next(errorHandler(403, "Please add a comment"));
  }
  try {
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    return res.status(201).json({ message: "Comment added" });
  } catch (error) {
    next(error);
  }
};
