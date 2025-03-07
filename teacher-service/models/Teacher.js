const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},

    name: {type: String, required: true},

    bio: {type: String},
    
    cours: [{type: String}]  
});

module.exports = mongoose.model("Teacher", TeacherSchema);
