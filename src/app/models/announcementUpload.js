//Author SP : 28-01-2020
var mongoose = require('mongoose');
var announcementUploadSchema = new mongoose.Schema({
  doc_id: {
    type: String
},
announcementId: {
    type: String
},
length : {
    type: Number
},
name: {
    type: String
},
type: {
    type: String
}

});

mongoose.model('AnnouncementUpload', announcementUploadSchema);
