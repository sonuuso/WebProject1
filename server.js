// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true });

// Student schema
const studentSchema = new mongoose.Schema({
    usn: String,
    semMarks: Object, // semMarks stored as an object
    moocCourses: Number,
    hackathons: Number,
    aictePoints: Number,
    projects: Number,
    internships: Number,
});

// Student model
const Student = mongoose.model('Student', studentSchema);

// Endpoint to get student by USN
app.get('/api/student/:usn', async (req, res) => {
    try {
        const student = await Student.findOne({ usn: req.params.usn });
        if (student) {
            // Convert semMarks object to an array of key-value pairs
            const semMarksArray = Object.entries(student.semMarks || {});
            const formattedStudent = {
                ...student.toObject(), // Include all other student properties
                semMarks: semMarksArray // Replace semMarks with an array format
            };
            res.json(formattedStudent);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Server error');
    }
});
// Endpoint to add a new student
app.post('/api/student', async (req, res) => {
  try {
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.status(201).send('Student added successfully');
  } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).send('Failed to add student');
  }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
