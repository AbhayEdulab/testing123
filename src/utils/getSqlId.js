
var mongoose = require('mongoose');
var CollegeDepartmentSchema = require('../app/models/collegeDepartment');
var collegeDepartmentModel = mongoose.model('CollegeDepartment');
var CollegeCourseSchema = require('../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var BatchMasterSchema = require('../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
var SemesterNewSchema = require('../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew'); 
var ChapterSchema = require('../app/models/chapter');
var chapterModel = mongoose.model('Chapter');
var UserSchema = require('../app/models/user');
var userModel = mongoose.model('User');
require("../app/models/cohort");
var cohortModel = mongoose.model("Cohort");
var newDivisionSchema = require('../app/models/newDivision');
var newDivisionModel = mongoose.model('newDivision');

var JobListSchema = require('../app/models/jobList');
var jobListModel = mongoose.model('JobList');
var jobsAppliedSchema = require('../app/models/jobsApplied')
var jobsAppliedModel = mongoose.model('jobsApplied')
//SQL
var path = require('path');
const { data } = require('./logger');
var root_path = path.dirname(require.main.filename);
var models  = require('../models');
const { JobList } = require('twilio/lib/rest/bulkexports/v1/export/job');

class getSqlId {

 async getDepartmentId(id , name){
      if(id == ''){
    return models.departments.findOne({where:{departmentName : name}})
      }else if(name == ''){
        var name = await this.getDepartmentName(id);
    return models.departments.findOne({where:{departmentName : name.departmentName}})
      }
  }
  getDepartmentName(id){
    return collegeDepartmentModel.findOne({_id : id})
  }
async getCourseId(id,name){
 if (id == ''){
   return models.courses.findOne({where:{courseName:name}})
 }else if(name == ''){
  var name = await this.getCourseName(id);
  return models.courses.findOne({where:{courseName:name.courseName}})
 }
}

getCourseName(id){
  return collegeCourseModel.findOne({_id : id})
}

async getBatchId(id,name){
  if(id == ''){
    return models.batchmasters.findOne({where:{batchName:name}})
  }else if(name == ''){
    var name = await this.getBatchName(id);
    return models.batchmasters.findOne({where:{batchName :name.batchName ,year : name.year}})
  }
}
getBatchName(id){
  return batchMasterModel.findOne({_id : id})
}

 async getSemesterId(id,name){
  if(id==''){
    return models.semesters.findOne({where:{semesterName:name}})
  }else if(name == ''){
    var name = await this.getSemesterName(id);
    return models.semesters.findOne({where:{semesterName :name.semesterName ,semYear : name.semYear}})
  }

}
getSemesterName(id){
  return semesterNewModel.findOne({_id : id})
}

async getChapterId(id,name){
  if(id==''){
    return models.chapters.findOne({where:{chapterName:name}})
  }else if(name == ''){
    var name = await this.getChapterName(id);
    return models.chapters.findOne({where:{chapterName :name.chapterName}})
  }
}

getChapterName(id){
  return chapterModel.findOne({_id : id})
}

getSubjectId(name,courseId,semesterId){
    return models.subject.findOne({where:{subject:name,courseId:courseId,semesterId : semesterId}})
}

async getUserId(id,name){
  if(id==''){
    return models.users.findOne({where:{fullName:name}})
  }else if(name == ''){
    var name = await this.getUserName(id);
    return models.users.findOne({where:{email :name.email}})
  }
}

getUserName(id){
  return userModel.findOne({_id : id})
}

async getDivisionId(id,name){
  if(id==''){
    return models.division.findOne({where:{name:name}})
  }else if(name == ''){
    var name = await this.getDivisionName(id);
    return models.division.findOne({where:{name :name.name}})
  }
}

getDivisionName(id){
  return newDivisionModel.findOne({_id : id})
}

async getCohortId(id,name){
  if(id==''){
    return models.cohort.findOne({where:{cohortName:name}})
  }else if(name == ''){
    var name = await this.getCohortName(id);
    return models.cohort.findOne({where:{cohortName :name.cohortName}})
  }
}

getCohortName(id){
  return cohortModel.findOne({_id : id})
}

async getJobId(id){
  var jobId = await this.getJob(id)
  return models.joblist.findOne({where:{companyName:jobId.companyName,jobTitle:jobId.jobTitle,jobDescription:jobId.jobDescription}})
}

async getJob(id){
  var jobsApplied = await this.getjobsApplied(id)
  return jobListModel.findOne({_id : jobsApplied.jobId})
}

getjobsApplied(id){
  return jobsAppliedModel.findOne({_id : id})
 }

}
module.exports = getSqlId;