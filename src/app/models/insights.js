const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var insightSchema  = new Schema({
docId:{
    type:String
},
filename:{
    type:String
},
title:{
    type:String
},
date:{
    type:String,
    required:true   
},
studentId:{
    type:String      
},
studentName:{
    type:String,
    required:true   
},
viewed:{
    type:Boolean,
    required:true     
},
letterId:{
    type:String,  
}
})

var newsletter = mongoose.model('Insights',insightSchema);
module.exports = newsletter;