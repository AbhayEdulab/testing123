//Author SP : 23-07-2020
const mongoose = require('mongoose');
const teacherEducationalDetails = new mongoose.Schema({
    userId: {
        type: String,ref:'User'
    },
    qualification :  {type: String, default:""},
    graduation : {type: String, default:""},
    masters :  {type: String, default:""},
    otherDegree :  {type: String, default:""},
    phd :  {type: Boolean, default:false},
});

module.exports = mongoose.model('TeacherEducationalDetails', teacherEducationalDetails);