import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// connect to cloudinary server
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected to database:");
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });

const app = express();

// serve the static files from ie css, js, index.js frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// start server
app.listen(7000, () => {
  console.log("Server started on port 7000");
});
