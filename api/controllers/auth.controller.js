import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  let { username, email, password } = req.body;
  try {
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(200).json({ message: "This email is already register", success: false });
    }
    // Encrypt user password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Save user to databse
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "Signup successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Invalid User"));
    }
    const userPassword = bcrypt.compareSync(password, user.password);
    if (!userPassword) {
      return next(errorHandler(500, "Invalid password"));
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    const { password: pass, ...rest } = user._doc;
    return res.status(200).cookie("access_token", token, { httpOnly: true }).json({
      message: "Login successfully",
      success: true,
      user: rest,
    });
    //res.status(200).json({ message: "Login sucessfully", token });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  let { username, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      const { password: pass, ...rest } = user._doc;
      return res.status(200).cookie("access_token", token, { httpOnly: true }).json({
        message: "SignIn successfully with google account",
        success: true,
        user: rest,
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: username.toLowerCase().split(" ").join(""),
        email,
        password: hashedPassword,
        profileImage: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      const { password: pass, ...rest } = newUser._doc;
      return res.status(201).cookie("access_token", token, { httpOnly: true }).json({
        message: "SignUp successfully with google account",
        success: true,
        user: rest,
      });
    }
  } catch (error) {
    next(error);
  }
};
