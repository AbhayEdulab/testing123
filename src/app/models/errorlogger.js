var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ErrorLoggerSchema = new Schema({
    name:{type:String,default:"",required:false},
    appId:{type:String,default:"",required:false},
    user:{type:String,default:"",required:false},
    time:{type:String,default:"",required:false},
    id:{type:String,default:"",required:false},
    url:{type:String,default:"",required:false},
    status:{type:String,default:"",required:false},
    message:{type:String,default:"",required:false},
    stack:{type:Schema.Types.Mixed,default:"",required:false}
})
mongoose.model('ErrorLogger',ErrorLoggerSchema);