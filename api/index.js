import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

//Import routes
import authRoute from "./routes/auth.routes.js";

app.use("/api/auth", authRoute);

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
