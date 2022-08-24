var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedbackQuestionSchema = new Schema({
    questionId : { type: String},
    questions : {type: String},
    createdOn : { type: Date, default: Date.now },
    updatedOn : { type: Date, default: Date.now },
});
module.exports = mongoose.model('feedbackQuestion', feedbackQuestionSchema);
 