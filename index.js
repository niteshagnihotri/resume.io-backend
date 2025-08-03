import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from "./routes/auth.js";
import pdfRoutes from "./routes/generate-pdf.js";
import resumeRoutes from "./routes/resume.js";
import { authenticate } from './middleware/authenticate.js';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "https://resume-io-ai.vercel.app",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); 
  });


app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/resume", authenticate, resumeRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});