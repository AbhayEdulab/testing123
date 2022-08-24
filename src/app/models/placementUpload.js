var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlacementUploadSchema = new Schema({
    docId: {
        type: String
    },
    placementId: {
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
    },
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

mongoose.model('PlacementUpload', PlacementUploadSchema);