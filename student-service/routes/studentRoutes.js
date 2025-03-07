const express = require("express");
const axios = require("axios");
const Student = require("../models/Student");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const COURSE_SERVICE_URL = "http://localhost:3001/courses"; 

router.get("/all", async (req, res) =>{
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
    res.status(500).json({message: "error fetching", error});
    }
});

router.post("/add", verifyToken, async (req, res) => {
    try {
        const { id, nom, email } = req.body;
        const newStudent = new Student({id, nom, email, cours:[] });
        await newStudent.save();
        res.status(201).json({message: "student added"});
    } catch (error) {
        res.status(500).json({message: "error adding ", error});
    }
});

router.post("/enroll/:etudiant_id/:cours_id", verifyToken, async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.etudiant_id});
        if (!student) return res.status(404).json({message: "student not found"});

        const response = await axios.get(`${COURSE_SERVICE_URL}/all`);
        const courses = response.data;
        const courseExists = courses.some(course => course.id === req.params.cours_id);

        if (!courseExists) return res.status(404).json({message: "course not found"});

        if (student.cours.includes(req.params.cours_id)) {
            return res.status(400).json({message: "student alrd is in this course"});
        }

        student.cours.push(req.params.cours_id);
        await student.save();
        res.json({ message: "student enrolled"});
    } catch (error) {
        res.status(500).json({message: "Error !!", error});
    }
});

router.get("/enrolledCourses/:etudiant_id", async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.etudiant_id });
        if (!student) return res.status(404).json({ message: "student not found" });

        const response = await axios.get(`${COURSE_SERVICE_URL}/all`);
        const allCourses = response.data;

        const enrolledCourses = allCourses.filter(course => student.cours.includes(course.id));
        res.json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: "error fetching", error});
        }
});

module.exports = router;
