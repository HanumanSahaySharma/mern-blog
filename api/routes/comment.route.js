import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getComments,
  likeComment,
  editComment,
  deleteComment,
  allComments,
} from "../controllers/comment.controller.js";

router.post("/create", verifyToken, createComment);
router.get("/get-comments/:postId", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/all-comments", verifyToken, allComments);

export default router;
