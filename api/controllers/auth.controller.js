import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  let { username, email, password } = req.body;
  try {
    if (!username || !email || !password || username === "" || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"));
    }
    const userExits = await User.findOne({ email: req.body.email });
    if (userExits) {
      return res.status(200).json({ message: "This email is already register.", success: false });
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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All field are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const userPassword = await bcrypt.compareSync(password, user.password);
    if (!userPassword) {
      return next(errorHandler(500, "Invalid password"));
    } else {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      const { password: pass, ...userInfo } = user._doc;
      return res.status(200).cookie("access_token", token, { httpOnly: true }).json(userInfo);
      //res.status(200).json({ message: "Login sucessfully", token });
    }
  } catch (error) {
    next(error);
  }
};
