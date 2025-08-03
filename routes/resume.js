import express from "express";
import Resume from "../models/Resume.js";

const router = express.Router();

// save and update
router.post("/", async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.userId;

    if (!data || !data.title) {
      return res.status(400).json({ message: "Missing resume data or title" });
    }

    let resume;
    const { resumeId, ...resumeFields } = data;

    if (resumeId) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { ...resumeFields },
        { new: true }
      );
    } else {
      resume = await Resume.create({ ...resumeFields, userId });
    }

    res.status(200).json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save resume" });
  }
});

// Get all resumes for user
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    console.log("Failed to fetch resume ", err);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
});

// Get single resume by ID
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json(resume);
  } catch (err) {
    console.log("Failed to fetch resume ", err);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
});

// Delete resume
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json({ message: "Resume deleted" });
  } catch (err) {
    console.log("Failed to delete resume ", err);
    res.status(500).json({ message: "Failed to delete resume" });
  }
});

export default router;