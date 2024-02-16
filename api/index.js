import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

//Import routes
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

//Connect MongoDB to databse
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server is running on port 5000!");
});

app.use("/api/auth", authRoute);
app.use("/api/auth/user", userRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
