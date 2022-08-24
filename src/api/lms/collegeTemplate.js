var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CollegeDepartmentSchema = require('../../app/models/collegeDepartment');
var collegeDepartmentModel = mongoose.model('CollegeDepartment');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');
require('../../app/models/camtasiaAnalytics');
const sendNotification = require('../mobile/pushNotification');
var camtasiaAnalyticsModel = mongoose.model('CamtasiaAnalytics');
var SemesterSchema = require('../../app/models/semester');
var semesterModel = mongoose.model('Semester');
var roomSchema = require('../../app/models/room');
var roomModel = mongoose.model('Room');
var BatchMasterSchema = require('../../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
var ChapterSchema = require('../../app/models/chapter');
var chapterModel = mongoose.model('Chapter');
var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var StudentBatchSchema = require('../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var DivisionSchema = require('../../app/models/division');
var divisionModel = mongoose.model('Division');
var TeacherSchema = require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
var subjectSchema = require('../../app/models/subject');
var subjectModel = mongoose.model('Subject');
var studentDivisionSchema = require('../../app/models/studentDivision');
var studentDivisionModel = mongoose.model('StudentDivision');
var uploads = require('../../app/models/uploads');
var path = require('path')
var fs = require('fs')
const {
  google
} = require('googleapis');
const customsearch = google.customsearch('v1');
var NewCourseSchema = require('../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
var courseBatchSchema = require('../../app/models/course_batch');
var courseBatchModel = mongoose.model('CourseBatch');
var newDivisionSchema = require('../../app/models/newDivision');
var newDivisionModel = mongoose.model('newDivision');
var notification_function = require('./../../utils/function');
require('../../app/models/subjectReference');
var subjectRefModel = mongoose.model('SubjectReference');
require('../../app/models/chapteryoutubelinks');
var SemesterNewSchema = require('../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
var youTubeLinkModel = mongoose.model('YouTubeLink');
var NoticeSchema = require('../../app/models/notice');
var noticeModel = mongoose.model('Notice');
var notificationModel = mongoose.model('Notification')
var noticeUploadSchema = require('../../app/models/noticeUpload');
const {
  json,
  response
} = require('express');
var noticeUploadModel = mongoose.model('NoticeUpload');
var emailService = require('../../utils/emailService');
require('../../app/models/onlineSubjectLink');
var onlineSubjectLinkModel = mongoose.model('OnlineSubjectLink');
require('../../app/models/onlineLectureLink');
var onlineLectureLinkModel = mongoose.model('OnlineLectureLink');
var mcqSchema = require('../../app/models/MCQ');
var mcqModel = mongoose.model('MCQ');
require('../../app/models/allowAccessToTeacher');
var allowAccessToTeacherModel = mongoose.model('AllowAccessToTeacher');
var SyllabusOverviewSchema = require('../../app/models/syllabusFiles');
var syllabusFilesModel = mongoose.model('SyllabusFiles');
var ChapterSyllabusFilesSchema = require('../../app/models/chapterSyllabusFile');
var chapterSyllabusFilesModel = mongoose.model('ChapterSyllabusFiles');
const config = require('config');
const {
  JsonWebTokenError
} = require('jsonwebtoken');
const {
  filelink
} = config.get('api');
const cipher = require('../common/auth/cipherHelper');
const userService = require('../common/user/userService');
require('../../app/models/library');
var LibraryModel = mongoose.model('Library');
require('../../app/models/libraryUploads');
var libraryUploadsModel = mongoose.model('LibraryUploads');
var moment = require('moment');
var vimeoLinkSchema = require('../../app/models/vimeoLink');
var vimeoLinkModel = mongoose.model('VimeoLink');
var UnapprovedSyllabusSchema = require('../../app/models/unapprovedSyllabus');
var UnapprovedSyllabusModel = mongoose.model('UnapprovedSyllabus')
require("../../app/models/activityTracker.js");
const activityTrackerModel = mongoose.model("ActivityTracker");
require("../../app/models/uploads");
var uploadsModel = mongoose.model('Uploads')
require('../../app/models/batchSemesterMaster');
var batchSemesterMasterModel = mongoose.model('BatchSemesterMaster');
require('../../app/models/catasiaLinks');
var camtasiaLinksModel = mongoose.model('CamtasiaLinks');
const fileType = require('file-type');
const Grid = require('gridfs-stream');
const {
  data,
  error
} = require('../../utils/logger');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
require('../../app/models/pdfTracking');
var PdfTracking = mongoose.model('PdfTracking');
var cohortSchema = require('../../app/models/cohort')
var cohortModel = mongoose.model('Cohort')
require('../../app/models/cohortTeacher')
var cohortTeacherModel = mongoose.model('CohortTeacher')
require('../../app/models/cohorttimetable')
var cohortTimeTableModel = mongoose.model('CohortTimeTable')
require('../../app/models/AllowAccessToSubAdmin');
var allowAccessToSubAdminModel = mongoose.model('AllowAccessToSubAdmin');
var PlacementSchema = require('../../app/models/placement');
var PlacementModel = mongoose.model('Placement');
var placementUpload = require('../../app/models/placementUpload')
var placementUploadModel = mongoose.model('PlacementUpload')
var examUpdate = require('../../app/models/examUpdate')
var examUpdateModel = mongoose.model('ExamUpdate')
require('../../app/models/newspaper');
var newsModel = mongoose.model("NewspaperLink")
facultyPayment = require('../../app/models/facultyPayment');
var facultyPayment = mongoose.model('facultyPayment');
var examUploadSchema = require('../../app/models/examUpload');
var examUploadModel = mongoose.model('ExamUpload');
var feedbackSchema = require('../../app/models/feedback');
var feedbackModel = mongoose.model('feedback');
const { ObjectID } = require('mongodb');
require('../../app/models/newtimetable');
var NewTimeTableModel = mongoose.model('NewTimeTable');
var fbmodel = require('../../app/models/feedback');
var feedbackModel = mongoose.model('feedback');
require('../../app/models/newtimetable');
var NewTimeTableModel = mongoose.model('NewTimeTable');
var fbmodel = require('../../app/models/feedback');
var feedbackModel = mongoose.model('feedback');

//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
const { AddOnResultInstance } = require('twilio/lib/rest/api/v2010/account/recording/addOnResult');
var getId = new getSqlId();

router.post('/addDepartment', function (req, res) {
  addDepartment(req.body);
  var collegeDepartmentData = new collegeDepartmentModel({
    departmentName: req.body.departmentName,
    shortName: req.body.shortName
  });
  collegeDepartmentData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });

});
function addDepartment(body) {
  models.departments.create({
    departmentName: body.departmentName,
    shortName: body.shortName
  }).then(function (result) {
    if (result) {
      // res.json({
      //     status:200,
      //     data:result
      // })
      // console.log("data save successfully")
    }
    else {
      // res.json({
      //     status:400,
      //     message : "Error occured while creating department."
      // })
    }
  })
}

router.get('/getDepartment', function (req, res) {
  collegeDepartmentModel.find({}).exec(function (err, department) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: department
      });
    }

  });

});

router.put('/updateDepartment', function (req, res) {
  updateDepartment(req.body);
  var query = {
    _id: req.body._id
  },
    update = {
      $set: {
        departmentName: req.body.departmentName,
        shortName: req.body.shortName

      }
    };
  collegeDepartmentModel.updateMany(query, update, function (err, department) {
    if (err) {
      console.error("err" + err)
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: department
      })
    }

  });


});
async function updateDepartment(body) {
  var department = await getId.getDepartmentId(body._id, '');
  models.departments.find({
    where: {
      id: department.id
    }
  }).then(function (depart) {
    if(depart){
      depart.update({
        departmentName: body.departmentName,
        shortName: body.shortName
      }).then(function (depart_updated) {
        // if(depart_updated){
        //   res.json({
        //     status: 200,
        //     data: depart_updated
        //   })
        // }else{
        //   res.json({
        //             status:400,
        //             message : "Error occured while updateing department."
        //         })
        // }
      })
    }
  
  })
}

router.delete('/deleteDepartment', async (req, res) => {
  try {
    let res_obj = {
      msg: '',
      status: 0
    }
    const departmentId = req.query.departmentId
    const courses = await collegeCourseModel.find({
      departmentId
    })
    const batches = await batchMasterModel.find({
      departmentId
    })
    const studentBatches = await studentBatchModel.find({
      departmentId
    })

    //* If every children under department is deleted then only delete the department
    if (!courses.length && !batches.length && !studentBatches.length) {
      res_obj.msg = 'Department deleted successfully !!!'
      res_obj.status = 200
      //* Delete the collections with given departmentId
      await collegeDepartmentModel.findByIdAndDelete(departmentId)
    } else {
      let batches_length = batches.length ? `${batches.length} batches` : ''
      let courses_length = courses.length ? `${courses.length} courses` : ''
      let studentBatches_length = studentBatches.length ?
        `${studentBatches.length} students in batches` :
        ''
      res_obj.msg = `Please delete the remaining ${courses_length} ${batches_length} ${studentBatches_length} first !!`
      res_obj.status = 409
    }
    res.status(200).json({
      status: res_obj.status,
      message: res_obj.msg,
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
    return res.status(400).json({
      message: 'Bad Request',
    })
  }
})

router.post('/addCollegeCourse', function (req, res) {
  createCourse(req.body)
  var collegeCourseData = new collegeCourseModel({
    courseName: req.body.courseName,
    departmentId: req.body.collegeDepartment,
    degree: req.body.degree
  });
  collegeCourseData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });

});
async function createCourse(body) {
  var department = await getId.getDepartmentId(body.collegeDepartment, '');
  models.courses.create({
    departmentId: department.id,
    courseName: body.courseName,
    degree: body.degree
  }).then(function (course) {
    console.log("course Added.....")
  })

};

router.get('/getCollegeCourse', function (req, res) {
  var view_data = [];
  collegeCourseModel.find({}).populate('departmentId', ['departmentName']).exec(function (err, course) {
    if (err) {
      console.error(err);
    } else if (course != '' || course != undefined || course != 'undefined' || course != null) {
      course.forEach(function (courses) {
        view_data.push({
          departmentName: courses.departmentId.departmentName,
          courseName: courses.courseName,
          courseId: courses._id,
          departmentId: courses.departmentId._id,
          degree: courses.degree
        })

      })
      res.json({
        status: 200,
        data: view_data

      });
    } else {
      res.json({
        status: 400
      });
    }
  });
});

router.put('/updateCollegeCourse', function (req, res) {
  updateCourse(req.body)
  var query = {
    _id: req.body.course_id
  },
    update = {
      $set: {
        departmentId: req.body.collegeDepartment,
        courseName: req.body.courseName,
        degree: req.body.degree

      }
    };
  collegeCourseModel.update(query, update, function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: course
      })
    }

  });

});
async function updateCourse(body) {
  var department = await getId.getDepartmentId(body.collegeDepartment, '');
  var course = await getId.getCourseId(body.course_id, '');
  var courseId = course.id
  var departmentId = department.id
  models.courses.find({
    where: {
      id: courseId
    }
  }).then(function (course) {
    if(course){
      course.update({
        departmentId: departmentId,
        courseName: body.courseName,
        degree: body.degree
      }).then(function (update_course) {
      })
    }
   
  })
}

router.get('/getUpdateCourseData', function (req, res) {
  var view_data = [];
  collegeCourseModel.find({
    _id: req.query.course_id
  }).populate('departmentId', ['departmentName']).exec(function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (course != '' || course != null || course != 'undefined' || course != undefined) {
      course.forEach(function (courses) {
        view_data.push({
          departmentName: courses.departmentId.departmentName,
          courseName: courses.courseName,
          courseId: courses._id,
          departmentId: courses.departmentId._id,
          degree: courses.degree
        });

      })
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        message: 'Course Not Find!!!!!!!!...'
      });
    }

  });

});

router.delete('/deleteCollegeCourse', async (req, res) => {
  try {
    let msg_obj = {
      msg: '',
      status: 0
    }
    var courseId = {
      _id: req.query.course_id
    }
    const batches = await batchMasterModel.find({
      courseId
    })
    const studentBatches = await studentBatchModel.find({
      courseId
    })
    const subjects = await subjectModel.find({
      courseId
    })
    const divisions = await subjectModel.find({
      courseId
    })

    if (!batches.length && !studentBatches.length && !subjects.length && !divisions.length) {
      msg_obj.msg = 'Course deleted successfully !!!'
      msg_obj.status = 200
      await collegeCourseModel.findByIdAndDelete(courseId)
    } else {
      let batches_length = batches.length ? `${batches.length} batches` : ''
      let subjects_length = subjects.length ? `${subjects.length} subjects` : ''
      let divisions_length = divisions.length ? `${divisions.length} divisions` : ''
      let studentBatches_length = studentBatches.length ?
        `${studentBatches.length} students in batches` :
        ''
      msg_obj.msg = `Please delete the remaining ${batches_length} ${subjects_length} ${studentBatches_length} ${divisions_length}first !!`
      msg_obj.status = 409
    }
    res.status(200).json({
      status: msg_obj.status,
      message: msg_obj.msg
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
    return res.status(400).json({
      message: 'Bad Request',
    })
  }
})

router.get('/getCollegeCourseWithShortName', function (req, res) {
  var view_data = [];
  collegeCourseModel.find({}).exec(function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (course != '') {
      course.forEach(function (courses) {
        view_data.push({
          courseName: courses.courseName,
          _id: courses._id
        });
      });
      res.json({
        status: 200,
        data: view_data
      });

    }
  })

});

router.get('/getCollegeCourseData', function (req, res) {
  collegeCourseModel.find({
    departmentId: req.query.departmentId
  }).then(function (course) {
    if (course != '') {
      res.json({
        status: 200,
        data: course
      });
    } else {
      res.json({
        status: 400,
        message: 'bad request'
      });
    }

  });

});


router.post('/addCollegeSemester', function (req, res) {
  createSemester(req.body)
  var semesterData = new semesterNewModel({
    semesterName: req.body.semesterName,
    semester_start_date: req.body.semesterStartDate,
    semester_end_date: req.body.semesterEndDate,
    semYear: req.body.semYear,
    courseId: req.body.courseId
  });
  semesterData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });
});
async function createSemester(body) {
  var course = await getId.getCourseId(body.courseId, '');
  var courseId = course.id
  models.semesters.create({
    courseId: courseId,
    semesterName: body.semesterName,
    semesterStartDate: body.semesterStartDate,
    semesterEndDate: body.semesterEndDate,
    semesterStatus: "false",
    semYear: body.semYear
  }).then(function (semester) {
    console.log("semester")
    // if(semester){
    //   res.json({
    //     status:200,
    //     data:semester
    //   });
    // }
  })
}

router.get('/getcourseWiseBatch', function (req, res) {
  batchMasterModel.find({
    courseId: req.query.courseId
  }).then(function (batch) {
    if (batch != '') {
      res.json({
        status: 200,
        data: batch
      });
    } else {
      res.json({
        status: 400,
        message: 'bad request'
      });
    }

  });

});

router.get('/getSemesterDataCourseWise', function (req, res) {
  semesterNewModel.find({
    courseId: req.query.courseId
  }).exec(function (err, semData) {
    if (err) {
      console.error(err)
    } else {
      res.json({
        status: 200,
        data: semData
      });

    }

  });

});


router.delete('/deleteSemester', function (req, res) {
  var query = {
    _id: req.query.semesterId
  }
  subjectModel.find({
    semesterId: req.query.semesterId
  }).exec(function (err, subject) {
    chapterModel.find({
      semesterId: req.query.semesterId
    }).exec(function (err1, chapter) {
      if (err && err1) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else if ((subject == '' || subject == null || subject == 'undefined' || subject == undefined) && (chapter == '' || chapter == null || chapter == 'undefined' || chapter == undefined)) {
        semesterNewModel.find({
          _id: req.query.semesterId
        }).exec(function (err, deleteSemester) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else if (deleteSemester != '' || deleteSemester != null || deleteSemester != 'undefined' || deleteSemester != undefined) {
            semesterNewModel.findOneAndRemove(query).exec(function (err, semester) {
              if (err) {
                return res.status(500).json({
                  message: 'Internal Server Error!!!....'
                });
              } else {
                res.json({
                  status: 200,
                  data: semester,
                  message: 'Semester Deleted Successfully!!!....'
                });
              }

            });

          }
        });
      } else if ((subject != '' || subject != null || subject != 'undefined' || subject != undefined) && (chapter != '' || chapter != null || chapter != 'undefined' || chapter != undefined)) {
        res.json({
          data1: subject,
          message: 'Please remove Semester data in Subject Master and Chapter Master!!!....'
        });

      }
    });
  });


});


router.put('/updateSemester', function (req, res) {
  updateSemester(req.body)
  var query = {
    _id: req.body.semester_id
  },
    update = {
      $set: {
        // 
        semesterName: req.body.semesterName,
        semester_start_date: req.body.semesterStartDate,
        semester_end_date: req.body.semesterEndDate,
        semYear: req.body.semYear

      }
    };
  semesterNewModel.update(query, update, function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: course
      })
    }

  });


});
async function updateSemester(body) {
  var semester = await getId.getSemesterId(body.semester_id, '');
  var semesterId = semester.id
  models.semesters.find({
    where: {
      id: semesterId
    }
  }).then(data => {
    if(data){
      data.update({
        semesterName: body.semesterName,
        semester_start_date: body.semesterStartDate,
        semester_end_date: body.semesterEndDate,
        semYear: body.semYear
      }).then(updatedSemester => {
        console.log("updatedSemester", updatedSemester)
      })
    }
 
  })
}

router.post('/addBatch', function (req, res) {
  createBatch(req.body);
  var year = req.body.year;
  var year2 = parseInt(year) + 1;
  var fullYear = year + " - " + year2;
  batchMasterModel.find({
    batchName: req.body.batchName,
    courseId: req.body.courseName,
    departmentId: req.body.collegeDepartment,
    year: fullYear
  }).then(function (batch) {
    if (batch != '') {
      res.json({
        status: 200,
        message: 'Batch already created!!!..'
      });
    } else {
      var batchData = new batchMasterModel({
        batchName: req.body.batchName,
        courseId: req.body.courseName,
        departmentId: req.body.collegeDepartment,
        year: fullYear
      });
      batchData.save(function (err, result) {
        if (err) {
          console.error(err);
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: result
          });
        }
      })
    }
  });
});
async function createBatch(body) {
  var course = await getId.getCourseId(body.courseName, '')
  var department = await getId.getDepartmentId(body.collegeDepartment, '')
  var courseId = course.id
  var departmentId = department.id
  var year = body.year;
  var year2 = parseInt(year) + 1;
  var fullYear = year + " - " + year2;
  models.batchmasters.create({
    batchName: body.batchName,
    courseId: courseId,
    departmentId: departmentId,
    year: fullYear,
    batchStatus: 'false'
  }).then(function (batch) {
    console.log("batch")
    //   if(batch){
    //     res.json({
    //         status:200,
    //         data:batch
    //     })
    //     console.log(" batch save successfully")
    // }
    // else{
    //     res.json({
    //         status:400,
    //         message : "Error occured while creating batch."
    //     })
    // }
  })
}

router.get('/getBatchData', function (req, res) {
  batchMasterModel.find({}).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({
    "createdOn": -1
  }).exec(function (err, batchData) {
    var view_data = [];
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {

      batchData.forEach(function (batches) {
        if (batches != '') {
          view_data.push({
            batchId: batches._id,
            batchName: batches.batchName,
            courseName: batches.courseId.courseName,
            departmentName: batches.departmentId.departmentName,
            courseId: batches.courseId._id,
            departmentId: batches.departmentId._id,
            yearName: batches.year,
            batchStatus: batches.batchStatus
          });

        }

      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })

      }, 500)

    }

  });
});

router.get('/getCourseWiseStudentold', function (req, res) {
  var view_data = [];
  userModel.aggregate(
    [{
      $match: {
        courseName: req.query.courseName,
        departmentName: req.query.departmentName
      },

    }])
    .exec(function (err, data) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        if (data != '') {
          data.forEach(function (users) {
            collegeCourseModel.aggregate(
              [{
                $match: {
                  courseName: req.query.courseName,
                  departmentName: req.query.departmentName
                },

              }]).exec(function (err, course) {
                course.forEach(function (courseData) {
                  studentBatchModel.find({
                    studentId: users._id,
                    courseId: courseData._id,
                    batchId: req.query.batchId
                  }).then(function (studentData) {
                    if (studentData.length == 1 || studentData.length > 1) { } else {
                      view_data.push({
                        studentId: users._id,
                        studentName: users.fullName,
                        studentEmail: users.email


                      });

                    }
                  })

                });

              });


          });
          setTimeout(function () {
            res.json({
              status: 200,
              data: view_data
            })
          }, 3500);

        }
      }
    });


});



router.get('/getUpdateBatch', function (req, res) {
  var view_data = [];
  batchMasterModel.find({
    _id: req.query.batchId
  }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).exec(function (err, batch) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (batch != '' || batch != null || batch != 'undefined' || batch != undefined) {
      batch.forEach(function (batches) {
        if (batches != '') {
          var Year = batches.year.split(' - ');
          var repalceYear = Year[0]
          view_data.push({
            batchId: batches._id,
            batchName: batches.batchName,
            courseName: batches.courseId.courseName,
            departmentName: batches.departmentId.departmentName,
            batch_start_date: batches.batch_start_date,
            batch_end_date: batches.batch_end_date,
            courseId: batches.courseId._id,
            departmentId: batches.departmentId._id,
            yearName: batches.year,
            year: repalceYear
          });
        }


      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        });
      }, 500)

    } else {
      res.json({
        message: 'Course Not Find!!!!!!!!...'
      });
    }

  });

});

router.put('/updateBatch', function (req, res) {
  updateBatch(req.body)
  var year = req.body.year;
  var year2 = parseInt(year) + 1;
  var fullYear = year + " - " + year2;
  var query = {
    _id: req.body.batch_id
  },
    update = {
      $set: {
        batchName: req.body.batchName,
        courseId: req.body.courseName,
        departmentId: req.body.collegeDepartment,
        year: fullYear

      }
    };
  batchMasterModel.update(query, update, function (err, batch) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      if (batch != '') {
        res.json({
          status: 200,
          data: batch,
        });
      }

    }

  });

});
async function updateBatch(body) {
  var year = body.year;
  var year2 = parseInt(year) + 1;
  var fullYear = year + " - " + year2;
  var batch = await getId.getBatchId(body.batch_id, '')
  var course = await getId.getCourseId(body.courseName, '')
  var department = await getId.getDepartmentId(body.collegeDepartment, '')
  var courseId = course.id
  var departmentId = department.id
  var batchId = batch.id
  models.batchmasters.find({
    where: {
      id: batchId
    }
  }).then(function (update_batch) {
    if(update_batch){
      update_batch.update({
        batchName: body.batchName,
        courseId: courseId,
        departmentId: departmentId,
        year: fullYear
      }).then(function (data) {
        console.log("update_batch")
        //   if(data){
        //     res.json({
        //       status:200,
        //       data:data
        //       });
        //   }
      })
    }
    
  })
}

router.delete('/deleteBatch', async (req, res) => {
  try {
    let msg_obj = {
      msg: '',
      status: 0
    }
    var batchId = {
      _id: req.query.batchId
    }
    const studentBatches = await studentBatchModel.find({
      batchId
    })

    if (!studentBatches.length) {
      msg_obj.msg = 'Batches deleted successfully !!!'
      msg_obj.status = 200
      await batchMasterModel.findByIdAndDelete(batchId)
    } else {
      let studentBatches_length = studentBatches.length ?
        `${studentBatches.length} student batches` :
        ''
      msg_obj.msg = `Please delete ${studentBatches_length} students in this batch first !!`
      msg_obj.status = 409
    }
    res.status(200).json({
      status: msg_obj.status,
      message: msg_obj.msg
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
    return res.status(400).json({
      message: 'Bad Request',
    })
  }
})

router.post('/addChapter', function (req, res) {
  createChapter(req.body)
  var url = "pages/chapter";
  var body_data = req.body.item;
  if (req.body.role == 'admin') {
    var status = "Approved"
  } else {
    var status = "Unapproved"
  }
  var chapterData = new chapterModel({
    unitName: body_data.unitName,
    chapterName: body_data.chapterName,
    courseId: body_data.courseId,
    subject: body_data.subject,
    semesterId: body_data.semesterName,
    status: status,
    lastUpdated: body_data.date,
  });
  chapterData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      batchSemesterMasterModel.aggregate([{
        $match: {
          semesterId: body_data.semesterName,
        }
      },
      {
        $lookup: {
          from: "studentbatches",
          localField: "batchId",
          foreignField: "batchId",
          as: "users"
        }
      },

      ]).then(function (students) {

        students.forEach(function (student) {
          student.users.forEach(elm => {
            var query_params = "courseId:" + body_data.courseId + ",subject:" + body_data.subject + ",semesterId:" + body_data.semesterName + ",batchId" + elm.batchId;

            var action = "Admin Added chapter";
            var notification_data = " added new chapter" + " " + body_data.chapterName + " in Subject " + body_data.subject;
            notification_function.notification(action, notification_data, elm.studentId, url, query_params);
          })
        })
        res.json({
          status: 200,
          data: result
        })
      })
    }

  });
});
async function createChapter(body) {
  var body_data = body.item;

  var course = await getId.getCourseId(body_data.courseId, '')
  var semester = await getId.getSemesterId(body_data.semesterName, '');
  var subject = await getId.getSubjectId(body_data.subject, course.id, semester.id)

  var url = "pages/chapter";
  if (body.role == 'admin') {
    var status = "Approved"
  } else {
    var status = "Unapproved"
  }
await  models.chapters.create({
    courseId: course.id,
    semesterId: semester.id,
    subjectId: subject.id,
    chapterName: body_data.chapterName,
    status: status,
    videoLink: body.videoLink,
    lastUpdated: body_data.date,
    completed: 'false',
  }).then(function (chapter) {
    if (chapter) {
      // res.json({
      //     status:200,
      //     data:chapter
      // })
      console.log(" chapter save successfully")
    }
    else {
      // res.json({
      //     status:400,
      //     message : "Error occured while creating chapter."
      // })
    }
  })

}




router.get('/getCourseWiseSemester', function (req, res) {
  semesterNewModel.find({
    courseId: req.query.courseId
  }).then(function (semester) {
    if (semester != '') {
      res.json({
        status: 200,
        data: semester
      });
    } else {
      res.json({
        status: 400,
        message: 'bad request'
      });
    }

  });

});

router.put('/updateChapter', function (req, res) {
  updateChapter(req.body)
  var query = {
    _id: req.body.chapterId
  },
    update = {
      $set: {
        chapterName: req.body.chapterName,
        subject: req.body.subject,
        semesterId: req.body.semesterName,
        lastUpdated: req.body.date,
        courseId: req.body.courseId
      }
    };
  chapterModel.findOneAndUpdate(query, update, function (err, chapter) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      var action = "Admin update chapter";
      var notification_data = " update new chapter" + " " + req.body.chapterName + " in Subject " + req.body.subject;
      var query_params = "course_id:" + req.body.courseId + ", subjects:" + req.body.subjects;
      var url = "pages/viewLesson";
      res.json({
        status: 200,
        data: chapter
      })
    }

  });


});
async function updateChapter(body) {
  var chapter = await getId.getChapterId(body.chapterId, '')
  var semester = await getId.getSemesterId(body.semesterName, '');
  var course = await getId.getCourseId(body.courseName, '')
  var subject = await getId.getSubjectId(body.subject, course.id, semester.id)
  models.chapters.find({
    where: {
      id: chapter.id
    }
  }).then(async chapter => {
    if(chapter){
   await   chapter.update({
        chapterName: body.chapterName,
        subjectId: subject.id,
        semesterId: semester.id,
        lastUpdated: body.date,
        courseId: course.id
      }).then(data => {
        // console.log("data", data)
      })
    }
   
  })
}

router.put('/updateChapterStatus', function (req, res) {
  updateChapterStatus(req.body)
  var query = {
    _id: req.body.chapterId
  },
    update = {
      $set: {
        status: req.body.status,
      }
    }
  chapterModel.findOneAndUpdate(query, update, function (err, chapter) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: chapter
      })
    }
  })
});
async function updateChapterStatus(body) {
  var chapter = await getId.getChapterId(body.chapterId, '')
  models.chapters.find({
    where: {
      id: chapter.id
    }
  }).then(chapter => {
    if(chapter){
      chapter.update({
        status: body.status,
      }).then(data => {
        console.log("data", data)
      })
    }
   
  })
}

router.delete('/deleteChapter', function (req, res) {
  var query = {
    _id: req.query.chapterId
  }
  var query_upload = {
    lessonId: req.query.chapterId
  }
  chapterModel.find({
    _id: req.query.chapterId
  }).exec(function (err, deleteChapter) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteChapter != '' || deleteChapter != null || deleteChapter != 'undefined' || deleteChapter != undefined) {
      chapterModel.findOneAndRemove(query).exec(function (err, chapter) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          uploads.findOneAndRemove(query_upload).exec(function (err, upload) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              res.json({
                status: 200,
                data: chapter,
                data1: upload,
                message: 'Chapter Deleted Successfully!!!....'
              });

            }
          });

        }

      });

    }
  });


});

