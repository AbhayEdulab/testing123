var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deliverablesSchema = new Schema({
      name  : { type: String, required: true  },
      deadline : {type:String},
      course : {type:String, ref: 'CollegeCourse'},
      semester : {type:String , ref: 'semesterNew'},
      subject : {type:String},
      createdOn: {
        type: Date,
        default: Date.now
      },
});

module.exports = mongoose.model('Deliverables', deliverablesSchema);