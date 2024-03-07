import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, getComments } from "../controllers/comment.controller.js";

router.post("/create", verifyToken, createComment);
router.get("/get-comments/:postId", getComments);

export default router;
