var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lessonsSchema = new Schema({
	courseId     : { type: String,ref:'Course'},
	  title        : { type: String, required: true  },
	  objective    : { type: String, required: false },
	  lastUpdated    : { type: String, required: false },
	  instructions : { type: String, required: false },
	  text         : { type: String, required: true  },
	  icon        : { type: String, required: false,default:"file-text-outline"  },
	  createdOn : {type:Date,default:Date.now},
	  updatedOn : {type:Date,default:Date.now},
	  status: { type: String, required: true, default: 'Unapproved' },
	  videoLink: {type: String, required: false }
});

var lessons = mongoose.model('lessons', lessonsSchema);
module.exports = lessons;