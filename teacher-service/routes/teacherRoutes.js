const express = require("express");
const axios = require("axios"); 
const Teacher = require("../models/Teacher");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const COURSE_SERVICE_URL = "http://localhost:3001/courses"; 

router.get("/all", async (req, res) =>{
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({message: "error fetching", error});
    }
});

router.post("/add", verifyToken, async (req, res) =>{
    try {
        const { id, name, bio } = req.body;
        const newTeacher = new Teacher({id, name, bio, cours: []});
        await newTeacher.save();
        res.status(201).json({message: "eeacher added" });
    } catch (error) {
        res.status(500).json({message: "error adding", error});
    }
});

router.post("/assign/:professeur_id/:cours_id", verifyToken, async (req, res) =>{
    try {
        const teacher = await Teacher.findOne({id: req.params.professeur_id});
        if (!teacher) return res.status(404).json({message: "teacher not found"});

        const response = await axios.get(`${COURSE_SERVICE_URL}/all`);
        const courses = response.data;
        const courseExists = courses.some(course => course.id === req.params.cours_id);

        if (!courseExists) return res.status(404).json({message: "course not found"});

        if (teacher.cours.includes(req.params.cours_id)) {
            return res.status(400).json({message: "teacher is alrd in this course"});
        }

        teacher.cours.push(req.params.cours_id);
        await teacher.save();
        res.json({ message: "course assigned" });
    } catch (error) {
            res.status(500).json({message: "error assigning !! ", error});
    }
});



router.get("/enrolledStudents/:cours_id", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3002/students/all");
        const allStudents = response.data;
        const enrolledStudents = allStudents.filter(student => student.cours.includes(req.params.cours_id));

        res.json(enrolledStudents);
    } catch (error) {
        res.status(500).json({message: "error", error });
    }
});

module.exports = router;
