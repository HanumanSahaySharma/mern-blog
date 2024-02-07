import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  let { username, email, password } = req.body;
  try {
    if (!username || !email || !password || username === "" || email === "" || password === "") {
      next(errorHandler(400, "All fields are required"));
    }
    const userExits = await User.findOne({ email: req.body.email });
    if (userExits) {
      res.status(200).json({ message: "This email is already register.", success: false });
    }
    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Save user to databse
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successfully.", success: true });
  } catch (error) {
    next(error);
  }
};
