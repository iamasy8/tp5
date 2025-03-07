require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DB_URI = `${process.env.URL_MONGOOSE}/${process.env.DBNAME}`;

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected "))
    .catch(err => console.error("Error !!", err));

app.listen(PORT, () => console.log(`course service running on port : ${PORT}`));

app.use("/courses", courseRoutes);
