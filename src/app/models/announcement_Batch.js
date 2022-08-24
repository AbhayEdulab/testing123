var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Announcement_BatchSchema = new Schema({
    announcement_id: { type: String, ref: 'Announcement', required: true },
    courseId : { type: String, ref: 'CollegeCourse', required: true },
    courseName : { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now }
});
mongoose.model('Announcement_Batch', Announcement_BatchSchema);