const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken"); 
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {id, name , email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: "email alrd exist"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({id, name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: "user registered successfully "});
    } catch (error) {
        res.status(500).json({message: "error registering user !!!", error});
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message:"wrong email or pswd "});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message:"wrong email or pswd "});

        const token = jwt.sign({id: user.id, email: user.email}, "secret_key", {expiresIn: "1h"});

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: "Error login", error});
    }
});

router.get("/profile", verifyToken, async (req, res) => {
    try {
        //const token = req.headers.authorization;
        //if (!token) return res.status(401).json({message: "error"});
        //const decoded = jwt.verify(token, "secret_key");

        const user = await User.findOne({id: decoded.id});
        if (!user) return res.status(404).json({message: "NPT FOUND"});
        res.status(200).json({id: user.id, name: user.name, email: user.email});
    } catch (error) {
        res.status(500).json({message: "Error", error});
    }
});

module.exports = router;
