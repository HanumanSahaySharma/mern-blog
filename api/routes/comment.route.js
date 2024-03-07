import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { createComment } from "../controllers/comment.controller.js";

router.post("/create", verifyToken, createComment);

export default router;
