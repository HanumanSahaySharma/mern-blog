import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  let { name, email, password } = req.body;
  try {
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(200).json({ message: "This email is already register", success: false });
    }
    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Save user to databse
    const newUser = new User({ name, email, password: hashedPassword });
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
        name: user.name,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ message: "Login successfully", success: true, user: { name: user.name, email: user.email } });
    //res.status(200).json({ message: "Login sucessfully", token });
  } catch (error) {
    next(error);
  }
};
