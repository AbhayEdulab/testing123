var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogsSchema = new Schema({
      title  : { type: String, required: true  },
      date : {type:String},
      category : {type:String},
      description  : { type: String},
      batchId :{type: String, ref: 'BatchMaster'},
      courseId:{type:String,ref:'CollegeCourse'},
      viewUserList : {type: Array, default:[]},
      viewUserId : {type: Array, default:[]},
});

var blogs = mongoose.model('Blogs', blogsSchema);
module.exports = blogs;