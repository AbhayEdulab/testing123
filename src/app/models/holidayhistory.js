var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HolidayHistorySchema = new Schema({
    start_date:{type:String,default:"",},
    end_date:{type:String,default:"",},
    description: {type:String,default:"",required:true},
    courseId : {type: String, ref: 'CollegeCourse'},
    batchId : {type: String, ref: 'BatchMaster'},
});

mongoose.model('HolidayHistory',HolidayHistorySchema);