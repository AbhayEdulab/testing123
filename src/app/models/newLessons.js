var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newLessonsSchema = new Schema({
        courseId     : { type: String,ref:'Course'},
        chapterId :{ type: String, required: true  },
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

var newLessons = mongoose.model('newLessons', newLessonsSchema);
module.exports = newLessons;