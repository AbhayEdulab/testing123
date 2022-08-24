var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ExamUpdateSchema = new Schema({
     title:{type: String,default:'',required:true},
     departmentId :{type: String,ref:'CollegeDepartment',required:true},
     courseId :{type: String,ref:'CollegeCourse',required:true},
     batchId :{type: String,ref:'BatchMaster',required:true},
     semesterId :{type: String,ref:'semesterNew',required:true},
     studentArray :{ type: Array ,default :null,required:true},
     description :{type: String,default:'',required:true},
     createdOn : {type:Date,default:Date.now},
     updatedOn : {type:Date,default:Date.now},
});

mongoose.model('ExamUpdate',ExamUpdateSchema);