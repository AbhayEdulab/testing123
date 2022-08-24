const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsletterSchema  = new Schema({
docId:{
    type:String
},
name:{
    type:String
},
length:{
    type:Number    
},
date:{
    type:Date,
    required:true   
},
filetype:{
    type:String      
},
title:{
    type:String,
    required:true   
}
})

var newsletter = mongoose.model('Newsletter',newsletterSchema);
module.exports = newsletter;