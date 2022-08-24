const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uploadedProjectSchema = new Schema({
userId:{
    type:String,required:true  
},
courseId:{
    type:String,required:true
},
BatchId:{
    type:String,required:true
},
doc_id: {
    type: String
},
length : {
    type: Number
},
name: {
    type: String
},
type: {
    type: String
},
firstName:{
    type:String,required:true
},
LastName:{
    type:String,required:true
},
Email:{
type:String,required:true
},
projectName:{
    type:String,required:true
},
Point:{
type:Number,required:true
},
marksObtained:{
    type:Number,
    default:null,
},
groupid:{
    type:String,
    default:"",
    required:true
},
})
module.exports = mongoose.model('UploadedProject', uploadedProjectSchema);