router.get('/getChapterData', function (req, res) {
  var view_data = [];
  var unit;
  if (req.query.courseId != undefined && req.query.subject != undefined && req.query.semester != undefined) {
    chapterModel.find({
      courseId: req.query.courseId,
      subject: req.query.subject,
      semesterId: req.query.semester

    }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).sort({
      "chapterName": 1
    }).then(function (course) {
      if (course != '') {
        chapterModel.find({
          courseId: req.query.courseId,
          subject: req.query.subject,
          semesterId: req.query.semester

        }).distinct('unitName').then(function (units) {
          unit = units;
        })
        course.forEach(function (courses) {
          view_data.push({
            unitName: courses.unitName,
            chapterName: courses.chapterName,
            chapterId: courses._id,
            status: courses.status,
            courseName: courses.courseId.courseName,
            semesterName: courses.semesterId.semesterName,
            semesterId: courses.semesterId._id,
            subject: courses.subject,
            completed: courses.completed 
          })
        });
        setTimeout(() => {
          res.json({
            status: 200,
            chapterUnits: unit,
            data: view_data
          })
        }, 500)
      } else {
        res.json({
          status: 200,
          message: 'No Result Found!!!...'
        })

      }

    });
  } else {
    chapterModel.find({}).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).sort({
      "createdOn": -1
    }).then(function (course) {
      if (course != '') {
        course.forEach(function (courses) {
          view_data.push({
            unitName: courses.unitName,
            chapterName: courses.chapterName,
            chapterId: courses._id,
            status: courses.status,
            courseName: courses.courseId.courseName,
            semesterName: courses.semesterId.semesterName,
            semesterId: courses.semesterId._id,
            subject: courses.subject,
            completed: courses.completed
          })

        });
        res.json({
          status: 200,
          data: view_data
        })
      }
    });
  }

});


router.get('/getUpdateChapter', function (req, res) {
  var view_data = [];
  chapterModel.find({
    _id: req.query.chapterId
  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, chapter) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (chapter != '' || chapter != null || chapter != 'undefined' || chapter != undefined) {
      chapter.forEach(function (chapters) {
        view_data.push({
          // 
          chapterId: chapters._id,
          chapterName: chapters.chapterName,
          status: chapters.status,
          courseName: chapters.courseId.courseName,
          courseId: chapters.courseId._id,
          subject: chapters.subject,
          semesterName: chapters.semesterId.semesterName,
          semesterId: chapters.semesterId._id,

        });


      });
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        message: 'Chapter Not Find!!!!!!!!...'
      });
    }

  });

});



router.post('/addBatchStudentData', function (req, res) {
  addBatchStudentData(req.body)
  var divisionName;
  var chattitle
  var roomName = req.body.batchId + "-" + req.body.divisionId
  req.body.studentArray.forEach(studentId => {
    studentBatchModel.find({
      batchId: req.body.batchId,
      departmentId: req.body.departmentId,
      courseId: req.body.courseId,
      divisionId: req.body.divisionId,
      studentId: studentId._id,
    }).then(function (batch) {
      if (batch == '' || batch == null || batch == undefined || batch == 'undefined') {
        studentBatchModel.create({
          batchId: req.body.batchId,
          departmentId: req.body.departmentId,
          courseId: req.body.courseId,
          divisionId: req.body.divisionId,
          studentId: studentId._id,
        }).then(function (result) {
          if (result) {
            roomModel.find({
              name1: roomName
            }).then(roomData => {

              if (roomData != null && roomData != '' && roomData != undefined) { } else {
                newDivisionModel.find({
                  _id: req.body.divisionId
                }).then(function (divisionInfo) {
                  divisionName = divisionInfo[0]['name']
                })
                batchMasterModel.find({
                  _id: req.body.batchId
                }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({
                  "createdOn": 1
                }).exec(function (err, batchData) {

                  batchData.forEach(function (batches) {
                    chattitle = batches['courseId']['courseName'] + ' - ' + batches['batchName'] + '(' + batches['year'] + ') - ' + divisionName
                    //console.log("chattitle == "+chattitle)
                  })
                  var today = Date.now();
                  newRoom = new roomModel({
                    name1: roomName,
                    name2: roomName,
                    roomName: chattitle,
                    lastActive: today,
                    createdOn: today
                  });
                  newRoom.save(function (err, newResult) {
                    if (err) {
                      console.log("Error : " + err);
                    }
                  })
                })

              }
            })
          }

        });
      } else {
        var query = {
          batchId: req.body.batchId,
          departmentId: req.body.departmentId,
          courseId: req.body.courseId,
          divisionId: req.body.divisionId,
          studentId: studentId._id,


        },
          update = {
            $set: {
              batchId: req.body.batchId,
              departmentId: req.body.departmentId,
              courseId: req.body.courseId,
              studentId: studentId._id,
              divisionId: req.body.divisionId,
            }
          };
        studentBatchModel.updateMany(query, update, function (err, lessons) {
          if (lessons) {
            roomModel.find({
              name1: roomName
            }).then(roomData => {
              if (roomData != null && roomData != '' && roomData != undefined) { } else {
                newDivisionModel.find({
                  _id: req.body.divisionId
                }).then(function (divisionInfo) {
                  divisionName = divisionInfo[0]['name']
                })
                batchMasterModel.find({
                  _id: req.body.batchId
                }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({
                  "createdOn": 1
                }).exec(function (err, batchData) {

                  batchData.forEach(function (batches) {
                    chattitle = batches['courseId']['courseName'] + ' - ' + batches['batchName'] + '(' + batches['year'] + ') - ' + divisionName
                  })
                  var today = Date.now();
                  newRoom = new roomModel({
                    name1: roomName,
                    name2: roomName,
                    roomName: chattitle,
                    lastActive: today,
                    createdOn: today
                  });
                  newRoom.save(function (err, newResult) {
                    if (err) {
                      console.log("Error : " + err);
                    }
                  })
                })

              }
            })
          }

        })

      }


    })



  });

  res.json({
    status: 200,
    // data:result
  })
});
async function addBatchStudentData(body) {
  var department = await getId.getDepartmentId(body.departmentId, '');
  var course = await getId.getCourseId(body.courseId, '')
  var batch = await getId.getBatchId(body.batchId, '')
  var division = await getId.getDivisionId(body.divisionId, '')

  var divisionName;
  var chattitle
  var roomName = batch.id + "-" + course.id
  body.studentArray.forEach(async studentId => {
    var student = await getId.getUserId(studentId._id, '')
    models.studentbatches.find({
      where: {
        batchId: batch.id,
        departmentId: department.id,
        courseId: course.id,
        divisionId: division.id,
        studentId: student.id,
      }
    }).then(Batch => {
      if (Batch == '' || Batch == null || Batch == undefined || Batch == 'undefined') {
        models.studentbatches.create({
          batchId: batch.id,
          departmentId: department.id,
          courseId: course.id,
          divisionId: division.id,
          studentId: student.id,
        }).then(result => {
          if (result) {
            models.rooms.find({
              where: {
                name1: roomName
              }
            }).then(roomData => {
              if (roomData != null && roomData != '' && roomData != undefined) { } else {
                models.division.find({
                  where: {
                    id: division.id
                  }
                }).then(divisionInfo => {
                  divisionName = divisionInfo['name']
                })
                models.batchmasters.batchData(batch.id).then(batchData => {
                  batchData.forEach(elm => {
                    chattitle = elm.courseName + '-' + elm.batchName + '(' + elm.year + ')' + divisionName
                  })
                  var today = Date.now();
                  models.rooms.create({
                    name1: roomName,
                    name2: roomName,
                    roomName: chattitle,
                    lastActive: today,
                    createdOn: today
                  }).then(newResult => {

                  })
                })
              }
            })
          }
        })
      } else {
        models.studentbatches.find({
          where: {
            batchId: batch.id,
            departmentId: department.id,
            courseId: course.id,
            divisionId: division.id,
            studentId: student.id,
          }
        }).then(batches => {
          if(batches){
            batches.update({
              batchId: batch.id,
              departmentId: department.id,
              courseId: course.id,
              divisionId: division.id,
              studentId: student.id,
            }).then(updatedBatch => {
              if (updatedBatch) {
                models.rooms.find({
                  where: {
                    name1: roomName
                  }
                }).then(roomData => {
                  if (roomData != null && roomData != '' && roomData != undefined) { } else {
                    models.division.find({
                      where: {
                        id: division.id
                      }
                    }).then(divisionInfo => {
                      divisionName = divisionInfo['name']
                    })
                    models.batchmasters.batchData(batch.id).then(batchData => {
                      batchData.forEach(elm => {
                        chattitle = elm.courseName + '-' + elm.batchName + '(' + elm.year + ')' + divisionName
                      })
                      var today = Date.now();
                      models.rooms.create({
                        name1: roomName,
                        name2: roomName,
                        roomName: chattitle,
                        lastActive: today,
                        createdOn: today
                      }).then(newResult => {
  
                      })
                    })
                  }
                })
              }
            })
          }
          
        })
      }
    })
  })
  // res.json({
  //   status: 200,
  //   // data:result
  // })
}

router.delete('/removeBatchStudent', function (req, res) {
  var query = {
    studentId: req.query.studentId,
    courseId: req.query.courseId,
    batchId: req.query.batchId
  }
  studentBatchModel.findOneAndRemove(query).exec(function (err, student) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error!!!....'
      });
    } else {
      res.json({
        status: 200,
        data: student,
        message: 'Student Deleted Successfully!!!....'
      });
    }

  });
});

router.get('/getViewBatchData', function (req, res) {
  var view_data = [];
  studentBatchModel.find({
    batchId: req.query.batchId,
    departmentId: req.query.departmentName,
    courseId: req.query.courseName,
  }).populate('batchId', ['batchName', 'year']).populate('departmentId', ['departmentName']).populate('courseId', ['courseName']).populate('divisionId', ['name']).populate('studentId', ['fullName']).exec(function (err, batchData) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (batchData != '') {
      batchData.forEach(function (batch) {
        view_data.push({
          batchId: batch.batchId._id ? batch.batchId._id : "",
          batchName: batch.batchId.batchName ? batch.batchId.batchName : "",
          departmentName: batch.departmentId.departmentName ? batch.departmentId.departmentName : "",
          courseId: batch.courseId._id ? batch.courseId._id : "",
          courseName: batch.courseId.courseName ? batch.courseId.courseName : "",
          studentName: batch.studentId.fullName ? batch.studentId.fullName : "",
          studentId: batch.studentId._id ? batch.studentId._id : "",
          batchStartDate: batch.batch_start_date ? batch.batch_start_date : "",
          batchEndDate: batch.batch_end_date ? batch.batch_end_date : "",
          divisionId: batch.divisionId._id ? batch.divisionId._id : "",
          divisionName: batch.divisionId.name ? batch.divisionId.name : "",
          yearName: batch.batchId.year ? batch.batchId.year : ""
        })
      })
      res.json({
        status: 200,
        data: view_data
      });
    } else if (batchData == '') {
      res.json({
        message: 'There are No Student Add !!....'
      })
    }

  });
});

router.get('/getDivisionData', function (req, res) {
  newDivisionModel.find().then(function (data) {
    if (data != '') {
      res.json({
        status: 200,
        data: data
      });
    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      })
    }


  });

});

router.get('/getOnlyDivisionData', function (req, res) {
  var view_data = [];
  divisionModel.aggregate([{
    $group: {
      _id: "$divisionName"
    }
  }]).exec((err, classes) => {
    if (err) {
      console.error(err)
    } else if (classes != '') {
      classes.forEach(function (data) {
        view_data.push({
          divisionName: data._id,
        });

      })
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 501,
        message: 'Internal server error!!!...'
      })
    }
  });

})

router.get('/getClassData', function (req, res) {
  var view_data = [];
  studentBatchModel.find({
    batchId: req.query.batchId,
    departmentId: req.query.departmentId,
    courseId: req.query.courseId

  }).populate('batchId', ['batchName']).populate('departmentId', ['departmentName']).populate('courseId', ['courseName']).populate('studentId', ['fullName']).exec(function (err, classData) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (classData != '') {
      classData.forEach(function (classes) {
        studentDivisionModel.find({
          studentId: classes.studentId._id,
          batchId: req.query.batchId,
          departmentId: req.query.departmentId,
          courseId: req.query.courseId
        }).then(function (division) {
          if (division.length == 1 || division.length > 1) { } else if (division.length == 0) {
            view_data.push({
              batchName: classes.batchId.batchName,
              departmentName: classes.departmentId.departmentName,
              courseName: classes.courseId.courseName,
              studentName: classes.studentId.fullName,
              studentId: classes.studentId._id,

            })
          }
        })

      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 3000);
    } else if (classData == '') {
      res.json({
        message: 'There are No Student Add Please Add Student in Batch !!....'
      })

    }
  });


});

router.post('/addStudentDivision', function (req, res) {
  req.body.studentArray.forEach(studentId => {

    studentDivisionModel.find({
      divisionId: req.body.divisionId,
      batchId: req.body.batchId,
      departmentId: req.body.departmentId,
      courseId: req.body.courseId,
      studentId: studentId._id,
    }).then(function (classes) {
      if (classes == '' || classes == null || classes == undefined || classes == 'undefined') {
        var studentDivisionData = new studentDivisionModel({
          divisionId: req.body.divisionId,
          batchId: req.body.batchId,
          departmentId: req.body.departmentId,
          courseId: req.body.courseId,
          studentId: studentId._id,
        });
        studentDivisionData.save(function (err, result) {
          if (err) {
            res.send({
              status: 500
            })
          }
        });
      } else {
        var query = {
          divisionId: req.body.divisionId,
          batchId: req.body.batchId,
          departmentId: req.body.departmentId,
          courseId: req.body.courseId,
          studentId: studentId._id

        },
          update = {
            $set: {
              divisionId: req.body.divisionId,
              batchId: req.body.batchId,
              departmentId: req.body.departmentId,
              courseId: req.body.courseId,
              studentId: studentId._id,
            }
          };
        studentDivisionModel.updateMany(query, update, function (err, lessons) {
          if (err) {
            res.send({
              status: 500
            })
          }
        })

      }


    })
  });

  res.json({
    status: 200,
  })
});

router.post('/addDivision', function (req, res) {
  addDivision(req.body)
  var divisionData = new newDivisionModel({
    name: req.body.divisionName,
    courseId: req.body.courseId,
    batchId: req.body.batchId,
    semesterId: req.body.semesterId,
  });
  divisionData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });


});
async function addDivision(body) {
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');
  models.division.create({
    name: body.divisionName,
    courseId: course.id,
    batchId: batch.id,
    semesterId: semester.id,
  }).then(division => {
    if (division) {
      console.log("addDivision", division)
    }
  })
}

router.put('/updateDivision', function (req, res) {
  updateDivision(req.body)
  var query = {
    _id: req.body.division_id,
  },
    update = {
      $set: {
        name: req.body.divisionName,
        courseId: req.body.courseId,
        batchId: req.body.batchId,
        semesterId: req.body.semesterId
      }
    };
  newDivisionModel.updateMany(query, update, function (err, Division) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        data: Division
      });
    }
  });

});
async function updateDivision(body) {
  var division = await getId.getDivisionId(body.divisionId, '')
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');

  models.division.find({
    where: {
      id: division.id
    }
  }).then(division => {
    if(division){
      division.update({
        name: body.divisionName,
        courseId: course.id,
        batchId: batch.id,
        semesterId: semester.id,
      }).then(data => {
        console.log("data", data)
      })
    }
   
  })
}

router.get('/getUpdateDivisionData', function (req, res) {
  var view_data = [];
  newDivisionModel.find({
    _id: req.query.divisionId
  }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).populate('semesterId', ['semesterName']).then(function (classes) {
    if (classes != '') {
      classes.forEach(function (data) {
        view_data.push({
          divisionName: data.name,
          divisionId: data._id,
          batchId: data.batchId._id ? data.batchId._id : 'NA',
          courseId: data.courseId._id ? data.courseId._id : 'NA',
          batchName: data.batchId.batchName ? data.batchId.batchName : 'NA',
          year: data.batchId.year ? data.batchId.year : 'NA',
          courseName: data.courseId.courseName ? data.courseId.courseName : 'NA',
          semesterId: data.semesterId._id ? data.semesterId._id : 'NA',
          semesterName: data.semesterId.semesterName ? data.semesterId.semesterName : 'NA'

        });

      });
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      })
    }

  });

});

router.delete('/deleteDivisionold', function (req, res) {
  var query = {
    _id: req.query.divisionId
  }
  studentDivisionModel.find({
    divisionId: req.query.divisionId
  }).exec(function (err, student) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (student == '' || student == null || student == 'undefined' || student == undefined) {
      divisionModel.find({
        _id: req.query.divisionId
      }).exec(function (err, deleteDivision) {
        if (err) {
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else if (deleteDivision != '' || deleteDivision != null || deleteDivision != 'undefined' || deleteDivision != undefined) {
          divisionModel.findOneAndRemove(query).exec(function (err, division) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              res.json({
                status: 200,
                data: division,
                message: 'Division Deleted Successfully!!!....'
              });
            }

          });

        }
      });
    } else if (student != '' || student != null || student != 'undefined' || student != undefined) {
      res.json({
        data1: student,
        message: 'Please remove Student in division !!!....'
      });

    }
  });


});


router.delete('/deleteDivision', async (req, res) => {
  try {
    let msg_obj = {
      msg: '',
      status: 0
    }
    const divisionId = {
      _id: req.query.divisionId
    }
    const teachers = await teacherModel.find({
      divisionId: req.query.divisionId
    })

    if (!teachers.length) {
      msg_obj.msg = 'Division deleted successfully !!!'
      msg_obj.status = 200
      await newDivisionModel.findByIdAndDelete(divisionId)
    } else {
      msg_obj.msg = 'Please delete allocate teacher associated with this division first!!'
      msg_obj.status = 409
    }
    res.status(200).json({
      status: msg_obj.status,
      message: msg_obj.msg
    })
  } catch (error) {
    res.json({
      message: err.message,
      divisionInDivisionTeacher,
      status: 400
    })
  }
})

router.get('/getAllClassData', function (req, res) {
  var view_data = [];
  newDivisionModel.find({}).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).populate('semesterId', ['semesterName']).then(function (classes) {
    if (classes != '') {
      classes.forEach(function (data) {
        view_data.push({
          divisionName: data.name,
          divisionId: data._id,
          batchId: data.batchId._id ? data.batchId._id : 'NA',
          courseId: data.courseId._id ? data.courseId._id : 'NA',
          batchName: data.batchId.batchName ? data.batchId.batchName : 'NA',
          batchYear: data.batchId.year ? data.batchId.year : 'NA',
          courseName: data.courseId.courseName ? data.courseId.courseName : 'NA',
          semesterId: data.semesterId._id ? data.semesterId._id : 'NA',
          semesterName: data.semesterId.semesterName ? data.semesterId.semesterName : 'NA'


        })


      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 500)

    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    }
  });
});


router.get('/getViewStudentClassData', function (req, res) {
  var view_data = [];
  studentDivisionModel.find({
    divisionId: req.query.divisionId,
    batchId: req.query.batchId,
    courseId: req.query.courseId,
    departmentId: req.query.departmentId

  }).populate('batchId', ['batchName']).populate('divisionId', ['divisionName']).populate('departmentId', ['departmentName']).populate('courseId', ['courseName']).populate('studentId', ['fullName']).exec(function (err, classes) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (classes != '') {
      classes.forEach(function (classData) {
        view_data.push({
          divisionName: classData.divisionId.divisionName,
          divisionId: classData.divisionId._id,
          batchName: classData.batchId.batchName,
          courseName: classData.courseId.courseName,
          departmentName: classData.departmentId.departmentName,
          studentName: classData.studentId.fullName,
          studentId: classData.studentId._id,
          batchId: classData.batchId._id,
          courseId: classData.courseId._id,
          departmentId: classData.departmentId._id

        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else if (classes == '') {
      res.json({
        message: 'There are No Student Add In Class Please Add Student !!....'
      })

    }
  })

});

router.delete('/removeClassStudent', function (req, res) {
  var query = {
    studentId: req.query.studentId,
    divisionId: req.query.divisionId,
    batchId: req.query.batchId,
    courseId: req.query.courseId,
    departmentId: req.query.departmentId
  }
  studentDivisionModel.find({
    studentId: req.query.studentId,
    divisionId: req.query.divisionId,
    batchId: req.query.batchId,
    courseId: req.query.courseId,
    departmentId: req.query.departmentId
  }).exec(function (err, deleteStudent) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteStudent != '' || deleteStudent != null || deleteStudent != 'undefined' || deleteStudent != undefined) {
      studentDivisionModel.findOneAndRemove(query).exec(function (err, student) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: student,
            message: 'Student Deleted Successfully!!!....'
          });
        }

      });

    }
  });



});


router.post('/addStudent', function (req, res) {
  addStudent(req)
  studentBatchModel.find({
    batchId: req.body.batch_id,
    departmentId: req.body.departmentId,
    courseId: req.body.courseId,
    studentId: req.body.user_id,
    divisionId: req.body.divisionId,
  }).then(function (batches) {
    if (batches == '' || batches == null || batches == undefined || batches == 'undefined') {
      var studentData = new studentBatchModel({
        batchId: req.body.batch_id,
        departmentId: req.body.departmentId,
        courseId: req.body.courseId,
        divisionId: req.body.divisionId,
        studentId: req.body.user_id,
        batch_start_date: req.body.start_date,
        batch_end_date: req.body.end_date
      });
      studentData.save(function (err, result) {
        if (err) {
          res.send({
            status: 500
          })
        } else {
          res.send({
            status: 200
          });
        }
      });
    } else {

      var query = {
        batchId: req.body.batch_id,
        departmentId: req.body.departmentId,
        courseId: req.body.courseId,
        studentId: req.body.user_id,
        divisionId: req.body.divisionId,

      },
        update = {
          $set: {
            batchId: req.body.batch_id,
            departmentId: req.body.departmentId,
            courseId: req.body.courseId,
            studentId: req.body.user_id,
            divisionId: req.body.divisionId,
          }
        };
      studentBatchModel.updateMany(query, update, function (err, result) {
        if (err) {
          res.send({
            status: 500
          })
        } else {
          res.send({
            status: 200
          });
        }
      })

    }


  })

});
async function addStudent(req) {
  var division = await getId.getDivisionId(req.body.divisionId, '')
  var department = await getId.getDepartmentId(req.body.departmentId, '');
  var batch = await getId.getBatchId(req.body.batch_id, '')
  var course = await getId.getCourseId(req.body.courseId, '')
  var user = await getId.getUserId(req.body.user_id, '')
  models.studentbatches.find({
    where: {
      batchId: batch.id,
      departmentId: department.id,
      courseId: course.id,
      studentId: user.id,
      divisionId: division.id
    }
  }).then(batches => {
    if (batches == '' || batches == null || batches == undefined || batches == 'undefined') {
      models.studentbatches.create({
        batchId: batch.id,
        departmentId: department.id,
        courseId: course.id,
        divisionId: division.id,
        studentId: user.id,
        batchStartDate: req.body.start_date,
        batchEndDate: req.body.end_date
      }).then(studentbatch => {
        console.log("studentbatch")
      })
    } else {
      batches.update({
        batchId: batch.id,
        departmentId: department.id,
        courseId: course.id,
        studentId: user.id,
        divisionId: division.id,
      }).then(batchesUpdate => {
        console.log("batchesUpdate")
      })
    }
  })
}

router.get('/getAllTeacherData', function (req, res) {
  var view_data = [];
  userModel.find({
    role: "teacher"
  }).then(function (teacher) {
    if (teacher != '') {
      teacher.forEach(function (teacherData) {
        view_data.push({
          teacherData
        });
      });
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        status: 500
      });
    }
  })
});

router.post('/addTeacherData', function (req, res) {
  addTeacherData(req.body)
  var teacherData = new teacherModel({
    divisionId: req.body.divisionId,
    teacher_id: req.body.teacherId,
    batch_id: req.body.batchId,
    department_id: req.body.departmentId,
    course_id: req.body.courseId,
    subject: req.body.subject,
    semesterId: req.body.semesterId,
    ratePerHour: req.body.ratePerHour
  });
  teacherData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      teacherModel.find({
        course_id: req.body.courseId,
        subject: req.body.subject
      }).then(function (teachers) {
        teachers.forEach(function (teacher) {
          var action = "Admin Added Divsion";
          var notification_data = "You have been Allocated new Division in " + req.body.subject;
          notification_function.notification(action, notification_data, teacher.teacher_id, '');
        })
      });
      res.json({
        status: 200,
        data: result
      })
    }

  });

})
async function addTeacherData(body) {
  console.log("body", body)
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');
  var subject = await getId.getSubjectId(body.subject, course.id, semester.id)
  var department = await getId.getDepartmentId(body.departmentId, '');
  var division = await getId.getDivisionId(body.divisionId, '')
  var user = await getId.getUserId(body.teacherId, '')
 await models.teachers.create({
    divisionId: division.id,
    teacherId: user.id,
    batchId: batch.id,
    departmentId: department.id,
    courseId: course.id,
    subjectId: subject.id,
    semesterId: semester.id,
    ratePerHour: body.ratePerHour
  }).then(teacherData => {
    console.log("teacherData")
  })
}

router.put('/updateTeacherData', function (req, res) {
  updateTeacherData(req.body)
  var query = {
    _id: req.body.previousTeacherId,
  },
    update = {
      $set: {
        teacher_id: req.body.teacherId,
        department_id: req.body.departmentId,
        course_id: req.body.courseId,
        divisionId: req.body.divisionId,
        semesterId: req.body.semesterId,
        batch_id: req.body.batchId,
        subject: req.body.subject,
        ratePerHour: req.body.ratePerHour
      }
    };
  teacherModel.updateMany(query, update, function (err, result) {
    if (err) {
      res.send({
        status: 500
      })
    } else {
      res.send({
        status: 200
      });
    }
  })
});
async function updateTeacherData(body) {
  teacherModel.find({
    _id: body.previousTeacherId
  }).then(async data => {
    var Batch = await getId.getBatchId(data.batch_id, '')
    var Course = await getId.getCourseId(data.course_id, '')
    var Semester = await getId.getSemesterId(data.semesterId, '');
    var Subject = await getId.getSubjectId(data.subject, course.id, semester.id)
    var Department = await getId.getDepartmentId(data.department_id, '');
    var Division = await getId.getDivisionId(data.divisionId, '')
    var User = await getId.getUserId(data.teacher_id, '')
 await   models.teachers.find({
      where: {
        divisionId: Division.id,
        teacherId: User.id,
        batchId: Batch.id,
        departmentId: Department.id,
        courseId: Course.id,
        subjectId: Subject.id,
        semesterId: Semester.id,
      }
    }).then(async teacherData => {
      var batch = await getId.getBatchId(body.batchId, '')
      var course = await getId.getCourseId(body.courseId, '')
      var semester = await getId.getSemesterId(body.semesterId, '');
      var subject = await getId.getSubjectId(body.subject, course.id, semester.id)
      var department = await getId.getDepartmentId(body.departmentId, '');
      var division = await getId.getDivisionId(body.divisionId, '')
      var user = await getId.getUserId(body.teacherId, '')
    await  teacherData.update({
        divisionId: division.id,
        teacherId: user.id,
        batchId: batch.id,
        departmentId: department.id,
        courseId: course.id,
        subjectId: subject.id,
        semesterId: semester.id,
        ratePerHour: body.ratePerHour
      }).then(data => {
        console.log("data>>>>", data)
      })
    })
  })



}

router.get('/getDivisionTeacherData', function (req, res) {
  var view_data = [];
  teacherModel.find({
  }).populate('batch_id', ['batchName', 'year']).populate('divisionId', ['name']).populate('department_id', ['departmentName']).populate('course_id', ['courseName']).populate('semesterId', ['semesterName']).populate('teacher_id', ['fullName', 'email']).exec(function (err, teacher) {

    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (teacher != '') {
      teacher.forEach(function (teacherData) {
        view_data.push({
          _id: teacherData._id,
          divisionName: teacherData.divisionId.name,
          divisionId: teacherData.divisionId._id,
          batchName: teacherData.batch_id.batchName,
          yearName: teacherData.batch_id.year,
          batchId: teacherData.batch_id._id,
          courseName: teacherData.course_id.courseName,
          courseId: teacherData.course_id._id,
          departmentName: teacherData.department_id.departmentName,
          departmentId: teacherData.department_id._id,
          teacherName: teacherData.teacher_id.fullName,
          teacherEmail: teacherData.teacher_id.email,
          teacher_id: teacherData.teacher_id._id,
          subject: teacherData.subject,
          semesterName: teacherData.semesterId.semesterName,
          semesterId: teacherData.semesterId._id
        })

      });
      res.json({
        status: 200,
        data: view_data
      })
    } else if (teacher == '') {
      res.json({
        message: 'There are No Allocate Teacher Please Allocate Teacher For Division!!....'
      })
    }

  });

});

router.put('/changeTeacher', function (req, res) {
  var query = {
    _id: req.body.previousTeacherId,
    department_id: req.body.departmentId,
    course_id: req.body.courseId,
    divisionId: req.body.divisionId,
    semesterId: req.body.semesterId
  },
    update = {
      $set: {
        teacher_id: req.body.teacherId
      }
    };
  teacherModel.updateMany(query, update, function (err, teacher) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        data: teacher
      });
    }
  });

});



