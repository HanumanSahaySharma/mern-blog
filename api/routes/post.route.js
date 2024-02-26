import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, deletePost, getPosts } from "../controllers/post.controller.js";

router.post("/create", verifyToken, createPost);
router.get("/get-posts", getPosts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);

export default router;
