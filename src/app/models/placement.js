var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlacementSchema = new Schema({
    placementName: {
        type: String,
        required: true
    },
    batchId: {
        type: String,
        default: ''
    },
    courseId: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    textPlacement: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    date: {
        type: String
    },
    videoName: {
        type: String,
        default: ''
    },
    setImp: {
        type: Boolean,
        default: false
    },
    videoId: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Placement', PlacementSchema);