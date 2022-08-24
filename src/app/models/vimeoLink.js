var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VimeoLinkSchema = new Schema({
  chapterId :{type: String,ref:'Chapter'},
  vimeoLinkName : {type:String},
  vimeoLink : {type:String},
  createdOn : {type:Date,default:Date.now},
  type_of_upload:{
    type: String
  },
});

mongoose.model('VimeoLink', VimeoLinkSchema);