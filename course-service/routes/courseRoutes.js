const express = require("express");
const Course = require("../models/Course");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/all", async (req, res) =>{
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({message:"error fetching", error});
    }
});

router.post("/add", verifyToken, async (req, res) => {
    try {
        const {id, titre , professeur_id , description, prix} = req.body;
        const newCourse = new Course({id, titre , professeur_id, description, prix});
        await newCourse.save();
        res.status(201).json({message: "course added"});
    } catch (error) {
        res.status(500).json({message: "add error ", error});
    }
});

router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate({id: req.params.id}, req.body, {new: true});
        if (!updatedCourse) return res.status(404).json({message: "course not found"});
        res.json({message: "course updated", course: updatedCourse});
    } catch (error) {res.status(500).json({message: "update error", error});
    }
});

router.delete("/delete/:id", verifyToken, async (req, res) =>{
    try {
        const deletedCourse = await Course.findOneAndDelete({id: req.params.id});
        if (!deletedCourse) return res.status(404).json({message: "course not found"});
        res.json({ message: "course deleted "});
    } catch (error){
        res.status(500).json({message: "delete error", error});
    }
});

router.get("/search", async (req, res) => {
    try {
        const keyword = req.query.q;
        const courses = await Course.find({titre: {$regex: keyword,$options: "i" }});
        res.json(courses);
    } catch (error) {res.status(500).json({message: "recerche error", error});
    }
});

module.exports = router;
