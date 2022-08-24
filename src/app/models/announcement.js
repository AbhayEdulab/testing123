var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnnouncementSchema = new Schema({
    subject: { type: String, default: null, required: true },
    description: { type: String, default: null, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    viewUserList : {type: Array, default:[]},
    viewUserId : {type: Array, default:[]},
});
mongoose.model('Announcement', AnnouncementSchema);