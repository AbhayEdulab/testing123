var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperSetterSchema = new Schema({
    userId :     {type: String},
    email :      {type: String,ref:'User'},
    courseId :   { type: String,ref:'Course',required:true},
    courseName :   { type: String,ref:'Course',required:true},
    semesterId : {type:String,ref: 'Semester',required:true},
    semesterName : {type:String,ref: 'Semester',required:true},
    subject :    {type:String,ref:'Subject',required:true},
});

module.exports = mongoose.model('paperSetter',paperSetterSchema);
