require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;
const DB_URI = `${process.env.URL_MONGOOSE}/${process.env.DBNAME}`;

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected "))
    .catch(err => console.error("Error !!", err));

//app.get("/", (req, res) => res.send("test auth  "));
app.use("/auth", authRoutes);
app.listen(PORT, () => console.log(`auth is running on port : ${PORT}`));
