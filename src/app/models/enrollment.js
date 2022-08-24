var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EnrollmentSchema = new Schema({
  roll_no : {type:String,default:"",required:true},
  first_name : {type:String,default:"",required:true},
  last_name : {type:String,default:"",required:true},
  status :  {type:String,default:false,required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}
});
mongoose.model('Enrollment',EnrollmentSchema);
