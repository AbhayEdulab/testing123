var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedback = new Schema({
    srno:{type:String,required:true},
    Timestamp:{type:String,required:true},
    Rating :{type: String,required:true},
    Author:{type: String,required:true},
    Comment:{type:String,required:false},
    Subject:{type:String,required:false},
   });

mongoose.model('feedback',feedback);