var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CollegeDegreeSchema = new Schema({
  degreeName :{type: String,required: true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('CollegeDegree',CollegeDegreeSchema);