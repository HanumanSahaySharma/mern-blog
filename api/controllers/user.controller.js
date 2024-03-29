import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 5) {
      return next(errorHandler(400, "Password must be at least 5 charectors"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username > 20) {
      return next(errorHandler(400, "Username must be between 6 and 20 charectors"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username can not contain space"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, "Username can only contain letters and numbers"));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profileImage: req.body.profileImage,
        },
      },
      {
        new: true,
      }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    return res.json({ user: rest, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({ message: "User deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({ message: "Signout successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errorHandler(401, "You are not allowed to see all users"));
  }
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 10;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find().sort({ createAt: sortDirection }).skip(startIndex).limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
    });
    return res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
