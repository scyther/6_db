const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Add a new student
app.post("/addStudent", async (req, res) => {
  try {
    const { studentName } = req.body;
    
    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const student = new Student({ studentName });
    const savedStudent = await student.save();
    
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error saving student", error });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
