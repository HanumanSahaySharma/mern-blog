import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser, deleteUser } from "../controllers/user.controller.js";

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
