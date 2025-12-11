const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Helper functions for in-memory storage
const findStudentById = (id) => {
  return global.students.find(student => student.id == id);
};

const findStudentIndexById = (id) => {
  return global.students.findIndex(student => student.id == id);
};

// ➕ CREATE STUDENT
router.post("/", async (req, res) => {
  try {
    // Check if we're using MongoDB or in-memory storage
    if (typeof global.students !== 'undefined') {
      // Using in-memory storage
      const { name, usn, sem } = req.body;
      
      // Validation
      if (!name || !usn || !sem) {
        return res.status(400).json({ error: "Name, USN, and sem are required" });
      }
      
      // Check if USN already exists
      const existingStudent = global.students.find(student => student.usn === usn);
      if (existingStudent) {
        return res.status(400).json({ error: "Student with this USN already exists" });
      }
      
      const student = {
        id: global.nextId++,
        name,
        usn,
        sem
      };
      
      global.students.push(student);
      return res.status(201).json({ message: "Student added", student });
    } else {
      // Using MongoDB
      // Accept legacy `class` in request bodies
      if (req.body.class && !req.body.sem) req.body.sem = req.body.class;
      const student = new Student(req.body);
      await student.save();
      const obj = student.toObject();
      obj.sem = obj.sem || obj.class;
      res.status(201).json({ message: "Student added", student: obj });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 READ ALL STUDENTS + SEARCH + FILTER
router.get("/", async (req, res) => {
  try {
    // Check if we're using MongoDB or in-memory storage
    if (typeof global.students !== 'undefined') {
      // Using in-memory storage
      const { name, usn, sem: classFilter } = req.query;

      let filteredStudents = global.students;
      
      if (name) {
        filteredStudents = filteredStudents.filter(student => 
          student.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      if (usn) {
        filteredStudents = filteredStudents.filter(student => student.usn === usn);
      }
      
      if (classFilter) {
        filteredStudents = filteredStudents.filter(student => student.sem === classFilter);
      }

      res.json(filteredStudents);
    } else {
      // Using MongoDB
      const { name, usn, sem: classFilter } = req.query;

      let filter = {};
      if (name) filter.name = { $regex: name, $options: "i" };
      if (usn) filter.usn = usn;
      if (classFilter) filter.sem = classFilter;

      const students = await Student.find(filter);
      const normalized = students.map(s => {
        const obj = s.toObject();
        obj.sem = obj.sem || obj.class;
        return obj;
      });
      res.json(normalized);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 READ SINGLE STUDENT
router.get("/:id", async (req, res) => {
  try {
    // Check if we're using MongoDB or in-memory storage
    if (typeof global.students !== 'undefined') {
      // Using in-memory storage
      const student = findStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } else {
      // Using MongoDB
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      const obj = student.toObject();
      obj.sem = obj.sem || obj.class;
      res.json(obj);
    }
  } catch (err) {
    res.status(404).json({ error: "Student not found" });
  }
});

// ✏ UPDATE STUDENT
router.put("/:id", async (req, res) => {
  try {
    // Check if we're using MongoDB or in-memory storage
    if (typeof global.students !== 'undefined') {
      // Using in-memory storage
      const studentIndex = findStudentIndexById(req.params.id);
      if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      const { name, usn, sem } = req.body;

      // Validation
      if (!name || !usn || !sem) {
        return res.status(400).json({ error: "Name, USN, and sem are required" });
      }
      
      // Check if USN already exists (excluding current student)
      const existingStudent = global.students.find(student => 
        student.usn === usn && student.id != req.params.id
      );
      if (existingStudent) {
        return res.status(400).json({ error: "Student with this USN already exists" });
      }
      
      global.students[studentIndex] = {
        ...global.students[studentIndex],
        name,
        usn,
        sem
      };
      
      res.json({ message: "Student updated", updated: global.students[studentIndex] });
    } else {
      // Using MongoDB
      if (req.body.class && !req.body.sem) req.body.sem = req.body.class;
      const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ error: "Student not found" });
      }
      const obj = updated.toObject();
      obj.sem = obj.sem || obj.class;
      res.json({ message: "Student updated", updated: obj });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE STUDENT
router.delete("/:id", async (req, res) => {
  try {
    // Check if we're using MongoDB or in-memory storage
    if (typeof global.students !== 'undefined') {
      // Using in-memory storage
      const studentIndex = findStudentIndexById(req.params.id);
      if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      const deletedStudent = global.students.splice(studentIndex, 1)[0];
      res.json({ message: "Student deleted", deleted: deletedStudent });
    } else {
      // Using MongoDB
      const deleted = await Student.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student deleted", deleted });
    }
  } catch (err) {
    res.status(404).json({ error: "Student not found" });
  }
});

module.exports = router;