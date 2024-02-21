import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);

export default router;
