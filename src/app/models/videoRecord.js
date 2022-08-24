var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VideoRecordSchema = new Schema({
	user_id :{type: String, ref: 'User'},
    course_id : {type: String, ref: 'Course'},
	// batch_id : {type: String, ref: 'Batch'},
	lessons_id : {type: String, ref: 'lessons'},
	timeRecord: { type: String, required: true },
	videoLink:{type:String, ref:'lessons'},
	seconds: { type: String, required: true },
	duration:{ type: String, required: true },
	updatedOn : {type:Date,default:Date.now}
})

mongoose.model('VideoRecord',VideoRecordSchema);