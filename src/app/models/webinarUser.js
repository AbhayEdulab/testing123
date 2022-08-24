var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WebinarUserSchema = new Schema({
  name:{type: String, required:true},
  emailId:{type: String, required:true},
  mobile:{type: String, required:true},
 // password:{type: String, required:true},
 engagement:{type: String, default:""},
 profession:{type: String, default:""},
 academic:{type: String, default:""},
 qualification:{type: String, default:""},
 question:{type: String, default:""},
 webinarId : {type: String, ref: 'Webinars'},
  createdOn : {type:Date,default:Date.now},
});


mongoose.model('WebinarUser',WebinarUserSchema);