router.post('/addSubject', function (req, res) {
  addSubject(req.body);
  var subjects = JSON.stringify(req.body.subject);

  var subjectData = new subjectModel({
    semesterId: req.body.semesterId,
    courseId: req.body.courseId,
    subject: subjects,

  });
  subjectData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });

});
async function addSubject(body) {
  var sub1 = JSON.stringify(body.subject);
  var semester = await getId.getSemesterId(body.semesterId, '');
  var course = await getId.getCourseId(body.courseId, '')
  var sub2 = sub1.replace(/^\[([^]*)]$/, '$1')
  var sub = sub2.replace(/^"(.*)"$/, '$1');
  var strs = sub.split(`","`);
  strs.forEach(elm => {
    models.subject.create({
      courseId: course.id,
      semesterId: semester.id,
      subject: elm
    }).then(data => {
      console.log("subject")
    })
  })

}

router.get('/getBatchWiseYear', function (req, res) {
  courseBatchModel.find({
    batch_id: req.query.batchId
  }).then(function (batch) {
    if (batch != '') {
      res.json({
        status: 200,
        data: batch
      })
    } else {
      res.json({
        status: 400,
        message: 'bad request'
      });
    }
  })

});


router.get('/getSubjectData', function (req, res) {
  var view_data = [];
  subjectModel.find({}).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, subject) {
    if (err) {
      console.error(err);
    } else if (subject != '' || subject != undefined || subject != 'undefined' || subject != null) {
      subject.forEach(function (subjects) {
        var course_subjects = [];
        var sub1 = subjects.subject;
        var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
        var sub = sub2.replace(/^"(.*)"$/, '$1');
        var strs = sub.split('","');
        strs.forEach(function (courseSubject) {
          course_subjects.push(courseSubject);
        });

        view_data.push({
          semesterId: subjects.semesterId._id,
          courseId: subjects.courseId,
          subject: course_subjects,
          semesterName: subjects.semesterId.semesterName,
          courseName: subjects.courseId.courseName,
          subjectId: subjects._id
        })

      })
      res.json({
        status: 200,
        data: view_data

      });
    } else {
      res.json({
        status: 400
      });
    }
  });
});

router.get('/getUpdateSubjectData', function (req, res) {
  var view_data = [];
  subjectModel.find({
    _id: req.query.subjectId
  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, subject) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (subject != '' || subject != null || subject != 'undefined' || subject != undefined) {
      subject.forEach(function (subjects) {
        var course_subjects = [];
        var sub1 = subjects.subject;
        var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
        var sub = sub2.replace(/^"(.*)"$/, '$1');
        var strs = sub.split('","');
        strs.forEach(function (courseSubject) {
          course_subjects.push(courseSubject);
        });
        view_data.push({
          semesterId: subjects.semesterId._id,
          courseId: subjects.courseId._id,
          subject: course_subjects,
          semesterName: subjects.semesterId.semesterName,
          courseName: subjects.courseId.courseName,
          subjectId: subjects._id
        });



      });
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        message: 'Course Not Find!!!!!!!!...'
      });
    }

  });

});

router.put('/updateSubject', function (req, res) {
  updateSubject(req.body);
  var subjects = JSON.stringify(req.body.subject);
  var query = {
    _id: req.body.semesterSubjectId
  },
    update = {
      $set: {
        courseId: req.body.courseId,
        semesterId: req.body.semesterId,
        subject: subjects

      }
    };
  subjectModel.update(query, update, function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: course
      })
    }

  });

});

async function updateSubject(body) {
  var semester = await getId.getSemesterId(body.semesterId, '');
  var course = await getId.getCourseId(body.courseId, '')
  var sub1 = JSON.stringify(body.subject)
  var sub2 = sub1.replace(/^\[([^]*)]$/, '$1')
  var sub = sub2.replace(/^"(.*)"$/, '$1');
  var strs = sub.split(`","`);
  strs.forEach(elm => {
    models.subject.find({
      where: {
        courseId: course.id,
        semesterId: semester.id,
      }
    }).then(subject => {
      if(subject){
        subject.update({
          courseId: course.id,
          semesterId: semester.id,
          subject: elm
        }).then(update_subject => {
          console.log("update_subject", update_subject)
        })
      }
     
    })
  })


}

router.delete('/deleteSubject', function (req, res) {
  var view_data = {
    flag: false,
  };
  var subject = req.query.subject;
  var subjectone = subject.split(',');
  for (var i = 0; i < subjectone.length; i++) {
    chapterModel.find({
      semesterId: req.query.semesterId,
      subject: subjectone[i]
    }).then(function (chapter) {
      var count = chapter.length + 1;
      if (count >= 2) {
        view_data.flag = true;
      } else if (count == 0) {
        view_data.flag = false;
      }

    })
  }
  setTimeout(function () {
    view_data.flag;
    var query = {
      _id: req.query.subjectId
    }
    if (view_data.flag == false) {
      subjectModel.find({
        _id: req.query.subjectId
      }).exec(function (err, deleteSubject) {
        if (err) {
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else if (deleteSubject != '' || deleteSubject != null || deleteSubject != 'undefined' || deleteSubject != undefined) {
          subjectModel.findOneAndRemove(query).exec(function (err, subject) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              res.json({
                status: 200,
                data: view_data,
                message: 'Subject Deleted Successfully!!!....'
              });
            }

          });

        }
      });
    } else if (view_data.flag == true) {
      res.json({
        message: 'Please Remove Chapter!!...'
      })
    }
  }, 500)
});

router.get('/getViewChapterData', function (req, res) {
  var view_data = [];
  chapterModel.find({
    _id: req.query.chapterId
  }).then(function (chapter) {
    if (chapter != '') {
      chapter.forEach(function (chapters) {
        uploads.find({
          lessonId: req.query.chapterId
        }).then(function (uploadData) {
          if (uploadData != '') {
            uploadData.forEach(function (upload) {
              view_data.push({
                chapterName: chapters.chapterName,
                chapterId: chapters._id,
                subject: chapters.subject,
                semesterName: chapters.semesterName,
                uploadFile: upload.name,
              })
            });
          } else if (uploadData == '') {
            view_data.push({
              chapterName: chapters.chapterName,
              chapterId: chapters._id,
              subject: chapters.subject,
              semesterName: chapters.semesterName,
            })
          }

        })
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        });
      }, 1500)
    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    }

  });

});

router.get('/websearch', function (req, res) {
  var query = req.query.q;
  customsearch.cse.list({
    cx: '005733325014051869310:62eupjczzhc',
    q: query,
    auth: 'AIzaSyDCDtZXDC9DDMo25L3r8u8CdcXVY5TvJRI',
  }).then(result => result.data).then((result) => {
    const {
      items,
      searchInformation
    } = result;
    if (searchInformation.totalResults != 0) {
      const data = {
        time: searchInformation.searchTime,
        items: items.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet,
          img: (((o.pagemap || {}).cse_image || {})[0] || {}).src
        }))
      }
      data.items.forEach(element => { });
      res.json({
        data: data.items
      });

    } else {
      res.json({
        data: ''
      });
    }
  });
})

router.get('/changeSemesterStatus', function (req, res) {
  changeSemesterStatus(req)
  var view_data = {
    statusFlag: false,
    count: false
  }
  var query = {
    _id: req.query.semesterId
  },
    update = {
      $set: {
        semesterStatus: req.query.semesterStatus,

      }
    };
  semesterNewModel.find({
    _id: req.query.semesterId
  }).then(function (sem) {
    if (sem != '') {
      if (sem[0].semesterStatus == 'false') {
        if (req.query.semesterStatus == 'true') {
          semesterNewModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.semesterStatus == 'false') {
          semesterNewModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = false
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })

        }

      } else if (sem[0].semesterStatus == 'true') {
        if (req.query.semesterStatus == 'true') {
          semesterNewModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.semesterStatus == 'false') {
          semesterNewModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = false
                res.json({
                  status: 200,
                  data: view_data

                })

              }

            }
          })

        }

      }

    }


  });
});

async function changeSemesterStatus(req) {
  var semester = await getId.getSemesterId(req.query.semesterId, '');
  models.semesters.find({
    where: {
      id: semester.id
    }
  }).then(Status => {
    if(Status){
      Status.update({
        semesterStatus: req.query.semesterStatus,
      }).then(upadteStatus=>{
        console.log("upadteStatus",upadteStatus)
      })
    }
 

  })

}

router.post('/saveVideoLink', function (req, res) {
  saveVedioLink(req.body)
  var youTubeLinks = new youTubeLinkModel({
    chapterId: req.body.chapterId,
    type_of_upload: req.body.type,
    youTubeLink: req.body.youTubeLink,
    videoName: req.body.videoName
  });
  youTubeLinks.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      chapterModel.find({
        _id: req.body.chapterId,
      }).then(function (chapter) {
        if (chapter.length > 0) {
          var current_year = moment(new Date()).format('YYYY');
          var previous_year = parseInt(current_year) - 1;
          var batch_year_search = previous_year + " - " + current_year; 
          var year_search;
          semesterNewModel.find({
            _id: chapter[0].semesterId
          }).then(function (semester) {
            if (semester[0].semesterName == 'Semester 1' || semester[0].semesterName == 'Semester 2') {
              year_search = 'FY';
            } else if (semester[0].semesterName == 'Semester 3' || semester[0].semesterName == 'Semester 4') {
              year_search = 'SY'
            } else {
              year_search = 'TY'
            }
            batchMasterModel.find({
              courseId: chapter[0].courseId,
              batchName: year_search,
              year: batch_year_search
            }).then(function (batch) {
              userModel.find({
                _id: req.body.user_id
              }).then(function (userdetails) {
                if (userdetails) {
                  var activity_action = " Added YouTube Video link.";
                  var activity_data = userdetails[0].fullName + " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                  notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                }
              })
              studentBatchModel.find({
                courseId: chapter[0].courseId,
                batchId: batch[0]._id
              }).then(function (studentData) {
                var action = "Admin Added YouTube Video link.";
                var notification_data = " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                studentData.forEach(function (student) {
                  notification_function.notification(action, notification_data, student.studentId);
                });
              })
            })
          })
        }
      })
      res.json({
        status: 200,
        data: result
      })
    }
  });
});
async function saveVedioLink(body) {
  var chapter = await getId.getChapterId(body.chapterId, '')
  models.youtubelinks.create({
    chapterId: chapter.id,
    typeOfUpload: body.type,
    youTubeLink: body.youTubeLink,
    videoName: body.videoName
  }).then(youtube => {
    if (youtube) {
      models.chapters.getSubject(chapter.id).then(async Chapter => {
        if (Chapter.length > 0) {
          var current_year = moment(new Date()).format('YYYY');
          var previous_year = parseInt(current_year) - 1;
          var batch_year_search = previous_year + " - " + current_year; //2019 - 2020
          var year_search;
          models.semesters.find({
            where: {
              id: Chapter[0].semesterId,
            }
          }).then(async semester => {
            if (semester.semesterName == 'Semester 1' || semester.semesterName == 'Semester 2') {
              year_search = 'FY';
            } else if (semester.semesterName == 'Semester 3' || semester.semesterName == 'Semester 4') {
              year_search = 'SY'
            } else {
              year_search = 'TY'
            }
            models.batchmasters.find({
              where: {
                courseId: Chapter[0].courseId,
                batchName: year_search,
                year: batch_year_search
              }
            }).then(async batch => {
              var user = await getId.getUserId(body.user_id, '')
              models.users.find({
                where: {
                  id: user.id,
                }
              }).then(userdetails => {
                if (userdetails) {
                  var activity_action = " Added YouTube Video link.";
                  var activity_data = userdetails.fullName + " Added YouTube Video for Chapter " + Chapter[0].chapterName + " and Subject " + Chapter[0].subject;
                  notification_function.activity(activity_action, activity_data, Chapter[0].courseId, batch.id);
                }
              })
              models.studentbatches.find({
                where: {
                  courseId: Chapter[0].courseId,
                  batchId: batch.id
                }
              }).then(studentData => {
                var action = "Admin Added YouTube Video link.";
                var notification_data = " Added YouTube Video for Chapter " + Chapter[0].chapterName + " and Subject " + Chapter[0].subject;
                studentData.forEach(function (student) {
                  notification_function.notification(action, notification_data, student.studentId);
                });
              })
            })
          })
        }
      })
    }
  })
}

router.get('/getYouTubeLinks', function (req, res) {
  youTubeLinkModel.find({
    chapterId: req.query.chapterId
  }).then(function (youTubeLinks) {
    if (youTubeLinks != '') {
      res.json({
        status: 200,
        data: youTubeLinks
      });
    } else {
      res.json({
        status: 500
      });
    }
  })
});

router.get('/getAllchapterFiles', function (req, res) {
  var view_data = [];
  uploads.find({
    lessonId: req.query.chapterId
  }).then(function (chapter) {
    if (chapter != '') {
      chapter.forEach(function (chapters) {
        view_data.push({
          uploadId: chapters._id,
          file_name: chapters.name,
          doc_id: chapters.doc_id,
          type: chapters.type,
          type_of_upload: chapters.type_of_upload,
          chapterId: chapters.lessonId,
          youtubeShow: false,
          onlineLectureLink: false,
          lectureVideo: false
        })
      })

    }
    youTubeLinkModel.find({
      chapterId: req.query.chapterId
    }).then(function (youtubes) {
      if (youtubes != '') {
        youtubes.forEach(function (youtube) {
          view_data.push({
            uploadId: youtube._id,
            file_name: youtube.youTubeLink,
            type_of_upload: 'prerequisite',
            chapterId: youtube.lessonId,
            youtubeShow: true,
            onlineLectureLink: false,
            lectureVideo: false
          })
        })
      }
      chapterModel.find({
        _id: req.query.chapterId
      }).then(function (videoLecture) {
        videoLecture.forEach((el) => {
          var videoElement = el.videoLink
          if (videoElement != '') {
            videoElement.forEach((videoEl) => {
              view_data.push({
                chapterId: el._id,
                file_name: videoEl,
                type_of_upload: 'lecture',
                youtubeShow: false,
                onlineLectureLink: false,
                lectureVideo: true
              })
            })
          }
          onlineLectureLinkModel.find({
            chapterId: req.query.chapterId
          }).then(function (onlineLecture) {
            if (onlineLecture != '') {
              onlineLecture.forEach((onlineLectures) => {
                view_data.push({
                  uploadId: onlineLectures._id,
                  chapterId: onlineLectures.chapterId,
                  file_name: onlineLectures.onlineLectureLink,
                  type_of_upload: onlineLectures.type_of_upload,
                  onlineLectureDate: onlineLectures.onlineLectureDate,
                  youtubeShow: false,
                  onlineLectureLink: true,
                  lectureVideo: false
                });
              });
            }

            if (chapter != '' || youtubes != '' || onlineLecture != '' || videoElement != '') {
              setTimeout(() => {
                res.json({
                  status: 200,
                  data: view_data,
                })
              }, 2000);
            } else if (chapter == '' && youtubes == '' && onlineLecture == '' && videoElement == '') {
              res.json({
                message: 'There are no uploaded Files!!...'
              })
            }

          })
        });
      })

    });
  });
});


router.delete('/deleteUploadFile', function (req, res) {
  var query = {
    _id: req.query.uploadId
  }
  uploads.find({
    _id: req.query.uploadId
  }).then(function (upload) {
    if (upload != '') {
      chapterModel.find({
        _id: upload[0].lessonId
      }).then(function (chapter) {
        userModel.find({
          _id: req.query.user_id
        }).then(function (userdetails) {
          if (userdetails) {
            var activity_action = "Deleted " + upload[0].type_of_upload;
            var activity_data = userdetails[0].fullName + " Deleted " + upload[0].type_of_upload + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
            notification_function.activity(activity_action, activity_data, chapter[0].courseId, '');
          }
        })
      })
      uploads.findOneAndRemove(query).exec(function (err, file) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            message: 'file Deleted Successfully!!!....'
          });
        }

      });
    } else if (upload == '') {
      youTubeLinkModel.find({
        _id: req.query.uploadId
      }).then(function (youtube) {
        if (youtube != '') {
          youTubeLinkModel.findOneAndRemove(query).exec(function (err, link) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              res.json({
                status: 200,
                message: 'link Deleted Successfully!!!....'
              });
            }

          });
        } else if (upload == '' || youtube == '') {
          onlineLectureLinkModel.find({
            _id: req.query.uploadId
          }).then(function (onlineLecture) {
            if (onlineLecture != '') {
              onlineLectureLinkModel.findOneAndRemove(query).exec(function (err, link) {
                if (err) {
                  return res.status(500).json({
                    message: 'Internal Server Error!!!....'
                  });
                } else {
                  chapterModel.find({
                    _id: req.query.chapterId
                  }).then(function (chapter) {
                  })
                  res.json({
                    status: 200,
                    message: 'link Deleted Successfully!!!....'
                  });
                }

              });
            } else if (upload == '' || youtube == '' || onlineLecture == '') {
              vimeoLinkModel.find({
                _id: req.query.uploadId
              }).then(function (vimeoUpload) {
                if (vimeoUpload != '') {
                  vimeoLinkModel.findOneAndRemove(query).exec(function (err, link) {
                    if (err) {
                      return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                      });
                    } else {
                      res.json({
                        status: 200,
                        message: 'link Deleted Successfully!!!....'
                      });
                    }

                  });
                }

              });
            }
          })
        }
      })
    }
  })

});

router.delete('/deleteVideoLink', function (req, res) {
  chapterModel.find({
    _id: req.query.chapterId
  }).then(function (chapter) {
    chapter.forEach((el) => {

      var video = el.videoLink

      while (video.indexOf(req.query.file_name) !== -1) {
        video.splice(video.indexOf(req.query.file_name), 1);
      }
      var query = {
        _id: req.query.chapterId
      },
        update = {
          $set: {
            videoLink: video,
          }
        };
      chapterModel.updateMany(query, update, function (err, videoLink) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            message: 'video deleted successfully!!!...'
          });
        }
      })
    })
  })
})

router.delete('/deleteYouTubeLink', function (req, res) {
  var query = {
    _id: req.query.id
  }
  youTubeLinkModel.findOneAndRemove(query).exec(function (err, link) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error!!!....'
      });
    } else {
      res.json({
        status: 200,
        message: 'link Deleted Successfully!!!....'
      });
    }

  });
});



router.get('/getNewSemesterData', function (req, res) {
  var view_data = []
  semesterNewModel.find().populate('courseId', ['courseName']).then(function (data) {
    data.forEach(function (semesters) {
      if (semesters.courseId) {
        view_data.push({
          semesterId: semesters._id,
          semesterName: semesters.semesterName,
          semesterStatus: semesters.semesterStatus,
          semester_end_date: semesters.semester_end_date,
          semester_start_date: semesters.semester_start_date,
          courseName: semesters.courseId.courseName,
          courseId: semesters.courseId._id,
          semyear: semesters.semYear,

        })
      } else {
        view_data.push({
          semesterId: semesters._id,
          semesterName: semesters.semesterName,
          semesterStatus: semesters.semesterStatus,
          semester_end_date: semesters.semester_end_date,
          semester_start_date: semesters.semester_start_date,
          semester_end_date: semesters.semester_end_date,
          semyear: semesters.semYear,
          semesterStatus: semesters.semesterStatus
        })
      }

    })
    if (view_data != '') {
      res.json({
        status: 200,
        data: view_data
      });
    } else if (view_data == '') {
      res.json({
        message: "There are no add semester please add semester!!!...."
      })
    }


  });
});


router.get('/changeBatchStatus', function (req, res) {
  changeBatchStatus(req)
  var view_data = {
    statusFlag: false,
    count: false
  }
  var query = {
    _id: req.query.batchId
  },
    update = {
      $set: {
        batchStatus: req.query.batchStatus,

      }
    };
  batchMasterModel.find({
    _id: req.query.batchId
  }).then(function (batch) {
    if (batch != '') {
      if (batch[0].batchStatus == 'false') {
        if (req.query.batchStatus == 'true') {
          batchMasterModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.batchStatus == 'false') {
          batchMasterModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = false
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })

        }

      } else if (batch[0].batchStatus == 'true') {
        if (req.query.batchStatus == 'true') {
          batchMasterModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.batchStatus == 'false') {
          batchMasterModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              if (changeStatus != '') {
                view_data.statusFlag = false
                res.json({
                  status: 200,
                  data: view_data

                })

              }

            }
          })

        }

      }

    }
  });

});

async function changeBatchStatus(req) {
  var batch = await getId.getBatchId(req.body.batchId, '')
  models.batchmasters.find({
    where: {
      id: batch.id
    }
  }).then(batch => {
    if(batch){
      batch.update({
        batchStatus: req.query.batchStatus
      }).then(updateStatus => {
        console.log("updateStatus")
      })
    }
   
  })

}
router.get('/getOnlyRunningBatchData', function (req, res) {
  var view_data = [];
  batchMasterModel.find({
    courseId: req.query.course_id,
    batchStatus: 'true'
  }).then(function (batch) {
    if (batch != '') {
      batch.forEach(function (batches) {

        view_data.push({
          batchId: batches._id,
          batchName: batches.batchName,
          year: batches.year,
          batchStatus: batches.batchStatus
        });
      })
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        status: 400,
        message: 'Bad Request!!!..'
      });
    }
  });

});

router.get('/getcourses', function (req, res) {

  collegeCourseModel.find({

  }).then(function (courses) {
    if (courses) {
      res.json({
        status: 200,
        data: courses
      });
    }
  })
});

router.post('/addNotice', function (req, res) {
  addNotice(req.body)
  var url = 'pages/notice'
  if (req.body._id != null) {
    noticeModel.findByIdAndUpdate(req.body._id, {
      noticeName: req.body.noticeName,
      batchId: req.body.batchId,
      category: req.body.category,
      courseId: req.body.courseId,
      textNotice: req.body.textNotice,
      type: req.body.type,
    },
      function (err, notices) {
        if (err) {
          res.json({
            status: 400
          })
        }
        if (notices) {
          res.json({
            status: 200,
            data: notices
          })
        }
      });
  } else {
    var noticeData = new noticeModel({
      noticeName: req.body.noticeName,
      batchId: req.body.batchId,
      category: req.body.category,
      courseId: req.body.courseId,
      textNotice: req.body.textNotice,
      type: req.body.type,
    });
    var query_params = "noticeId:" + noticeData._id + ",noticeName:" + req.body.noticeName + ",type:" + req.body.type + ",notice:" + req.body.textNotice;
    noticeData.save(function (err, result) {
      if (err) {
        console.error(err);
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: result
        });
      }
      if (req.body.category != 'All') {
        studentBatchModel.find({
          batchId: req.body.batchId
        }).then(function (student) {
          student.forEach(function (studentData) {
            var action = "Admin Added Notice";
            var notification_data = "Added new notice : " + req.body.noticeName;
            notification_function.notification(action, notification_data, studentData.studentId, url, query_params);
            userModel.find({
              _id: studentData.studentId
            }).then(function (students) {
              students.forEach(function (allStudent) {
                // emailService.sendNoticeMsgAndMail(allStudent.email, allStudent.mobile);
              });
            });
          });
        });
      } else if (req.body.category == 'All') {
        studentBatchModel.find({
          batchId: req.body.batchId
        }).then(function (student) {
          student.forEach(function (studentData) {
            var action = "Admin Added Notice";
            var notification_data = "Added new notice : " + req.body.noticeName;
            notification_function.notification(action, notification_data, studentData.studentId, url, query_params);
            userModel.find({
              _id: studentData.studentId
            }).then(function (students) {
              students.forEach(function (allStudent) {
                emailService.sendNoticeMsgAndMail(allStudent.email, allStudent.mobile);
              })

            })
          })
        });
      }
    })
  }


});
async function addNotice(body) {
console.log("body",body)
  var url = 'pages/notice'
  if (body._id != null) {
    noticeModel.find({
      _id: body._id
    }).then(async notices => {
      var batchId = await getId.getBatchId(notices.batchId, '')
      var courseId = await getId.getCourseId(notices.courseId, '')
      models.notices.find({
        where: {
          batchId: batchId.id,
          courseId: courseId.id,
          noticeName: notices.noticeName
        }
      }).then(async notice => {
        if(notice){
          var Batch = await getId.getBatchId(notices.batchId, '')
          var Course = await getId.getCourseId(notices.courseId, '')
          notice.update({
            noticeName: body.noticeName,
            batchId: Batch.id,
            category: body.category,
            courseId: Course.id,
            textNotice: body.textNotice,
            type: body.type,
          })
        }
        
      })
    })
  } else {
    if(body.category == "All"){
      if(body.courseId == "All" && body.batchId == ""){
        models.notices.create({
          noticeName: body.noticeName,
          batchId:  null ,
          category: body.category,
          courseId: null,
          textNotice: body.textNotice,
          type: body.type,
        }).then(notice => {
            // models.studentbatches.find({
            //   where:{
            //     batchId: batch.id,
            //   }
            // }).then(students => {
            //   students.forEach(elm => {
            //     var action = "Admin Added Notice";
            //     var notification_data = "Added new notice : " + body.noticeName;
            //     notification_function.notification(action, notification_data, elm.studentId, url, query_params);
            //     models.users.find({
            //       where: {
            //         id: elm.studentId
            //       }
            //     }).then(student => {
            //       student.forEach(function (allStudent) {
            //         // emailService.sendNoticeMsgAndMail(allStudent.email, allStudent.mobile);
            //       });
            //     })
            //   })
            // })
          })
      }
      if(body.courseId !=  'All' && body.batchId == ''){
      var course = await getId.getCourseId(body.courseId, '')
        models.notices.create({
          noticeName: body.noticeName,
          batchId:  null ,
          category: body.category,
          courseId: course.id,
          textNotice: body.textNotice,
          type: body.type,
        }).then(notice => {
            // models.studentbatches.find({
            //   where:{
            //     batchId: batch.id,
            //   }
            // }).then(students => {
            //   students.forEach(elm => {
            //     var action = "Admin Added Notice";
            //     var notification_data = "Added new notice : " + body.noticeName;
            //     notification_function.notification(action, notification_data, elm.studentId, url, query_params);
            //     models.users.find({
            //       where: {
            //         id: elm.studentId
            //       }
            //     }).then(student => {
            //       student.forEach(function (allStudent) {
            //         // emailService.sendNoticeMsgAndMail(allStudent.email, allStudent.mobile);
            //       });
            //     })
            //   })
            // })
          })
      }
     
      
     
    }else{
      var batch = await getId.getBatchId(body.batchId, '')
      var course = await getId.getCourseId(body.courseId, '')
      models.notices.create({
        noticeName: body.noticeName,
        batchId: batch.id,
        category: body.category,
        courseId: course.id,
        textNotice: body.textNotice,
        type: body.type,
      }).then(notice => {
        var query_params = "noticeId:" + notice.id + ",noticeName:" + body.noticeName + ",type:" + body.type + ",notice:" + body.textNotice;
        if (body.category != 'All') {
          // models.studentbatches.find({
            // where:{
          //   batchId: batch.id,
            // }
          // }).then(students => {
          //   students.forEach(elm => {
          //     var action = "Admin Added Notice";
          //     var notification_data = "Added new notice : " + body.noticeName;
          //     notification_function.notification(action, notification_data, elm.studentId, url, query_params);
          //     models.users.find({
          //       where: {
          //         id: elm.studentId
          //       }
          //     }).then(student => {
          //       student.forEach(function (allStudent) {
          //         // emailService.sendNoticeMsgAndMail(allStudent.email, allStudent.mobile);
          //       });
          //     })
          //   })
          // })
        } 
      })
    }
  
  }
}

router.post("/addNotification", function (req, res) {
  addNotification(req.body)
  //Taking data from post request
  const title = req.body.title;
  const message = req.body.message;
  const reciever = req.body.reciever;
  const batch = req.body.batch;
  const course = req.body.course;

  if (reciever == "All") {
    userModel.find({
      role: "student"
    }).then((userDetails) => {
      if (userDetails) {
        userDetails.forEach((user) => {
          sendNotification(title, message, user._id.toHexString());

          notification_function.notification(
            title,
            message,
            user._id.toHexString()
          );
        });
        res.json({
          status: 200,
          data: "Notification Sent Successfully!!",
        });
      } else {
        res.json({
          status: 400,
          data: "Notification Failed!!",
        });
      }
    });
  } else if (reciever == "Batch") {
    studentBatchModel
      .find({
        batchId: batch,
        courseId: course
      }, {
        studentId: 1
      })
      .then((studentDetails) => {
        if (studentDetails) {
          studentDetails.forEach((student) => {
            sendNotification(title, message, student.studentId);

            notification_function.notification(
              title,
              message,
              student.studentId
            );
          });
          res.json({
            status: 200,
            data: "Notification Sent Successfully!!",
          });
        } else {
          res.json({
            status: 400,
            data: "Notification Failed!!",
          });
        }
      });
  }
});
async function addNotification(body) {
  var batch = await getId.getBatchId(body.batch, '')
  var course = await getId.getCourseId(body.course, '')
  var title = body.title;
  var message = body.message;
  var reciever = body.reciever;
  var batch = batch.id;
  var course = course.id

  if (reciever == "All") {
    models.users.find({
      where: {
        role: "student"
      }
    }).then(userDetails => {
      if (userDetails) {
        userDetails.forEach((user) => {
          sendNotification(title, message, user.id);

          notification_function.notification(
            title,
            message,
            user.id
          );
        });
        // res.json({
        //   status: 200,
        //   data: "Notification Sent Successfully!!",
        // });
      } else {
        // res.json({
        //   status: 400,
        //   data: "Notification Failed!!",
        // });
      }
    })
  } else if (reciever == "Batch") {
    models.studentbatches.find({
      where: {
        batchId: batch,
        courseId: course
      }
    }).then(studentDetails => {
      if (studentDetails) {
        studentDetails.forEach((student) => {
          sendNotification(title, message, student.studentId);
          notification_function.notification(
            title,
            message,
            student.studentId
          );
        });
        // res.json({
        //   status: 200,
        //   data: "Notification Sent Successfully!!",
        // });
      } else {
        // res.json({
        //   status: 400,
        //   data: "Notification Failed!!",
        // });
      }
    })
  }
}

