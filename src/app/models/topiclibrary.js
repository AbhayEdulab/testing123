var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var topicLibrarySchema = new Schema({
    topicname : {type: String},
    tags : {type :Array},
    videos :  {type: Array},
    podcasts :  {type: Array},
    websites: {type : Array},
    editortext :  {type: String},
    files : {type :Array},
    reftopicId :{type:Array},
    setImptopic :  {type: Boolean,default:false},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
  
})

module.exports = mongoose.model('topicLibrary' , topicLibrarySchema);