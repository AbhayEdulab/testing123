var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperSetUploadSchema =new Schema({
userId:{type:String, required:true},
batchId :{type:String, default:"", required:true,ref: 'BatchMaster'},
courseId : {type:String, default:"", required:true,ref: 'CollegeCourse'},
semesterId:  {type:String,default:"", required:true,ref:'semesterNew'},
subject:{ type:String, required:true},
name: {  type: String },
doc_id: { type: String},
fileLength : {  type: Number},
type: {  type: String },
createdAt: {type:Date,default:Date.now},

})
mongoose.model('PaperSetUpload',paperSetUploadSchema);