router.post("/addIndividualNotification", async function (req, res) {
  addIndividualNotification(req)
  const studentId = req.body.studentId;
  const title = req.body.title;
  const message = req.body.message;

  sendNotification(title, message, studentId);

  notification_function.notification(
    title,
    message,
    studentId
  );
  res.json({
    status: 200,
    data: "Notification Sent Successfully!!",
  });
});
async function addIndividualNotification(req) {
  var user = await getId.getUserId(req.body.studentId, '')
  const studentId = user.id;
  const title = req.body.title;
  const message = req.body.message;

  sendNotification(title, message, studentId);

  notification_function.notification(
    title,
    message,
    studentId
  );
  // res.json({
  //   status: 200,
  //   data: "Notification Sent Successfully!!",
  // });
}

router.get('/getNoticeData', function (req, res) {
  var view_data = [];
  noticeModel.find({
    category: 'All'
  }).exec(function (err, notice) {
    if (err) {
      console.error(err)
    } else {
      if (notice != '') {
        notice.forEach(function (noticeData) {
          view_data.push({
            noticeId: noticeData._id,
            noticeName: noticeData.noticeName,
            batchName: 'All',
            courseName: 'All',
            type: noticeData.type,
            textNotice: noticeData.textNotice,
            noticeDate: moment(new Date(noticeData.createdOn)).format('YYYY-MM-DD')
          })
        })
      }
      noticeModel.find({}).then(function (noticebatch) {
        if (noticebatch != '') {
          noticeModel.find({
            category: ''
          }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).exec(function (err, allnotice) {
            if (err) {
              console.log(err)
            } else if (allnotice != '') {
              allnotice.forEach(function (noticebatchData) {
                view_data.push({
                  noticeId: noticebatchData._id,
                  noticeName: noticebatchData.noticeName,
                  batchName: noticebatchData.batchId.batchName,
                  yearName: noticebatchData.batchId.year,
                  batchId: noticebatchData.batchId._id,
                  courseId: noticebatchData.courseId._id,
                  courseName: noticebatchData.courseId.courseName,
                  type: noticebatchData.type,
                  textNotice: noticebatchData.textNotice,
                  noticeDate: moment(new Date(noticebatchData.createdOn)).format('YYYY-MM-DD')
                })
              })
            }
          })
        }


      });
    }
    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      });
    }, 1500)
  });
});

router.get('/getNoticefile', function (req, res) {
  var view_data = [];
  noticeUploadModel.find({
    noticeId: req.query.noticeId
  }).then(function (notice) {
    if (notice != '') {
      notice.forEach(function (notices) {
        view_data.push({
          noticeUploadId: notices._id,
          noticeId: notices.noticeId,
          doc_id: notices.doc_id,
          type: notices.type,
          file_name: notices.name

        });
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else if (notice == '') {
      res.json({
        status: 400,
        message: 'No file uploaded!!!..'
      });
    }
  })

});

router.delete('/deleteNotice', function (req, res) {
  var query = {
    _id: req.query.noticeId
  }
  var query1 = {
    noticeId: req.query.noticeId
  }
  noticeModel.find({
    _id: req.query.noticeId
  }).exec(function (err, deleteNotice) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteNotice != '' || deleteNotice != null || deleteNotice != 'undefined' || deleteNotice != undefined) {
      noticeModel.findOneAndRemove(query).exec(function (err, notice) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          noticeUploadModel.find({
            noticeId: req.query.noticeId
          }).exec(function (err, noticeUpload) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              noticeUploadModel.findOneAndRemove(query1).exec(function (err, noticeUploadDelete) {
                if (err) {
                  return res.status(500).json({
                    message: 'Internal Server Error!!!....'
                  });
                } else {
                  res.json({
                    status: 200,
                    message: 'notice Deleted Successfully!!!....'
                  });
                }

              })
            }
          })
        }

      });

    }
  });
});

router.delete('/deleteNoticeFile', function (req, res) {
  var query = {
    _id: req.query.noticeUploadId
  }
  noticeUploadModel.find({
    _id: req.query.noticeUploadId
  }).exec(function (err, uploadNotice) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (uploadNotice != '' || uploadNotice != null || uploadNotice != 'undefined' || uploadNotice != undefined) {
      noticeUploadModel.findOneAndRemove(query).exec(function (err, batch) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: batch,
            message: 'File Deleted Successfully!!!....'
          });
        }

      });

    }
  })
});

router.get('/getParticularNotice', function (req, res) {
  var view_data = [];
  count = 0;
  if (req.query.noticeId != 'null') {
    noticeModel.find({
      _id: req.query.noticeId
    }).then(function (notice) {

      if (notice != '') {

        count = 0;
        promise1 = new Promise((resolve, reject) => {
          noticeUploadModel.find({
            noticeId: req.query.noticeId
          }).then(function (noticeFile) {
            noticeFile.forEach(function (allNoticeFile) {
              view_data.push({
                noticeUploadId: allNoticeFile._id,
                file_name: allNoticeFile.name,
                doc_id: allNoticeFile.doc_id,
                type: allNoticeFile.type,
                noticeId: allNoticeFile.noticeId
              });
              count++;
            });

            if (noticeFile.length == count) {
              resolve(view_data);
            }
          });

        })
        Promise.all([promise1]).then(result => {
          if (result) {
            setTimeout(function () {
              res.json({
                status: 200,
                data: view_data
              });
            }, 1500)
          }

        })
      } else {
        res.json({
          message: 'bad request!!!..'
        });
      }
    });


  } else {
    res.json({
      status: 400,
      message: 'Bad Request!!!...'
    })
  }
});

router.get('/getAllNoticeParticularStudentWise', function (req, res) {
  var view_data = [];
  noticeModel.find({
    batchId: req.query.batchId,
    courseId: req.query.courseId
  }).then(function (notice) {
    if (notice != '') {
      notice.forEach(function (notices) {
        view_data.push({
          _id: notices._id,
          noticeName: notices.noticeName,
          courseId: notices.courseId,
          batchId: notices.batchId,
          textNotice: notices.textNotice,
          createdOn: moment(new Date(notices.createdOn)).format('YYYY-MM-DD')
        })
      })
    }

    noticeModel.find({
      category: 'All'
    }).exec(function (err, notice) {
      if (err) {
        console.error(err)
      } else {
        notice.forEach(function (noticeData) {
          view_data.push({
            _id: noticeData._id,
            noticeName: noticeData.noticeName,
            batchName: 'All',
            courseName: 'All',
            textNotice: noticeData.textNotice,
            createdOn: moment(new Date(noticeData.createdOn)).format('YYYY-MM-DD')
          })
        })
      }
    });
    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      });
    }, 1500)
  })



});


router.get('/getOnlineLectureSubjectLink', function (req, res) {
  var view_data = [];
  onlineSubjectLinkModel.find({
    courseId: req.query.courseId,
    subject: req.query.subject,
    semesterId: req.query.semesterId
  }).then(function (link) {
    if (link != '') {
      link.forEach(function (links) {
        view_data.push({
          _id: links._id,
          onlineLinkName: links.onlineLinkName,
          subject: links.subject
        });
      });
      res.json({
        status: 200,
        data: view_data
      });
    } else {
      res.json({
        status: 400,
        message: 'bad request!!..'
      });
    }
  })
});


router.post('/saveOnlineLectureLink', function (req, res) {
  saveOnlineLectureLink(req.body)
  var onlineLectureLinks = new onlineLectureLinkModel({
    chapterId: req.body.chapterId,
    type_of_upload: req.body.type,
    onlineLectureLink: req.body.onlineLectureLink,
    onlineLectureDate: req.body.onlineLectureDate
  });
  onlineLectureLinks.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      chapterModel.find({
        _id: req.body.chapterId,
      }).then(function (chapter) {
        if (chapter.length > 0) {
          var current_year = moment(new Date()).format('YYYY');
          var previous_year = parseInt(current_year) - 1;
          var batch_year_search = previous_year + " - " + current_year; 
          var year_search;
          semesterNewModel.find({
            _id: chapter[0].semesterId
          }).then(function (semester) {
            if (semester[0].semesterName == 'Semester 1' || semester[0].semesterName == 'Semester 2') {
              year_search = 'FY';
            } else if (semester[0].semesterName == 'Semester 3' || semester[0].semesterName == 'Semester 4') {
              year_search = 'SY'
            } else {
              year_search = 'TY'
            }
            batchMasterModel.find({
              courseId: chapter[0].courseId,
              batchName: year_search,
              year: batch_year_search
            }).then(function (batch) {
              userModel.find({
                _id: req.body.user_id
              }).then(function (userdetails) {
                if (userdetails) {
                  var activity_action = "Added Online lecture link.";
                  var activity_data = userdetails[0].fullName + " Added online lecture link for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                  notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                }
              })
              studentBatchModel.find({
                courseId: chapter[0].courseId,
                batchId: batch[0]._id
              }).then(function (studentData) {
                var action = "Admin Added Online lecture link.";
                var notification_data = " Added online lecture link for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                studentData.forEach(function (student) {
                  notification_function.notification(action, notification_data, student.studentId);
                });
              })
            })
          })
        }
      })
      res.json({
        status: 200,
        data: result
      })
    }
  });
});

async function saveOnlineLectureLink(body) {
  var chapter = await getId.getChapterId(body.chapterId, '')
  models.onlinelecturelinks.create({
    chapterId: chapter.id,
    typeOfUpload: body.type,
    onlineLectureLink: body.onlineLectureLink,
    onlineLectureDate: body.onlineLectureDate
  }).then(data => {
    models.chapters.getSubject(chapter.id).then(chapter => {
      if (chapter.length > 0) {
        models.batchsemester.findAll({
          where: {
            semesterId: chapter[0].semesterId
          }
        }).then(batchsem => {
          models.studentbatches.findAll({
            where: {
              batchId: batchsem.batchId,
              courseId: batchsem.courseId
            }
          }).then(async studentData => {

            var action = "Admin Added " + body.type;
            var notification_data = " Added " + body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
            studentData.forEach(function (student) {
              notification_function.notification(action, notification_data, student.studentId);
            });
            var user = await getId.getUserId(body.user_id, '')
            models.users.findAll({
              where: {
                id: user.id
              }
            }).then(userdetails => {
              if (userdetails) {
                var activity_action = " Added " + body.type;
                var activity_data = userdetails[0].fullName + " Added " + body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                notification_function.activity(activity_action, activity_data, chapter[0].courseId, batchsem.batchId);
              }
            })


          })
        })
      }
    })
  })
}


router.post('/saveVideoLectureLink', function (req, res) {
  saveVideoLectureLink(req)
  var videoLinkArr = [];
  var videoLecture = req.body.videoLink
  chapterModel.find({
    _id: req.body.chapterId,
  }).then(chapter => {
    chapter.forEach((element) => {
      if (element != [] || element != null || element != undefined) {

        videoLinkArr = element.videoLink
        if (videoLinkArr.indexOf(videoLecture) === -1) {

          videoLinkArr.push(videoLecture)

          setTimeout(() => {
            var query = {
              _id: req.body.chapterId,
            }

            update = {
              $set: {
                videoLink: videoLinkArr
              }
            }

            chapterModel.findOneAndUpdate(query, update, function (req, videoLectureLink) {
              res.json({
                status: 200,
                data: videoLectureLink,
              })

            })

          }, 2000);

        } else {
          res.json({
            status: 201,
            message: 'video can not inserted',
          })
        }
      } else {
        res.json({
          status: 400
        })
      }
    })

  })
});

async function saveVideoLectureLink(req) {
  var videoLinkArr = [];
  var videoLecture = req.body.videoLink
  var chapter = await getId.getChapterId(req.body.chapterId, '')
  models.chapters.find({
    where: {
      id: chapter.id
    }
  }).then(chapters => {
    chapters.forEach(elm => {
      if (elm != [] || elm != null || elm != undefined) {
        videoLinkArr = element.videoLink
        if (videoLinkArr.indexOf(videoLecture) === -1) {
          videoLinkArr.push(videoLecture)
          models.chapters.find({
            where: {
              id: chapter.id
            }
          }).then(chap => {
            if(chap){
              chap.update({
                videoLink: videoLinkArr
              }).then(update => {
                console.log("update")
              })
            }
            
          })
        }
      }
    })
  })
}

router.get('/getSubjectChapterContentData', function (req, res) {
  if (req.query.type == 'prerequisite') {
    youTubeLinkModel.find({
      chapterId: req.query.chapterId,
      type_of_upload: req.query.type
    }).sort({
      "createdOn": -1
    }).then(function (youtube) {
      if (youtube != '') {
        res.json({
          status: 200,
          data: youtube
        })
      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    });
  } else if (req.query.type == 'ppt/notes' || req.query.type == 'practise question' || req.query.type == 'dataSet') {
    uploads.find({
      lessonId: req.query.chapterId,
      type_of_upload: req.query.type
    }).sort({
      "createdOn": -1
    }).then(function (upload) {
      if (upload != '') {
        res.json({
          status: 200,
          data: upload
        })
      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    });
  } else if (req.query.type == 'onlineLecture') {
    onlineLectureLinkModel.find({
      chapterId: req.query.chapterId,
      type_of_upload: req.query.type
    }).sort({
      "createdOn": -1
    }).then(function (online) {
      if (online != '') {
        res.json({
          status: 200,
          data: online
        })
      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    });
  } else if (req.query.type == 'vimeoLink') {
    vimeoLinkModel.find({
      chapterId: req.query.chapterId,
      type_of_upload: req.query.type
    }).sort({
      "createdOn": -1
    }).then(function (vimeo) {
      if (vimeo != '') {
        res.json({
          status: 200,
          data: vimeo
        })
      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    });
  }


});

router.get('/getOnlyRunningBatchDataForAnalytics', function (req, res) {
  var view_data = [];
  batchMasterModel.find({
    batchStatus: 'true'
  }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).exec(function (err, batch) {
    if (err) {
      console.error(err)
    } else {
      if (batch != '') {
        batch.forEach(function (batches) {
          view_data.push({
            batchId: batches._id,
            batchName: batches.batchName,
            year: batches.year,
            batchStatus: batches.batchStatus,
            courseName: batches.courseId.courseName,
            courseId: batches.courseId._id,
            departmentName: batches.departmentId.departmentName,
            departmentId: batches.departmentId._id
          });
        })
        res.json({
          status: 200,
          data: view_data
        });
      } else {
        res.json({
          status: 400,
          message: 'Bad Request!!!..'
        });
      }

    }
  });

});

router.get('/getSubjectWiseChapter', function (req, res) {
  chapterModel.find({
    courseId: req.query.courseId,
    subject: req.query.subject,
    semesterId: req.query.semesterId
  }).then(function (chapter) {
    if (chapter != '') {
      res.json({
        status: 200,
        data: chapter,
      })
    } else {
      res.json({
        status: 400,
        message: 'Bad request!!!..'
      });
    }

  })
});

router.get('/getChapterDataCount', function (req, res) {
  var view_data = [];
  chapterModel.find({
    courseId: req.query.courseId,
    subject: req.query.subject,
    semesterId: req.query.semesterId

  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).sort({
    "createdOn": -1
  }).then(function (chapters) {
    if (chapters != '') {
      chapters.forEach(function (chapter) {
        if (req.query.title == 'Prerequisite') {
          youTubeLinkModel.find({
            chapterId: chapter._id,
            type_of_upload: 'prerequisite'
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
        if (req.query.title == 'ppt/notes') {
          uploads.find({
            lessonId: chapter._id,
            type_of_upload: 'ppt/notes'
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
        if (req.query.title == 'practise question') {
          uploads.find({
            lessonId: chapter._id,
            type_of_upload: 'practise question'
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
        if (req.query.title == 'dataSet') {
          uploads.find({
            lessonId: chapter._id,
            type_of_upload: 'dataSet'
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
        if (req.query.title == 'onlineLecture') {
          onlineLectureLinkModel.find({
            chapterId: chapter._id,
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
        if (req.query.title == 'quiz') {
          mcqModel.find({
            chapterId: chapter._id,
          }).then(function (chapterCount) {
            view_data.push({
              chapterName: chapter.chapterName,
              chapterId: chapter._id,
              status: chapter.status,
              courseName: chapter.courseId.courseName,
              semesterName: chapter.semesterId.semesterName,
              semesterId: chapter.semesterId._id,
              subject: chapter.subject,
              count: chapterCount.length
            })

          })
        }
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 4500)
    } else {
      res.json({
        status: 200,
        message: 'No Result Found!!!...'
      })

    }

  });

})

router.post('/allowAccessDataUploadToTeacher', function (req, res) {
  allowAccessDataUploadToTeacher(req.body)
  allowAccessToTeacherModel.find({
    teacher_id: req.body.teacher_id
  }).then(function (teacher) {
    if (teacher != '') {
      var query = {
        teacher_id: req.body.teacher_id
      },
        update = {
          $set: {
            ppt_notes: req.body.event
          }
        };
      update1 = {
        $set: {
          practise_question: req.body.event
        }
      };
      update2 = {
        $set: {
          prerequisite: req.body.event
        }
      };
      update3 = {
        $set: {
          onlineLecture: req.body.event
        }
      };
      update4 = {
        $set: {
          quiz: req.body.event
        }
      };
      update5 = {
        $set: {
          syllabus_objectives: req.body.event
        }
      };
      update6 = {
        $set: {
          vimeoLink: req.body.event
        }
      };


      if (req.body.type == 'ppt/notes') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update, function (err, ppt_notes) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: ppt_notes
            })
          }
        });
      } else if (req.body.type == 'practise_question') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update1, function (err, practise_question) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: practise_question
            })
          }
        });
      } else if (req.body.type == 'prerequisite') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update2, function (err, prerequisite) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: prerequisite
            })
          }
        });
      } else if (req.body.type == 'onlineLecture') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update3, function (err, onlineLecture) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: onlineLecture
            })
          }
        });
      } else if (req.body.type == 'quiz') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update4, function (err, quiz) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: quiz
            })
          }
        });
      } else if (req.body.type == 'syllabus_objectives') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update5, function (err, syllabus) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: syllabus
            })
          }
        });
      } else if (req.body.type == 'vimeoLink') {
        allowAccessToTeacherModel.findOneAndUpdate(query, update6, function (err, vimeoLink) {
          if (err) {
            return res.status(400).json({
              message: 'Bad Request'
            });
          } else {
            res.json({
              status: 200,
              data: vimeoLink
            })
          }
        });
      }


    } else {
      if (req.body.type == 'ppt/notes') {
        var ppt_notes = req.body.event
      } else if (req.body.type == 'practise_question') {
        var practise_question = req.body.event
      } else if (req.body.type == 'prerequisite') {
        var prerequisite = req.body.event
      } else if (req.body.type == 'onlineLecture') {
        var onlineLecture = req.body.event
      } else if (req.body.type == 'quiz') {
        var quiz = req.body.event
      } else if (req.body.type == 'syllabus_objectives') {
        var syllabus_objectives = req.body.event
      } else if (req.body.type == 'vimeoLink') {
        var vimeoLink = req.body.event
      }
      var allowAccessToTeacher = new allowAccessToTeacherModel({
        teacher_id: req.body.teacher_id,
        ppt_notes: ppt_notes ? ppt_notes : 'false',
        practise_question: practise_question ? practise_question : 'false',
        prerequisite: prerequisite ? prerequisite : 'false',
        onlineLecture: onlineLecture ? onlineLecture : 'false',
        quiz: quiz ? quiz : 'false',
        syllabus_objectives: syllabus_objectives ? syllabus_objectives : 'true',
        vimeoLink: vimeoLink ? vimeoLink : 'false'

      });
      allowAccessToTeacher.save(function (err, result) {
        if (err) {
          console.error(err);
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: result
          })
        }
      });
    }
  })

})
async function allowAccessDataUploadToTeacher(body) {
  var user = await getId.getUserId(body.teacher_id, '')
  models.allowaccesstoteachers.find({
    where: {
      teacherId: user.id
    }
  }).then(teacher => {
    if (teacher != null) {
      if (body.type == 'ppt/notes') {
        teacher.update({
          pptNotes: body.event
        })
      } else if (body.type == 'practise_question') {
        teacher.update({
          practiseQuestion: body.event
        })
      } else if (body.type == 'prerequisite') {
        teacher.update({
          prerequisite: body.event
        })
      } else if (body.type == 'onlineLecture') {
        teacher.update({
          onlineLecture: body.event
        })
      } else if (body.type == 'quiz') {
        teacher.update({
          quiz: body.event
        })
      } else if (body.type == 'syllabus_objectives') {
        teacher.update({
          syllabusObjectives: body.event
        })
      } else if (body.type == 'vimeoLink') {
        teacher.update({
          vimeoLink: body.event
        })
      }
    } else {
      if (body.type == 'ppt/notes') {
        var ppt_notes = body.event
      } else if (body.type == 'practise_question') {
        var practise_question = body.event
      } else if (body.type == 'prerequisite') {
        var prerequisite = body.event
      } else if (body.type == 'onlineLecture') {
        var onlineLecture = body.event
      } else if (body.type == 'quiz') {
        var quiz = body.event
      } else if (body.type == 'syllabus_objectives') {
        var syllabus_objectives = body.event
      } else if (body.type == 'vimeoLink') {
        var vimeoLink = body.event
      }
      models.allowaccesstoteachers.create({
        teacherId: user.id,
        pptNotes: ppt_notes ? ppt_notes : 'false',
        practiseQuestion: practise_question ? practise_question : 'false',
        prerequisite: prerequisite ? prerequisite : 'false',
        onlineLecture: onlineLecture ? onlineLecture : 'false',
        quiz: quiz ? quiz : 'false',
        syllabusObjectives: syllabus_objectives ? syllabus_objectives : 'true',
        vimeoLink: vimeoLink ? vimeoLink : 'false'
      }).then(allow => {
        console.log("allow")
      })
    }
  })
}

router.get('/getTeacherWithAccessControl', function (req, res) {
  var view_data = [];
  userModel.find({
    role: "teacher"
  }).then(function (teacher) {
    if (teacher != '') {
      teacher.forEach(function (teacherData) {
        allowAccessToTeacherModel.find({
          teacher_id: teacherData._id
        }).then(function (access) {
          if (access != '') {
            view_data.push({
              teacher_id: teacherData._id,
              teacherName: teacherData.fullName,
              accessId: access[0]._id ? access[0]._id : '',
              ppt_notes: access[0].ppt_notes ? access[0].ppt_notes : 'false',
              practise_question: access[0].practise_question ? access[0].practise_question : 'false',
              prerequisite: access[0].prerequisite ? access[0].prerequisite : 'false',
              onlineLecture: access[0].onlineLecture ? access[0].onlineLecture : 'false',
              quiz: access[0].quiz ? access[0].quiz : 'false',
              syllabus_objectives: access[0].syllabus_objectives ? access[0].syllabus_objectives : 'true',
              vimeoLink: access[0].vimeoLink ? access[0].vimeoLink : 'false',


            })
          } else {
            view_data.push({
              teacher_id: teacherData._id,
              teacherName: teacherData.fullName,
              ppt_notes: 'false',
              practise_question: 'false',
              prerequisite: 'false',
              onlineLecture: 'false',
              quiz: 'false',
              syllabus_objectives: 'true',
              vimeoLink: 'false'


            })
          }
        })
      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        });
      }, 3000)
    } else {
      res.json({
        status: 500
      });
    }
  })
})

router.get('/getAccessOfContentOfChapter', function (req, res) {
  var view_data = [];
  allowAccessToTeacherModel.find({
    teacher_id: req.query.teacher_id
  }).then(function (teacher) {
    if (teacher != '') {
      res.json({
        status: 200,
        data: teacher
      });
    } else if (teacher == '') {
      view_data.push({
        ppt_notes: 'false',
        practise_question: 'false',
        prerequisite: 'false',
        onlineLecture: 'false',
        quiz: 'false',
        syllabus_objectives: 'true',
        vimeoLink: 'false'


      })
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 400,
        message: 'bad request!!..'
      })
    }
  })
});

router.get('/getSemesterWiseSubject', function (req, res) {
  var view_data = [];
  var course_subjects = [];
  if (req.query.semesterName == 'Semester 1') {
    var query = {
      semesterName: req.query.semesterName
    }
  } else if (req.query.semesterName != 'Semester 1') {
    var query = {
      _id: req.query.semesterName
    }
  }
  collegeCourseModel.find({
    courseName: req.query.courseName
  }).then(function (course) {
    semesterNewModel.find(query).then(function (sem) {
      subjectModel.find({
        courseId: course[0]._id,
        semesterId: sem[0]._id
      }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, subject) {
        if (err) {
          console.error(err)
        } else {
          if (subject != '') {
            subject.forEach(function (subjects) {
              var sub1 = subjects.subject;
              var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
              var sub = sub2.replace(/^"(.*)"$/, '$1');
              var strs = sub.split('","');
              strs.forEach(function (courseSubject) {
                course_subjects.push({
                  subject: courseSubject,
                  courseId: subjects.courseId._id,
                  courseName: subjects.courseId.courseName,
                  semesterId: subjects.semesterId._id,
                  semesterName: subjects.semesterId.semesterName,
                });
              });
            });
            res.json({
              status: 200,
              data: course_subjects,
            })
          } else {
            res.json({
              status: 400,
              message: 'bad request'
            })
          }
        }

      })
    })
  });
});

router.get('/getSyllabusdata', function (req, res) {
  var view_data = [];
  syllabusFilesModel.find({
    courseId: req.query.courseId,
    semesterId: req.query.semesterId,
    subject: req.query.subject
  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, syllabusData) {
    if (err) {
      console.error(err)
    } else {
      if (syllabusData != '') {
        syllabusData.forEach(function (syllabus) {
          view_data.push({
            syllabusId: syllabus._id,
            courseId: syllabus.courseId._id,
            courseName: syllabus.courseId.courseName,
            semesterId: syllabus.semesterId._id,
            semesterName: syllabus.semesterId.semesterName,
            description: syllabus.description ? syllabus.description : 'No Syllabus Content',
            doc_id: syllabus.doc_id,
            name: syllabus.name,
            type: syllabus.type,
            file_link: `${filelink}/api/viewCourse/download?document_id=${syllabus.doc_id}`,
            length: syllabus.length
          })
        })

        res.json({
          status: 200,
          data: view_data
        })

      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    }

  });

});

router.delete('/deleteSyllabus', function (req, res) {
  var query = {
    _id: req.query.id
  }
  syllabusFilesModel.find({
    _id: req.query.id
  }).exec(function (err, syllabus) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (syllabus != '' || syllabus != null || syllabus != 'undefined' || syllabus != undefined) {
      userModel.find({
        _id: req.query.user_id
      }).then(function (userdetails) {
        if (userdetails) {
          var activity_action = " Deleted Syllabus.";
          var activity_data = userdetails[0].fullName + " deleted Syllabus for Subject " + syllabus[0].subject;
          notification_function.activity(activity_action, activity_data, syllabus[0].courseId, '');
        }
      })
      syllabusFilesModel.findOneAndRemove(query).exec(function (err, syllabusData) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: syllabusData,
            message: ' Deleted Successfully!!!....'
          });
        }

      });

    }
  });


});

router.post('/addsyllabusData', function (req, res) {
  addsyllabusData(req)
  var syllabusData = new syllabusFilesModel({
    courseId: req.body.courseId,
    subject: req.body.subject,
    semesterId: req.body.semesterId,
    description: req.body.description,
  });
  syllabusData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      userModel.find({
        _id: req.body.user_id
      }).then(function (userdetails) {
        if (userdetails) {
          var activity_action = " Added Syllabus.";
          var activity_data = userdetails[0].fullName + " Added Syllabus for Subject " + req.body.subject;
          notification_function.activity(activity_action, activity_data, req.body.courseId, '');
        }
      })
      res.json({
        status: 200,
        data: result
      })
    }

  });

});

async function addsyllabusData(req) {
  var course = await getId.getCourseId(req.body.courseId, '')
  var semester = await getId.getSemesterId(req.body.semesterId, '');
  var subject = await getId.getSubjectId(req.body.subject, course.id, semester.id)
await  models.syllabusfiles.create({
    courseId: course.id,
    subject: subject.id,
    semesterId: semester.id,
    description: req.body.description,
  }).then(async syllabusfiles => {
    if (syllabusfiles) {
      var user = await getId.getUserId(req.body.user_id, '')
      models.users.find({
        where: {
          id: user.id
        }
      }).then(userdetails => {
        if (userdetails) {
          var activity_action = " Added Syllabus.";
          var activity_data = userdetails[0].fullName + " Added Syllabus for Subject " + req.body.subject;
          notification_function.activity(activity_action, activity_data, req.body.courseId, '');
        }
      })
    }
  })
}

