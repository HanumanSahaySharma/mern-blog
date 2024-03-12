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
    return res.status(201).json({ comment: newComment });
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404, "Comment not found");
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this comment"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );
    await editedComment.save();
    return res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (!req.user.isAdmin && comment.userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to delete this comment"));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
export const allComments = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      next(errorHandler(401, "You are not allowed to get all comments"));
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComment = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    return res.status(200).json({
      totalComments,
      lastMonthComment,
      comments,
    });
  } catch (error) {
    next(error);
  }
};
