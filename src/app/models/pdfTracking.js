var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PdfTrackingSchema = new Schema({
  doc_id: {type:String},
  user_id :{type: String, ref: 'User'},
  totalPages : {type:Number},
  page_count:{type:Number},
  percentage:{type:Number},
  course_id : {type: String, ref: 'Course'},
  chapterId : {type: String, ref: 'Chapter'},

 
});

mongoose.model('PdfTracking',PdfTrackingSchema);