var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CollegeDepartmentSchema = new Schema({
  departmentName :{type: String,required: true},
  shortName :{type: String,required: true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('CollegeDepartment',CollegeDepartmentSchema);