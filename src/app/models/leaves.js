var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var leavesSchema = new Schema({
    userId : {type: String, ref: 'User',required:true},
    courseId : {type: String, ref: 'CollegeCourse'},
    batchId : {type: String, ref: 'BatchMaster'},
    title :{type : String},
    startDate :{type:String,default:"",required:true},
    endDate:{type:String,default:"",},
    description:{type : String,default:"",required:true},
    reasonForLeave:{type : String,required:true},
    role :{type:String,default:"",required:true},
    status :{type : String},
    hide :{type:Boolean},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },

});
module.exports = mongoose.model('Leaves', leavesSchema);