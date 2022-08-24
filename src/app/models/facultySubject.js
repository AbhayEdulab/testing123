var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var facultySubjects = new Schema({
        Course: {type:String},  
        Batch:{type:String}, 
        Semester: {type:String},
        Subject: {type:String},
        Faculty: {type:String},
        user_id : {type:String},
        bbb_roomName : {type : String}
   });

mongoose.model('facultySubject',facultySubjects);