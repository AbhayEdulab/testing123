var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentProfileDetailsSchema = new Schema({
  // studentId:{type:String,required:true},
  fullName :{type: String,required:true},
  mobile_number:{type: String,required:true},
  whatsapp_number:{type:String,required:true},
  email_id:{type: String,required:true},
  dob : {type:String,required: true},
  mother_name: {type: String,required:true},
  mother_contact_number: {type: String},
  father_name: {type: String,required:true},
  father_contact_number: {type: String},
  home_address: {type: String},
  city: {type: String},
  state: {type: String},
  country: {type: String},
  nationality: {type: String,default:'',},
  admission_category: {type: String,default:''},
  guardian_full_name:{type: String},
  guardian_email_id:{type: String},
  guardian_mobile_number:{type: String},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('StudentProfileDetails',StudentProfileDetailsSchema);