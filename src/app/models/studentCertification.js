const mongoose = require('mongoose');
var Schema = mongoose.Schema;
//const STATUS= ['true','false'];
//const VIEWED= ['1','0'];
var studentCertificationSchema = new Schema({
studentId:{
    type:String,required:true  
},
// courseId:{
//     type:String,required:true
// },
// courseName:{
//     type:String,required:true
// },
// BatchId:{
//     type:String,required:true
// },
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
type_of_document:{
    type: String
}
// firstName:{
//     type:String,required:true
// },
// LastName:{
//     type:String,required:true
// },
// Email:{
// type:String,required:true
// },
// assignmentName:{
//     type:String,required:true
// },
// Point:{
// type:Number,required:true
// },
// marksObtained:{
//     type:Number,
//     default:null,
// },
// subject:{
//     type:String,
//     required:true

// },
// uploaded:{
//      type:String ,
//      default:"false",
//      enum:STATUS,
//      required:true
// },
// viewStatus:{
//     type:String ,
//     default:"0",
//     enum:VIEWED,
//     required:true
// },
// Submitted:{
//     type:String ,
//     default:"0",
//     enum:VIEWED,
//     required:true
// },
// groupid:{
//     type:String,
//     default:"",
//     required:true
// },
// uploadTypeOfAssignment:{
//     type:String,
//     default:"",
//     required:true
// }

})
module.exports = mongoose.model('StudentCertification', studentCertificationSchema);