router.post('/addChapterSyllabus', function (req, res) {
  addChapterSyllabus(req)
  var syllabusData = new chapterSyllabusFilesModel({
    userId: req.body.user_id,
    unitName: req.body.unitName,
    chapterName: req.body.chapterName,
    courseId: req.body.courseId,
    subject: req.body.subject,
    semesterId: req.body.semesterId,
    description: req.body.description,
  });
  syllabusData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });

});
async function addChapterSyllabus(req) {
  var course = await getId.getCourseId(req.body.courseId, '')
  var semester = await getId.getSemesterId(req.body.semesterId, '');
  var subject = await getId.getSubjectId(req.body.subject, course.id, semester.id)
  var user = await getId.getUserId(req.body.user_id, '');
 await models.chaptersyllabusfiles.create({
    userId: user.id,
    unitName: req.body.unitName,
    chapterName: req.body.chapterName,
    courseId: course.id,
    subjectId: subject.id,
    semesterId: semester.id,
    description: req.body.description
  }).then(chaptersyllabusfiles => {
    console.log("chaptersyllabusfiles")
  })
}

router.get('/getChapterSyllabus', function (req, res) {
  var view_data = [];
  chapterSyllabusFilesModel.find({
    userId: req.query.user_id,
    courseId: req.query.courseId,
    semesterId: req.query.semesterId,
    subject: req.query.subject,
    unitName: req.query.chapterUnit,
    chapterName: req.query.chapterName,
  })
    .populate('courseId', ['courseName']).populate('semesterId', ['semesterName'])
    .exec(function (err, syllabusData) {
      if (err) {
        console.error(err)
      } else {
        if (syllabusData != '') {
          syllabusData.forEach(function (syllabus) {
            view_data.push({
              syllabusId: syllabus._id,
              courseId: syllabus.courseId._id,
              courseName: syllabus.courseId.courseName,
              semesterId: syllabus.semesterId._id,
              semesterName: syllabus.semesterId.semesterName,
              description: syllabus.description ? syllabus.description : 'No Syllabus',
              doc_id: syllabus.doc_id,
              name: syllabus.name,
              type: syllabus.type,
              file_link: `${filelink}/api/viewCourse/download?document_id=${syllabus.doc_id}`,
              length: syllabus.length



            })
          })
          res.json({
            status: 200,
            data: view_data
          })

        } else {
          res.json({
            status: 400,
            message: 'bad request!!..'
          })
        }
      }

    });

});

router.delete('/deleteChapterSyllabus', function (req, res) {
  var query = {
    _id: req.query.id
  }
  chapterSyllabusFilesModel.find({
    _id: req.query.id
  }).exec(function (err, syllabus) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (syllabus != '' || syllabus != null || syllabus != 'undefined' || syllabus != undefined) {
      userModel.find({
        _id: req.query.user_id
      }).then(function (userdetails) {
        if (userdetails) {
          var activity_action = " Deleted Syllabus.";
          var activity_data = userdetails[0].fullName + " deleted Syllabus for Subject " + syllabus[0].subject;
          notification_function.activity(activity_action, activity_data, syllabus[0].courseId, '');
        }
      })
      chapterSyllabusFilesModel.findOneAndRemove(query).exec(function (err, syllabusData) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: syllabusData,
            message: ' Deleted Successfully!!!....'
          });
        }

      });

    }
  });


});

router.post('/addDescription', function (req, res) {
  addDescription(req.body)
  var description = req.body.description
  description = description.split('p>')
  description = description[1].split('<')
  var query = {
    _id: req.body.chapterNo
  },
    update = {
      $set: {
        description: description[0]
      }
    };

  chapterModel.update(query, update, function (err, chapterInfo) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: chapterInfo
      })
    }
  })

})

async function addDescription(body) {
  var chapter = await getId.getChapterId(body.chapterNo, '')
  models.chapters.find({
    where: {
      id: chapter.id
    }
  }).then(chapter => {
    if(chapter){
      var description = body.description
      description = description.split('p>')
      description = description[1].split('<')
      chapter.update({
        description: description[0]
      }).then(updated => {
        console.log("updated", updated)
      })
    }
   
  })
}

router.put('/updateSyllabusData', function (req, res) {
  var query = {
    _id: req.body.syllabusId
  },
    update = {
      $set: {
        description: req.body.description,
      }
    };
  syllabusFilesModel.updateMany(query, update, function (err, syllabus) {
    if (err) {
      console.error("err" + err)
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: syllabus
      })
    }

  });
});

router.post('/addReferenceLink', function (req, res) {
  addReferenceLink(req)
  var referenceData = new subjectRefModel({
    subject: req.body.subject,
    courseId: req.body.courseId,
    semesterId: req.body.semesterId,
    description: req.body.description,
    link: req.body.link,
  });
  referenceData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      var current_year = moment(new Date()).format('YYYY');
      var previous_year = parseInt(current_year) - 1;
      var batch_year_search = previous_year + " - " + current_year;
      var year_search;
      semesterNewModel.find({
        _id: req.body.semesterId
      }).then(function (semester) {
        if (semester[0].semesterName == 'Semester 1' || semester[0].semesterName == 'Semester 2') {
          year_search = 'FY';
        } else if (semester[0].semesterName == 'Semester 3' || semester[0].semesterName == 'Semester 4') {
          year_search = 'SY'
        } else {
          year_search = 'TY'
        }
        batchMasterModel.find({
          courseId: req.body.courseId,
          batchName: year_search,
          year: batch_year_search
        }).then(function (batch) {
          studentBatchModel.find({
            courseId: req.body.courseId,
            batchId: batch[0]._id
          }).then(function (studentData) {
            var action = "Admin Added Subject References.";
            var notification_data = " Added new reference in Subject " + req.body.subject;
            studentBatchModel.find({
              courseId: req.body.courseId
            }).then(function (studentData) {
              studentData.forEach(function (student) {
                notification_function.notification(action, notification_data, student.studentId);
              });
            })
          })
        })
      })
      res.json({
        status: 200,
        data: result
      })
    }

  });
})

async function addReferenceLink(req) {
  var course = await getId.getCourseId(req.body.courseId, '')
  var semester = await getId.getSemesterId(req.body.semesterId, '');
  var subject = await getId.getSubjectId(req.body.subject, course.id, semester.id)

await  models.subjectreferences.create({
    subjectId: subject.id,
    courseId: course.id,
    semesterId: semester.id,
    description: req.body.description,
    link: req.body.link,
  }).then(subjectreferences => {
    if (subjectreferences) {
      var current_year = moment(new Date()).format('YYYY');
      var previous_year = parseInt(current_year) - 1;
      var batch_year_search = previous_year + " - " + current_year;
      var year_search;
      models.semesters.find({
        where: {
          id: semester.id
        }
      }).then(semester => {
        if (semester.semesterName == 'Semester 1' || semester.semesterName == 'Semester 2') {
          year_search = 'FY';
        } else if (semester.semesterName == 'Semester 3' || semester.semesterName == 'Semester 4') {
          year_search = 'SY'
        } else {
          year_search = 'TY'
        }
        // models.studentbatches.find({
        //  where:{
        //    courseId:course.id
        //  }
        // }).then(async studentDetails=>{
        //  studentDetails.forEach(async function (student) {
        //    var user = await getId.getUserId(student.studentId,'')
        //    var action = "Admin Added Subject References.";
        //    var notification_data = " Added new reference in Subject " + req.body.subject;
        //    notification_function.notification(action, notification_data, user.id);
        //  });
        // })
      })
    }
  })

}

router.get('/getReferenceData', function (req, res) {
  var view_data = [];
  subjectRefModel.find({
    subject: req.query.subject,
    courseId: req.query.courseId,
    semesterId: req.query.semesterId
  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).exec(function (err, refData) {
    if (err) {
      console.error(err)
    } else {
      if (refData != '') {
        refData.forEach(function (ref) {
          view_data.push({
            refId: ref._id,
            courseId: ref.courseId._id,
            courseName: ref.courseId.courseName,
            semesterId: ref.semesterId._id,
            semesterName: ref.semesterId.semesterName,
            description: ref.description ? ref.description : 'No Description!!!..',
            link: ref.link

          })
        })

        res.json({
          status: 200,
          data: view_data
        })

      } else {
        res.json({
          status: 400,
          message: 'bad request!!..'
        })
      }
    }

  });

});

router.delete('/deleteRefLink', function (req, res) {
  var query = {
    _id: req.query.refId
  }
  subjectRefModel.find({
    _id: req.query.refId
  }).exec(function (err, ref) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (ref != '' || ref != null || ref != 'undefined' || ref != undefined) {
      subjectRefModel.findOneAndRemove(query).exec(function (err, refData) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: refData,
            message: 'Link Deleted Successfully!!!....'
          });
        }

      });

    }
  });


});

router.post('/addOtherAdmin', function (req, res) {
  addOtherAdmin(req.body)
  var password = 'SDBI.0000';
  const {
    salt,
    passwordHash
  } = cipher.saltHashPassword(password);
  userModel.find({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  }).then(function (subadmin) {
    if (subadmin != '') {
      res.json({
        status: 200,
        message: 'User already exists!!!..'
      });
    } else {
      const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: 'active',
        login: req.body.email,
        email: req.body.email,
        fullName: req.body.firstName + ' ' + req.body.lastName,
        role: 'subadmin',
        salt,
        passwordHash,
        loginCount: 0,
        onboarding: 'no',

      }
      var user = this.userService.addUser(newUser)
      setTimeout(function () {
        userModel.find({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        }).then(function (users) {
          if (users != '') {
            res.json({
              status: 200,
              data: users
            })
          }
        })
      }, 100)
    }
  });
});
async function addOtherAdmin(body) {
  var password = 'SDBI.0000';
  const {
    salt,
    passwordHash
  } = cipher.saltHashPassword(password);
  models.users.find({
    where: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    }
  }).then(user => {
    if (user) {
      console.log('User Already exists !!!!!')
    } else {
      models.users.create({
        firstName: body.firstName,
        lastName: body.lastName,
        status: 'active',
        login: body.email,
        email: body.email,
        fullName: body.firstName + ' ' + body.lastName,
        role: 'subadmin',
        salt,
        passwordHash,
        loginCount: 0,
        onboarding: 'no',
      }).then(subadmin => {
        console.log("subadmin")
      })
    }
  })
}

router.get('/getOtherAdminData', function (req, res) {
  userModel.aggregate([{
    $addFields: {
      id: {
        $toString: "$_id",
      },
    },
  },
  {
    $match: {
      role: {
        $eq: 'subadmin',
      },
    },
  },
  {
    $lookup: {
      from: "allowaccesstosubadmins",
      localField: "id",
      foreignField: "user_id",
      as: "users",
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$users", 0],
        },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      users: 0,
    },
  },
  ]).then(function (userData) {
    if (userData != '') {
      res.json({
        status: 200,
        data: userData
      })
    } else {
      res.json({
        status: 400,
        message: 'bad request!!..'
      })
    }
  })
});


router.delete('/deleteOtherAdmin', function (req, res) {
  var query = {
    _id: req.query.otherAdminId
  }
  userModel.find({
    _id: req.query.otherAdminId
  }).exec(function (err, deleteAdmin) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteAdmin != '' || deleteAdmin != null || deleteAdmin != 'undefined' || deleteAdmin != undefined) {
      userModel.findOneAndRemove(query).exec(function (err, admin) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: admin,
            message: 'Deleted Successfully!!!....'
          });
        }

      });

    }
  });


});


router.post('/addLibrary', function (req, res) {
  addLibrary(req)
  var data = new LibraryModel({
    name: req.body.name,
    link: req.body.link,
    type: req.body.type,
    subType: req.body.subType,
    batchId: req.body.batchId,
    category: req.body.category,
    courseId: req.body.courseId,
    subjects: req.body.tags
  });

  data.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      });
    }
    //  if(req.body.category!='All'){
    //     studentBatchModel.find({
    //       batchId:req.body.batchId
    //     }).then(function(student){
    //       student.forEach(function(studentData){
    //         var action = "Admin Added Notice";
    //         var notification_data = "Added new notice : " + req.body.noticeName;
    //         //notification_function.notification(action, notification_data, studentData.studentId, '', '');
    //         userModel.find({_id:studentData.studentId}).then(function(students){
    //           students.forEach(function(allStudent){
    //             emailService.sendNoticeMsgAndMail(allStudent.email,allStudent.mobile);
    //           });
    //       });
    //       });
    //     });
    //   }else if(req.body.category=='All'){
    //     studentBatchModel.find({
    //     }).then(function(student){
    //       student.forEach(function(studentData){
    //         var action = "Admin Added Notice";
    //         var notification_data = "Added new notice : " + req.body.noticeName;
    //         //notification_function.notification(action, notification_data, studentData.studentId, '', '');
    //         userModel.find({_id:studentData.studentId}).then(function(students){
    //           students.forEach(function(allStudent){
    //             emailService.sendNoticeMsgAndMail(allStudent.email,allStudent.mobile);
    //           })

    //       })
    //       })
    //     });
    //   }
  })
});
async function addLibrary(req) {
  var batch = await getId.getBatchId(req.body.batchId, '')
  var course = await getId.getCourseId(req.body.courseId, '')
  models.libraries.create({
    name: req.body.name,
    link: req.body.link,
    type: req.body.type,
    subType: req.body.subType,
    batchId: batch.id,
    category: req.body.category,
    courseId: course.id,
    subjects: req.body.tags
  }).then(libraries => {
    console.log("libraries")
  })
}

router.get('/getLibraryData', function (req, res) {
  var view_data = [];
  var view_data1 = [];
  var view_data2 = [];
  var view_data3 = [];
  var view_data4 = [];
  LibraryModel.find({
    category: 'All'
  }).exec(function (err, library) {
    if (err) {
      console.error(err)
    } else {
      if (library != '') {
        library.forEach(function (l_batchData) {
          if (l_batchData.type == 'Industry Connect Session') {
            view_data1.push({
              Id: l_batchData._id,
              Name: l_batchData.name,
              batchName: 'All',
              courseId: l_batchData.courseId._id,
              courseName: l_batchData.courseId.courseName,
              type: l_batchData.type,
              subType: l_batchData.subType,
              link: l_batchData.link
            })

          } else if (l_batchData.type == 'Interview and Soft Skills') {
            view_data2.push({
              Id: l_batchData._id,
              Name: l_batchData.name,
              batchName: 'All',
              batchId: l_batchData.batchId._id,
              courseId: l_batchData.courseId._id,
              courseName: l_batchData.courseId.courseName,
              type: l_batchData.type,
              subType: l_batchData.subType,
              link: l_batchData.link
            })
          } else if (l_batchData.type == 'Datasets') {
            view_data3.push({
              Id: l_batchData._id,
              Name: l_batchData.name,
              batchName: "All",
              batchId: l_batchData.batchId._id,
              courseId: l_batchData.courseId._id,
              courseName: l_batchData.courseId.courseName,
              type: l_batchData.type,
              subType: l_batchData.subType,
              link: l_batchData.link
            })
          } else if (l_batchData.type == 'Additional') {
            view_data4.push({
              Id: l_batchData._id,
              Name: l_batchData.name,
              batchName: 'All',
              batchId: l_batchData.batchId._id,
              courseId: l_batchData.courseId._id,
              courseName: l_batchData.courseId.courseName,
              type: l_batchData.type,
              subType: l_batchData.subType,
              link: l_batchData.link
            })
          }

        })
      }
      LibraryModel.find({}).then(function (l_batch) {
        if (l_batch != '') {
          LibraryModel.find({
            category: ''
          }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).exec(function (err, allnotice) {
            if (err) {
              console.log(err)
            } else if (allnotice != '') {
              allnotice.forEach(function (l_batchData) {
                if (l_batchData.type == 'Industry Connect Session') {
                  view_data1.push({
                    Id: l_batchData._id,
                    Name: l_batchData.name,
                    batchName: l_batchData.batchId.batchName,
                    yearName: l_batchData.batchId.year,
                    batchId: l_batchData.batchId._id,
                    courseId: l_batchData.courseId._id,
                    courseName: l_batchData.courseId.courseName,
                    type: l_batchData.type,
                    subType: l_batchData.subType,
                    link: l_batchData.link
                  })
                } else if (l_batchData.type == 'Interview and Soft Skills') {
                  view_data2.push({
                    Id: l_batchData._id,
                    Name: l_batchData.name,
                    batchName: l_batchData.batchId.batchName,
                    yearName: l_batchData.batchId.year,
                    batchId: l_batchData.batchId._id,
                    courseId: l_batchData.courseId._id,
                    courseName: l_batchData.courseId.courseName,
                    type: l_batchData.type,
                    subType: l_batchData.subType,
                    link: l_batchData.link
                  })
                } else if (l_batchData.type == 'Datasets') {
                  view_data3.push({
                    Id: l_batchData._id,
                    Name: l_batchData.name,
                    batchName: l_batchData.batchId.batchName,
                    yearName: l_batchData.batchId.year,
                    batchId: l_batchData.batchId._id,
                    courseId: l_batchData.courseId._id,
                    courseName: l_batchData.courseId.courseName,
                    type: l_batchData.type,
                    subType: l_batchData.subType,
                    link: l_batchData.link
                  })
                } else if (l_batchData.type == 'Additional') {
                  view_data4.push({
                    Id: l_batchData._id,
                    Name: l_batchData.name,
                    batchName: l_batchData.batchId.batchName,
                    yearName: l_batchData.batchId.year,
                    batchId: l_batchData.batchId._id,
                    courseId: l_batchData.courseId._id,
                    courseName: l_batchData.courseId.courseName,
                    type: l_batchData.type,
                    subType: l_batchData.subType,
                    link: l_batchData.link
                  })
                }
              })
            }
          })
        }

        //  }

      });

      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data,
          view_data1: view_data1,
          view_data2: view_data2,
          view_data3: view_data3,
          view_data4: view_data4
        });
      }, 4000)
    }
  });
});

router.get('/getLibraryfile', function (req, res) {
  var view_data = [];
  libraryUploadsModel.find({
    noticeId: req.query.Id
  }).then(function (notice) {
    if (notice != '') {
      notice.forEach(function (notices) {
        view_data.push({
          noticeUploadId: notices._id,
          noticeId: notices.noticeId,
          doc_id: notices.doc_id,
          type: notices.type,
          file_name: notices.name

        });
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else if (notice == '') {
      res.json({
        message: 'No file uploaded!!!..'
      });
    }
  })

});

router.delete('/deleteLibrary', function (req, res) {
  var query = {
    _id: req.query.Id
  }
  var query1 = {
    noticeId: req.query.Id
  }
  LibraryModel.find({
    _id: req.query.Id
  }).exec(function (err, deleteNotice) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteNotice != '' || deleteNotice != null || deleteNotice != 'undefined' || deleteNotice != undefined) {
      LibraryModel.findOneAndRemove(query).exec(function (err, notice) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          libraryUploadsModel.find({
            noticeId: req.query.Id
          }).exec(function (err, noticeUpload) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              libraryUploadsModel.findOneAndRemove(query1).exec(function (err, noticeUploadDelete) {
                if (err) {
                  return res.status(500).json({
                    message: 'Internal Server Error!!!....'
                  });
                } else {
                  res.json({
                    status: 200,
                    message: 'notice Deleted Successfully!!!....'
                  });
                }

              })
            }
          })
        }

      });

    }
  });
});

router.delete('/deleteLibraryFile', function (req, res) {
  var query = {
    _id: req.query.UploadId
  }
  libraryUploadsModel.find({
    _id: req.query.UploadId
  }).exec(function (err, uploadNotice) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (uploadNotice != '' || uploadNotice != null || uploadNotice != 'undefined' || uploadNotice != undefined) {
      libraryUploadsModel.findOneAndRemove(query).exec(function (err, batch) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: batch,
            message: 'File Deleted Successfully!!!....'
          });
        }

      });

    }
  })
});

router.post('/saveVimeoLink', function (req, res) {
  saveVimeoLink(req.body)
  var vimeoLink = new vimeoLinkModel({
    chapterId: req.body.chapterId,
    type_of_upload: req.body.type,
    vimeoLinkName: req.body.vimeoLinkName,
    vimeoLink: req.body.vimeoLink
  });
  vimeoLink.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      chapterModel.find({
        _id: req.body.chapterId,
      }).then(function (chapter) {
        if (chapter.length > 0) {
          var current_year = moment(new Date()).format('YYYY');
          var previous_year = parseInt(current_year) - 1;
          var batch_year_search = previous_year + " - " + current_year;
          var year_search;
          semesterNewModel.find({
            _id: chapter[0].semesterId
          }).then(function (semester) {
            if (semester[0].semesterName == 'Semester 1' || semester[0].semesterName == 'Semester 2') {
              year_search = 'FY';
            } else if (semester[0].semesterName == 'Semester 3' || semester[0].semesterName == 'Semester 4') {
              year_search = 'SY'
            } else {
              year_search = 'TY'
            }
            batchMasterModel.find({
              courseId: chapter[0].courseId,
              batchName: year_search,
              year: batch_year_search
            }).then(function (batch) {
              userModel.find({
                _id: req.body.user_id
              }).then(function (userdetails) {
                if (userdetails) {
                  var activity_action = "Admin Added YouTube Video link.";
                  var activity_data = userdetails[0].fullName + " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                  notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                }
              })
              studentBatchModel.find({
                courseId: chapter[0].courseId,
                batchId: batch[0]._id
              }).then(function (studentData) {
                var action = "Admin Added YouTube Video link.";
                var notification_data = " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                studentData.forEach(function (student) {
                  notification_function.notification(action, notification_data, student.studentId);
                });
              })
            })
          })
        }
      })
      res.json({
        status: 200,
        data: result
      })
    }
  });

});
async function saveVimeoLink(body) {
  var chapter = await getId.getChapterId(body.chapterId, '')
  models.vimeolink.create({
    chapterId: chapter.id,
    type_of_upload: body.type,
    vimeoLinkName: body.vimeoLinkName,
    vimeoLink: body.vimeoLink
  }).then(vimeo => {
    if (vimeo) {
      models.chapters.getSubject(chapter.id).then(chapter => {
        if (chapter.length > 0) {
          models.batchsemester.findAll({
            where: {
              semesterId: chapter[0].semesterId
            }
          }).then(batchsem => {
            models.studentbatches.findAll({
              where: {
                batchId: batchsem.batchId,
                courseId: batchsem.courseId
              }
            }).then(async studentData => {

              var action = "Admin Added YouTube Video link.";
              var notification_data = " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
              studentData.forEach(function (student) {
                notification_function.notification(action, notification_data, student.studentId);
              });
              var user = await getId.getUserId(body.user_id, '')
              models.users.findAll({
                where: {
                  id: user.id
                }
              }).then(userdetails => {
                if (userdetails) {
                  var activity_action = "Admin Added YouTube Video link.";
                  var activity_data = userdetails[0].fullName + " Added YouTube Video for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                  notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0].id);
                }
              })


            })
          })
        }
      })
    }
  })
}


router.put('/updateChapterSyllabus', function (req, res) {
  chapterSyllabusFilesModel.find({
    _id: req.body.syllabusId
  }).then(function (chapterSyllabus) {
    if (chapterSyllabus != '') {
      var query = {
        _id: req.body.syllabusId
      },
        update = {
          $set: {
            courseId: req.body.courseId,
            subjects: req.body.subject,
            semesterId: req.body.semesterId,
            description: req.body.description,
            userId: req.body.user_id,
            unitName: req.body.unitName,
            chapterName: req.body.chapterName
          }
        }
      chapterSyllabusFilesModel.findOneAndUpdate(query, update, function (err, chapterSyllabusUpdate) {
        if (err) {
          res.json({
            status: 400,
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
          });
        }
      })
    }
  })
})
router.put('/updateSyllabusTeacher', function (req, res) {
  UnapprovedSyllabusModel.find({
    syllabusFilesId: req.body.syllabusId
  }).then(function (unapprovedSyllabus) {
    if (unapprovedSyllabus != '') {
      var query = {
        syllabusFilesId: req.body.syllabusId
      },
        update = {
          $set: {
            courseId: req.body.courseId,
            subjects: req.body.subject,
            semesterId: req.body.semesterId,
            description: req.body.description,
            teacher_id: req.body.teacher_id,
            approval: req.body.approval
          }
        };

      var query1 = {
        _id: req.body.syllabusId
      }
      update1 = {
        $set: {
          approval: req.body.approval
        }
      }
      syllabusFilesModel.findOneAndUpdate(query1, update1, function (err, approvalUpdate) {

      })
      UnapprovedSyllabusModel.updateMany(query, update, function (err, course) {
        if (err) {
          console.log("err==>" + err);
          res.json({
            status: 400,
            message: 'Bad Request'
          });
        } else {
          if (course) {
            UnapprovedSyllabusModel.find({
              syllabusFilesId: req.body.syllabusId
            }).then(function (courseData) {
              if (courseData != '') {
                res.json({
                  status: 200,
                  data: course,
                  data1: courseData
                });

              }

            })
          }
        }

      });

    } else if (unapprovedSyllabus == '') {
      var courseData = new UnapprovedSyllabusModel({
        syllabusFilesId: req.body.syllabusId,
        courseId: req.body.courseId,
        subjects: req.body.subject,
        semesterId: req.body.semesterId,
        description: req.body.description,
        teacher_id: req.body.teacher_id,
        approval: req.body.approval
      });
      var query1 = {
        _id: req.body.syllabusId
      }
      update1 = {
        $set: {
          approval: req.body.approval
        }
      }
      syllabusFilesModel.findOneAndUpdate(query1, update1, function (err, approvalUpdate) {

      })
      courseData.save(function (err, result) {
        if (err) {

        } else {
          res.json({
            status: 200,
            data: result
          })
        }
      });
    }

  })
})

