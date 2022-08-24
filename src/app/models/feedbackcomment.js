var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedbackCommentSchema = new Schema({
    feedbackId : { type: String, ref: 'studentFeedback'},
    userId: { type: String, ref: 'User'}, //'User'
    feedbackcomments: {type: String},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('feedbackComment', feedbackCommentSchema);