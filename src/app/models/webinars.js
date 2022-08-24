var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WebinarSchema = new Schema({
    webinarTopic:{type: String, required:true},
    link:{type: String, default:""},
    description:{type: String, default:""},
    date : {type: String, default:""},
    time : {type: String, default:""},
    speaker : {type: String, default:""},
    createdOn : {type:Date,default:Date.now},
});


mongoose.model('Webinars',WebinarSchema);