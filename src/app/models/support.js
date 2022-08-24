var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SupportSchema = new Schema({
    adminEmail:{type: String, default:null},
    technicalEmail:{type: String, default:null },
    otherEmail :{type: String, default:null },
    contentEmail:{type: String, default:null }
});


mongoose.model('Support',SupportSchema);