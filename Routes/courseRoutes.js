import express from "express";
import multer from "multer";
import Course from "../models/CourseModels.js";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});
const upload = multer({ storage });

// ✅ CREATE course
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, duration, description, popular, outline } = req.body;
    
    // Validate outline JSON
    let parsedOutline = [];
    try {
      parsedOutline = JSON.parse(outline || "[]");
      if (!Array.isArray(parsedOutline)) {
        throw new Error("Outline must be an array");
      }
    } catch (err) {
      return res.status(400).json({ 
        error: "Invalid outline format", 
        details: err.message,
        receivedOutline: outline 
      });
    }

    const newCourse = new Course({
      image: req.file ? path.join('/uploads', req.file.filename) : "",
      title,
      duration,
      description,
      popular: popular === "true",
      outline: parsedOutline,
    });
    await newCourse.save();
    res.status(201).json({ message: "✅ Course created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📖 READ all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⭐ READ popular courses
router.get("/popular", async (req, res) => {
  try {
    const popularCourses = await Course.find({ popular: true });
    res.json(popularCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📖 READ single course by ID (for CourseView)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ UPDATE course
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, duration, description, popular, outline } = req.body;

    // Validate outline JSON if provided
    let parsedOutline;
    if (outline) {
      try {
        parsedOutline = JSON.parse(outline);
        if (!Array.isArray(parsedOutline)) {
          throw new Error("Outline must be an array");
        }
      } catch (err) {
        return res.status(400).json({ 
          error: "Invalid outline format", 
          details: err.message,
          receivedOutline: outline 
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        image: req.file ? path.join('/uploads', req.file.filename) : undefined,
        title,
        duration,
        description,
        popular: popular === "true",
        outline: parsedOutline,
      },
      { new: true }
    );

    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found!" });

    res.json({ message: "✏️ Course updated successfully!", updatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ DELETE course
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Course not found!" });

    res.json({ message: "🗑️ Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
