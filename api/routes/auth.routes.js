import express from "express";
const router = express.Router();
import { signUp, signIn, google } from "../controllers/auth.controller.js";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);

export default router;
