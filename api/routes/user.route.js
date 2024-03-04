import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser, deleteUser, signout, getUsers } from "../controllers/user.controller.js";

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/get-users", verifyToken, getUsers);

export default router;
