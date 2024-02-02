import express from "express";
const router = express.Router();
import { signUp } from "../controllers/auth.controller.js";

router.post("/signup", signUp);

export default router;