router.post('/saveCamtasiaLink', function (req, res) {
  saveCamtasiaLink(req.body)
  var StudentList = [];
  if (req.body.linkID != '') {
    var query = {
      _id: req.body.linkID
    },
      update = {
        $set: {
          course: req.body.course,
          semester: req.body.semester,
          subject: req.body.subject,
          chapter: req.body.chapter,
          linkName: req.body.linkName,
          link: req.body.link,

        }
      };
    camtasiaLinksModel.findOneAndUpdate(query, update, function (req, savedLinks) {
      res.json({
        status: 200,
        data: savedLinks
      });

    });
  } else {
    studentBatchModel.find({
      courseId: req.body.course,
      batchId: req.body.batchId
    }).populate("studentId", ["fullName"]).then((students) => {
      for (var i = 0; i < students.length; i++) {
        var userId = students[i].studentId._id;
        var userName = students[i].studentId.fullName;
        StudentList.push({
          userId: userId,
          userName: userName,
          percentage: 0,
          seconds: 0,
          duration: 0
        });
      }
      camtasiaAnalyticsModel.create({
        course: req.body.course,
        semester: req.body.semester,
        subject: req.body.subject,
        chapter: req.body.chapter,
        linkName: req.body.linkName,
        link: req.body.link,

        StudentList: StudentList,

      }, (err, savedLinks) => {
        if (err) {
          console.error(err)
        } else {
          console.log("camtasiaAnalytics added sucessfully....!!")
        }
      })
    })

    camtasiaLinksModel.create({
      course: req.body.course,
      semester: req.body.semester,
      subject: req.body.subject,
      chapter: req.body.chapter,
      linkName: req.body.linkName,
      link: req.body.link,

    }, (err, savedLinks) => {
      if (err) {
        console.error(err)
      } else {
        chapterModel.find({
          _id: req.body.chapter,
        }).then(function (chapter) {
          if (chapter.length > 0) {
            var current_year = moment(new Date()).format('YYYY');
            var previous_year = parseInt(current_year) - 1;
            //var next_year = parseInt(current_year) + 1;
            var batch_year_search = previous_year + " - " + current_year; //2019 - 2020
            var year_search;
            semesterNewModel.find({
              _id: chapter[0].semesterId
            }).then(function (semester) {
              if (semester[0].semesterName == 'Semester 1' || semester[0].semesterName == 'Semester 2') {
                year_search = 'FY';
              } else if (semester[0].semesterName == 'Semester 3' || semester[0].semesterName == 'Semester 4') {
                year_search = 'SY'
              } else {
                year_search = 'TY'
              }
              batchMasterModel.find({
                courseId: chapter[0].courseId,
                batchName: year_search,
                year: batch_year_search
              }).then(function (batch) {
                userModel.find({
                  _id: req.body.user_id
                }).then(function (userdetails) {
                  if (userdetails) {
                    var activity_action = "Added Camtasia Link.";
                    var activity_data = userdetails[0].fullName + " Added Camtasia Link for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                    notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                  }
                })
              })
            })
          }
        })
        res.json({
          status: 200,
          data: savedLinks
        })
      }
    })
  }

})
async function saveCamtasiaLink(body) {
  var Course = await getId.getCourseId(body.course, '')
  var semester = await getId.getSemesterId(body.semester, '');
  var subject = await getId.getSubjectId(body.subject,Course.id, semester.id)
  var user = await getId.getUserId(body.user_id, '')
  var chapter = await getId.getChapterId(body.chapter, '')
  var StudentList = [];
  if (body.linkID != null) {
    models.camtasialinks.findAll({
      where: {
        id: body.linkID
      }
    }).then(async link => {
      if(link){
    await    link.update({
          courseId: Course.id,
          semesterId: semester.id,
          subjectId: subject.id,
          chapterId: chapter.id,
          linkName: body.linkName,
          link: body.link,
        }).then(update_link => {
          // res.json({
          //   status: 200,
          //   data: update_link
          // });
        })
      }
      
    })
  } else {
    models.studentbatches.student(Course.id, semester.id).then(students => {
      students.forEach(elm => {
        models.camtasiaanalytics.create({
          courseId: Course.id,
          semesterId: semester.id,
          subjectId: subject.id,
          chapterId: chapter.id,
          linkName: body.linkName,
          link: body.link,
          userId: elm.studentId,
          percentage: 0,
          seconds: 0,
          duration: 0
        }).then(camtasiaanalytic => {
          if (camtasiaanalytic) {
            console.log("camtasiaAnalytics added sucessfully....!!")
          }
        })
      })

      models.camtasialinks.create({
        courseId: Course.id,
        semesterId: semester.id,
        subjectId: subject.id,
        chapterId: chapter.id,
        linkName: body.linkName,
        link: body.link,
      }).then(camtasialink => {
        if (camtasialink) {
          models.chapters.findAll({
            where: {
              id: chapter.id
            }
          }).then(chapter => {
            if (chapter.length > 0) {
              models.batchsemester.findAll({
                where: {
                  semesterId: chapter[0].semesterId
                }
              }).then(batchsem => {
                models.studentbatches.findAll({
                  where: {
                    batchId: batchsem.batchId,
                    courseId: batchsem.courseId
                  }
                }).then(studentData => {

                  var action = "Admin Added " + body.type;
                  var notification_data = " Added " + body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                  studentData.forEach(function (student) {
                    notification_function.notification(action, notification_data, student.studentId);
                  });

                  models.users.findAll({
                    where: {
                      id: user.id
                    }
                  }).then(userdetails => {
                    // if (userdetails) {
                    //   var activity_action = " Added " + body.type;
                    //   var activity_data = userdetails[0].fullName + " Added " + body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                    //   notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch.id);
                    // }
                  })


                })
              })
            }
          })
        }
      })
    })

  }
}

router.get('/getAllCamtasiaLinks', function (req, res) {
  camtasiaLinksModel.find({

  }).populate('course', ['courseName']).populate('semester', ['semesterName']).populate('chapter', ['chapterName']).then(function (links) {
    res.json({
      status: 200,
      data: links
    })
  })
});

router.get('/deleteCamtasiaLink/:id', function (req, res) {
  var query = {
    _id: req.params.id
  }

  camtasiaLinksModel.deleteOne(query, (err, links) => {
    if (links) {
      res.json({
        status: 200,
        message: 'removed successfully'
      })
    } else {
      console.err(err);
    }
  })
});

router.get('/getActivityTrackerData', function (req, res) {
  var view_data = []
  activityTrackerModel.find({}).exec(function (err, activities) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (activities != '' || activities != 'undefined' || activities != 'null') {
      activities.forEach(function (activity) {
        view_data.push({
          id: activity._id,
          activity: activity.activity,
          data: activity.data,
          createdOn: moment(activity.createdOn).fromNow(),
        })

      })
      res.json({
        status: 200,
        data: view_data
      });
    }
  });

});


router.get('/getSubjectDataforlibrary', function (req, res) {
  var batchID = req.query.batch;
  var courseID = req.query.course_id;
  var view_data = [];
  var view_data1 = [];
  var view_data2 = [];
  course_subjects = [];

  batchMasterModel.find({
    _id: batchID,
    courseId: courseID
  }).populate('courseId', ['courseName']).then(function (batches) {
    var course = batches[0].courseId;
    var datacourseName = course.courseName;
    var courseName;
    if (datacourseName == 'B.Sc') {
      courseName = 'BSc'
    } else if (datacourseName == 'M.Sc') {
      courseName = 'MSc'
    } else if (datacourseName == 'PG Diploma') {
      courseName = 'Diploma'
    }
    console.log("courseName=>" + courseName)
    var semJSonOrCond = [];
    if (batches != '') {
      if (batches[0].batchName == 'TY') {
        semJSonOrCond = [{
          semesterName: "Semester 5"
        },
        {
          semesterName: "Semester 6"
        },
        {
          semesterName: courseName + " Semester 5"
        },
        {
          semesterName: courseName + " Semester 6"
        },
        ]
      } else if (batches[0].batchName == 'SY') {
        semJSonOrCond = [{
          semesterName: "Semester 4"
        },
        {
          semesterName: "Semester 3"
        },
        {
          semesterName: courseName + " Semester 4"
        },
        {
          semesterName: courseName + " Semester 3"
        }
        ]

      } else if (batches[0].batchName == 'FY') {
        semJSonOrCond = [{
          semesterName: "Semester 1"
        },
        {
          semesterName: "Semester 2"
        },
        {
          semesterName: courseName + " Semester 1"
        },
        {
          semesterName: courseName + " Semester 2"
        },
        ]
      }
      semesterNewModel.find({
        $or: semJSonOrCond
      }).sort({
        'createdOn': -1
      }).exec(function (err, semesters) {
        if (err) {
          console.log(err);
        } else if (semesters != '') {
          if (semesters[0].semesterStatus == 'true' && semesters[1].semesterStatus == 'true') {
            semesters.forEach(function (semesterData) {
              view_data1.push({
                semesterData
              });

            });
            semesterNewModel.find({
              _id: semesters[0]._id
            }).then(function (semData) {

              // })
              subjectModel.find({
                courseId: course._id,
                semesterId: semData[0]._id
              }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject) {
                if (subject != '') {
                  subject.forEach(subjectData => {
                    var sub1 = subjectData.subject;
                    var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                    var sub = sub2.replace(/^"(.*)"$/, '$1');
                    var strs = sub.split('","');
                    strs.forEach(function (courseSubject) {
                      course_subjects.push(courseSubject);

                    });
                    view_data.push({
                      subjects: course_subjects,
                      courseName: subjectData.courseId.courseName,
                      courseId: subjectData.courseId._id,
                      semesterName: subjectData.semesterId.semesterName,
                      semesterId: subjectData.semesterId._id,
                      batchName: batches[0].batchName,
                      batchId: batches[0]._id,
                    });


                  })
                } else if (subject == '') {
                  subjectModel.find({
                    courseId: course,
                    semesterId: semesters[1]._id
                  }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject1) {
                    if (subject1 != '') {
                      subject1.forEach(subjectData => {
                        var sub1 = subjectData.subject;
                        var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                        var sub = sub2.replace(/^"(.*)"$/, '$1');
                        var strs = sub.split('","');
                        strs.forEach(function (courseSubject) {
                          course_subjects.push(courseSubject);

                        });
                        view_data.push({
                          subjects: course_subjects,
                          courseName: subjectData.courseId.courseName,
                          courseId: subjectData.courseId._id,
                          semesterName: subjectData.semesterId.semesterName,
                          semesterId: subjectData.semesterId._id,
                          batchName: batches[0].batchName,
                          batchId: batches[0]._id,
                        });


                      })
                    }

                  });
                }
              })
            });
          } else if (semesters[1].semesterStatus == 'true') {
            semesterNewModel.find({
              _id: semesters[1]._id
            }).then(function (semestersFirstSem) {
              if (semestersFirstSem != '') {
                semestersFirstSem.forEach(function (semesterData) {
                  view_data1.push({
                    semesterData
                  });
                });

                subjectModel.find({
                  courseId: course._id,
                  semesterId: semestersFirstSem[0]._id
                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject) {
                  if (subject != '') {
                    subject.forEach(subjectData => {
                      var sub1 = subjectData.subject;
                      var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                      var sub = sub2.replace(/^"(.*)"$/, '$1');
                      var strs = sub.split('","');
                      strs.forEach(function (courseSubject) {
                        course_subjects.push(courseSubject);

                      });
                      view_data.push({
                        subjects: course_subjects,
                        courseName: subjectData.courseId.courseName,
                        courseId: subjectData.courseId._id,
                        semesterName: subjectData.semesterId.semesterName,
                        semesterId: subjectData.semesterId._id,
                        batchName: batches[0].batchName,
                        batchId: batches[0]._id,
                        overview: ''
                      });


                    })
                  }
                });
              }

            })
          }

          setTimeout(function () {
            res.json({
              status: 200,
              data: view_data,
              subjectData: course_subjects,
              data1: view_data1,
              data2: view_data2,
            })
          }, 1500)
        }

      });

    }
  });

});

router.get('/getLibraryDataForStudent', function (req, res) {
  var view_data1 = [];
  var view_data2 = [];
  var view_data3 = [];
  var view_data4 = [];
  LibraryModel.find({
    category: 'All'
  }).exec(function (err, library) {
    if (err) {
      console.error(err)
    } else {

      LibraryModel.find({
        courseId: req.query.course_id,
        batchId: req.query.batchId,
        subjects: req.query.subjectName
      }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).exec(function (err, allnotice) {
        if (err) {
          console.log(err)
        } else if (allnotice != '') {
          allnotice.forEach(function (l_batchData) {
            if (l_batchData.type == 'Industry Connect Session') {
              view_data1.push({
                Id: l_batchData._id,
                Name: l_batchData.name,
                batchName: l_batchData.batchId.batchName,
                yearName: l_batchData.batchId.year,
                batchId: l_batchData.batchId._id,
                courseId: l_batchData.courseId._id,
                courseName: l_batchData.courseId.courseName,
                type: l_batchData.type,
                subType: l_batchData.subType,
                link: l_batchData.link,
                subjects: l_batchData.subjects,
              })
            } else if (l_batchData.type == 'Interview and Soft Skills') {
              view_data2.push({
                Id: l_batchData._id,
                Name: l_batchData.name,
                batchName: l_batchData.batchId.batchName,
                yearName: l_batchData.batchId.year,
                batchId: l_batchData.batchId._id,
                courseId: l_batchData.courseId._id,
                courseName: l_batchData.courseId.courseName,
                type: l_batchData.type,
                subType: l_batchData.subType,
                link: l_batchData.link,
                subjects: l_batchData.subjects,
              })
            } else if (l_batchData.type == 'Datasets') {
              view_data3.push({
                Id: l_batchData._id,
                Name: l_batchData.name,
                batchName: l_batchData.batchId.batchName,
                yearName: l_batchData.batchId.year,
                batchId: l_batchData.batchId._id,
                courseId: l_batchData.courseId._id,
                courseName: l_batchData.courseId.courseName,
                type: l_batchData.type,
                subType: l_batchData.subType,
                link: l_batchData.link,
                subjects: l_batchData.subjects,
              })
            } else if (l_batchData.type == 'Additional') {
              view_data4.push({
                Id: l_batchData._id,
                Name: l_batchData.name,
                batchName: l_batchData.batchId.batchName,
                yearName: l_batchData.batchId.year,
                batchId: l_batchData.batchId._id,
                courseId: l_batchData.courseId._id,
                courseName: l_batchData.courseId.courseName,
                type: l_batchData.type,
                subType: l_batchData.subType,
                link: l_batchData.link,
                subjects: l_batchData.subjects,
              })
            }
          })
        }
      })



      setTimeout(function () {
        res.json({
          status: 200,
          view_data1: view_data1,
          view_data2: view_data2,
          view_data3: view_data3,
          view_data4: view_data4
        });
      }, 4000)
    }
  });

})

router.get('/getCourseAdmindashboard', function (req, res) {
  viewCourse = [];
  collegeCourseModel.find({}).exec(function (err, allCourses) {
    allCourses.forEach((course) => {
      batchMasterModel.find({
        batchStatus: true,
      }).exec(function (err, allBatches) {
        allBatches.forEach((batch) => {

        })
      })
      viewCourse.push({
        courseName: course.courseName,
        title: course.courseName,
        CourseID: course._id,
        courseBatches: CourseBAtch
      })
    })
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: studentBatch

      })
    }

  });

});


router.post('/pastChapterContent', async (req, res) => {
  pastChapterContent(req)
  if (req.body.copyData != undefined || req.body.copyData != 'undefined' || req.body.copyData != null || req.body.copyData != '') {

    for (let data of req.body.copyData) {
      const chapters = await chapterModel.find({
        chapterName: data.chapterName,
        semesterId: req.body.toSemester,
        subject: req.body.toSubject,
        courseId: req.body.toCourse,
      })
      if (chapters.length == 0) {
        const chapterData = await chapterModel.create({
          chapterName: data.chapterName,
          semesterId: req.body.toSemester,
          subject: req.body.toSubject,
          courseId: req.body.toCourse,
          videoLink: data.videoLink,
          status: "Approved",
          icon: data.icon,
        })
        if (chapterData) {
          var newChapterId = chapterData._id
          if (data.dataSet) {
            uploadsModel.create({
              lessonId: newChapterId,
              doc_id: data.dataSet.doc_id,
              length: data.dataSet.length,
              name: data.dataSet.name,
              type: data.dataSet.type,
              type_of_upload: data.dataSet.type_of_upload
            })
          }
          if (data.pptNotes) {
            uploadsModel.create({
              lessonId: newChapterId,
              doc_id: data.pptNotes.doc_id,
              length: data.pptNotes.length,
              name: data.pptNotes.name,
              type: data.pptNotes.type,
              type_of_upload: data.pptNotes.type_of_upload
            })
          }
          if (data.practiseQuestion) {
            uploadsModel.create({
              lessonId: newChapterId,
              doc_id: data.practiseQuestion.doc_id,
              length: data.practiseQuestion.length,
              name: data.practiseQuestion.name,
              type: data.practiseQuestion.type,
              type_of_upload: data.practiseQuestion.type_of_upload
            })
          }
          if (data.prerequisites) {
            youTubeLinkModel.create({
              chapterId: newChapterId,
              youTubeLink: data.prerequisites.youTubeLink
            })
          }
          if (data.quis) {
            mcqModel.create({
              chapterId: newChapterId,
              name: data.quis.name,
              set: data.quis.set
            })
          }
        }
      } else {
        chapters.forEach(function (chapter) {
          if (data.dataSet) {
            uploadsModel.create({
              lessonId: chapter._id,
              doc_id: data.dataSet.doc_id,
              length: data.dataSet.length,
              name: data.dataSet.name,
              type: data.dataSet.type,
              type_of_upload: data.dataSet.type_of_upload
            })
          }
          if (data.pptNotes) {
            uploadsModel.create({
              lessonId: chapter._id,
              doc_id: data.pptNotes.doc_id,
              length: data.pptNotes.length,
              name: data.pptNotes.name,
              type: data.pptNotes.type,
              type_of_upload: data.pptNotes.type_of_upload
            })
          }
          if (data.practiseQuestion) {
            uploadsModel.create({
              lessonId: chapter._id,
              doc_id: data.practiseQuestion.doc_id,
              length: data.practiseQuestion.length,
              name: data.practiseQuestion.name,
              type: data.practiseQuestion.type,
              type_of_upload: data.practiseQuestion.type_of_upload
            })
          }
          if (data.prerequisites) {
            youTubeLinkModel.create({
              chapterId: chapter._id,
              youTubeLink: data.prerequisites.youTubeLink
            })
          }
          if (data.quis) {
            mcqModel.create({
              chapterId: chapter._id,
              name: data.quis.name,
              set: data.quis.set
            })
          }
        })
      }


    }

    res.json({
      status: 200,
    })
  }


})
async function pastChapterContent(req) {
  if (req.body.copyData != undefined || req.body.copyData != 'undefined' || req.body.copyData != null || req.body.copyData != '') {
    req.body.copyData.forEach(async data => {
      var course = await getId.getCourseId(req.body.toCourse, '')
      var semester = await getId.getSemesterId(req.body.toSemester, '');
      var subject = await getId.getSubjectId(req.body.toSubject.course.id, semester.id)
    await  models.chapters.find({
        where: {
          courseId: course.id,
          subjectId: subject.id,
          semesterId: semester.id,
          chapterName: data.chapterName
        }
      }).then(chapters => {
        if (chapters.lenght == 0) {
          models.chapters.create({
            chapterName: data.chapterName,
            semesterId: semester.id,
            subjectId: subject.id,
            courseId: course.id,
            videoLink: data.videoLink,
            status: "Approved",
            icon: data.icon,
          }).then(Chapter => {
            if (Chapter) {
              if (data.dataSet) {
                models.uploads.create({
                  lessonId: Chapter.id,
                  length: data.dataSet.length,
                  name: data.dataSet.name,
                  type: data.dataSet.type,
                  typefOfUpload: data.dataSet.type_of_upload
                })
              }
              if (data.pptNotes) {
                models.uploads.create({
                  lessonId: Chapter.id,
                  length: data.pptNotes.length,
                  name: data.pptNotes.name,
                  type: data.pptNotes.type,
                  typefOfUpload: data.pptNotes.type_of_upload
                })
              }
              if (data.practiseQuestion) {
                models.uploads.create({
                  lessonId: Chapter.id,
                  length: data.practiseQuestion.length,
                  name: data.practiseQuestion.name,
                  type: data.practiseQuestion.type,
                  type_of_upload: data.practiseQuestion.type_of_upload
                })
              }
              if (data.prerequisites) {
                models.youtubelinks.create({
                  chapterId: Chapter.id,
                  youTubeLink: data.prerequisites.youTubeLink
                })
              }
              if (data.quis) {
                models.mcqs.create({
                  chapterId: Chapter.id,
                  name: data.quis.name,
                  set: data.quis.set
                })
              }
            }
          })
        } else {
          chapters.forEach(function (chapter) {
            if (data.dataSet) {
              models.uploads.create({
                lessonId: chapter.id,
                length: data.dataSet.length,
                name: data.dataSet.name,
                type: data.dataSet.type,
                typefOfUpload: data.dataSet.type_of_upload
              })
            }
            if (data.pptNotes) {
              models.uploads.create({
                lessonId: chapter.id,
                length: data.pptNotes.length,
                name: data.pptNotes.name,
                type: data.pptNotes.type,
                typefOfUpload: data.pptNotes.type_of_upload
              })
            }
            if (data.practiseQuestion) {
              models.uploads.create({
                lessonId: chapter.id,
                length: data.practiseQuestion.length,
                name: data.practiseQuestion.name,
                type: data.practiseQuestion.type,
                type_of_upload: data.practiseQuestion.type_of_upload
              })
            }
            if (data.prerequisites) {
              models.youtubelinks.create({
                chapterId: chapter.id,
                youTubeLink: data.prerequisites.youTubeLink
              })
            }
            if (data.quis) {
              models.mcqs.create({
                chapterId: chapter.id,
                name: data.quis.name,
                set: data.quis.set
              })
            }
          })
        }
      })
    })
  }
}


router.post('/pastAllChapterContent', function (req, res) {
  pastAllChapterContent(req)
  chapterModel.aggregate([{
    $match: {
      "subject": {
        $eq: req.body.fromSubject,
      },
      "courseId": {
        $eq: req.body.fromCourse,
      },
      "semesterId": {
        $eq: req.body.fromSemester,
      },
    }
  },
  {
    $addFields: {
      id: {
        $toString: "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "uploads",
      "localField": "id",
      "foreignField": "lessonId",
      "as": "uploads"
    }
  },

  {
    "$lookup": {
      "from": "youtubelinks",
      "localField": "id",
      "foreignField": "chapterId",
      "as": "prerequisites"
    }
  },
  {
    "$lookup": {
      "from": "mcqs",
      "localField": "id",
      "foreignField": "chapterId",
      "as": "quis"
    }
  },
  {
    $project: {
      pptNotes: {
        $filter: {
          input: "$uploads",
          as: "data",
          cond: {
            $eq: ["$$data.type_of_upload", "ppt/notes"]
          }
        }
      },
      practiseQuestion: {
        $filter: {
          input: "$uploads",
          as: "data",
          cond: {
            $eq: ["$$data.type_of_upload", "practise question"]
          }
        }
      },
      prerequisites: {
        $filter: {
          input: "$prerequisites",
          as: "data",
          cond: {}
        }
      },
      quis: {
        $filter: {
          input: "$quis",
          as: "data",
          cond: {}
        }
      },
      "chapterName": 1,
    }
  },
  ]).then(function (chaptersData) {
    chaptersData.forEach(function (chapter) {
      chapterModel.create({
        chapterName: chapter.chapterName,
        semesterId: req.body.toSemester,
        subject: req.body.toSubject,
        courseId: req.body.toCourse,
        videoLink: chapter.videoLink,
        status: "Approved",
        icon: chapter.icon,

      }, (err, createdChapter) => {
        if (err) {
          console.error(err)
        } else {
          var newChapterId = createdChapter._id
          chapter.prerequisites.forEach(function (link) {
            youTubeLinkModel.create({
              chapterId: newChapterId,
              youTubeLink: link.youTubeLink
            })
          })

          chapter.practiseQuestion.forEach(function (ppt) {
            uploadsModel.create({
              lessonId: newChapterId,
              doc_id: ppt.doc_id,
              length: ppt.length,
              name: ppt.name,
              type: ppt.type,
              type_of_upload: ppt.type_of_upload
            })
          })

          chapter.quis.forEach(function (q) {
            mcqModel.create({
              chapterId: newChapterId,
              name: q.name,
              set: q.set
            })
          })

          chapter.pptNotes.forEach(function (ppt) {
            uploadsModel.create({
              lessonId: newChapterId,
              doc_id: ppt.doc_id,
              length: ppt.length,
              name: ppt.name,
              type: ppt.type,
              type_of_upload: ppt.type_of_upload
            })

          })

        }

      })
    })
    res.json({
      status: 200,
    })
  })
})
async function pastAllChapterContent(req) {
  var course = await getId.getCourseId(req.body.toCourse, '')
  var semester = await getId.getSemesterId(req.body.toSemester, '');
  var subject = await getId.getSubjectId(req.body.toSubject, course.id, semester.id)

await  models.chapters.getChapterNoteData(course.id, semester.id, subject.id).then(data => {
    if (data) {
      models.chapters.create({
        chapterName: data[0].chapterName,
        semesterId: semester.id,
        subjectId: subject.id,
        courseId: course.id,
        videoLink: data[0].videoLink,
        status: "Approved",
        icon: data[0].icon,

      }).then(createChapter => {
        data.forEach(elm => {

          if (elm.uploadName != '') {
            models.uploads.create({
              lessonId: createChapter.id,
              length: elm.length,
              name: elm.uploadName,
              type: elm.uploadtype,
              typefOfUpload: elm.typefOfUpload
            }).then(upload => {
              console.log("upload")
            })
          }
          if (elm.videoName != '') {
            models.youtubelinks.create({
              chapterId: createChapter.id,
              videoName: elm.videoName,
              youTubeLink: elm.youTubeLink,
              typeOfUpload: elm.typeOfUpload
            }).then(youtubelinks => {
              console.log("youtubelinks")
            })
          }
          if (elm.mcqName != '') {
            models.mcqs.create({
              chapterId: createChapter.id,
              sets: elm.sets,
              name: elm.mcqName
            }).then(mcqs => {
              console.log("mcqs")
            })
          }

        })
      })

    }
  })
}

router.get('/getContentForCopyChapterData', function (req, res) {
  chapterModel.aggregate([{
    $match: {
      "subject": {
        $eq: req.query.subject,
      },
      "courseId": {
        $eq: req.query.course,
      },
      "semesterId": {
        $eq: req.query.semester,
      },
    }
  },
  {
    $addFields: {
      id: {
        $toString: "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "uploads",
      "localField": "id",
      "foreignField": "lessonId",
      "as": "uploads"
    }
  },

  {
    "$lookup": {
      "from": "youtubelinks",
      "localField": "id",
      "foreignField": "chapterId",
      "as": "prerequisites"
    }
  },
  {
    "$lookup": {
      "from": "mcqs",
      "localField": "id",
      "foreignField": "chapterId",
      "as": "quis"
    }
  },
  {
    $project: {
      pptNotes: {
        $filter: {
          input: "$uploads",
          as: "data",
          cond: {
            $eq: ["$$data.type_of_upload", "ppt/notes"]
          }
        }
      },
      practiseQuestion: {
        $filter: {
          input: "$uploads",
          as: "data",
          cond: {
            $eq: ["$$data.type_of_upload", "practise question"]
          }
        }
      },
      dataSet: {
        $filter: {
          input: "$uploads",
          as: "data",
          cond: {
            $eq: ["$$data.type_of_upload", "dataSet"]
          }
        }
      },
      prerequisites: {
        $filter: {
          input: "$prerequisites",
          as: "data",
          cond: {}
        }
      },
      quis: {
        $filter: {
          input: "$quis",
          as: "data",
          cond: {}
        }
      },
      "chapterName": 1,
      "_id": 1,
      "description": 1,
    }
  },
  ]).then(function (uploads) {
    res.json({
      status: 200,
      data: uploads
    })
  })
});

router.post('/DeleteSelectedChapter', function (req, res) {

  var ChaptersIdArr = req.body;
  var count = 0;
  ChaptersIdArr.forEach((chapterID) => {

    promise1 = new Promise((resolve, reject) => {
      uploadsModel.deleteMany({
        lessonId: chapterID
      }, function (err, deleteupload) {

        if (err) {
          reject('error');
        } else if (deleteupload) {
          setTimeout(() => {
            resolve(1);
          }, 200)
        }
      });
    })
    promise2 = new Promise((resolve, reject) => {
      youTubeLinkModel.deleteMany({
        chapterId: chapterID
      }, function (err, deleteYouTubeLink) {

        if (err) {
          reject('error');
        } else if (deleteYouTubeLink) {
          setTimeout(() => {
            resolve(1);
          }, 200)
        }
      });
    })
    promise3 = new Promise((resolve, reject) => {
      mcqModel.deleteMany({
        chapterId: chapterID
      }, function (err, deletemcq) {
        if (err) {
          reject('error');
        } else if (deletemcq) {
          setTimeout(() => {
            resolve(1);
          }, 200)
        }
      });
    })
    promise4 = new Promise((resolve, reject) => {
      chapterModel.findOneAndRemove({
        _id: chapterID
      }, function (err, deletechapter) {

        if (err) {
          reject('error');
        } else if (deletechapter) {
          setTimeout(() => {
            resolve(1);
          }, 200)
        }
      });
    })
    Promise.all([promise1, promise2, promise3, promise4]).then(result => {
      if ((result[0] == 1) && (result[1] == 1) && (result[2] == 1) && (result[3] == 1)) {
        count += 1;
      }
      setTimeout(() => {
        sendResponse();
      }, 500);
    })

  })

  function sendResponse() {
    if (ChaptersIdArr.length == count) {
      res.json({
        status: 200
      })
    }
  }

})


router.get('/getChapterContents', function (req, res) {
  chapterModel.aggregate([

    {
      $addFields: {
        id: {
          $toString: "$_id"
        }
      }
    },
    {
      $match: {
        "id": {
          $eq: req.query.id,
        },

      }
    },
    {
      "$lookup": {
        "from": "uploads",
        "localField": "id",
        "foreignField": "lessonId",
        "as": "uploads"
      }
    },

    {
      "$lookup": {
        "from": "youtubelinks",
        "localField": "id",
        "foreignField": "chapterId",
        "as": "prerequisites"
      }
    },
    {
      "$lookup": {
        "from": "mcqs",
        "localField": "id",
        "foreignField": "chapterId",
        "as": "quis"
      }
    },
    {
      "$lookup": {
        "from": "camtasialinks",
        "localField": "id",
        "foreignField": "chapter",
        "as": "selfStudy"
      }
    },
    {
      $project: {
        pptNotes: {
          $filter: {
            input: "$uploads",
            as: "data",
            cond: {
              $eq: ["$$data.type_of_upload", "ppt/notes"]
            }
          }
        },
        practiseQuestion: {
          $filter: {
            input: "$uploads",
            as: "data",
            cond: {
              $eq: ["$$data.type_of_upload", "practise question"]
            }
          }
        },
        dataSet: {
          $filter: {
            input: "$uploads",
            as: "data",
            cond: {
              $eq: ["$$data.type_of_upload", "dataSet"]
            }
          }
        },
        prerequisites: {
          $filter: {
            input: "$prerequisites",
            as: "data",
            cond: {}
          }
        },
        quis: {
          $filter: {
            input: "$quis",
            as: "data",
            cond: {}
          }
        },
        selfStudy: {
          $filter: {
            input: "$selfStudy",
            as: "data",
            cond: {}
          }
        },
        "chapterName": 1,
      }
    },
  ]).then(function (uploads) {
    res.json({
      status: 200,
      data: uploads
    })
  })
});

router.get('/getCamtasiaAnalytics', function (req, res) {
  chapterModel.aggregate([{
    $match: {
      "subject": {
        $eq: req.query.subject,
      },
      "courseId": {
        $eq: req.query.courseId,
      },
      "semesterId": {
        $eq: req.query.semesterId,
      },
    }
  },
  {
    $addFields: {
      id: {
        $toString: "$_id"
      }
    }
  },
  {
    "$lookup": {
      from: "camtasiaanalytics",
      localField: "id",
      foreignField: "chapter",
      as: "Analytics"
    }
  },
  {
    $project: {
      "chapterName": 1,
      "Analytics.link": 1,
      "Analytics.linkName": 1,
      "Analytics.StudentList.userName": 1,
      "Analytics.StudentList.percentage": 1,
    }
  },
  ]).then((camtasia) => {
    if (camtasia != '') {
      res.json({
        status: 200,
        data: camtasia
      })
    }
  })
})

router.get('/getBatchStudents', function (req, res) {
  var students = [];
  studentBatchModel.find({
    batchId: req.query.batchId,
    courseId: req.query.courseId
  }).populate('studentId', ['fullName', 'email']).then(function (studentBatch) {
    if (studentBatch != undefined || studentBatch != null || studentBatch != '') {
      studentBatch.forEach(element => {
        students.push({
          student: element.studentId,
          divisionId: element.divisionId
        })
      })

      res.json({
        status: 200,
        data: students
      })
    } else {
      res.json({
        status: 400,
        message: "No student's found..."
      })
    }
  })
})

router.get('/getSemAttendence', function (req, res) {
  var present = {};
  var absent = {};
  var total = {};
  var finalPresenty = {};
  var presentCount = 0;
  var absentCount = 0;
  var totalCount = 0;
  var view_data = [];
  attendanceModel.aggregate([{
    $match: {
      user_id: req.query.user_id,
      course_id: req.query.course_id,
      batch_id: req.query.batch_id,
      division_id: req.query.divisionId,
      attendance_date: {
        $gte: req.query.semStart,
        $lte: req.query.semEnd
      },
    }
  }]).then(function (studentAttendance) {
    if (studentAttendance != undefined || studentAttendance != null || studentAttendance != '') {
      const dist = [...new Set(studentAttendance.map(x => x.subject))]

      studentAttendance.forEach(el => {
        total[el.subject] = (total[el.subject] || 0) + 1;
        if (el.present == "Present") {
          present[el.subject] = (present[el.subject] || 0) + 1;
        }
        if (el.present == "Absent") {
          absent[el.subject] = (absent[el.subject] || 0) + 1;
        }
        dist.forEach(subject => {
          if (el.subject == subject) {
            totalCount++;
          }
          if (subject == el.subject && el.present == 'Present') {
            presentCount++
          } else if (subject == el.subject && el.present == 'Absent') {
            absentCount++
          }
        })
      })
      dist.forEach(data => {
        Object.keys(absent).forEach(key => {
          if ((data in absent) == false) {
            absent[data] = 0;
          }
        })
        Object.keys(present).forEach(key1 => {
          if ((data in present) == false) {
            present[data] = 0;
          }
        })
      })
      dist.forEach(sub => {
        Object.keys(total).forEach(key => {
          Object.keys(present).forEach(key1 => {
            Object.keys(absent).forEach(key2 => {
              if (sub == key && key == key1 && key1 == key2) {
                var percentage = Math.round((present[key1] / total[key]) * 100)
                view_data.push({
                  subject: sub,
                  present: present[key1],
                  absent: absent[key2],
                  total: total[key],
                  percentage: percentage
                })
              }
            })
          })
        })
      })
      finalPresenty['totalLectures'] = totalCount;
      finalPresenty['totalPresent'] = presentCount;
      finalPresenty['totalAbsent'] = absentCount;

      res.json({
        status: 200,
        subjectPresenty: view_data,
        totalPresenty: finalPresenty
      })

    } else {
      res.json({
        status: 400,
        message: "No data Found...!!"
      })
    }
  })
})

router.post('/saveBatchSemesterMaster', function (req, res) {
  saveBatchSemesterMaster(req.body)
  if (req.body._id) {
    var query = {
      _id: req.body._id
    },
      update = {
        $set: {
          batchId: req.body.batchId,
          semesterId: req.body.semesterId,

        }
      };
    batchSemesterMasterModel.updateMany(query, update, function (err, data) {
      if (err) {
        console.error("err" + err)
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: data
        })
      }

    });
  } else {
    batchSemesterMasterModel.create({
      batchId: req.body.batchId,
      semesterId: req.body.semesterId,
      courseId: req.body.courseId,
      departmentId: req.body.departmentId,

    })
      .then(data => {
        res.json({
          status: 200,
          data: data
        })
      })
  }
})
async function saveBatchSemesterMaster(body) {
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');
  var department = await getId.getDepartmentId(body.departmentId, '');
  models.batchsemester.find({
    where:{
      batchId: batch.id,
      semesterId: semester.id,
      courseId: course.id,
    }
   
  }).then(Batch => {
    if ( Batch != null ) {
      Batch.update({
        batchId: batch.id,
        semesterId: semester.id,
      }).then(update => {
        console.log("update")
      })
    } else {
      models.batchsemester.create({
        batchId: batch.id,
        semesterId: semester.id,
        courseId: course.id,
        departmentId: department.id,
      }).then(data => {
        // res.json({
        //   status: 200,
        //   data: data
        // })
      })
    }

  })

}
router.delete('/deleteBatchesSemester', async (req, res) => {

  batchSemesterMasterModel.findByIdAndRemove(req.query.id, function (err, deleteEvent) {
    if (err) {
      res.json({
        status: 400,
        message: "Bad Request "
      })
    } else {
      res.json({
        status: 200,
        message: "Deleted Succesfully"
      })
    }
  })

})


