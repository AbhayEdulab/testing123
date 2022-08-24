var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AllowAccessToSubAdminSchema = new Schema({
  user_id:{type:String,required:true},
  access :{type: Array,default:''},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
});

mongoose.model('AllowAccessToSubAdmin',AllowAccessToSubAdminSchema);