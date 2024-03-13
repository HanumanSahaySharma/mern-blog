import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
console.log(__dirname);

//Import routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";

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
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
