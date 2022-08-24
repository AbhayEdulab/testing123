var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var facultyPayment = new Schema({
    invoiceNumber:{type:String,required:true},
	courseId     : { type: String,ref:'Course'},
    subjects: {type: String,required: true},
    semesterId:{type: String,ref: 'semesterNew'},
    specialization:{type:String},
    batchId:{type:String,ref:'BatchMaster'},
    year:{type:String,ref:'BatchMaster'},
    teacherId:{type:String,required:true,ref:'User'},
    type:{type:String},
    fileName:{type:String},
    month:{type:String,required:true},
    year:{type:String,required:true},
    doc_id:{type:String}
   });

mongoose.model('facultyPayment',facultyPayment);