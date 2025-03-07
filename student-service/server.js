require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const DB_URI = `${process.env.URL_MONGOOSE}/${process.env.DBNAME}`;

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected "))
    .catch(err => console.error("Error !!", err));

app.use("/students", studentRoutes);

app.listen(PORT, () => console.log(`student is running on port : ${PORT}`));
