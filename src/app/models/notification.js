var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notificationSchema = new Schema({

  action : {type:String,required:true},
  notification_data : {type:String,default:"",required:true},
  UserID: {type:String,required:true},
  read_notification : {type:String,default:"false",required:true},
  delete_notification : {type:String,default:"false",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  url_data : {type:String,default:""},
  query_params : {type:String,default:""},

});

mongoose.model('Notification',notificationSchema);
