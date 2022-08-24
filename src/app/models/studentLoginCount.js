var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentLoginCountSchema = new Schema({
user_id: { type: String, ref: 'User' },
loginDate : {type:String,default:"",required:true},
loginCount : {type:Number,default:"0"}, 
courseId : {type:String,required:true},
batchId : {type:String, ref:'BatchMaster'},
});
mongoose.model('studentLoginCount',studentLoginCountSchema);