router.get('/getBatchSemesterData', function (req, res) {
  batchSemesterMasterModel.aggregate([{
    $addFields: {
      batchId: {
        $toObjectId: "$batchId"
      }
    }
  },
  {
    "$lookup": {
      "from": "batchmasters",
      "localField": "batchId",
      "foreignField": "_id",
      "as": "batch"
    }
  },
  {
    $addFields: {
      courseId: {
        $toObjectId: "$courseId"
      }
    }
  },
  {
    "$lookup": {
      "from": "collegecourses",
      "localField": "courseId",
      "foreignField": "_id",
      "as": "course"
    }
  },
  {
    $addFields: {
      departmentId: {
        $toObjectId: "$departmentId"
      }
    }
  },
  {
    "$lookup": {
      "from": "collegedepartments",
      "localField": "departmentId",
      "foreignField": "_id",
      "as": "department"
    }
  },


  {
    $addFields: {
      semesterId: {
        $toObjectId: "$semesterId"
      }
    }
  },
  {
    "$lookup": {
      "from": "semesterNew",
      "localField": "semesterId",
      "foreignField": "_id",
      "as": "semester"
    }
  },



  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$batch", 0]
        }, "$$ROOT"]
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$course", 0]
        }, "$$ROOT"]
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$department", 0]
        }, "$$ROOT"]
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$semester", 0]
        }, "$$ROOT"]
      }
    }
  },

  {
    $project: {
      semester: 0,
      batch: 0,
      department: 0,
      course: 0
    }
  }

  ]).then(function (data) {
    res.json({
      status: 200,
      data: data
    })
  })
})

router.get('/getTeacherCourse', function (req, res) {
  var view_data = [];
  teacherModel.aggregate([{
    $match: {
      teacher_id: req.query.user_id
    }
  },
  {
    $addFields: {
      course: {
        $toObjectId: "$course_id"
      }

    }
  },
  {
    $lookup: {
      from: "collegecourses",
      localField: "course",
      foreignField: "_id",
      as: "courses"
    }
  },
  {
    $lookup: {
      from: "newtimetables",
      let: {
        courseId: "$course_id",
        userId: "$teacher_id",
        start: req.query.start,
        end: req.query.end
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$course_id", "$$courseId"],
            },
            {
              $eq: ["$teacher_id", "$$userId"],
            },
            {
              $gte: ["$date", "$$start"],
            },
            {
              $lte: ["$date", "$$end"],
            }
            ]
          }
        }
      }],
      as: "timeTable"
    }
  },
  {
    $project: {
      "courses": "$courses",
      "total": {
        "$size": "$timeTable"
      },
    }
  }
  ]).then(function (courses) {
    if (courses) {
      courses.forEach(function (course) {
        view_data.push({
          courseName: course.courses[0].courseName,
          course_id: course.courses[0]._id,
          count: course.total,
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 400,
        message: 'bad request'
      });
    }
  })

});

router.get('/getStudentsByCourse', function (req, res) {
  var students = [];
  studentBatchModel.find({
    courseId: req.query.course_id
  }).populate('studentId', ['fullName', 'email']).then(function (studentBatch) {
    if (studentBatch != undefined || studentBatch != null || studentBatch != '') {
      studentBatch.forEach(element => {
        students.push({
          student: element.studentId,
          divisionId: element.divisionId
        })
      })

      res.json({
        status: 200,
        data: students
      })
    } else {
      res.json({
        status: 400,
        message: "No student's found..."
      })
    }
  })
})

router.get('/getSemesterByCourse', (req, res) => {
  var Semesters = [];
  batchSemesterMasterModel.find({
    courseId: req.query.course_id
  }).populate('semesterId', ['semesterName', 'semesterStatus', 'semYear']).then(function (semesterStatus) {
    if (semesterStatus != null || semesterStatus == true) {
      semesterStatus.forEach(element => {
        Semesters.push({
          semesterId: element.semesterId,
          semesterName: element.semesterName,
          semYear: element.semYear
        })
      })
      res.json({
        status: 200,
        data: Semesters
      })
    } else {
      res.json({
        status: 400,
        message: "No Sems found..."
      })
    }
  })
})

router.get('/getPdfTrackingData/:chapterId', function (req, res) {
  uploads.find({
    lessonId: req.params.chapterId
  }).then(function (data) {
    setTimeout(() => {
      res.json({
        status: 200,
        data: data
      })
    }, 100);
  });
})

router.get('/getUsersByPDFs/:doc_id', function (req, res) {
  PdfTracking.find({
    doc_id: req.params.doc_id,
  }).populate('user_id', ['fullName']).then(function (data) {
    setTimeout(() => {
      res.json({
        status: 200,
        data: data
      })
    }, 100);
  });
})


router.post('/saveCohort', (req, res) => {
  saveCohort(req.body)
  let data = req.body
  let {
    cohortName,
    cohortData
  } = data
  let batchesData = {}
  cohortData.map((val) => {
    batchesData.batchId = val.batchId
    batchesData.departmentId = val.departmentId
    batchesData.courseId = val.courseId
    batchesData.batchName = val.batchName
    batchesData.courseName = val.courseName
    batchesData.yearName = val.yearName
    batchesData.departmentName = val.departmentName
  })

  let batchesArr = cohortData.map(
    (val) => `${val.batchId} ${val.courseId} ${val.batchName} ${val.courseName} ${val.yearName}`
  )
  let batchesId = cohortData.map(
    (val) => `${val.batchId}`
  )

  let batchIds = batchesArr.map(val => val.split(" ")[0])
  let courseIds = batchesArr.map(val => val.split(" ")[1])

  let batchesArrView = cohortData.map(
    (val) => ` ${val.batchName} ${val.courseName} ${val.yearName}`
  )
  try {
    let newCohort = new cohortModel({
      cohortName,
      batchesData,
      batchesArr,
      batchesArrView,
      batchesId
    })
    newCohort.save()
    res.status(200).json({
      status: 'Save cohort is wokring!!',
      cohortName,
      batchesData,
      batchesArr,
      batchesArrView,
      batchesId
    })
  } catch (error) {
    res.status(500).json({
      status: 'Cannot save cohort',
      message: error.message,
    })
  }
})
async function saveCohort(body) {
  let data = body
  let { cohortName, cohortData } = data
  let batchesData = {}
  cohortData.map(async (val) => {
    var batch = await getId.getBatchId(val.batchId, '')
    var course = await getId.getCourseId(val.courseId, '')
    var department = await getId.getDepartmentId(val.departmentId, '');
    batchesData.batchId = batch.id
    batchesData.departmentId = department.id
    batchesData.courseId = course.id
    batchesData.batchName = val.batchName
    batchesData.courseName = val.courseName
    batchesData.yearName = val.yearName
    batchesData.departmentName = val.departmentName
  })
  var Batch = await getId.getBatchId(val.batchId, '')
  var Course = await getId.getCourseId(val.courseId, '')
  val.batchId = Batch.id
  val.courseId = Course.id
  let batchesArr = cohortData.map(
    (val) => `${batch.id} ${course.id} ${val.batchName} ${val.courseName} ${val.yearName}` 
  )
  let batchesId = cohortData.map(
    (val) => `${batch.id}`
  )

  let batchesArrView = cohortData.map(
    (val) => ` ${val.batchName} ${val.courseName} ${val.yearName}`
  )
  try {
    let newCohort = new cohortModel({
      cohortName,
      batchesData,
      batchesArr,
      batchesArrView,
      batchesId
    })
    newCohort.save()
    res.status(200).json({
      status: 'Save cohort is wokring!!',
      cohortName,
      batchesData,
      batchesArr,
      batchesArrView,
      batchesId
    })
  } catch (error) {
    // res.status(500).json({
    //   status: 'Cannot save cohort',
    //   message: error.message,
    // })

  }
  var batchmaster = [];
  var coursemas = [];
  var alldata = []
  models.batchmasters.getCourse().then(function (Id) {
    Id.forEach(element => {
      batchmaster.push(
        element.id,
      ),
        coursemas.push(
          element.id,
          element.courseId,
          element.batchName,
        ),
        alldata.push(
          element.courseName,
          element.year
        )
    })
    var batchesArr1 = coursemas
    models.cohort.create({
      batchesId: batchmaster,
      cohortName: body.cohortName,
      batchesArr: batchesArr1,
      batchesArrView: alldata,
    }).then(function (result) {
      if (result) {
        console.log("data save successfully", result)
        // res.json({
        //   status: 200,
        //   data: result
        // })
      }
    })
  })

}


router.get('/getCohorts', function (req, res) {
  cohortModel.find({}).exec(function (err, cohort) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request',
      })
    } else {
      res.json({
        status: 200,
        data: cohort,
      })
    }
  })
})

router.delete('/deleteCohort', async (req, res) => {
  try {
    const divisionId = {
      _id: req.query.cohortId
    }
    let msg_obj = {
      msg: '',
      status: 0
    }

    const cohortInCohortTeacher = await cohortTeacherModel.find({
      divisionId: req.query.cohortId
    })

    if (!cohortInCohortTeacher.length) {
      msg_obj.msg = 'Cohort Successfully Deleted!!'
      msg_obj.status = 200
      await cohortModel.findByIdAndDelete(divisionId)
    } else {
      msg_obj.msg = 'Please delete allocate teacher associated with this cohort first!!'
      msg_obj.status = 409
    }
    res.json({
      message: msg_obj.msg,
      status: msg_obj.status
    })

  } catch (err) {
    res.json({
      message: err.message,
      cohortInCohortTeacher,
      status: 400
    })
  }
})

router.get('/getCohortBatchSubject', function (req, res) {
  var course_subjects = []
  cohortModel.find({
    _id: req.query.cohortId,
  }).exec(function (err, cohort) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request',
      })
    } else if (cohort != '' || cohort != null || cohort != 'undefined' || cohort != undefined) {
      cohort.forEach(function (cohorts) {
        if (cohorts != '') {
          var batches = cohorts.batchesArr;
          for (var i = 0; i < batches.length; i++) {
            var courseid = batches[i].split(" ")[1];
            subjectModel.find({
              courseId: courseid,
            }).exec(function (err, course) {
              if (course != '') {
                course.forEach(function (courses) {
                  var sub1 = courses.subject;
                  var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                  var sub = sub2.replace(/^"(.*)"$/, '$1');
                  var strs = sub.split('","');
                  strs.forEach(function (courseSubject) {
                    course_subjects.push(courseSubject);
                  });
                });
              }
            });
          }
        }
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: course_subjects
        })
      }, 1000);

    }
  })
});

router.post('/addCohortTeacherData', function (req, res) {
  addCohortTeacherData(req.body)
  var teacherData = new cohortTeacherModel({
    cohortId: req.body.cohortId,
    teacher_id: req.body.teacherId,
    subject: req.body.subject,
    semesterId: req.body.semesterId,
  });
  teacherData.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: result
      })
    }

  });

})
async function addCohortTeacherData(body) {
  var subject = await getId.getSubjectId(body.subject)//remaining
  var semester = await getId.getSemesterId(body.semester_id, '');
  var user = await getId.getUserId(body.teacherId, '')
  var cohort = await getId.getCohortId(body.cohortId, '')
await  models.cohortteacher.create({
    cohortId: cohort.id,
    teacherId: user.id,
    subjectId: subject.id,
    semesterId: semester.id,
  }).then(teacher => {
    console.log("teacher", teacher)
  })
}
router.get('/getCohortTeacherData', function (req, res) {
  var view_data = [];
  cohortTeacherModel.find({})
    .populate('cohortId', ['cohortName'])
    .populate('semesterId', ['semesterName']).populate('teacher_id', ['fullName', 'email']).sort({
      "createdOn": -1
    }).exec(function (err, teacher) {

      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else if (teacher != '') {
        teacher.forEach(function (teacherData) {
          view_data.push({
            _id: teacherData._id,
            cohortName: teacherData.cohortId.cohortName,
            cohortId: teacherData.cohortId._id,
            teacherName: teacherData.teacher_id.fullName,
            teacherEmail: teacherData.teacher_id.email,
            teacher_id: teacherData.teacher_id._id,
            subject: teacherData.subject,
            semesterName: teacherData.semesterId.semesterName,
            semesterId: teacherData.semesterId._id
          })

        });
        res.json({
          status: 200,
          data: view_data
        })
      } else if (teacher == '') {
        res.json({
          message: 'There are No Allocate Teacher Please Allocate Teacher For Cohort!!....'
        })
      }

    });

});

router.put('/updateCohortTeacherData', function (req, res) {
  updateCohortTeacherData(req.body)
  var query = {
    _id: req.body.previousTeacherId,
  },
    update = {
      $set: {
        teacher_id: req.body.teacherId,
        cohortId: req.body.cohortId,
        semesterId: req.body.semesterId,
        subject: req.body.subject,
      }
    };
  cohortTeacherModel.updateMany(query, update, function (err, result) {
    if (err) {
      res.send({
        status: 500
      })
    } else {
      res.send({
        status: 200
      });
    }
  })
});
async function updateCohortTeacherData(body) {
  cohortTeacherModel.find({
    _id: body.previousTeacherId
  }).then(async cohort => {
    var subject = await getId.getSubjectId(cohort.subject)//remaining
    var semester = await getId.getSemesterId(cohort.semesterId, '');
    var user = await getId.getUserId(cohort.teacher_id, '')
    var Cohort = await getId.getCohortId(cohort.cohortId, '')
  await  models.cohortteacher.find({
      where: {
        cohortId: Cohort.id,
        teacherId: user.id,
        subjectId: subject.id,
        semesterId: semester.id,
      }
    }).then(async data => {
      if(data){
        var Subject = await getId.getSubjectId(body.subject)//remaining
        var Semester = await getId.getSemesterId(body.semesterId, '');
        var User = await getId.getUserId(body.teacherId, '')
        var CohortId = await getId.getCohortId(body.cohortId, '')
     await   data.update({
          cohortId: CohortId.id,
          teacherId: User.id,
          subjectId: Subject.id,
          semesterId: Semester.id,
        }).then(updatedTeacher => {
          console.log("updatedTeacher", updatedTeacher)
        })
      }
    
    })
  })

}

router.delete('/cohortTeachers', async (req, res) => {
  try {
    const cohortTeacherId = {
      _id: req.query.cohortTeacherId
    }
    let msg_obj = {
      msg: '',
      status: 0
    }

    const teachersInCohortTT = await cohortTimeTableModel.find({
      cohortTeacherId: req.query.cohortTeacherId
    })

    if (!teachersInCohortTT.length) {
      msg_obj.msg = 'Allocation Successfully Deleted!!'
      msg_obj.status = 200
      await cohortTeacherModel.findByIdAndDelete(cohortTeacherId)
    } else {
      msg_obj.msg = 'Please delete cohort timeTable associated with this teacher first!!'
      msg_obj.status = 409
    }
    res.json({
      message: msg_obj.msg,
      status: msg_obj.status
    })

  } catch (err) {
    res.json({
      message: err.message,
      teachersInCohortTT,
      status: 400
    })
  }
})

router.post('/allowAccessMenuToSubAdmin', function (req, res) {
  allowAccessMenuToSubAdmin(req.body)
  allowAccessToSubAdminModel.find({
    user_id: req.body.id
  }).then(function (user) {
    if (user != '') {
      var query = {
        user_id: req.body.id
      },
        update = {
          $set: {
            access: req.body.data
          }
        };

      allowAccessToSubAdminModel.findOneAndUpdate(query, update, function (err, result) {
        if (err) {
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: result
          })
        }
      });



    } else {
      var AllowAccessToSubAdmin = new allowAccessToSubAdminModel({
        user_id: req.body.id,
        access: req.body.data
      });
      AllowAccessToSubAdmin.save(function (err, result) {
        if (err) {
          console.error(err);
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: result
          })
        }
      });
    }
  })

})
async function allowAccessMenuToSubAdmin(body) {
  console.log("body",body)
  var user = await getId.getUserId(body.id, '')
  models.allowacesstosubadmin.find({
    where: {
      id: user.id
    }
  }).then(async user => {
    if (user != null) {
      models.allowacesstosubadmin.find({
        where: {
          id: user.id
        }
      }).then(userdata => {
        if(userdata){
          userdata.update({
            access: body.data
          })
        }
       
      })

    } else {
  var user = await getId.getUserId(body.id, '')
      models.allowacesstosubadmin.create({
        userId: user.id,
        access: body.data
      }).then(access => {
        console.log("access")
      })
    }
  })
}
router.get('/getsubAdminData', function (req, res) {
  allowAccessToSubAdminModel.find({
    user_id: req.query.id
  }).select('access').then(function (user) {
    if (user) {
      res.json({
        status: 200,
        data: user
      })
    } else {
      res.json({
        status: 400,
        message: 'no data'
      })
    }
  })
});


router.get('/getDivisionBatchWise', function (req, res) {
  newDivisionModel.find({
    batchId: req.query.batchId
  }).exec(function (err, division) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: division
      });
    }

  });

});

