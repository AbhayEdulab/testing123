var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsPaperSchema = new Schema({
   name: { type: String, required: true },
   link: { type: String, required: true },
   filename: { type: String, required: true },
   doc_id: { type: String, required: true },
   createdOn: { type: Date, default: Date.now },
   updatedOn: { type: Date, default: Date.now },

});
mongoose.model('NewspaperLink', newsPaperSchema);