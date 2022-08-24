var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eduactionalProfilesSchema = new Schema({
    studentId: { type: String, ref: 'User'},
    matriculation: {
        matricInstituteName: { type: String, default: '' },
        matricBoard_uni: { type: String , default: ''},
        matricEducationType: { type: String , default: ''},
        matricScore: { type: String ,default: ''},
        matricStartDate: { type: String ,default: ''},
        matricEndDate: { type: String ,default: ''},
    },
    intermediate: {
        interInstituteName: { type: String,default: '' },
        interBoard_uni: { type: String ,default: ''},
        interEducationType: { type: String,default: '' },
        interSpecialization: { type: String,default: '' },
        interScore: { type: String,default: '' },
        interStartDate: { type: String,default: '' },
        interEndDate: { type: String,default: '' },
    },
    currentCourse:{
        currInstituteName: { type: String,default: '' },
        currBoard_uni: { type: String ,default: ''},
        currEducationType: { type: String ,default: ''},
        currSpecialization: { type: String,default: '' },
        currSubjects: { type: String,default: '' },
        currStartDate: { type: String,default: '' },
        currEndDate: { type: String,default: '' },
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('educationalProfiles', eduactionalProfilesSchema);