router.get('/getWorkshopDepartment', function (req, res) {
  var view_data = [];
  studentBatchModel.find({
    studentId: req.query.id
  }).then(function (users) {
    if (users) {
      users.forEach(function (user) {
        view_data.push({
          departmentId: user.departmentId
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 400,
        message: 'no data'
      })
    }
  })
});

router.post("/markToCompleteSubject", function (req, res) {
  markToCompleteSubject(req)
  chapterModel.findOne({
    _id: req.body.id,
  })
    .then(function (user) {
      if (user != "") {
        var query = {
          _id: req.body.id,
        },
          update = {
            $set: {
              completed: req.body.value,
            },
          };
        chapterModel.findOneAndUpdate(query, update, function (req, updateuser) {
          res.json({
            status: 200,
            data: updateuser,
          });
        });
      } else {
        res.json({
          status: 400,
        });
      }
    });
});
async function markToCompleteSubject(req) {
  var chapter = await getId.getChapterId(req.body.id, '')
  models.chapters.find({
    where: {
      id: chapter.id
    }
  }).then(chapters => {
    if(chapters){
      chapters.update({
        completed: req.body.value
      }).then(cpm => {
        console.log("completed")
      })
    } 
  })
}
router.get('/SemesterData', function (req, res) {
  semesterNewModel.find({
    courseId: req.query.courseId
  }).populate('courseId', ['courseName']).exec(function (err, semesterData) {
    var view_data = [];
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (semesterData != '') {
      semesterData.forEach(function (semesters) {
        view_data.push({
          semesterId: semesters._id,
          semesterName: semesters.semesterName,
          semester_start_date: semesters.semester_start_date,
          semester_end_date: semesters.semester_end_date,
          courseName: semesters.courseId.courseName,
          semyear: semesters.semYear
        });
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else if (semesterData == '') {
      res.json({
        message: "There are no add semester please add semester!!!...."
      })
    }

  });
});


router.get('/getSemestername', function (req, res) {
  collegeCourseModel.find({
    courseName: req.query.title
  }).exec(function (err, course) {
    semesterNewModel.find({
      courseId: course[0]._id
    })
      .sort({
        'createdOn': -1
      }).then(function (semesterData) {
        if (semesterData) {
          res.json({
            status: 200,
            data: semesterData
          })
        } else {
          res.json({
            status: 400,
            message: 'no data'
          })
        }
      })
  })
})


router.get('/getBatchData1', function (req, res) {
  batchMasterModel.find({
    courseId: req.query.courseid
  }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({
    "createdOn": 1
  }).exec(function (err, batchData) {
    var view_data = [];
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {

      batchData.forEach(function (batches) {
        if (batches != '') {
          view_data.push({
            batchId: batches._id,
            batchName: batches.batchName,
            courseName: batches.courseId.courseName,
            departmentName: batches.departmentId.departmentName,
            courseId: batches.courseId._id,
            departmentId: batches.departmentId._id,
            yearName: batches.year,
            batchStatus: batches.batchStatus
          });

        }

      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })

      }, 500)

    }

  });
});
router.get('/getAllClassData1', function (req, res) {
  var view_data = [];
  newDivisionModel.find({
    courseId: req.query.courseid
  }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).populate('semesterId', ['semesterName']).then(function (classes) {
    if (classes != '') {
      classes.forEach(function (data) {
        view_data.push({
          divisionName: data.name,
          divisionId: data._id,
          batchId: data.batchId._id ? data.batchId._id : 'NA',
          courseId: data.courseId._id ? data.courseId._id : 'NA',
          batchName: data.batchId.batchName ? data.batchId.batchName : 'NA',
          batchYear: data.batchId.year ? data.batchId.year : 'NA',
          courseName: data.courseId.courseName ? data.courseId.courseName : 'NA',
          semesterId: data.semesterId._id ? data.semesterId._id : 'NA',
          semesterName: data.semesterId.semesterName ? data.semesterId.semesterName : 'NA'


        })


      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 500)

    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    }
  });
});

router.get('/getTeacherWiseCourse', function (req, res) {
  var view_data = [];
  teacherModel.find({
    teacher_id: req.query.user_id
  }).populate('course_id', ['courseName']).populate('semesterId', ['semesterName']).populate('batch_id').then(function (data) {
    if (data != '') {
      data.forEach(function (data) {
        view_data.push({
          courseId: data.course_id._id ? data.course_id._id : 'NA',
          courseName: data.course_id.courseName ? data.course_id.courseName : 'NA',
          semesterId: data.semesterId._id ? data.semesterId._id : 'NA',
          semesterName: data.semesterId.semesterName ? data.semesterId.semesterName : 'NA',
          subject: data.subject ? data.subject : 'NA',
          batchId: data.batch_id._id ? data.batch_id._id : 'NA',
          batchName: data.batch_id.batchName ? data.batch_id.batchName : 'NA',
          batchYear: data.batch_id.year ? data.batch_id.year : 'NA',
        })


      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 500)

    } else {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    }
  });

});

router.get('/getstudentWiseSemester', function (req, res) {
  var view_data = []
  collegeCourseModel.find({
    courseName: req.query.title
  }).then(async course => {
    await studentBatchModel.find({
      studentId: req.query.userId
    }).then(async batch => {
      batch.forEach(async data => {
        await batchSemesterMasterModel.find({
          batchId: data.batchId,
          courseId: course[0]._id
        }).then(semester => {
          semester.forEach(async elm => {
            await semesterNewModel.find({
              _id: elm.semesterId
            }).then(data => {
              data.forEach(async element => {
                await view_data.push({
                  semesterId: element._id,
                  semesterName: element.semesterName,
                })
              })
            })
          })

        })
      })

    })
    setTimeout(() => {
      res.json({
        status: 200,
        data: view_data
      })
    }, 5000);

  })

})

router.get('/getCurrentBatchStudent', (req, res) => {
  console.log("req.query", req.query)
  var view_data = []
  studentBatchModel.find({
    batchId: req.query.batchId,
    departmentId: req.query.departmentId,
    courseId: req.query.courseId
  }).populate('studentId', ['fullName', 'email']).then(students => {
    students.forEach(elm => {
      view_data.push({
        studentName: elm.studentId.fullName,
        studentEmail: elm.studentId.email,
        studentId: elm.studentId._id,
        batchId: elm.batchId,
        departmentId: elm.departmentId,
        courseId: elm.courseId

      })
    })
    setTimeout(() => {
      res.json({
        status: 200,
        data: view_data
      })
    }, 2000);

  })
})
router.get('/BatchStudents', (req, res) => {
  var students = [];
  studentBatchModel.find({
    batchId: req.query.batchId,
    courseId: req.query.courseId
  }).populate('studentId', ['fullName', 'email', 'role']).then(function (studentBatch) {
    if (studentBatch != undefined || studentBatch != null || studentBatch != '') {
      studentBatch.forEach(element => {
        students.push({
          userId: element.studentId._id,
          name: element.studentId.fullName,
          email: element.studentId.email,
          role: element.studentId.role
        })
      })

      res.json({
        status: 200,
        data: students
      })
    } else {
      res.json({
        status: 400,
        message: "No student's found..."
      })
    }
  })
})


router.get('/batchTeachers', (req, res) => {
  var teachers = [];
  teacherModel.find({
    batch_id: req.query.batchId,
    course_id: req.query.courseId,
    semesterId: req.query.semesterId
  }).populate('teacher_id', ['fullName', 'email', 'role']).then(function (teachersList) {
    if (teachersList != undefined || teachersList != null || teachersList != '') {
      teachersList.forEach(element => {
        teachers.push({
          userId: element.teacher_id._id,
          name: element.teacher_id.fullName,
          email: element.teacher_id.email,
          role: element.teacher_id.role
        })
      })
      res.json({
        status: 200,
        data: teachers
      })
    } else {
      res.json({
        status: 400,
        message: "No student's found..."
      })
    }
  })
})

router.get('/getUnallocatedStudent', (req, res) => {
  var view_data = []
  userModel.aggregate(
    [{
      $match: {
        courseName: req.query.courseName,
        departmentName: req.query.departmentName,
        academicYear: req.query.yearName
      },

    }])
    .exec(function (err, data) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        if (data != '') {
          data.forEach(function (users) {
            studentBatchModel.find({
              studentId: users._id,
            }).then(function (studentData) {
              if (studentData.length > 0) {

              } else {
                view_data.push({
                  studentId: users._id,
                  studentName: users.fullName,
                  studentEmail: users.email
                });

              }
            })

          });
          setTimeout(function () {
            res.json({
              status: 200,
              data: view_data
            })
          }, 3500);

        }
      }
    });
})
router.get('/batchWiseSemesterData', function (req, res) {
  batchSemesterMasterModel.find({
    batchId: req.query.batchId
  }).populate('batchId').populate('semesterId').then(function (data) {
    var view_data = [];
    data.forEach(function (semesters) {
      view_data.push({
        semesterId: semesters.semesterId._id,
        semesterName: semesters.semesterId.semesterName,
        semester_start_date: semesters.semesterId.semester_start_date,
        semester_end_date: semesters.semesterId.semester_end_date,
        courseName: semesters.semesterId.courseId.courseName,
        semyear: semesters.semesterId.semYear
      });
    })
    res.json({
      status: 200,
      data: view_data
    })

  })

});


router.post('/addPlacement', (req, res) => {
  addPlacement(req.body)
  var url = 'pages/placement'
  var date = moment(new Date()).format('YYYY-MM-DD');
  if (req.body._id != null) {
    PlacementModel.findByIdAndUpdate(req.body._id, {
      placementName: req.body.placementName,
      batchId: req.body.batchId,
      category: req.body.category,
      courseId: req.body.courseId,
      textPlacement: req.body.textPlacement,
      type: req.body.type,
      date: date,
      setImp: req.body.setImp,
      videoName: req.body.videoName,
      videoId: req.body.videoId,
    },
      function (err, enrollment) {
        if (err) {
          res.json({
            status: 400,
          })
        }
        if (enrollment) {
          res.json({
            status: 200,
            data: enrollment
          })
        }
      });
  } else {
    var placementData = new PlacementModel({
      placementName: req.body.placementName,
      batchId: req.body.batchId,
      category: req.body.category,
      courseId: req.body.courseId,
      textPlacement: req.body.textPlacement,
      type: req.body.type,
      date: date,
      setImp: req.body.setImp,
      videoName: req.body.videoName,
      videoId: req.body.videoId,
    });
    var query_params = "placementId:" + placementData._id + ",placementName:" + req.body.placementName + ",type:" + req.body.type + ",placement:" + req.body.textPlacement;
    placementData.save(function (err, result) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message: 'Bad Request'
        })
      } else {
        if (req.body.category == '' && req.body.setImp == true || req.body.category == '' && req.body.setImp == false) {
          studentBatchModel.find({
            batchId: req.body.batchId
          }).then(function (student) {
            student.forEach(function (studentData) {
              var action = "Admin Added Placements";
              var notification_data = "Added new Placements : " + req.body.placementName;
              notification_function.notification(action, notification_data, studentData.studentId, url, query_params);
            });

          })
        }
        if (req.body.category == 'All' && req.body.setImp == true || req.body.category == 'All' && req.body.setImp == false) {
          studentBatchModel.find({}).then(function (student) {
            student.forEach(function (studentData) {
              var action = "Admin Added Placements";
              var notification_data = "Added new Placements : " + req.body.placementName;
              notification_function.notification(action, notification_data, studentData.studentId, url, query_params);
            });
          })
        }
        res.json({
          status: 200,
          data: result
        })
      }
    })
  }

})
async function addPlacement(body) {
  var url = 'pages/placement'
  var date = moment(new Date()).format('YYYY-MM-DD');
  if (body._id) {
    var batch = await getId.getBatchId(body.batchId, '')
    var course = await getId.getCourseId(body.courseId, '')
    PlacementModel.find({
      _id: body._id
    }).then(placement => {
      if (placement) {
        models.placements.find({
          where: {
            placementName: placement[0].placementName,
            date: placement[0].date,
          }
        }).then(place => {
          if(place){
            place.update({
              placementName: body.placementName,
              batchId: batch.id,
              category: body.category,
              courseId: course.id,
              textPlacement: body.textPlacement,
              type: body.type,
              date: date,
              setImp: body.setImp,
              videoName: body.videoName,
              videoId: body.videoId,
            }).then(update => {
              console.log("update", update)
            })
          }
          


        })
      }

    })
  } else {
    if(body.batchId == '' && body.courseId == ''){
      models.placements.create({
        placementName: body.placementName,
        batchId: null,
        category: body.category,
        courseId: null,
        textPlacement: body.textPlacement,
        type: body.type,
        date: date,
        setImp: body.setImp,
        videoName: body.videoName,
        videoId: body.videoId,
      }).then(placement => {
        console.log("placement")
      })
    }else if (body.batchId == '' && body.courseId != '' ) {
      var course = await getId.getCourseId(body.courseId, '')

      models.placements.create({
        placementName: body.placementName,
        batchId: null,
        category: body.category,
        courseId: course.id,
        textPlacement: body.textPlacement,
        type: body.type,
        date: date,
        setImp: body.setImp,
        videoName: body.videoName,
        videoId: body.videoId,
      }).then(placement => {
        console.log("placement")
      })
    } else {
      var batch = await getId.getBatchId(body.batchId, '')
      var course = await getId.getCourseId(body.courseId, '')
      models.placements.create({
        placementName: body.placementName,
        batchId: batch.id,
        category: body.category,
        courseId: course.id,
        textPlacement: body.textPlacement,
        type: body.type,
        date: date,
        setImp: body.setImp,
        videoName: body.videoName,
        videoId: body.videoId,
      }).then(placement => {
        console.log("placement")
      })
      if (body.category == '' && body.setImp == true || body.category == '' && body.setImp == false) {
        models.studentbatches.find({
          batchId: batch.id
        }).then(function (student) {
          student.forEach(async function (studentData) {
            var user = await getId.getUserId(studentData.studentId, '')
            var action = "Admin Added Placements";
            var notification_data = "Added new Placements : " + body.placementName;
            notification_function.notification(action, notification_data, user.id, url, query_params);
          });

        })
      }
      if (body.category == 'All' && body.setImp == true || body.category == 'All' && body.setImp == false) {
        models.studentbatches.find({}).then(function (student) {
          student.forEach(async function (studentData) {
            var user = await getId.getUserId(studentData.studentId, '')
            var action = "Admin Added Placements";
            var notification_data = "Added new Placements : " + req.body.placementName;
            notification_function.notification(action, notification_data, user.id, url, query_params);
          });
        })
      }
    }

  }
}
router.get('/getPlacement', (req, res) => {
  var view_data = [];
  PlacementModel.find({
    category: 'All',
    batchId: {
      $ne: 'All'
    }
  }).exec(function (err, place) {
    if (err) {
      console.error(err)
    } else {
      if (place != '') {
        place.forEach(function (placeData) {
          view_data.push({
            _id: placeData._id,
            placementName: placeData.placementName,
            batchName: 'All',
            courseName: 'All',
            type: placeData.type,
            textPlacement: placeData.textPlacement,
            date: placeData.date,
            setImp: placeData.setImp,
            videoName: placeData.videoName,
            videoId: placeData.videoId
          })
        })
      }
      PlacementModel.aggregate([{
        $match: {
          category: {
            $ne: "All"
          }
        }
      },
      {
        $addFields: {
          course: {
            $toObjectId: "$courseId"
          },

        }
      },
      {
        $lookup: {
          from: "collegecourses",
          localField: "course",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$courses", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        $addFields: {
          batch: {
            $toObjectId: "$batchId"
          },

        }
      },
      {
        $lookup: {
          from: "batchmasters",
          localField: "batch",
          foreignField: "_id",
          as: "batches"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$batches", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        $project: {
          courses: 0,
          batches: 0,

        }
      }
      ]).then(function (allnotice) {
        if (allnotice) {
          allnotice.forEach(function (noticebatchData) {
            view_data.push({
              _id: noticebatchData._id,
              placementName: noticebatchData.placementName,
              videoName: noticebatchData.videoName,
              videoId: noticebatchData.videoId,
              batchName: noticebatchData.batchName,
              batchId: noticebatchData.batchId,
              date: noticebatchData.date,
              courseId: noticebatchData.courseId,
              courseName: noticebatchData.courseName,
              type: noticebatchData.type,
              textPlacement: noticebatchData.textPlacement,
              setImp: noticebatchData.setImp
            })
          })
        }
      });
      PlacementModel.aggregate([{
        $match: {
          category: {
            $eq: "All"
          },
          batchId: {
            $eq: "All"
          }
        }
      },
      {
        $addFields: {
          course: {
            $toObjectId: "$courseId"
          },

        }
      },
      {
        $lookup: {
          from: "collegecourses",
          localField: "course",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$courses", 0]
            }, "$$ROOT"]
          }
        }
      },

      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$batches", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        $project: {
          courses: 0,
        }
      }
      ]).then(function (allnotice) {
        if (allnotice) {
          allnotice.forEach(function (noticebatchData) {
            view_data.push({
              _id: noticebatchData._id,
              placementName: noticebatchData.placementName,
              batchName: "All",
              batchId: noticebatchData.batchId,
              videoId: noticebatchData.videoId,
              videoName: noticebatchData.videoName,
              date: noticebatchData.date,
              courseId: noticebatchData.courseId,
              courseName: noticebatchData.courseName,
              type: noticebatchData.type,
              textPlacement: noticebatchData.textPlacement,
              setImp: noticebatchData.setImp,
            })
          })
        }
      });

    }
    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      });
    }, 2000)
  });
})

router.get('/getPlacementFile', function (req, res) {
  var view_data = [];
  placementUploadModel.find({
    placementId: req.query._id
  }).then(function (Files) {
    if (Files.length > 0) {
      Files.forEach(function (File) {
        view_data.push({
          placementUploadId: File._id,
          placementId: File.placementId,
          docId: File.docId,
          type: File.type,
          file_name: File.name
        });
      })
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 400,
        message: 'No file uploaded!!!..'
      });
    }
  })

});

router.get('/getPlacements', (req, res) => {
  var view_data = [];
  if (req.query.type == 'file') {
    PlacementModel.find({
      _id: req.query.placementId,
    }).then(function (files) {
      files.forEach(File => {
        placementUploadModel.find({
          placementId: File._id
        }).then(async function (file) {
          await file.forEach(async data => {
            await view_data.push({
              docId: data.docId,
              placementName: File.placementName,
              textPlacement: File.textPlacement,
              type: File.type,
              placementId: data.placementId,
              file_name: data.name
            })
          })
          res.json({
            status: 200,
            data: view_data
          })
        })
      })

    })

  } else if (req.query.type == 'video') {
    PlacementModel.find({
      _id: req.query.placementId,
    }).then(function (videos) {
      videos.forEach(video => {
        view_data.push({
          videoName: video.videoName,
          videoId: video.videoId,
          placementName: video.placementName,
          textPlacement: video.textPlacement,
          type: video.type
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    })
  } else if (req.query.type == 'filevideo') {
    PlacementModel.find({
      _id: req.query.placementId,
    }).then(function (videos) {
      videos.forEach(video => {
        placementUploadModel.find({
          placementId: req.query.placementId
        }).then(files => {
          files.forEach(file => {
            view_data.push({
              videoName: video.videoName,
              videoId: video.videoId,
              placementName: video.placementName,
              textPlacement: video.textPlacement,
              type: video.type,
              docId: file.docId,
              file_name: file.name
            })
          })
          res.json({
            status: 200,
            data: view_data
          })
        })
      })
    })

  } else if (req.query.type == 'text') {
    PlacementModel.find({
      _id: req.query.placementId,
    }).then(function (texts) {
      texts.forEach(text => {
        view_data.push({
          placementName: text.placementName,
          textPlacement: text.textPlacement,
          type: text.type
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    })

  }

})



router.get('/getAllPlacementDataStudentWise', (req, res) => {
  var view_data = [];
  PlacementModel.find({
    batchId: req.query.batchId,
    courseId: req.query.courseId
  }).then(function (places) {
    if (places != '') {
      places.forEach(function (place) {
        view_data.push({
          _id: place._id,
          placementName: place.placementName,
          courseId: place.courseId,
          batchId: place.batchId,
          textPlacement: place.textPlacement,
          type: place.type,
          date: place.date
        })
      })
    }
    PlacementModel.find({
      category: 'All',
      batchId: '',
      courseId: ''
    }).exec(function (err, placees) {
      if (err) {
        console.error(err)
      } else {
        placees.forEach(function (placeData) {
          view_data.push({
            _id: placeData._id,
            placementName: placeData.placementName,
            courseId: placeData.courseId,
            batchId: placeData.batchId,
            textPlacement: placeData.textPlacement,
            type: placeData.type,
            date: placeData.date
          })
        })
      }
    });
    PlacementModel.find({
      batchId: 'All',
      courseId: req.query.courseId
    }).exec(function (err, placees) {
      if (err) {
        console.error(err)
      } else {
        placees.forEach(function (placeData) {
          view_data.push({
            _id: placeData._id,
            placementName: placeData.placementName,
            courseId: placeData.courseId,
            batchId: placeData.batchId,
            textPlacement: placeData.textPlacement,
            type: placeData.type,
            date: placeData.date
          })
        })
      }
    });
    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      });
    }, 1500)
  })


})

router.delete('/deletePlacement', function (req, res) {
  var query = {
    _id: req.query.placementId
  }
  var query1 = {
    placementId: req.query.placementId
  }
  PlacementModel.find({
    _id: req.query.placementId
  }).exec(function (err, deletePlacement) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deletePlacement != '' || deletePlacement != null || deletePlacement != 'undefined' || deletePlacement != undefined) {
      PlacementModel.findOneAndRemove(query).exec(function (err, notice) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          placementUploadModel.find({
            placementId: req.query.placementId
          }).exec(function (err, placementUpload) {
            if (err) {
              return res.status(500).json({
                message: 'Internal Server Error!!!....'
              });
            } else {
              res.json({
                status: 200,
                message: 'Placement Deleted Successfully!!!....'
              });
            }
          })
        }

      });

    }
  });
});

router.delete('/deletePlacementFile', function (req, res) {
  if (req.query.type == 'file') {
    var query = {
      placementId: req.query.placementId,
    }
    placementUploadModel.find({
      placementId: req.query.placementId
    }).exec(function (err, uploadPlacement) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else if (uploadPlacement != '' || uploadPlacement != null || uploadPlacement != 'undefined' || uploadPlacement != undefined) {
        placementUploadModel.findOneAndRemove(query).exec(function (err, batch) {
          if (err) {
            return res.status(500).json({
              message: 'Internal Server Error!!!....'
            });
          } else if (batch) {
            PlacementModel.findByIdAndUpdate(req.query.placementId, {
              $set: {
                type: 'text'
              }
            }).exec(function (err, place) {
              if (err) {
                console.log(err)
              } else {
                res.json({
                  status: 200,
                  data: batch,
                  message: 'File Deleted Successfully!!!....'
                });
              }
            })

          }

        });

      }
    })
  } else if (req.query.type == 'video') {
    var query = {
      placementId: req.query.placementId,
    }
    PlacementModel.find({
      placementId: req.query.placementId
    }).exec((err, places) => {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else if (places != '' || places != null || places != 'undefined' || places != undefined) {
        PlacementModel.findByIdAndUpdate(req.query.placementId, {
          $set: {
            videoName: '',
            videoId: '',
            type: 'text'
          }
        }).exec(function (err, batch) {
          if (err) {
            return res.status(500).json({
              message: 'Internal Server Error!!!....'
            });
          } else {
            res.json({
              status: 200,
              data: batch,
              message: 'File Deleted Successfully!!!....'
            });
          }

        });

      }
    })
  } else if (req.query.type == 'filevideo') {
    var query = {
      placementId: req.query.placementId
    }
    placementUploadModel.find({
      placementId: req.query.placementId
    }).exec(function (err, uploadPlace) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else if (uploadPlace != '' || uploadPlace != null || uploadPlace != 'undefined' || uploadPlace != undefined) {
        placementUploadModel.findOneAndRemove(query).exec(function (err, batch) {
          if (err) {
            return res.status(500).json({
              message: 'Internal Server Error!!!....'
            });
          } else if (batch) {
            PlacementModel.findByIdAndUpdate(req.query.placementId, {
              $set: {
                type: 'video'
              }
            }).exec(function (err, place) {
              if (err) {
                console.log(err)
              } else {
                res.json({
                  status: 200,
                  data: batch,
                  message: 'File Deleted Successfully!!!....'
                });
              }
            })
          }

        });

      }
    })
  }

});

router.get('/getBatchDatawithStudentCount', (req, res) => {
  view_data = []
  batchMasterModel.aggregate([{
    $addFields: {
      batch_id: {
        $toString: "$_id"
      }
    }
  },
  {
    "$lookup": {
      "from": "studentbatches",
      "localField": "batch_id",
      "foreignField": "batchId",
      "as": "batch"
    }
  },
  {
    $addFields: {
      department_id: {
        $toObjectId: "$departmentId"
      }
    }
  },
  {
    "$lookup": {
      "from": "collegedepartments",
      "localField": "department_id",
      "foreignField": "_id",
      "as": "department"
    }
  },
  {
    $addFields: {
      course_id: {
        $toObjectId: "$courseId"
      }
    }
  },
  {
    "$lookup": {
      "from": "collegecourses",
      "localField": "course_id",
      "foreignField": "_id",
      "as": "course"
    }
  },
  {
    $project: {

      '_id': 1,
      'courseId': 1,
      'departmentId': 1,
      'batchName': 1,
      'year': 1,
      'month': 1,
      'department.departmentName': 1,
      'course.courseName': 1,


      "total": {
        "$size": "$batch"
      },
    },
  },

  ]).then(batchData => {
    batchData.forEach(async elm => {
      await view_data.push({
        batchId: elm._id,
        batchName: elm.batchName,
        departmentName: elm.department[0].departmentName,
        courseName: elm.course[0].courseName,
        departmentId: elm.departmentId,
        courseId: elm.courseId,
        total: elm.total,
        yearName: elm.year,
        monthName: elm.month
      })
    })
    console.log(view_data)

    if (view_data) {
      res.json({
        status: 200,
        data: view_data
      })
    } else {
      res.json({
        status: 400,
      })
    }
  })
});


router.get('/getnewspaper', function (req, res) {
  var userData = [];
  newsModel.find({}).then(function (result) {
    result.forEach(result => {
      var user = {
        docid: result.doc_id,
        name: result.name,
        link: result.link,
        picture: `${filelink}/api/usersData/download?document_id=${result.doc_id}`
      }
      userData.push(user);

    })
    res.send({
      status: 200,
      data: userData
    })

  })
});

router.delete('/deletenewspaper', function (req, res) {
  var query = {
    docid: req.query.newspaperdoc_id
  }
  newsModel.findOneAndRemove(query).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error!!!....'
      });
    } else {
      res.json({
        status: 200,
        message: 'Deleted Successfully!!!....'
      });
    }

  });
});


router.post('/addExamUpdate', (req, res) => {
  addExamUpdate(req.body)
  examUpdateModel.create({
    title: req.body.title,
    departmentId: req.body.departmentId,
    courseId: req.body.courseId,
    batchId: req.body.batchId,
    semesterId: req.body.semesterId,
    description: req.body.description,
    studentArray: req.body.studentData

  }).then(data => {
    examUpdateModel.find({
      _id: data._id
    }).populate('semesterId').then(student => {
      student[0].studentArray.forEach(elm => {
        if (req.body.System) {
          var action = " Admin Added Exam Updates";
          var notification_data = "Added Exam Updates : " + student[0].title;
          notification_function.notification(action, notification_data, elm.UserId);
        }
        if (req.body.Email) {
          emailService.ExamUpdateMail(elm.email, student[0].title, elm.name, student[0].description);
        }
      })
    })

    res.json({
      status: 200,
      data: data
    });
  })
})
async function addExamUpdate(body) {
  var student = []
  var department = await getId.getDepartmentId(body.departmentId, '');
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');
  body.studentData.forEach(async elm => {
    var user = await getId.getUserId(elm.userId, '')
    student.push({
      userId: user.id,
      name: elm.name,
      role: elm.role,
      email: elm.email
    })
  })
  models.examupdates.create({
    title: body.title,
    departmentId: department.id,
    courseId: course.id,
    batchId: batch.id,
    semesterId: semester.id,
    description: body.description,
    studentArray: student
  }).then(data => {
    models.examupdates.find({
      where: {
        id: data.id
      }
    }).then(student => {

      student.studentArray.forEach(elm => {
        if (req.body.System) {
          var action = " Admin Added Exam Updates";
          var notification_data = "Added Exam Updates : " + student[0].title;
          notification_function.notification(action, notification_data, elm.userId);
        }
        if (req.body.Email) {
          // emailService.ExamUpdateMail(elm.email, student[0].title, elm.name, student[0].description);
        }
      })

    })
  })

}
router.get('/getExamUpdates', (req, res) => {
  var view_data = []
  examUpdateModel.find({}).populate('semesterId').populate('courseId').populate('batchId')
    .then(data => {
      data.forEach(elm => {
        var count = elm.studentArray.length
        view_data.push({
          _id: elm._id,
          title: elm.title,
          studentArray: elm.studentArray,
          description: elm.description,
          courseId: elm.courseId._id,
          courseName: elm.courseId.courseName,
          batchId: elm.batchId._id,
          batchName: elm.batchId.batchName,
          year: elm.batchId.year,
          semesterId: elm.semesterId._id,
          semesterName: elm.semesterId.semesterName,
          count: elm.studentArray.length,
          type: elm.type,
        })
      })
      if (view_data) {
        res.json({
          status: 200,
          data: view_data
        });
      }
    })
})
router.delete('/deleteExamUpdate', (req, res) => {
  var query = {
    _id: req.query.Id
  }
  examUpdateModel.findOneAndRemove(query).exec(function (err, data) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error!!!....'
      });
    } else {
      res.json({
        status: 200,
        message: 'Deleted Successfully!!!....'
      });
    }

  })
})

router.get('/getExamUpdateStudentSide', (req, res) => {
  examUpdateModel.find({
    courseId: req.query.courseId,
    batchId: req.query.batchId,
    "studentArray.studentId": req.query.userId
  }).populate('semesterId').populate('courseId').populate('batchId').then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      });
    }
  })

})


router.get('/getNewStudent', (req, res) => {
  userModel.find({
    status: 'inactive',
    role: 'student'
  }).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      });
    } else {
      res.json({
        status: 400,
      });
    }
  })
})

router.put('/studentActive', (req, res) => {
  studentActive(req)
  var query = {
    _id: req.body.studentId
  },
    update = {
      $set: {
        status: 'active'
      }
    };
  userModel.findOneAndUpdate(query, update, function (err, user) {
    if (user) {
      const token = cipher.generateResetPasswordToken(user._id);
      emailService.ActiveStudentLms(user.email, user.fullName, token);
      res.json({
        status: 200,
        data: user
      });
    } else {
      res.json({
        status: 400,
      });
    }
  })
})
async function studentActive(req) {
  var user = await getId.getUserId(req.body.studentId, '')
  models.users.find({
    where: {
      id: user.id
    }
  }).then(data => {
    if(data){
      data.update({
        status: 'active'
      }).then(update => {
        if (update) {
          // const token = cipher.generateResetPasswordToken(user._id);
          // emailService.ActiveStudentLms(update.email, update.fullName, token);
        }
      })
    }
   
  })
}

router.get('/getTeacherPaymentHistory', (req, res) => {
  if (req.query.month && req.query.year) {
    facultyPayment.find({
      teacherId: req.query.teacherId,
      month: req.query.month,
      year: req.query.year,
      type: 'pay'
    }).populate('teacherId').then(data => {
      if (data) {
        res.json({
          status: 200,
          data: data
        });
      } else {
        res.json({
          status: 400,
        });
      }
    })
  } else {
    facultyPayment.find({
      teacherId: req.query.teacherId,
      type: 'pay'
    }).populate('teacherId').then(data => {
      if (data) {
        res.json({
          status: 200,
          data: data
        });
      } else {
        res.json({
          status: 400,
        });
      }
    })
  }

})

router.get('/getMonthWisePaymentData', (req, res) => {
  if (req.query.teacherId == '' || req.query.teacherId == null) {
    facultyPayment.find({
      month: req.query.selectedMonth,
      year: req.query.selectedYear,
      type: 'pay'
    }).populate('teacherId').then(data => {
      if (data) {
        res.json({
          status: 200,
          data: data
        });
      } else {
        res.json({
          status: 400,
        });
      }
    })
  } else {
    facultyPayment.find({
      teacherId: req.query.teacherId,
      month: req.query.selectedMonth,
      year: req.query.selectedYear,
      type: 'pay'
    }).populate('teacherId').then(data => {
      if (data) {
        res.json({
          status: 200,
          data: data
        });
      } else {
        res.json({
          status: 400,
        });
      }
    })
  }

})

router.get('/downloadPayPdf', (req, res) => {
  var fileName = req.query.fileName;
  var teacherId = req.query.teacherId
  var currentPath = process.cwd();
  if (req.query.teacherId) {
    var download_new = currentPath + "/src/payment_PDF/" + teacherId + "/" + fileName;
    const downloadData = download_new
    res.download(downloadData)
  }
})

router.get('/getExamfile', function (req, res) {
  var view_data = [];
  examUploadModel.find({
    examId: req.query.examId
  }).then(function (exam) {
    if (exam) {
      res.json({
        status: 200,
        data: exam
      });
    }

  })
});

router.delete('/deleteExamFile', function (req, res) {
  var query = {
    _id: req.query.examUploadId
  };

  examUploadModel.findOneAndRemove(query, function (err, exam) {
    if (err) {
      res.json({
        status: 500,
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200
      })
    }
  });

});


router.get('/getTeacherOnlinedata', (req, res) => {
  NewTimeTableModel.find({
    course_id: req.query.course_id,
    semester_id: req.query.semesterId,
    subject: req.query.subject
  }).then(async data => {
    var teacher = []
    data.forEach(async lecture => {
      await teacher.push({
        teacherName: lecture.teacherName,
        subject: lecture.subject,
        date: lecture.date,
        fromTime: lecture.fromTime,
        toTime: lecture.toTime,
        batch_id: lecture.batch_id,
      })
    })
    res.json({
      status: 200,
      data: data
    })
  })
})

router.get('/getViewStudentAttendance', (req, res) => {

  studentBatchModel.aggregate([
    {
      $match: {
        batchId: req.query.batchId,
      }
    },
    {
      $addFields: {
        stuId: {
          $toObjectId: "$studentId"
        }
      }
    },
    {
      "$lookup": {
        "from": "users",
        "localField": "stuId",
        "foreignField": "_id",
        "as": "student"
      }
    }
  ]).then(async data => {
    res.json({
      status: 200,
      data: data
    })
  })

})

router.get('/getStudentComment', async (req, res) => {
  var view_data = [];
  var semesterName = '';
  var subject = '';
  var date = '';
  semesterNewModel.find({
    _id: req.query.semesterId
  }).then(data => {
    if (data[0].semesterName == "MSc Semester 1") {
      semesterName = "MSc Sem 1"
    } else if (data[0].semesterName == "MSc Semester 2") {
      semesterName = "MSc Sem 2"
    } else if (data[0].semesterName == "MSc Semester 3") {
      semesterName = "MSc Sem 3"
    } else if (data[0].semesterName == "MSc Semester 4") {
      semesterName = "MSc Sem 4"
    } else if (data[0].semesterName == "BSc Semester 1") {
      semesterName = "BSc Sem 1"
    } else if (data[0].semesterName == "BSc Semester 2") {
      semesterName = "BSc Sem 2"
    } else if (data[0].semesterName == "BSc Semester 3") {
      semesterName = "BSc Sem 3"
    } else if (data[0].semesterName == "BSc Semester 4") {
      semesterName = "BSc Sem 4"
    } else if (data[0].semesterName == "BSc Semester 5") {
      semesterName = "BSc Sem 5"
    } else if (data[0].semesterName == "BSc Semester 6") {
      semesterName = "Bsc Sem 6"
    }
    subject = semesterName + ' - ' + req.query.subject
    date = moment(new Date(req.query.date)).format('DD.MM.YY')
    feedbackModel.find({
      Timestamp: {
        $regex: date
      },
      Subject: {
        $regex: subject
      },
      Author: {
        $regex: req.query.fullname
      }
    }).then(data1 => {
      data1.forEach(elm => {
        view_data.push({
          _id: elm._id,
          Rating: elm.Rating.replace(/\D/g, ''),
          Author: elm.Author,
          Comment: elm.Comment ? elm.Comment : ''
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    })
  })
})

module.exports = router;

