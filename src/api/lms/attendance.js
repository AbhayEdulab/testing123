var express = require('express');
var vd = require('sort-objects-array');
var router = express.Router();
var mongoose = require('mongoose');
var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');
var EnrollmentSchema = require('../../app/models/enrollment');
var EnrollmentDetailsSchema = require('../../app/models/enrollmentdetails');
var BatchSchema = require('../../app/models/batch');
var UserSchema = require('../../app/models/user');
var CourseSchema = require('../../app/models/course');
var enrollmentdetailsModel = mongoose.model('EnrollmentDetail');
var batchModel = mongoose.model('Batch');
var userModel = mongoose.model('User');
var courseModel = mongoose.model('Course');
var eventSchema = require('../../app/models/event');
var eventModel = mongoose.model('Event');
var moment = require('moment');
var async = require('async');
var json2xls = require('json2xls');
var fs = require('fs');
var h2p = require('html2plaintext');
require('../../app/models/newtimetable');
var NewTimeTableModel = mongoose.model('NewTimeTable');
var enrollmentDetailModel = mongoose.model('EnrollmentDetail');
var notification_function = require('./../../utils/function');
var topicOfTheDaySchema = require('../../app/models/topicOfTheDay');
var TopicOfTheDayModel = mongoose.model('TopicOfTheDay');
var NewCourseSchema = require('../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
var DivisionSchema = require('../../app/models/division');
var divisionModel = mongoose.model('Division');
require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
require('../../app/models/holidayhistory');
var holidayHistoryModel = mongoose.model('HolidayHistory');
require('../../app/models/studentDivision');
var studentDivisionModel = mongoose.model('StudentDivision');
require('../../app/models/multitimetable')
var multiTimeTableModel = mongoose.model('MultiTimeTable')
var StudentBatchSchema = require('../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var emailService = require('../../utils/emailService');
require('../../app/models/chapter')
var chapterModel = mongoose.model('Chapter');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var BatchMasterSchema = require('../../app/models/batchMaster');
const sendNotification = require('../mobile/pushNotification');
var batchMasterModel = mongoose.model('BatchMaster');
require('../../app/models/cohorttimetable')
var cohortTimeTableModel = mongoose.model('CohortTimeTable')
var CohortAttendanceSchema = require("../../app/models/cohortAttendance");
var cohortAttendanceModel = mongoose.model("CohortAttendance");
var cohortTopicOfTheDaySchema = require("../../app/models/cohortTopicOfTheDay");
var cohortTopicOfTheDayModel = mongoose.model("CohortTopicOfTheDay");
require('../../app/models/cohortTeacher')
var cohortTeacherModel = mongoose.model('CohortTeacher')
require("../../app/models/cohort");
var cohortModel = mongoose.model("Cohort");
require("../../app/models/leaves");
var leavesModel = mongoose.model("Leaves");
require("../../app/models/leaveUpload");
var leavesUploadModel = mongoose.model("LeaveUpload");
require('../../app/models/newtimetable');
var timeTableModel = mongoose.model('NewTimeTable');
//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

router.post('/saveAttendance', function (req, res) {
  saveAttendance(req.body)
  var today = Date.now();
  if (req.body.attendanceArray.length > '0') {
    req.body.attendanceArray.forEach(function (student) {
      attendanceModel.find({
        user_id: student.student_id,
        course_id: student.student_course_id,
        timeTableId: req.body.timeTableId, //Disable this to enable single day attendance.
        batch_id: student.student_batchID,
        division_id: student.division_id,
        subject: req.body.subject,
        attendance_date: student.attendance_date
      }).then(function (attendance) {
        if (attendance == null || attendance == '' || attendance == 'undefined' || attendance == undefined) {

          var attendanceData = new attendanceModel({

            user_id: student.student_id,
            course_id: student.student_course_id,
            timeTableId: req.body.timeTableId,
            batch_id: student.student_batchID,
            division_id: student.division_id,
            semesterId : student.student_semId,
            subject: req.body.subject,
            present: student.attendanceStatus,
            attendance_date: student.attendance_date,
            createdOn: today,
            updatedOn: today,
          });
          attendanceData.save(function (err, result) {
            if (err) {
              res.send({
                status: 500
              })
            }
          });
        } else {
          var query = {
              user_id: student.student_id,
              course_id: student.student_course_id,
              timeTableId: req.body.timeTableId, //Disable this to enable single day attendance.
              division_id: student.division_id,
              subject: req.body.subject,
              attendance_date: student.attendance_date,

            },
            update = {
              $set: {
                present: student.attendanceStatus,
              }
            };
          attendanceModel.updateMany(query, update, function (err, lessons) {
            if (err) {
              res.send({
                status: 500
              })
            }
          })
        }
      })
    });
    res.send({
      status: 200
    })
  } else {
    res.send({
      // status: 300,
      message: 'please mark attendance...!'
    })

  }
})
async function saveAttendance(body) {
  // console.log("body",body)
  var today = Date.now();
  if (body.attendanceArray.length > '0') {
    body.attendanceArray.forEach(function (student) {
      NewTimeTableModel.find({
        _id: body.timeTableId
      }).then(async timetable => {
        var semester = await getId.getSemesterId(timetable[0].semester_id,'');
        var batch = await getId.getBatchId(timetable[0].batch_id, '')
        var course = await getId.getCourseId(timetable[0].course_id, '')
        var subject = await getId.getSubjectId(timetable[0].subject,course.id,semester.id)
        var division = await getId.getDivisionId(timetable[0].division_id, '')
        var user = await getId.getUserId(timetable[0].teacher_id, '')
      await  models.newtimetables.find({
          where: {
            courseId: course.id,
            batchId: batch.id,
            subjectId: subject.id,
            divisionId: division.id,
            teacherId: user.id,
            date : timetable[0].date,
            fromTime :timetable[0].fromTime,
            toTime  :timetable[0].toTime
          }
        }).then(async time => {
          var Batch = await getId.getBatchId(student.student_batchID, '')
          var Course = await getId.getCourseId(student.student_course_id, '')
          var Subject = await getId.getSubjectId(body.subject,Course.id,time.semesterId)
          var Division = await getId.getDivisionId(student.division_id, '')
          var User = await getId.getUserId(student.student_id, '')
        await   models.attendances.find({
            where: {
              userId: User.id,
              courseId: Course.id,
              batchId: Batch.id,
              divisionId: Division.id,
              timeTableId: time.id,
              subjectId: Subject.id,
              attendanceDate: student.attendance_date,
            }
          }).then(async attendance => {
            // console.log("attendance",attendance)
            
            if (attendance == null) {
              var Batch = await getId.getBatchId(student.student_batchID, '')
          var Course = await getId.getCourseId(student.student_course_id, '')
          var Semester = await getId.getSemesterId(student.student_semId,'');
          var Subject = await getId.getSubjectId(body.subject,Course.id,Semester.id)
          var Division = await getId.getDivisionId(student.division_id, '')
          var User = await getId.getUserId(student.student_id, '')
        await   models.attendances.create({
                userId: User.id,
                courseId: Course.id,
                batchId: Batch.id,
                divisionId: Division.id,
                timeTableId: time.id,
                subjectId: Subject.id,
                semesterId : Semester.id,
                attendanceDate: student.attendance_date,
                present: student.attendanceStatus,
              }).then(attendance => {
                console.log("attendance")
              })
            } else {
              var Batch = await getId.getBatchId(student.student_batchID, '')
              var Course = await getId.getCourseId(student.student_course_id, '')
              var Subject = await getId.getSubjectId(body.subject,Course.id,semester.id)
              var Division = await getId.getDivisionId(student.division_id, '')
              var User = await getId.getUserId(student.student_id, '')
            await  models.attendances.find({
                where: {
                  userId: User.id,
                  courseId: Course.id,
                  divisionId: Division.id,
                  timeTableId: time.id,
                  subjectId: Subject.id,
                  attendanceDate: student.attendance_date,
                }
              }).then(attendance => {
                if(attendance){
                  attendance.update({
                    present: student.attendanceStatus,
                  }).then(update => {
                    console.log("update")
                  })
                }
                
              })
            }
          })
        })
      })
    })
  }
}

router.get('/getattendanceMonthWise/:id/:date', function (req, res) {
  var count = 0;
  var count1 = 0;
  var absentDate = [];

  attendanceModel.aggregate(
      [{
        $match: {
          student_id: req.params.id,
          createdOn: {
            $regex: "'" + req.params.date + '.*' //'2019-07-.*'
          },
          present: true
        },

      }])
    .exec(function (err, data) {

      attendanceModel.aggregate(
          [{
            $match: {
              student_id: req.params.id,
              createdOn: {
                $regex: "'" + req.params.date + '.*'
              },
              present: false
            },

          }])
        .exec(function (err, data1) {
          res.send({
            status: 200,
            present: data.length,
            absent: data1.length
          })
        });
    });




});

router.get('/download', function (req, res) {
  var location = req.query.pdf;
  const downloadData = location;
  res.download(downloadData);
});

router.get('/MonthWiseAttendance/:month', function (req, res) {
  var data1 = {}
  var view_data = [];
  var day = new Date(req.params.month);
  var lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0) + 1;
  var month = day.getMonth() + 1;
  var year = day.getFullYear();
  var Present;

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  var count = daysInMonth(month, year);
  attendanceModel.find().distinct('student_id',
    function (err, data) {
      if (!err) {
        require('async').each(data, function (att, callback) {
          var query = attendanceModel.find({
            student_id: att,
            createdOn: {
              $gte: moment(req.params.month).format("YYYY-MM-DD"),
              $lte: moment(lastDay).format("YYYY-MM-DD")
            }
          }).sort('createdOn');
          query.exec(function (err, res) {

            data1.student_name = res[0].student_first_name;
            data1.roll_no = res[0].student_roll_no;
            res.forEach(function (attdata) {
              if (attdata.present == 'true' || attdata.present == true || attdata.present == 1) {
                Present = 'P';
              } else {
                Present = 'Ab';
              }

              for (let i = 1; i <= count; i++) {
                var date1 = attdata.createdOn;

                var val = i + "/" + month + "/" + year;
                if (i == date1.getDate()) {
                  data1[val] = Present
                } else {
                  // data1[val] = 'Ab'
                }
              }


            })
            view_data.push(data1);
            data1 = {}

          });
          callback();
        }, function (err, results) {
          if (err) {
            console.err("err==", err)
          } else {

            setTimeout(function () {

              var xls = json2xls(view_data);
              var currentPath = process.cwd();
              fs.writeFileSync(currentPath + "/src/public/excel_sheets/Attendance.xlsx", xls, 'binary');

              var file_name = "Attendance.xlsx";
              var filepath = currentPath + "/src/public/excel_sheets/Attendance.xlsx";
              res.json({
                status: 200,
                data: filepath
              });
            }, 20000)

          }

        });
      }
    })
});

router.get('/getAttendanceMonthData/:date', function (req, res) {

  var view_data = [];
  var absentDate = [];
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var startDate = new Date(firstDay);
  var endDate = new Date();
  this.numOfDates = getBusinessDatesCount(startDate, endDate);
  // alert(numOfDates)
  function getBusinessDatesCount(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
      var dayOfWeek = curDate.getDay();
      if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
        count++;
      curDate.setDate(curDate.getDate() + 1);
    }

    return count;
  }

  attendanceModel.find().distinct('student_id',
    function (err, response) {
      if (!err) {
        response.forEach(function (att) {
          attendanceModel.find({
            student_id: att,
            createdOn: {
              $gte: moment(req.params.date).format("YYYY-MM-DD")
            }
          }, function (err, res) {
            var count = 0;
            var count1 = 0;
            if (res.length > 0) {
              res.forEach(function (res1) {
                if (res1.present == true || res1.present == 1 || res1.present == 'true') {
                  count++;
                } else {
                  count1++;
                  absentDate.push(moment(res1.createdOn).format("YYYY-MM-DD"));
                }

              })

              view_data.push({
                id: att,
                roll_no: res[0].student_roll_no,
                first_name: res[0].student_first_name,
                last_name: res[0].student_last_name,
                present: count,
                absent: count1,
                totalDays: parseFloat(count / numOfDates * 100).toFixed(2),
                absentDate: absentDate
              })
            }

          })


        });
        setTimeout(function () {
          res.json({
            status: 200,
            data: view_data
          })
        }, 1500)
      }
    });


  //     }
  // })
});

router.get('/getattendanceIdwise', function (req, res) {
  multiTimeTableModel.aggregate([{
      $match: {
        course_id: {
          $eq: req.query.course_id
        },
        batch_id: {
          $eq: req.query.batch_id
        },
        subject: {
          $eq: req.query.subject
        }
      }
    },
    {
      "$lookup": {
        "from": "attendances",
        "localField": "timeTableId",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },

    {
      $project: {
        timeTableData: {
          $filter: {
            input: "$timeTableData",
            as: "pdf",
            cond: {
              $eq: ["$$pdf.user_id", req.query.id]
            }
          }
        },

        "_id": 1,
        "semesterName": 1,
        "courseName": 1,
        "batchName": 1,
        "divisionName": 1,
        "subject": 1,
        "date": 1,
        "time": 1,
        "location": 1,
        "course_id": 1,
        "batch_id": 1,
        "division_id": 1,
        "semester_id": 1,
        "timeTableId": 1,
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0,
      }
    }

  ]).then(function (data) {
    if (data != '') {
      setTimeout(function () {
        res.json({
          status: 200,
          data: data
        })
      }, 500)
    } else {
      setTimeout(function () {
        res.json({
          status: 400,
          data: data
        })
      }, 500)
    }

  });
});


router.post('/addevent', function (req, res) {
  addevent(req.body)
  var eventData = new eventModel({
    user_id: req.body.user_id,
    role: req.body.role,
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    todoCheck: req.body.todoCheck,
    courseId: req.body.courseId,
    batchId: req.body.batchId,
    semesterId: req.body.semesterId
  });

  eventData.save(function (err, result) {
    if (err) {
      res.json({
        status: 400
      })
    } else {
      userModel.find({
        _id: req.body.user_id
      }).then(function (userdetails) {
        if (userdetails) {
          var activity_action = "Added Event.";
          var activity_data = userdetails[0].fullName + " Added event of title " + req.body.title;
          notification_function.activity(activity_action, activity_data, req.body.courseId, '');
        }
      })
      res.json({
        data: result,
        status: 200
      })
    }
  })

});
async function addevent(body) {
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var semester = await getId.getSemesterId(body.semesterId, '');
  var user = await getId.getUserId(body.user_id, '')
  models.events.create({
    user_id: user.id,
    role: body.role,
    title: body.title,
    date: body.date,
    description: body.description,
    todoCheck: body.todoCheck,
    courseId: course.id,
    batchId: batch.id,
    semesterId: semester.id,
  }).then(event => {
    if (event) {
      models.users.find({
        where: {
          id: user.id,
        }
      }).then(user => {
        // if (user) {
        //   var activity_action = "Added Event.";
        //   var activity_data = user.fullName + " Added event of title " + body.title;
        //   notification_function.activity(activity_action, activity_data, course.id, '');
        // }
      })
    }
  })
}

router.get('/getevent/:id/:role/', function (req, res) {
  var view_data = [];
  if (req.params.role == 'admin' || req.params.role == "accountsAdmin") {
    eventModel.find({
      role: 'admin'
    }).then(function (eventData) {
      eventData.forEach(function (event1) {
        view_data.push({
          id: event1._id,
          date: new Date(event1.date),
          title: event1.title,
          description: event1.description,
          from: event1.time_from,
          to: event1.time_to,
          color: 'red',
          courseId: event1.courseId,

        });
      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 1000)

    });
  } else if (req.params.role == 'student') {
    eventModel.find({
      user_id: req.params.id
    }).then(event => {
      event.forEach(event1 => {
        view_data.push({
          date: new Date(event1.date),
          id: event1._id,
          title: event1.title,
          description: event1.description,
          from: event1.time_from,
          to: event1.time_to,
          color: 'red',
        })
      })

    })

    studentBatchModel.find({
      studentId: req.params.id
    }).then(batches => {
      batches.forEach(elm => {
        eventModel.find({
          courseId: elm.courseId,
          batchId: elm.batchId
        }).then(event => {
          event.forEach(element => {
            view_data.push({
              date: new Date(element.date),
              id: element._id,
              title: element.title,
              description: element.description,
              from: element.time_from,
              to: element.time_to,
              color: 'red',
              courseId: element.courseId,
            })
          })
        })
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 500)
    })
  } else if (req.params.role == 'teacher') {

    eventModel.find({
      user_id: req.params.id
    }).then(event => {
      // console.log("event",event)
      event.forEach(event1 => {
        view_data.push({
          date: new Date(event1.date),
          id: event1._id,
          title: event1.title,
          description: event1.description,
          from: event1.time_from,
          to: event1.time_to,
          color: 'red',
        })
      })
    })

    teacherModel.find({
      teacher_id: req.params.id
    }).then(function (courses) {
      //  var count = 0;
      courses.forEach(function (course) {
        // if(count == 0){
        eventModel.find({
          courseId: course.course_id,
          batchId: course.batch_id
        }).then(function (eventData) {
          eventData.forEach(function (event1) {
            view_data.push({
              date: new Date(event1.date),
              id: event1._id,
              title: event1.title,
              description: event1.description,
              from: event1.time_from,
              to: event1.time_to,
              color: 'red',
              courseId: event1.courseId,
              batchId: event1.batchId
            });
          });

        });
        // }
        // else{
        //     eventModel.find({
        //         $or: [
        //             {
        //                 courseId : course.course_id,
        //             },
        //         ]
        //     }).then(function(eventData){
        //         eventData.forEach(function(event1){
        //             view_data.push({
        //                 date : new Date(event1.date),
        //                 id : event1._id,
        //                 title : event1.title,
        //                 description : event1.description,
        //                 from: event1.time_from,
        //                 to : event1.time_to,
        //                 color: 'red',
        //                 courseId : event1.courseId,

        //             });
        //         });

        //     });
        // }
        // count++ ;
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 1000)
    })
  }
})

router.get('/viewevent/:id/:role/', function (req, res) {
  var view_data = {};

  if (req.params.role == 'admin') {
    eventModel.findOne({
      _id: req.params.id
    }).populate('courseId', ['courseName']).populate('batchId', ['batchName']).then(function (data) {
      view_data.id = data._id;
      view_data.title = data.title;
      view_data.description = h2p(data.description);
      // view_data.time_from = data.time_from;
      // view_data.time_to = data.time_to;
      // view_data.location = data.location;
      view_data.date = data.date;
      view_data.batchId = data.batchId._id;
      view_data.courseId = data.courseId._id;
      view_data.courseName = data.courseId.courseName;
      view_data.batchName = data.batchId.batchName;
      res.json({
        status: 200,
        data: view_data
      })
    });

  } else {
    eventModel.findOne({
      _id: req.params.id
    }).then(function (data) {
      view_data.id = data._id;
      view_data.title = data.title;
      view_data.description = h2p(data.description);
      // view_data.time_from = data.time_from;
      // view_data.time_to = data.time_to;
      // view_data.location = data.location;
      view_data.date = data.date;
      // view_data.batchId = data.batchId._id;
      // view_data.courseId = data.courseId._id;
      // view_data.courseName = data.courseId.courseName;
      // view_data.batchName = data.batchId.batchName;
      res.json({
        status: 200,
        data: view_data
      })
    });
  }

})

// router.get('/viewevent/:id',function(req,res){
//   var view_data = {};

//   eventModel.findOne({
//     _id : req.params.id
//     }).populate('courseId', ['courseName']).populate('batchId', ['batchName']).then(function(data){
//     console.log("data", data);
//         view_data.id = data._id;
//         view_data.title = data.title;
//         view_data.description = h2p(data.description);
//         // view_data.time_from = data.time_from;
//         // view_data.time_to = data.time_to;
//        // view_data.location = data.location;
//         view_data.date = data.date;
//         view_data.batchId = data.batchId._id;
//         view_data.courseId = data.courseId._id;
//         view_data.courseName = data.courseId.courseName;
//         view_data.batchName = data.batchId.batchName;
//        res.json({
//         status : 200,
//         data:view_data
//     })

// });
// })

router.get('/viewTimeTable/:id/', function (req, res) {
  NewTimeTableModel.aggregate([{
      $addFields: {
        id: {
          $toString: "$_id"
        }
      }
    },
    {
      $match: {
        id: {
          $eq: req.params.id
        }
      }
    },
    {
      "$lookup": {
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });
});



router.get('/getOptimizeTimeTable/:id/:role/:fullName/:subject/:currentmonth/:previousMonth/:NextMonth', (req, res) => {
  if (req.params.role == 'admin' || req.params.role == 'accountsAdmin' || req.params.role == 'subadmin') {
    NewTimeTableModel.aggregate([
      // {
      //     $match: {

      //       $or: [{
      //           date: {
      //             $regex: req.params.previousMonth
      //           }
      //         },
      //         {
      //           date: {
      //             $regex: req.params.currentmonth
      //           }
      //         },
      //         {
      //           date: {
      //             $regex: req.params.NextMonth
      //           }
      //         }
      //       ]


      //     },

      //   },
        {
          $addFields: {
            id: {
              $toString: "$_id"
            }
          }
        },
        {
          "$lookup": {
            "from": "topicofthedays",
            "localField": "id",
            "foreignField": "timeTableId",
            "as": "timeTableData"
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{
                $arrayElemAt: ["$timeTableData", 0]
              }, "$$ROOT"]
            }
          }
        },
        {
          $project: {
            timeTableData: 0
          }
        }
      ])
      .then(async function (data) {
        // Add Attendance mark not mark here
        let resData = []
        // for (let schedule of data) {

        //   console.log("topicName----", schedule.topicNames)
        //   let marked = false;
        //   let attendance = await attendanceModel.find({
        //     timeTableId: schedule._id,
        //   }).limit(2)

        //   if (attendance.length > 0) {

        //     marked = true;
        //   }

        //   let newObject = {
        //     _id: schedule._id,
        //     teacher_id: schedule.teacher_id,
        //     semesterName: schedule.semesterName,
        //     courseName: schedule.courseName,
        //     batchName: schedule.batchName,
        //     divisionName: schedule.divisionName,
        //     subject: schedule.subject,
        //     teacherName: schedule.teacherName,
        //     date: schedule.date,
        //     // prevdate:schedule.prevdate,
        //     // nextdate:schedule.nextdate,
        //     fromTime: schedule.fromTime,
        //     toTime: schedule.toTime,
        //     location: schedule.location,
        //     approval: schedule.approval,
        //     playbackLink: schedule.playbackLink,
        //     course_id: schedule.course_id,
        //     batch_id: schedule.batch_id,
        //     division_id: schedule.division_id,
        //     semester_id: schedule.semester_id,
        //     id: schedule._id,
        //     topicNames: schedule.topicNames,
        //     attendanceMarked: marked

        //   }

        //   console.log(newObject)

        //   resData.push(newObject)

        // }

        res.json({
          status: 200,
          data: data
        })

      });

    // if(req.params.currentmonth){
    //   NewTimeTableModel.aggregate([
    //     {
    //         $match:{

    //             date: {
    //               $regex: req.params.currentmonth
    //             },
    //             // prevdate:{
    //             //   $regex: req.params.previousMonth
    //             // },
    //             // nextdate:{
    //             //   $regex: req.params.NextMonth
    //             // }

    //         }
    //     },
    //     {
    //         $addFields: {
    //             id: {
    //                 $toString: "$_id"
    //             }
    //         }
    //     },
    //     {
    //         "$lookup": {
    //             "from": "topicofthedays",
    //             "localField": "id",
    //             "foreignField": "timeTableId",
    //             "as": "timeTableData"
    //         }
    //     },
    //     {
    //         $replaceRoot: {
    //             newRoot: {
    //                 $mergeObjects: [{
    //                     $arrayElemAt: ["$timeTableData", 0]
    //                 }, "$$ROOT"]
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             timeTableData: 0
    //         }
    //     }
    // ])      
    // .then(async function(data){
    //     // Add Attendance mark not mark here
    //     let resData = []
    //     for(let schedule of data){

    //         console.log("topicName----",schedule.topicNames)
    //         let marked = false;
    //         let attendance = await attendanceModel.find({
    //             timeTableId: schedule._id,
    //         }).limit(2)

    //         if(attendance.length > 0    ){

    //             marked = true;
    //         }

    //         let newObject = {
    //             _id: schedule._id,
    //             teacher_id: schedule.teacher_id,
    //             semesterName: schedule.semesterName,
    //             courseName: schedule.courseName,
    //             batchName: schedule.batchName,
    //             divisionName: schedule.divisionName,
    //             subject: schedule.subject,
    //             teacherName: schedule.teacherName,
    //             date: schedule.date,
    //             // prevdate:schedule.prevdate,
    //             // nextdate:schedule.nextdate,
    //             fromTime: schedule.fromTime,
    //             toTime: schedule.toTime,
    //             location: schedule.location,
    //             approval: schedule.approval,
    //             playbackLink: schedule.playbackLink,
    //             course_id: schedule.course_id,
    //             batch_id: schedule.batch_id,
    //             division_id: schedule.division_id,
    //             semester_id: schedule.semester_id,
    //             id: schedule._id,
    //             topicNames: schedule.topicNames,
    //             attendanceMarked: marked

    //         }

    //         console.log(newObject)

    //         resData.push(newObject)

    //     }

    //     res.json({
    //         status : 200,
    //         data:resData
    //     }) 

    // });

    // }

    // if(req.params.previousMonth){
    //   NewTimeTableModel.aggregate([
    //     {
    //         $match:{

    //             date: {
    //               $regex: req.params.previousMonth
    //             },
    //             // prevdate:{
    //             //   $regex: req.params.previousMonth
    //             // },
    //             // nextdate:{
    //             //   $regex: req.params.NextMonth
    //             // }

    //         }
    //     },
    //     {
    //         $addFields: {
    //             id: {
    //                 $toString: "$_id"
    //             }
    //         }
    //     },
    //     {
    //         "$lookup": {
    //             "from": "topicofthedays",
    //             "localField": "id",
    //             "foreignField": "timeTableId",
    //             "as": "timeTableData"
    //         }
    //     },
    //     {
    //         $replaceRoot: {
    //             newRoot: {
    //                 $mergeObjects: [{
    //                     $arrayElemAt: ["$timeTableData", 0]
    //                 }, "$$ROOT"]
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             timeTableData: 0
    //         }
    //     }
    // ])      
    // .then(async function(data){
    //     // Add Attendance mark not mark here
    //     let resData = []
    //     for(let schedule of data){

    //         console.log("topicName----",schedule.topicNames)
    //         let marked = false;
    //         let attendance = await attendanceModel.find({
    //             timeTableId: schedule._id,
    //         }).limit(2)

    //         if(attendance.length > 0    ){

    //             marked = true;
    //         }

    //         let newObject = {
    //             _id: schedule._id,
    //             teacher_id: schedule.teacher_id,
    //             semesterName: schedule.semesterName,
    //             courseName: schedule.courseName,
    //             batchName: schedule.batchName,
    //             divisionName: schedule.divisionName,
    //             subject: schedule.subject,
    //             teacherName: schedule.teacherName,
    //             date: schedule.date,
    //             // prevdate:schedule.prevdate,
    //             // nextdate:schedule.nextdate,
    //             fromTime: schedule.fromTime,
    //             toTime: schedule.toTime,
    //             location: schedule.location,
    //             approval: schedule.approval,
    //             playbackLink: schedule.playbackLink,
    //             course_id: schedule.course_id,
    //             batch_id: schedule.batch_id,
    //             division_id: schedule.division_id,
    //             semester_id: schedule.semester_id,
    //             id: schedule._id,
    //             topicNames: schedule.topicNames,
    //             attendanceMarked: marked

    //         }

    //         console.log(newObject)

    //         resData.push(newObject)

    //     }

    //     res.json({
    //         status : 200,
    //         data:resData
    //     }) 

    // });

    // }

    // if(req.params.NextMonth){
    //   NewTimeTableModel.aggregate([
    //     {
    //         $match:{

    //             date: {
    //               $regex: req.params.NextMonth
    //             },
    //             // prevdate:{
    //             //   $regex: req.params.previousMonth
    //             // },
    //             // nextdate:{
    //             //   $regex: req.params.NextMonth
    //             // }

    //         }
    //     },
    //     {
    //         $addFields: {
    //             id: {
    //                 $toString: "$_id"
    //             }
    //         }
    //     },
    //     {
    //         "$lookup": {
    //             "from": "topicofthedays",
    //             "localField": "id",
    //             "foreignField": "timeTableId",
    //             "as": "timeTableData"
    //         }
    //     },
    //     {
    //         $replaceRoot: {
    //             newRoot: {
    //                 $mergeObjects: [{
    //                     $arrayElemAt: ["$timeTableData", 0]
    //                 }, "$$ROOT"]
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             timeTableData: 0
    //         }
    //     }
    // ])      
    // .then(async function(data){
    //     // Add Attendance mark not mark here
    //     let resData = []
    //     for(let schedule of data){

    //         console.log("topicName----",schedule.topicNames)
    //         let marked = false;
    //         let attendance = await attendanceModel.find({
    //             timeTableId: schedule._id,
    //         }).limit(2)

    //         if(attendance.length > 0    ){

    //             marked = true;
    //         }

    //         let newObject = {
    //             _id: schedule._id,
    //             teacher_id: schedule.teacher_id,
    //             semesterName: schedule.semesterName,
    //             courseName: schedule.courseName,
    //             batchName: schedule.batchName,
    //             divisionName: schedule.divisionName,
    //             subject: schedule.subject,
    //             teacherName: schedule.teacherName,
    //             date: schedule.date,
    //             // prevdate:schedule.prevdate,
    //             // nextdate:schedule.nextdate,
    //             fromTime: schedule.fromTime,
    //             toTime: schedule.toTime,
    //             location: schedule.location,
    //             approval: schedule.approval,
    //             playbackLink: schedule.playbackLink,
    //             course_id: schedule.course_id,
    //             batch_id: schedule.batch_id,
    //             division_id: schedule.division_id,
    //             semester_id: schedule.semester_id,
    //             id: schedule._id,
    //             topicNames: schedule.topicNames,
    //             attendanceMarked: marked

    //         }

    //         console.log(newObject)

    //         resData.push(newObject)

    //     }

    //     res.json({
    //         status : 200,
    //         data:resData
    //     }) 

    // });

    // }


  }
})
router.get('/getTimeTable/:id/:role/:fullName/:subject/', function (req, res) {
  if (req.params.role == 'admin' || req.params.role == 'subadmin' || req.params.role == 'accountsAdmin') {
    NewTimeTableModel.aggregate([{
        $match: {
          date: {
            $regex: '2021-07-' //'2019-07-.*'
          }

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
          "from": "topicofthedays",
          "localField": "id",
          "foreignField": "timeTableId",
          "as": "timeTableData"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$timeTableData", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        $project: {
          timeTableData: 0
        }
      }
    ]).then(async function (data) {

      // console.log(`Response Data ${JSON.stringify(resData[0])} \n\n`)
      setTimeout(function () {

        res.json({
          status: 200,
          data: data
        })

      }, 1200)

    });

  } else if (req.params.role == 'teacher') {
    if (req.params.subject == '' || req.params.subject == 'null' || req.params.subject == undefined) {
      NewTimeTableModel.aggregate([{
          $match: {
            $or: [{
                teacher_id: req.params.id
              },
              {
                teacherName: req.params.fullName
              }
            ],
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
            "from": "topicofthedays",
            "localField": "id",
            "foreignField": "timeTableId",
            "as": "timeTableData"
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{
                $arrayElemAt: ["$timeTableData", 0]
              }, "$$ROOT"]
            }
          }
        },
        {
          $project: {
            timeTableData: 0
          }
        }
      ]).then(function (data) {
        userModel.find({
          _id: req.params.id
        }, {
          calendarOnOff: 1
        }, function (err, user) {
          if (err) {
            return handleError(res, err);
          } else {
            setTimeout(function () {
              res.json({
                status: 200,
                data: data,
                data2: user
              })
            }, 500)
          }

        });
      });
    } else {
      NewTimeTableModel.aggregate([{
          $match: {
            "teacherName": {
              $eq: req.params.fullName
            },
            "subject": {
              $eq: req.params.subject
            }

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
            "from": "topicofthedays",
            "localField": "id",
            "foreignField": "timeTableId",
            "as": "timeTableData"
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{
                $arrayElemAt: ["$timeTableData", 0]
              }, "$$ROOT"]
            }
          }
        },
        {
          $project: {
            timeTableData: 0
          }
        }
      ]).then(function (data) {

        userModel.find({
          _id: req.params.id
        }, {
          calendarOnOff: 1
        }, function (err, user) {
          if (err) {
            return handleError(res, err);
          } else {
            setTimeout(function () {
              res.json({
                status: 200,
                data: data,
                data2: user
              })
            }, 500)
          }

        });
      });
    }
  } else if (req.params.role == 'student') {
    if (req.params.subject == '' || req.params.subject == 'null' || req.params.subject == undefined) {
      studentBatchModel.find({
        studentId: req.params.id
      }).then(function (data) {
        var batch_id = [];
        // if()
        // if(data.length > 1){
        //     var batch_id = data[1].batchId;
        // }
        data.forEach(element => {
          batch_id.push({
            batch_id: element.batchId
          })
        })
        var course_id = data[0].courseId;
        // var batchid = data[0].batchId;
        NewTimeTableModel.aggregate([{
            $match: {
              "course_id": {
                $eq: course_id
              },
              $or: batch_id,
              
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
              "from": "topicofthedays",
              "localField": "id",
              "foreignField": "timeTableId",
              "as": "timeTableData"
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{
                  $arrayElemAt: ["$timeTableData", 0]
                }, "$$ROOT"]
              }
            }
          },
          {
            $project: {
              timeTableData: 0
            }
          }
        ]).then(function (timeTable) {
          setTimeout(function () {
            res.json({
              status: 200,
              data: timeTable
            })
          }, 0)
        });
      });
    } else {
      studentBatchModel.find({
        studentId: req.params.id
      }).then(function (data) {
        var course_id = data[0].courseId;
        NewTimeTableModel.aggregate([{
            $match: {
              "course_id": {
                $eq: course_id
              },
              "batch_id": {
                $eq: batch_id
              },
              "approval": {
                $eq: "Approved"
              },
              "subject": {
                $eq: req.params.subject
              }
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
              "from": "topicofthedays",
              "localField": "id",
              "foreignField": "timeTableId",
              "as": "timeTableData"
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{
                  $arrayElemAt: ["$timeTableData", 0]
                }, "$$ROOT"]
              }
            }
          },
          {
            $project: {
              timeTableData: 0
            }
          }
        ]).then(function (timeTable) {
          setTimeout(function () {
            res.json({
              status: 200,
              data: timeTable
            })
          }, 0)
        });
      });
    }

  }

});



router.get('/getTimeTableOfToday/:id/:role/:date/', function (req, res) {
  NewTimeTableModel.aggregate([{
      $match: {
        "date": req.params.date,
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});

router.get('/getTimeTableOfWeek/:fullName/:user_id/:weekStart/:weekEnd/', function (req, res) {
  NewTimeTableModel.aggregate([{
      $match: {
        $or: [{
            teacher_id: req.params.user_id
          },
          {
            teacherName: req.params.fullName
          }
        ],

        // filter to limit to whatever is of importance
        "date": {
          $gte: req.params.weekStart,
          $lte: req.params.weekEnd
        }
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});


router.get('/viewAllDivisionWiseData', function (req, res) {

  var view_data = [];
  attendanceModel.find({
    attendance_date: req.query.date,
    batch_id: req.query.batch_id,
    course_id: req.query.course_id,
    // division_id : req.query.divisionId,
    subject: req.query.subject
  }).populate('user_id').exec(function (err, attendanceData) {
    if (attendanceData != '') {
      attendanceData.forEach(function (data) {
        if (data != '') {
          view_data.push({
            student_name: data.user_id.fullName,
            student_email: data.user_id.email,
            student_course: data.course_id.courseName,
            batchName: data.batch_id.batch_id,
            attendance_date: data.attendance_date,
            status: data.present
          });
        }
      });
      res.send({
        status: 200,
        data: view_data
      })
    } else {
      res.send({
        status: 400
      })
    }
  });

});


router.get('/viewBatchDivisionWiseData', function (req, res) {
  var view_data = [];
  attendanceModel.find({
    attendance_date: req.query.date,
    batch_id: req.query.batch_id,
    course_id: req.query.course_id,
    division_id: req.query.divisionId,
    subject: req.query.subject
  }).populate('user_id').exec(function (err, attendanceData) {
    if (attendanceData != '') {
      attendanceData.forEach(function (data) {
        if (data != '' && data['user_id'] != null) {
          view_data.push({
            student_name: data.user_id.fullName,
            student_email: data.user_id.email,
            student_course: data.course_id.courseName,
            batchName: data.batch_id.batch_id,
            attendance_date: data.attendance_date,
            status: data.present
          });
        }
      });
      res.send({
        status: 200,
        data: view_data
      })
    } else {
      res.send({
        status: 400
      })
    }
  });

});

router.get('/courseWiseBatch/:course', function (req, res) {
  batchModel.find({
    course_id: req.params.course
  }).then(function (courseData) {
    if (courseData) {
      res.send({
        status: 200,
        data: courseData
      })
    } else {
      res.send({
        status: 400

      })
    }

  });

});

router.get('/attendanceData', function (req, res) {
  console.log("req---->>", req.query)
  var date = moment(new Date()).format('YYYY-MM-DD');
  var counter = 0;
  var view_data = [];
  studentBatchModel.aggregate([{
      $addFields: {
        id: {
          $toObjectId: "$studentId"
        }
      }
    },
    {
      $match: {
        courseId: {
          $eq: req.query.course_id
        },
        batchId: {
          $eq: req.query.batch_id
        },
      }
    },
    {
      "$lookup": {
        "from": "users",
        "localField": "id",
        "foreignField": "_id",
        "as": "users"
      }
    },
    {
      "$lookup": {
        "from": "leaves",
        "localField": "studentId",
        "foreignField": "userId",
        "as": "leaves"
      }
    },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$users", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        users: 0
      }
    }
  ]).then(data => {
    data.forEach(elm => {
      if (elm.leaves.length > 0) {
        if (req.query.date <= elm.leaves[0].endDate && req.query.date >= elm.leaves[0].startDate) {
          view_data.push({
            student_id: elm.id,
            student_name: elm.fullName,
            student_email: elm.email,
            division_id: elm.divisionId,
            student_course_id: req.query.course_id,
            student_batchID: req.query.batch_id,
            student_semId : req.query.semester_id,
            leave: true
          });
        } else {
          view_data.push({
            student_id: elm.id,
            student_name: elm.fullName,
            student_email: elm.email,
            division_id: elm.divisionId,
            student_course_id: req.query.course_id,
            student_batchID: req.query.batch_id,
            student_semId : req.query.semester_id,
            leave: false
          });
        }
      } else {
        view_data.push({
          student_id: elm.id,
          student_name: elm.fullName,
          student_email: elm.email,
          division_id: elm.divisionId,
          student_course_id: req.query.course_id,
          student_batchID: req.query.batch_id,
          student_semId : req.query.semester_id,
          leave: false
        });
      }
    })
    chapterModel.find({
      courseId: req.query.course_id,
      semesterId: req.query.semester_id,
      subject: req.query.subject
    }).then(function (chapters) {
      res.json({
        status: 200,
        data: view_data,
        data2: chapters
      })
    })

  })
});

router.get('/viewAllStudentData', function (req, res) {
  attendanceModel.find({}).then(function (student) {
    if (student) {
      res.send({
        status: 200,
        data: student
      })
    } else {
      res.send({
        status: 400
      })
    }

  });

});

router.post('/calendarOnOff', function (req, res) {
  calendarOnOff(req)
  userModel.findOne({
    _id: req.body.teacher_id,
  }).then(function (user) {
    if (user != '') {
      var query = {
          _id: req.body.teacher_id

        },
        update = {
          $set: {
            calendarOnOff: req.body.value,
          }
        };
      userModel.findOneAndUpdate(query, update, function (req, updateuser) {
        res.json({
          status: 200,
          data: updateuser
        });

      });
    } else {
      res.json({
        status: 400
      });
    }

  });

});

async function calendarOnOff(req) {

  var user = await getId.getUserId(req.body.teacher_id, '')
  models.users.find({
    where: {
      id: user.id
    }
  }).then(user => {
    if (user != '') {
      user.update({
        calendarOnOff: req.body.value,
      }).then(updateUser => {
        console.log("updateUser", updateUser)
      })
    }
  })
}

router.get('/getCalendarOnOfF', function (req, res) {

  userModel.find({
    _id: req.query.teacher_id,
    "role": req.query.role
  }).then(function (user) {
    if (user != '') {
      res.send({
        status: 200,
        data: user
      });

    } else {
      res.send({
        status: 400
      });
    }
  });
});

router.get('/viewMonthWiseAttendance', function (req, res) {
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  var countc = 0;
  var studentInfo = []
  var name
  var userId
  var subject
  NewTimeTableModel.find({
    course_id: req.query.course_id,
    batch_id: req.query.batch_id,
    subject: req.query.subject,
    date: {
      $regex: req.query.date //'2019-07-.*'
    }
  }).then(function (timetables) {

    attendanceModel.find({
        course_id: req.query.course_id,
        batch_id: req.query.batch_id,
        subject: req.query.subject,
        attendance_date: {
          $regex: req.query.date //'2019-07-.*'
        }
      }).populate('course_id', ['courseName']).populate('user_id')
      .distinct('user_id').exec(function (err, attendancedata) {
        if (err) {
          throw err;
        }
        if (attendancedata != '') {
          timetables.forEach(elm=>{
            if(elm.approval=='Rejected'){
              countc++
            }
          })
          attendancedata.forEach(infoo => {
            attendanceModel.find({
                course_id: req.query.course_id,
                batch_id: req.query.batch_id,
                subject: req.query.subject,
                user_id: infoo,
                attendance_date: {
                  $regex: req.query.date //'2019-07-.*'
                }
              }).populate('course_id', ['courseName']).populate('user_id')
              .exec(function (err, studentData) {
                studentData.forEach(element => {
                  if (element['user_id'] != null) {
                    name = element['user_id']['fullName'];
                    userId = element['user_id']['_id'];
                    subject = element['subject']
                  } else {
                    name = '',
                      subject = ''
                  }

                  if (element['user_id'] != null) {
                    if (element['present'] == 'Present') {
                      if (element['user_id'] != null && element['user_id'] != '') {


                      }

                      presentCount++
                      count++
                    } else if (element['present'] == 'Absent') {
                      absentCount++
                      count++
                    }
                  } else {
                    presentCount++
                    count++
                  }


                })
                var percentage = (100 * presentCount) / studentData.length
                if (name != null && name != '') {
                  if (studentData.length == count) {
                    //setTimeout(() => {
                    studentInfo.push({
                      Name: name,
                      userId: userId,
                      subject: subject,
                      present: presentCount,
                      Absent: absentCount,
                      Total_lecture: studentData.length + countc,
                      percentage: percentage,
                      timetables: timetables.length,
                      countC:countc

                    })
                    //},8000)



                  }
                }

                presentCount = 0
                absentCount = 0
                count = 0
                totalCount++
                if (attendancedata.length == totalCount) {
                  // console.log("studentInfo",studentInfo)
                  res.json({
                    status: 200,
                    data: studentInfo
                  });
                  //},3000)                            

                }


              })
          })
        } else {
          res.json({
            status: 400,
            message: 'Excel is Not generated!!!!!!........'
          });
        }

      });
  })


});





router.get('/getAllTeacherData', function (req, res) {
  userModel.find({
    "role": 'teacher'
  }).then(function (teacher) {
    if (teacher) {
      res.send({
        status: 200,
        data: teacher
      })
    } else {
      res.send({
        status: 400
      })

    }
  });

});


router.post('/excelToExportMonthWise', function (req, res) {
  var view_data = [];

  attendanceModel.find({
      course_id: req.body.course_id,
      batch_id: req.body.batch_id,
      subject: req.body.subject,
      attendance_date: {
        $regex: req.body.date //'2019-07-.*'
      }
    }).populate('course_id', ['courseName']).populate('user_id')
    .exec(function (err, attendancedata) {
      if (err) {
        throw err;
      } else if (attendancedata != '') {

        attendancedata.forEach(function (data) {
          if (data != '' && data['user_id'] != null) {

            view_data.push({
              StudentName: data.user_id.fullName ? data.user_id.fullName : '-',
              StudentEmail: data.user_id.email ? data.user_id.email : '-',
              CourseName: data.course_id.courseName ? data.course_id.courseName : '-',
              Subject: req.body.subject,
              Division: req.body.divisionName,
              Date: data.attendance_date ? data.attendance_date : '-',
              AttendanceStatus: data.present ? data.present : '-'

            })
          }
        });
        var xls = json2xls(view_data);
        var currentPath = process.cwd();
        fs.writeFileSync(currentPath + "/src/public/excel_sheets/AttendanceMonthWise" + req.body.date + ".xlsx", xls, 'binary');

        var file_name = "AttendanceMonthWise.xlsx";
        var filepath = currentPath + '/src/public/excel_sheets/AttendanceMonthWise' + req.body.date + '.xlsx';
        //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
        res.json({
          status: 200,
          data: filepath
        });

      } else {
        res.json({
          status: 400,
          message: 'Excel is Not generated!!!!!!........'
        });
      }
    });
});


router.post('/excelToExportDateWise', function (req, res) {
  const view_data = [];
  //    var present;
  attendanceModel.find({
      course_id: req.body.course_id,
      batch_id: req.body.batch_id,
      subject: req.body.subject,
      attendance_date: req.body.date
    }).populate('batch_id', ['batch_id']).populate('course_id', ['courseName', 'subjects']).populate('user_id')
    .exec(function (err, attendancedata) {
      if (err) {
        throw err;
      } else if (attendancedata != '') {
        attendancedata.forEach(function (data) {
          if (data != '') {
            view_data.push({
              StudentName: data.user_id.fullName ? data.user_id.fullName : '-',
              StudentEmail: data.user_id.email ? data.user_id.email : '-',
              courseName: data.course_id.courseName ? data.course_id.courseName : '-',
              Subject: req.body.subject,
              Division: req.body.divisionName,
              AttendanceStatus: data.present ? data.present : '-'

            })
          }
        });


        var view_data_asc = vd(view_data, 'StudentName');

        var xls = json2xls(view_data_asc);
        var currentPath = process.cwd();
        fs.writeFileSync(currentPath + "/src/public/excel_sheets/AttendanceDateWise.xlsx", xls, 'binary');

        var file_name = "AttendanceDateWise.xlsx";
        var filepath = currentPath + "/src/public/excel_sheets/AttendanceDateWise.xlsx";
        res.json({
          status: 200,
          data: filepath
        });

      } else {
        res.json({
          status: 400,
          message: 'Excel is Not generated!!!!!!........'
        });
      }
    });


});



router.post('/excelToExportMonthSubjectWise', function (req, res) {
  // console.log("req.query",req.body)
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var unmarkedCount = 0;
  var count = 0;
  var totalCount = 0;
  var countc = 0;
  var studentInfo = []
  var name
  var userId
  var subject
  NewTimeTableModel.find({
    course_id: req.body.course_id,
    batch_id: req.body.batch_id,
    subject: req.body.subject,
    date: {
      $regex: req.body.date //'2019-07-.*'
    }
  }).then(function (timetables) {
    // console.log("timetables",timetables)

    attendanceModel.find({
        course_id: req.body.course_id,
        batch_id: req.body.batch_id,
        subject: req.body.subject,
        attendance_date: {
          $regex: req.body.date //'2019-07-.*'
        }
      }).populate('course_id', ['courseName']).populate('user_id')
      .distinct('user_id').exec(function (err, attendancedata) {
        if (err) {
          throw err;
        }
        if (attendancedata != '') {
          timetables.forEach(elm=>{
            if(elm.approval=='Rejected'){
              countc++
            }
          })
          attendancedata.forEach(infoo => {
            attendanceModel.find({
                course_id: req.body.course_id,
                batch_id: req.body.batch_id,
                subject: req.body.subject,
                user_id: infoo,
                attendance_date: {
                  $regex: req.body.date //'2019-07-.*'
                }
              }).populate('course_id', ['courseName']).populate('user_id')
              .exec(function (err, studentData) {
                studentData.forEach(element => {
                  if (element['user_id'] != null) {
                    name = element['user_id']['fullName'];
                    userId = element['user_id']['_id'];
                    subject = element['subject']
                  } else {
                    name = '',
                      subject = ''
                  }

                  if (element['user_id'] != null) {
                    if (element['present'] == 'Present') {
                      if (element['user_id'] != null && element['user_id'] != '') {


                      }

                      presentCount++
                      count++
                    } else if (element['present'] == 'Absent') {
                      absentCount++
                      count++
                    } 

                  } else {
                    presentCount++
                    count++
                  }


                })
                var percentage = (100 * presentCount) / studentData.length
                if (name != null && name != '') {
                  if (studentData.length == count) {
                    //setTimeout(() => {
                    studentInfo.push({
                      Name: name,
                      userId: userId,
                      subject: subject,
                      present: presentCount,
                      Absent: absentCount,
                      Unmarked :timetables.length - (studentData.length + countc) ,
                      cancelLecture :countc,
                      Total_lecture: studentData.length + countc,
                      percentage: percentage.toFixed(2),
                      timetables: timetables.length,

                    })
                    //},8000)



                  }
                }

                presentCount = 0
                absentCount = 0
                unmarkedCount = 0
                count = 0
                totalCount++
// console.log("studentInfo",studentInfo)
                   if (attendancedata.length == totalCount) {
                // console.log("studentInfo",studentInfo)
                //setTimeout(() => {
                var studentInfo_asc = vd(studentInfo, 'Name');
                var xls = json2xls(studentInfo_asc);
                var currentPath = process.cwd();
                fs.writeFileSync(currentPath + "/src/public/excel_sheets/AttendanceMonthWise" + req.body.date + ".xlsx", xls, 'binary');
                //fs.writeFileSync('C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+".xlsx", xls, 'binary')
                var file_name = "AttendanceMonthWise.xlsx";
                var filepath = currentPath + '/src/public/excel_sheets/AttendanceMonthWise' + req.body.date + '.xlsx';
                //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
                res.json({
                  status: 200,
                  data: filepath
                });
                //},3000)                            

              }


            })
        })
      } else {
        res.json({
          status: 400,
          message: 'Excel is Not generated!!!!!!........'
        });
      }
    });
  });
});

router.post('/excelToExportMonthBatchSubjectWise', function (req, res) {
  var allData = req.body.allData;
  var subName = req.body.subject
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  var studentInfo = []
  var name
  var subject
  attendanceModel.find({
      course_id: req.body.course_id,
      batch_id: req.body.batch_id,
      subject: req.body.subject,
      division_id: req.body.divisionId,
      attendance_date: {
        $regex: req.body.date //'2019-07-.*'
      }
    }).populate('course_id', ['courseName']).populate('user_id')
    .distinct('user_id').exec(function (err, attendancedata) {
      if (err) {
        throw err;
      }
      if (attendancedata != '') {
        attendancedata.forEach(infoo => {
          attendanceModel.find({
              course_id: req.body.course_id,
              batch_id: req.body.batch_id,
              subject: req.body.subject,
              division_id: req.body.divisionId,
              user_id: infoo,
              attendance_date: {
                $regex: req.body.date //'2019-07-.*'
              }
            }).populate('course_id', ['courseName']).populate('user_id')
            .exec(function (err, studentData) {
              studentData.forEach(element => {
                if (element['user_id'] != null) {
                  name = element['user_id']['fullName']
                  subject = element['subject']
                } else {
                  name = '',
                    subject = ''
                }

                if (element['user_id'] != null) {
                  if (element['present'] == 'Present') {
                    if (element['user_id'] != null && element['user_id'] != '') {


                    }

                    presentCount++
                    count++
                  } else if (element['present'] == 'Absent') {
                    // name = element['user_id']['fullName']
                    // subject = element['subject']
                    absentCount++
                    count++
                  }
                } else {
                  presentCount++
                  count++
                }


              })
              var percentage = (100 * presentCount) / studentData.length
              if (name != null && name != '') {
                if (studentData.length == count) {
                  //setTimeout(() => {
                  studentInfo.push({
                    Name: name,
                    subject: subject,
                    present: presentCount,
                    Absent: absentCount,
                    Total_lecture: studentData.length,
                    percentage: percentage

                  })
                  //},8000)



                }
              }

              presentCount = 0
              absentCount = 0
              count = 0
              totalCount++
              if (attendancedata.length == totalCount) {
                //setTimeout(() => {
                var xls = json2xls(allData);
                var currentPath = process.cwd();
                fs.writeFileSync(currentPath + "/src/public/excel_sheets/AttendanceMonthWise" + req.body.date + ".xlsx", xls, 'binary');
                var file_name = "AttendanceMonthWise.xlsx";
                var filepath = currentPath + '/src/public/excel_sheets/AttendanceMonthWise' + req.body.date + '.xlsx';
                //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
                res.json({
                  status: 200,
                  data: filepath
                });
                //},3000)                            

              }


            })
        })
      } else {
        res.json({
          status: 400,
          message: 'Excel is Not generated!!!!!!........'
        });
      }

    });
});




router.get('/getBatchMonthSubjectWise', function (req, res) {
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  var studentInfo = []
  var name
  var subject
  attendanceModel.find({
    course_id: req.query.course_id,
    batch_id: req.query.batch_id,
    subject: req.query.subject,
    attendance_date: {
      $regex: req.query.date //'2019-07-.*'
    }
  }).distinct('user_id').exec(function (err, attendancedata) {
    if (err) {
      throw err;
    }
    if (attendancedata != '') {
      attendancedata.forEach(infoo => {
        attendanceModel.find({
            course_id: req.query.course_id,
            batch_id: req.query.batch_id,
            subject: req.query.subject,
            user_id: infoo,
            attendance_date: {
              $regex: req.query.date //'2019-07-.*'
            }
          }).populate('course_id', ['courseName']).populate('user_id')
          .exec(function (err, studentData) {
            studentData.forEach(element => {
              if (element['user_id'] != null) {
                if (element['present'] == 'Present') {
                  //if(element['user_id'] != null){
                  name = element['user_id']['fullName']
                  subject = element['subject']

                  presentCount++
                  count++
                } else if (element['present'] == 'Absent') {
                  name = element['user_id']['fullName']
                  subject = element['subject']
                  absentCount++
                  count++
                }

                var percentage = (100 * presentCount) / studentData.length

                if (studentData.length == count) {
                  //setTimeout(() => {
                  studentInfo.push({
                    Name: name,
                    subject: subject,
                    present: presentCount,
                    Absent: absentCount,
                    Total_lecture: studentData.length,
                    percentage: percentage

                  })
                  //},8000)



                }


              } else {}


            })

            presentCount = 0
            absentCount = 0
            count = 0
            totalCount++
            if (attendancedata.length == totalCount) {
              //console.log("studentInfo=== "+JSON.stringify(studentInfo))                            
              //setTimeout(() => {
              //        var xls = json2xls(studentInfo);
              //    var currentPath = process.cwd();
              //    console.log("currentPath== "+currentPath)
              //    //fs.writeFileSync(currentPath + "/src/public/excel_sheets/AttendanceMonthWise"+req.body.date+".xlsx", xls, 'binary');
              //    fs.writeFileSync('C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+".xlsx", xls, 'binary')
              //    var file_name = "AttendanceMonthWise.xlsx";
              //    //var filepath = currentPath + '/src/public/excel_sheets/AttendanceMonthWise'+req.body.date+'.xlsx';
              //    var filepath = 'C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+'.xlsx';
              //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
              res.json({
                status: 200,
                data: studentInfo
              });
              //},3000)                            

            }


          })
      })
    } else {
      res.json({
        status: 400,
        message: 'Excel is Not generated!!!!!!........'
      });
    }

  });
});





router.get('/viewValidBatchMonth', function (req, res) {
  var view_data = [];
  attendanceModel.find({
    batch_id: req.query.batch_id,
    //course_id: req.query.course_id,
    division_id: req.query.divisionId,
    //subject:req.query.subject
  }).exec(function (err, attendanceData) {
    if (attendanceData != '') {
      attendanceData.forEach(function (data) {
        if (data != '') {
          view_data.push(data.attendance_date)
        }
      });
      res.send({
        status: 200,
        data: view_data
      })
    } else {
      res.send({
        status: 400
      })
    }
  });
})


router.get('/getSubjects', function (req, res) {
  attendanceModel.find({
    course_id: req.query.course_id,
    batch_id: req.query.batch_id,
    //division_id : req.query.divisionId,
    // attendance_date: {
    //     $regex:req.query.date  //'2019-07-.*'
    // },
    //user_id : '5f40e2542c6e113cc5a5b971'
  }).distinct('subject').exec(function (err, subjectList) {
    if (subjectList != null && subjectList != '') {
      res.json({
        status: 200,
        data: subjectList
      })
    }
  })
})

router.get('/toList/:id', function (req, res) {
  var view_data = [];
  eventModel.find({
    user_id: req.params.id,
    todoCheck: 'false'
  }).then(function (eventData) {
    if (eventData) {
      eventData.forEach(function (event1) {
        view_data.push({
          eventId: event1._id,
          date: event1.date,
          title: event1.title,
          description: event1.description,
          //  from: event1.time_from,
          // to : event1.time_to,
          color: 'red'
        });
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
      })
    }
  });
});

router.get('/viewValidDatesMonths', function (req, res) {
  var view_data = [];
  attendanceModel.find({
    batch_id: req.query.batch_id,
    course_id: req.query.course_id,
    //    division_id : req.query.divisionId,
    subject: req.query.subject
  }).exec(function (err, attendanceData) {
    if (attendanceData != '') {
      attendanceData.forEach(function (data) {
        if (data != '') {
          view_data.push(data.attendance_date)
        }
      });
      res.send({
        status: 200,
        data: view_data
      })
    } else {
      res.send({
        status: 400
      })
    }
  });

});

router.post('/deleteEvent', function (req, res) {
  eventModel.findByIdAndRemove(req.body.id, function (err, deleteEvent) {
    if (err) {
      res.json({
        status: 400
      })
    } else {
      res.json({
        status: 200
      })
    }
  })
});

router.post('/deleteTimeTable', function (req, res) {
  NewTimeTableModel.findByIdAndRemove(req.body.id, function (err, deleteEvent) {
    if (err) {
      res.json({
        status: 400
      })
    } else {
      multiTimeTableModel.find({
        timeTableId: req.body.id
      }).remove().exec();
      attendanceModel.find({
        timeTableId: req.body.id
      }).remove().exec();
      TopicOfTheDayModel.find({
        timeTableId: req.body.id
      }).remove().exec();
      if (deleteEvent.approval == 'Approved') {
        if (req.body.notify == true) {
          studentBatchModel.find({
            batchId: deleteEvent.batch_id,
            divisionId: deleteEvent.division_id
          }).then(function (studentBatches) {
            studentBatches.forEach(studentBatch => {
              userModel.findById(studentBatch.studentId).then(function (student) {
                emailService.deleteScheduleMsg(student.email, student.mobile, deleteEvent.date, deleteEvent.fromTime);
                var newDate = moment(deleteEvent.date, "YYYY-MM-DD").format("DD MMM YYYY");
                var notification_data = "Your class for " + deleteEvent.subject + ", scheduled on " + newDate + " " + deleteEvent.fromTime + " is cancelled";
                sendNotification("Lecture Cancelled", notification_data, student._id.toHexString());
              })
            })
          })
        }
      }
      res.json({
        status: 200
      })
      var url = "pages/calendar";
      divisionModel.find({
        divisionName: req.body.divisionName,
      }).then(function (users) {
        users.forEach(function (user) {
          var action = "Admin Deleted TimeTable";
          var notification_data = "Your class has been cancelled for " + req.body.subject + " on " + req.body.date;
          //notification_function.notification(action, notification_data, user.studentId,url,'');
        })
      });

      teacherModel.find({
        divisionName: req.body.divisionName,
        subject: req.body.subject,
      }).then(function (teachers) {
        teachers.forEach(function (teacher) {
          var action = "Admin Deleted TimeTable";
          var notification_data = "Your class has been cancelled for " + req.body.subject + " on " + req.body.date;
          //notification_function.notification(action, notification_data, teacher.teacher_id, url,'');
        })
      });
    }
  })
});

router.get('/getUpdatetodoList/:id', function (req, res) {
  var view_data = [];
  eventModel.find({
    user_id: req.params.id,
    todoCheck: 'true'
  }).then(function (eventData) {
    if (eventData) {
      eventData.forEach(function (event1) {
        view_data.push({
          eventId: event1._id,
          date: event1.date,
          title: event1.title,
          description: event1.description,
          todoCheck: event1.todoCheck,
          color: 'red'
        });
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
      })
    }
  });
});

router.delete('/deleteTODO', function (req, res) {

  var query = {
    _id: req.query.eventId
  }
  eventModel.find({
    _id: req.query.eventId
  }).exec(function (err, deleteTodo) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteTodo != '' || deleteTodo != null || deleteTodo != 'undefined' || deleteTodo != undefined) {
      eventModel.findOneAndRemove(query).exec(function (err, course) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: course,
            message: 'todo Deleted Successfully!!!....'
          });
        }

      });

    }
  });

})

router.put('/checkTodo', function (req, res) {
  checkTodo(req)
  var query = {
      _id: req.body.eventId,
      user_id: req.body.user_id
    },
    update = {
      $set: {
        todoCheck: req.body.event

      }
    };
  eventModel.updateMany(query, update, function (err, event) {
    if (err) {
      console.error("err" + err)
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: event
      })
    }

  });

});
async function checkTodo(req) {
  eventModel.find({
    _id: req.body.eventId
  }).then(async eventmodel => {
    var user = await getId.getUserId(eventmodel[0].user_id, '')
    var course = await getId.getCourseId(eventmodel[0].courseId, '')
    models.events.find({
      where: {
        courseId: course.id,
        userId: user.id,
        role: eventmodel[0].role,
        title: eventmodel[0].title,
        date: eventmodel[0].date,
      }
    }).then(event => {
      if (event) {
        event.update({
          todoCheck: req.body.event
        }).then(update => {
          console.log("update", update)
        })
      }
    })
  })
}

// Author SP save Topic Of The day...
router.post('/saveTopicName', function (req, res) {
  saveTopicName(req)
  var topicNamesData = new TopicOfTheDayModel({
    date: req.body.date,
    subject: req.body.subject,
    topicNames: req.body.topicName,
    course_id: req.body.course_id,
    timeTableId: req.body.timeTableId
  });
  topicNamesData.save(function (err, result) {
    if (err) {
      res.json({
        status: 400
      })
    } else {
      var query = {
          _id: req.body.chapterId,
        },
        update = {
          $set: {
            completed: 'true',
          },
        };
      chapterModel.findOneAndUpdate(query, update, function (req, updateuser) {});
      res.json({
        data: result,
        status: 200
      })
    }
  })
});
async function saveTopicName(req) {
  NewTimeTableModel.find({
    _id: req.body.timeTableId
  }).then(async time => {
    // console.log("time",time[0].course_id)
    var batch = await getId.getBatchId(time[0].batch_id, '')
    var course = await getId.getCourseId(time[0].course_id, '')
    var semester = await getId.getSemesterId(time[0].semester_id, '');
    var user = await getId.getUserId(time[0].teacher_id, '')
    var division = await getId.getDivisionId(time[0].division_id, '')
    var subject = await getId.getSubjectId(time[0].subject,course.id,semester.id)
  await  models.newtimetables.find({
      where: {
        teacherId: user.id,
        courseId: course.id,
        batchId: batch.id,
        divisionId: division.id,
        semesterId: semester.id,
        subjectId: subject.id
      }
    }).then(async timetable => {
      var Course = await getId.getCourseId(req.body.course_id, '')
      models.topicofthedays.create({
        courseId: Course.id,
        timeTableId: timetable.id,
        date: req.body.date,
        subject: req.body.subject,
        topicNames: req.body.topicName,
      }).then(data => {
        if (data) {
          chapterModel.find({
            _id: req.body.chapterId
          }).then(async chapter => {
            var Course = await getId.getCourseId(chapter[0].course_id, '')
            var semester = await getId.getSemesterId(chapter[0].semesterId, '');
            var subject = await getId.getSubjectId(chapter[0].subject,course.id,semester.id)
        await    models.chapter.find({
              where: {
                courseId: Course.id,
                subjectId: subject.id,
                semesterId: semester.id,
                chapterName: chapter.chapterName
              }
            }).then(chapter => {
              if(chapter){
                chapter.update({
                  completed: true
                }).then(updateChapter => {
                  console.log("updateChapter", updateChapter)
                })
              }
              
            })
          })
        }
      })
    })
  })
}

// Author SP get Topic Of The day...
router.get('/getTopicName/:id/:role/', function (req, res) {

  if (req.params.role == 'admin') {
    TopicOfTheDayModel.find({}).then(function (data) {

      setTimeout(function () {
        res.json({
          status: 200,
          data: data
        })
      }, 500)
    });
  } else if (req.params.role == 'teacher') {
    var timetableData = [];
    courseModel.find({
      teacher_id: req.params.id
    }).then(function (data) {
      data.forEach(element => {
        TopicOfTheDayModel.find({
          subject: element.subjects
        }).then(function (timeTable) {
          timetableData = timetableData.concat(timeTable);
        });
      })
      setTimeout(function () {
        res.json({
          status: 200,
          data: timetableData
        })
      }, 1000)
    })

  }

});
// Author SP view Topic Of The day...
router.get('/viewTopicName/:id', function (req, res) {

  TopicOfTheDayModel.find({
    _id: req.params.id
  }).then(function (data) {
    res.json({
      status: 200,
      data: data
    })
  });
});



router.post('/addholidayhistory', (req, res) => {
  addholidayhistory(req.body)
  var HolidayHistory = new holidayHistoryModel({});
  holidayHistoryModel.create({
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    description: req.body.description,
    courseId: req.body.courseId,
    batchId: req.body.batchId
  }, (err, dataInserted) => {
    if (err) {
      console.error(err)
    } else {
      userModel.find({
        _id: req.body.user_id
      }).then(function (userdetails) {
        if (userdetails) {
          var activity_action = "Added Holiday.";
          var url = '/pages/calendar'
          var activity_data = userdetails[0].fullName + " Added holiday.";
          notification_function.notification(activity_action, activity_data, url, '');
        }
      })
      res.json({
        status: 200
      })
    }
  })

});
async function addholidayhistory(body) {
  var batch = await getId.getBatchId(body.batchId, '')
  var course = await getId.getCourseId(body.courseId, '')
  var user = await getId.getUserId(body.user_id, '')
  models.holidayhistories.create({
    start_date: body.start_date,
    end_date: body.end_date,
    description: body.description,
    courseId: course.id,
    batchId: batch.id,
  }).then(data => {
    if (data) {
      models.users.find({
        where: {
          id: user.id
        }
      }).then(elm => {
        var activity_action = "Added Holiday.";
        var url = '/pages/calendar'
        var activity_data = elm.fullName + " Added holiday.";
        notification_function.notification(activity_action, activity_data, url, '');
      })
    }
  })
}


router.get('/getholidayhistory/:id/:role/', function (req, res) {
  if (req.params.role == "admin" || req.params.role == "accountsAdmin") {
    holidayHistoryModel.find({}).then(function (data) {
      setTimeout(function () {
        res.json({
          status: 200,
          data: data
        })
      }, 500)
    });
  } else if (req.params.role == "teacher") {
    teacherModel.find({
      teacher_id: req.params.id,
    }).then(function (data) {

      var batchId1 = '';
      var batchId2 = '';
      var batchId3 = '';
      var batchId4 = '';
      var courseId1 = '';
      var courseId2 = '';
      var courseId3 = '';
      var courseId4 = '';
      if (data.length == 1) {
        batchId1 = data[0].batch_id;
        courseId1 = data[0].course_id;
      } else if (data.length == 2) {
        batchId1 = data[0].batch_id;
        courseId1 = data[0].course_id;
        batchId2 = data[1].batch_id;
        courseId2 = data[1].course_id;
      } else if (data.length == 3) {
        batchId1 = data[0].batch_id;
        courseId1 = data[0].course_id;
        batchId2 = data[1].batch_id;
        courseId2 = data[1].course_id;
        batchId3 = data[2].batch_id;
        courseId3 = data[2].course_id;
      } else if (data.length == 4) {
        batchId1 = data[0].batch_id;
        courseId1 = data[0].course_id;
        batchId2 = data[1].batch_id;
        courseId2 = data[1].course_id;
        batchId3 = data[2].batch_id;
        courseId3 = data[2].course_id;
        batchId4 = data[3].batch_id;
        courseId4 = data[3].course_id;
      }
      holidayHistoryModel.find({
        $or: [{
            courseId: courseId1
          },
          {
            courseId: courseId2
          },
          {
            courseId: courseId3
          },
          {
            courseId: courseId4
          },
          {
            $and: [{
              courseId: 'All'
            }],
          }
        ],
        $or: [{
            batchId: batchId1
          },
          {
            batchId: batchId2
          },
          {
            batchId: batchId3
          },
          {
            batchId: batchId4
          },
          {
            $and: [{
              courseId: 'All'
            }],
          }
        ]
      }).then(function (holidays) {
        res.json({
          status: 200,
          data: holidays
        })
        //console.log(`getHolidayHistoryData ${JSON.stringify(holidays[0])} \n\n`)
      })

    })
  } else if (req.params.role == "student") {
    studentBatchModel.find({
      studentId: req.params.id
    }).then(function (data) {
      var batchid = '';
      if (data.length == 1) {
        batchid = data[0].batchId;
      } else if (data.length == 2) {
        batchid = data[1].batchId;
      } else if (data.length == 3) {
        batchid = data[2].batchId;
      }
      var course_id = data[0].courseId;
      console.log(course_id)
      console.log(batchid)
      holidayHistoryModel.find({

        $or: [{
            courseId: course_id,
          },
          {
            courseId: 'All',
          },

        ],
        $or: [{
            batchId: batchid
          },
          {
            batchId: 'All'
          }
        ]

      }).then(function (holidays) {
        console.log("holidays", holidays)
        res.json({
          status: 200,
          data: holidays
        })
      })

    })
  }
});


router.get('/viewholiday/:id', function (req, res) {
  var view_data = []
  holidayHistoryModel.find({
    _id: req.params.id
  }).then(function (data) {
    // console.log("data", data)
    data.forEach(elm => {
      if (elm.courseId == 'All' && elm.batchId == 'All') {
        view_data.push({
          description: elm.description,
          start_date: elm.start_date,
          end_date: elm.end_date,
          _id: elm._id,
          courseName: elm.courseId,
          batchName: elm.batchId,
        })
      } else if (elm.batchId == 'All' && elm.courseId != 'All') {
        holidayHistoryModel.find({
          _id: req.params.id
        }).populate('courseId', ['courseName']).then(function (holiday) {
          holiday.forEach(elm => {
            view_data.push({
              description: elm.description,
              start_date: elm.start_date,
              end_date: elm.end_date,
              _id: elm._id,
              courseName: elm.courseId.courseName,
              batchName: elm.batchId,
            })
          })

        })

      } else {
        holidayHistoryModel.find({
            _id: req.params.id
          }).populate('batchId', ['batchName', 'year'])
          .populate('courseId', ['courseName']).then(function (holiday) {
            holiday.forEach(elm => {
              view_data.push({
                description: elm.description,
                start_date: elm.start_date,
                end_date: elm.end_date,
                _id: elm._id,
                courseName: elm.courseId.courseName,
                batchName: elm.batchId.batchName,
                year: elm.batchId.year
              })
            })

          })
      }
    })

    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      })
    }, 500)
  });
});


router.post('/deleteholiday', function (req, res) {
  holidayHistoryModel.findByIdAndRemove(req.body.id, function (err, deleteholiday) {
    if (err) {
      res.json({
        status: 400
      })
    } else {
      res.json({
        status: 200
      })
    }
  })
});

router.post('/excelToExportTimeTable', function (req, res) {
  var view_data = [];
  multiTimeTableModel.aggregate([{
      $match: {
        "subject": {
          $eq: req.body.subject,
        },
        "semester_id": {
          $eq: req.body.semesterId
        }
      }
    },
    {
      "$lookup": {
        "from": "attendances",
        "localField": "timeTableId",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $project: {
        present: {
          $filter: {
            input: "$timeTableData",
            as: "timeTable",
            cond: {
              $eq: ["$$timeTable.present", "Present"]
            }
          }
        },
        absent: {
          $filter: {
            input: "$timeTableData",
            as: "timetable",
            cond: {
              $eq: ["$$timetable.present", "Absent"]
            }
          }
        },
        "_id": 1,
        "semesterName": 1,
        "courseName": 1,
        "batchName": 1,
        "divisionName": 1,
        "subject": 1,
        "date": 1,
        "time": 1,
        "location": 1,
        "course_id": 1,
        "batch_id": 1,
        "division_id": 1,
        "semester_id": 1,
        "timeTableId": 1,

      }
    },

  ]).then(function (data) {
    if (data != '') {
      data.forEach(function (data1) {
        if (data1 != '') {
          view_data.push({
            Date: data1.date ? data1.date : '-',
            Time: data1.time ? data1.time : '-',
            Present: data1.present.length ? data1.present.length : '-',
            Absent: data1.absent.length ? data1.absent.length : '-',
            AllStudents: data1.present.length + data1.absent.length ? data1.present.length + data1.absent.length : '-'
          })
        }
      });


      var xls = json2xls(view_data);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/lectures.xlsx", xls, 'binary');

      var file_name = "AttendanceDateWise.xlsx";
      var filepath = currentPath + "/src/public/excel_sheets/lectures.xlsx";
      res.json({
        status: 200,
        data: filepath
      });

    } else {
      res.json({
        status: 400,
        message: 'Excel is Not generated!!!!!!........'
      });
    }
  });
});

router.get('/getClassAttendance/:id/:status/', function (req, res) {
  var view_data = [];
  attendanceModel.find({
    timeTableId: req.params.id,
    present: req.params.status
  }).populate('user_id').exec(function (err, attendanceData) {
    if (attendanceData != '') {
      attendanceData.forEach(function (data) {
        if (data != '') {
          view_data.push({
            student_name: data.user_id.fullName,
            student_email: data.user_id.email,
            student_course: data.course_id.courseName,
            batchName: data.batch_id.batch_id,
            attendance_date: data.attendance_date,
            status: data.present
          });
        }
      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data
        })
      }, 500)
    }
  });
});

router.get('/getallAttendence/:id/', function (req, res) {
  attendanceModel.find({
    user_id: req.params.id,
  }).then(function (attendanceData) {
    res.json({
      status: 200,
      data: attendanceData
    })
  });
});

router.get('/getCourseAdmindashboard', function (req, res) {
  viewCourse = [];
  count = 0;
  collegeCourseModel.find({}).exec(function (err, allCourses) {

    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      allCourses.forEach((course) => {

        batchMasterModel.find({
          batchStatus: true,
          courseId: course._id
        }).exec(function (err, allBatches) {
          count++;
          viewCourse.push({
            id: count,
            courseName: course.courseName,
            title: course.courseName,
            CourseID: course._id,
            allBatcheslength: allBatches.length
          })
          if (count == allCourses.length) {
            res.json({
              status: 200,
              data: viewCourse
            })
          }
        })

      })

    }
  });

});

router.post('/getBatchCourseWise', function (req, res) {
  var count = 0;
  var CourseBatch = [];
  batchMasterModel.find({
    batchStatus: true,
    courseId: req.body.CourseData.CourseID
  }).exec(function (err, allBatches) {

    allBatches.forEach((batch) => {
      NewTimeTableModel.find({
        date: req.body.todaysDate,
        course_id: req.body.CourseData.CourseID,
        batch_id: batch._id
      }).exec(function (err, todaysTimetablebatchwise) {
        count++;
        CourseBatch.push({
          batchName: batch.batchName,
          batchyear: batch.year,
          batchCourseId: batch.courseId,
          timeTable: todaysTimetablebatchwise
        })
        if (count == allBatches.length) {
          res.json({
            status: 200,
            data: CourseBatch
          })
        }
      })
    })
    if (err) {
      res.json({
        status: 400
      })
    } else if (allBatches.length == 0) {
      res.json({
        status: 201
      })
    }
  })
})


router.get('/getTimeTableFilter/:courseId/:semesterId/', function (req, res) {
  NewTimeTableModel.aggregate([{
      $match: {
        course_id: {
          $eq: req.params.courseId,
        },
        semester_id: {
          $eq: req.params.semesterId,
        }
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});

router.get("/getBatchCourseWise2", function (req, res) {
  var count = 0;
  var CourseBatch = [];
  var courseId = req.query.courseId
  var date = req.query.date
  batchMasterModel
    .find({
      batchStatus: true,
      courseId: courseId,
    })
    .exec(function (err, allBatches) {
      allBatches.forEach((batch) => {
        NewTimeTableModel.find({
          date: date,
          course_id: courseId,
          batch_id: batch._id,
        }).exec(function (err, todaysTimetablebatchwise) {
          count++;
          CourseBatch.push({
            batchName: batch.batchName,
            batchyear: batch.year,
            batchCourseId: batch.courseId,
            timeTable: todaysTimetablebatchwise,
          });
          if (count == allBatches.length) {
            res.json({
              status: 200,
              data: CourseBatch,
            });
          }
        });
      });
      if (err) {
        res.json({
          status: 400,
        });
      } else if (allBatches.length == 0) {
        res.json({
          status: 201,
        });
      }
    });
});

router.get('/getTeachTimeTableFilter', function (req, res) {

  NewTimeTableModel.aggregate([{
      $match: {
        course_id: {
          $eq: req.query.courseId,
        },
        semester_id: {
          $eq: req.query.semesterId,
        },
        teacher_id: {
          $eq: req.query.teacher_id,
        }
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});

router.get("/getDateWiseAttendance", function (req, res) {
  // console.log("req.query----",req.query)
  var view_data = [];
  attendanceModel.find({
    timeTableId: req.query.timeTableId,
    attendance_date: req.query.date,
  }).populate("user_id").exec(function (err, attendanceData) {
    // console.log("attendanceData-----",attendanceData)
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (attendanceData != "" || attendanceData != undefined || attendanceData != null) {
      attendanceData.forEach(function (data) {
        view_data.push({
          _id: data._id,
          student_name: data.user_id.fullName,
          student_email: data.user_id.email,
          student_course_id: data.course_id,
          student_batchID: data.batch_id,
          attendance_date: data.attendance_date,
          status: data.present,
          virtualPresent: data.virtualPresent,
        });
      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data,
        });
      }, 500);
    }
  });
});

router.put('/updateAttendance', function (req, res) {
  updateAttendance(req)
  var query = {
      _id: req.body._id,
    },
    update = {
      $set: {
        present: req.body.status,
      },
    };

  attendanceModel.updateMany(query, update, function (err, attendance) {
    if (err) {
      console.error(err);
    } else {
      res.json({
        status: 200,
        data: attendance
      });
    }
  });

});

async function updateAttendance(req) {
  attendanceModel.find({
    _id: req.body._id,
  }).then(async attendance => {
    if (attendance) {
      var Batch = await getId.getBatchId(attendance[0].batch_id, '')
      var Course = await getId.getCourseId(attendance[0].course_id, '')
      var Semester = await getId.getSemesterId(attendance[0].semesterId,'');
      var Subject = await getId.getSubjectId(attendance[0].subject,Course.id,Semester.id)
      var Division = await getId.getDivisionId(attendance[0].division_id, '')
      var User = await getId.getUserId(attendance[0].user_id, '')
    await  models.attendances.find({
        where: {
          courseId: Course.id,
          batchId: Batch.id,
          divisionId: Division.id,
          subjectId: Subject.id,
          userId: User.id,
          semesterId : Semester.id,
          attendanceDate: attendance[0].attendance_date,
          present: attendance[0].present
        }
      }).then(updateatt => {
        if(updateatt){
          updateatt.update({
            present: req.body.status,
          }).then(present => {
            console.log("present")
          })
        }
       
      })
    }
  })
}

router.get('/getTimeTableOfWeekly/:fullName/:user_id/:course_id/:weekStart/:weekEnd/', function (req, res) {
  NewTimeTableModel.aggregate([{
      $match: {
        "teacher_id": {
          $eq: req.params.user_id
        },
        "teacherName": {
          $eq: req.params.fullName
        },
        "course_id": {
          $eq: req.params.course_id
        },
        // filter to limit to whatever is of importance
        "date": {
          $gte: req.params.weekStart,
          $lte: req.params.weekEnd
        }
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});


//delete cohort time table(with attendance and topic of data) (Megha Patil ----Date:18-11-2021)
router.post("/deleteCohortTimeTable", function (req, res) {
  cohortTimeTableModel.findByIdAndRemove(req.body.id, function (err, deleteEvent) {
    //   console.log("deleteid---"+JSON.stringify(req.body.id))
    if (err) {
      res.json({
        status: 400,
      });
    } else {
      cohortTimeTableModel.find({
        _id: req.body.id
      }).remove().exec();
      cohortAttendanceModel.find({
        cohortTimeTableId: req.body.id
      }).remove().exec();
      cohortTopicOfTheDayModel.find({
        cohortTimeTableId: req.body.id
      }).remove().exec();
      res.json({
        status: 200,
      });

      cohortTeacherModel.find({
          subject: req.body.subject,
        })
        .then(function (teachers) {
          teachers.forEach(function (teacher) {
            var action = "Admin Deleted CohortTimeTable";
            var notification_data =
              "Your class has been cancelled for " +
              req.body.subject +
              " on " +
              req.body.date;
            notification_function.notification(action, notification_data, teacher.teacher_id, '');
          });
        });
    }
  });
});

//get cohort time table all data (Megha Patil ----Date:19-11-2021)
router.get("/getCohort/:id/", function (req, res) {
  // console.log("req.param----",req.params)
  cohortTimeTableModel.aggregate([{
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $match: {
        id: {
          $eq: req.params.id,
        },
      },
    },
    {
      $lookup: {
        from: "cohortteachers",
        localField: "cohort_id",
        foreignField: "divisionId",
        as: "cohortTeachersData",
      },
    },
    {
      $lookup: {
        from: "cohorttopicofthedays",
        localField: "id",
        foreignField: "cohortTimeTableId",
        as: "cohortTopicData",
      },
    },

    {
      $addFields: {
        coID: {
          $toObjectId: "$cohort_id",
        },
      },
    },
    {
      $lookup: {
        from: "cohorts",
        localField: "coID",
        foreignField: "_id",
        as: "chohorts",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
              $arrayElemAt: ["$chohorts", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
              $arrayElemAt: ["$cohortTeachersData", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
              $arrayElemAt: ["$cohortTopicData", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $project: {
        chohorts: 0,
        cohortTeachersData: 0,
        cohortTopicData: 0
      },
    },

  ]).then(function (data) {
    res.json({
      sttus: 200,
      data: data
    })
  })
})

router.get("/getTimeTableCohort/:id/:role/:fullName/:subject/", function (req, res) {
  if (req.params.role == "admin") {
    cohortTimeTableModel.aggregate([{
        $lookup: {
          from: "cohortteachers",
          localField: "cohort_id",
          foreignField: "divisionId",
          as: "cohortTeachersData",
        },
      },
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "cohorttopicofthedays",
          localField: "id",
          foreignField: "cohortTimeTableId",
          as: "TopicNames",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
                $arrayElemAt: ["$TopicNames", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },

      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
                $arrayElemAt: ["$cohortTeachersData", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          cohortTeachersData: 0,
          TopicNames: 0
        },
      },

    ]).then(function (data) {
      res.json({
        sttus: 200,
        data: data,
        view: 'true'
      })
    })
  } else if (req.params.role == "teacher") {
    cohortTimeTableModel.aggregate([{
        $match: {
          teacher_id: {
            $eq: req.params.id,
          },
        },
      },
      {
        $lookup: {
          from: "cohortteachers",
          localField: "cohort_id",
          foreignField: "divisionId",
          as: "cohortTeachersData",
        },
      },
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "cohorttopicofthedays",
          localField: "id",
          foreignField: "cohortTimeTableId",
          as: "TopicNames",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
                $arrayElemAt: ["$TopicNames", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },


      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
                $arrayElemAt: ["$cohortTeachersData", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          cohortTeachersData: 0,
          TopicNames: 0
        },
      },

    ]).then(function (data) {
      res.json({
        sttus: 200,
        data: data,
        view: 'true'
      })
    })
  } else if (req.params.role == "student") {
    var bacthesData = [];
    var view_data = [];
    var cohortId = [];
    studentBatchModel.find({
      studentId: req.params.id
    }).then(function (batches) {
      var linkView = '';
      batches.forEach(element => {
        linkView = element.linkView;
        bacthesData.push({
          batchesId: element.batchId
        })
      })
      // console.log("batchesa--->>",bacthesData)
      //     cohortModel.aggregate([
      //         {
      //           $match: {
      //            $or:
      //            bacthesData,
      //                  }
      //          },
      //          {
      //            $addFields: {
      //              id: {
      //                $toString: "$_id",
      //              },
      //            },
      //          },
      //             {
      //           $lookup: {
      //             from: "cohorttimetables",
      //             localField: "id",
      //             foreignField: "cohort_id",
      //             as: "cohortTimeTableData",
      //           },
      //           },
      //     //              {
      //     //   $replaceRoot: {
      //     //     newRoot: {
      //     //       $mergeObjects: [
      //     //         {
      //     //           $arrayElemAt: ["$cohortTimeTableData", 0],
      //     //         },
      //     //         "$$ROOT",
      //     //       ],
      //     //     },
      //     //   },
      //     // },
      //           //  {"$unwind":"$cohortTimeTableData"},
      //           //  {"$unwind":"$cohortTimeTableData._id"},
      //         //       {
      //         //    $addFields: {
      //         //      _id: {
      //         //        $toString: "$cohortTimeTableData._id",
      //         //      },
      //         //    },
      //         //  },
      //           //       {
      //           // $lookup: {
      //           //   from: "cohorttopicofthedays",
      //           //   localField: "_id",
      //           //   foreignField: "cohortTimeTableId",
      //           //   as: "topics",
      //           // },
      //           // },

      //     //        {
      //     //   $replaceRoot: {
      //     //     newRoot: {
      //     //       $mergeObjects: [
      //     //         {
      //     //           $arrayElemAt: ["$topics", 0],
      //     //         },
      //     //         "$$ROOT",
      //     //       ],
      //     //     },
      //     //   },
      //     // },
      //     {
      //       $project: {
      //         cohortTimeTableData: 0,
      //         topics : 0
      //       },
      //     },
      // ])
      cohortModel.find({
        $or: bacthesData
      }).then(function (cohorts) {
        cohorts.forEach(cohort => {
          cohortId.push({
            cohort_id: cohort._id
          })
        })

        cohortTimeTableModel.find({
          $or: cohortId
        }).then(function (data) {
          data.forEach(element => {
            cohortTopicOfTheDayModel.find({
              cohortTimeTableId: element._id
            }).then(function (topics) {
              view_data.push({
                fromTime: element.fromTime,
                toTime: element.toTime,
                approval: element.approval,
                _id: element._id,
                date: element.date,
                location: element.location,
                subject: element.subject,
                playbackLink: linkView ? element.playbackLink : '',
                topicNames: topics.length > '0' ? topics[0].topicNames : ''
              });
            })
          })
        })
      })


      setTimeout(() => {
        res.json({
          sttus: 200,
          data: view_data,
          view: linkView
        })
      }, 3000);
    })
  }
})

router.post("/saveCohortAttendance", function (req, res) {
  console.log("req.body",req.body)
  var today = Date.now();
  if (req.body.attendanceArray.length > "0") {
    req.body.attendanceArray.forEach(function (student) {
      cohortAttendanceModel
        .find({
          user_id: student.student_id,
          course_id: student.student_course_id,
          cohortTimeTableId: req.body.timeTableId, //Disable this to enable single day attendance.
          batch_id: student.student_batchID,
          // division_id: student.division_id,
          subject: req.body.subject,
          attendance_date: student.attendance_date,
        })
        .then(function (attendance) {
          if (
            attendance == null ||
            attendance == "" ||
            attendance == "undefined" ||
            attendance == undefined
          ) {
            var attendanceData = new cohortAttendanceModel({
              user_id: student.student_id,
              course_id: student.student_course_id,
              cohortTimeTableId: req.body.timeTableId,
              batch_id: student.student_batchID,
              // division_id: student.division_id,
              subject: req.body.subject,
              present: student.attendanceStatus,
              // virtualPresent:student.virtualStatus,
              attendance_date: student.attendance_date,
              createdOn: today,
              updatedOn: today,
            });
            attendanceData.save(function (err, result) {
              if (err) {
                res.send({
                  status: 500,
                });
              }
            });
          } else {
            var query = {
                user_id: student.student_id,
                course_id: student.student_course_id,
                cohortTimeTableId: req.body.timeTableId, //Disable this to enable single day attendance.
                // division_id: student.division_id,
                subject: req.body.subject,
                attendance_date: student.attendance_date,
              },
              update = {
                $set: {
                  present: student.attendanceStatus,
                },
              };
            cohortAttendanceModel.updateMany(query, update, function (err, lessons) {
              if (err) {
                res.send({
                  status: 500,
                });
              }
            });
          }
        });
    });
    res.send({
      status: 200,
    });
  } else {
    res.send({
      // status: 300,
      message: "please mark attendance...!",
    });
  }
});

// Author megha cohort subject attendance... (Megha Patil ----Date:19-11-2021)
router.get("/cohortAttendanceData", async function (req, res) {
  var date = moment(new Date()).format("YYYY-MM-DD");
  // var courseId = '';
  var chapters = [];
  var view_data = [];
  await cohortModel.find({
    _id: req.query.cohort_id,
  }).exec(async function (err, cohort) {
    await cohort.forEach(async function (cohorts) {
      if (cohorts != '') {
        var batches = cohorts.batchesArr;
        for (var i = 0; i < batches.length; i++) {
          // console.log("batches---"+JSON.stringify(batches))
          // console.log("batches[i]---"+JSON.stringify(batches[i]))
          var courseid = batches[i].split(" ")[1];
          var batchid = batches[i].split(" ")[0]
          // console.log("courseid----"+courseid);
          // console.log("batchid---->"+JSON.stringify(batchid))

          await studentBatchModel.aggregate([{
              $addFields: {
                id: {
                  $toObjectId: "$studentId"
                }
              }
            },
            {
              $match: {
                courseId: {
                  $eq: courseid
                },
                batchId: {
                  $eq: batchid
                },
              }
            },
            {
              "$lookup": {
                "from": "users",
                "localField": "id",
                "foreignField": "_id",
                "as": "users"
              }
            },
            {
              "$lookup": {
                "from": "leaves",
                "localField": "studentId",
                "foreignField": "userId",
                "as": "leaves"
              }
            },

            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [{
                    $arrayElemAt: ["$users", 0]
                  }, "$$ROOT"]
                }
              }
            },
            {
              $project: {
                users: 0
              }
            }
          ]).then(async data => {
            await data.forEach(async elm => {
              if (elm.leaves.length > 0) {
                if (req.query.date <= elm.leaves[0].endDate && req.query.date >= elm.leaves[0].startDate) {
                  await view_data.push({
                    student_id: elm.studentId,
                    student_name: elm.fullName,
                    student_email: elm.email,
                    division_id: elm.divisionId,
                    student_course_id: req.query.course_id,
                    student_batchID: req.query.batch_id,
                    leave: true
                  });
                } else {
                  console.log("qwertyuiop")
                  await view_data.push({
                    student_id: elm.studentId,
                    student_name: elm.fullName,
                    student_email: elm.email,
                    division_id: elm.divisionId,
                    student_course_id: req.query.course_id,
                    student_batchID: req.query.batch_id,
                    leave: false
                  });
                }
              } else {
                await view_data.push({
                  student_id: elm.studentId,
                  student_name: elm.fullName,
                  student_email: elm.email,
                  division_id: elm.divisionId,
                  student_course_id: req.query.course_id,
                  student_batchID: req.query.batch_id,
                  leave: false
                });
              }

            })
          })
        }
      }
    })
    await chapterModel.find({
      courseId: req.query.course_id,
      semesterId: req.query.semester_id,
      subject: req.query.subject
    }).then(async function (chapters) {
      await res.json({
        status: 200,
        data: view_data,
        data2: chapters
      })
    })
  })

});

//Megha Patil ----Date:19-11-2021
router.get("/getDateWiseCohortAttendance", function (req, res) {
  // console.log("req.query----",req.query)
  var view_data = [];
  cohortAttendanceModel.find({
    cohortTimeTableId: req.query.timeTableId,
    attendance_date: req.query.date,
  }).populate('user_id').exec(function (err, cohortAttData) {
    // console.log("cohortAttData-----",cohortAttData)
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (cohortAttData != "" || cohortAttData != undefined || cohortAttData != null) {
      cohortAttData.forEach(function (data) {
        view_data.push({
          _id: data._id,
          student_name: data.user_id.fullName,
          student_email: data.user_id.email,
          student_course_id: data.course_id,
          student_batchID: data.batch_id,
          attendance_date: data.attendance_date,
          status: data.present,
          // virtualPresent: data.virtualPresent,
        });
      });
      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data,
        });
      }, 500);
    }
  });
});

// Author megha save cohort Topic Of The day...Date:19-11-2021
router.post("/saveCohortTopicName", function (req, res) {

  cohortTopicOfTheDayModel.find({
    date: req.body.date,
    subject: req.body.subject,
    cohortTimeTableId: req.body.timeTableId,
  }).then(function (data) {
    if (data.length > 0) {
      var query = {
          _id: data[0]._id
        },
        update = {
          $set: {
            topicNames: req.body.topicName,
          }
        };

      cohortTopicOfTheDayModel.update(query, update, function (err, result) {
        if (err) {
          console.log("err==>" + err);
          res.json({
            status: 400,
            message: 'Bad Request'
          });
        } else {
          res.json({
            data: result,
            status: 200,
          });
        }
      })
    } else {
      var topicNamesData = new cohortTopicOfTheDayModel({
        date: req.body.date,
        topicNames: req.body.topicName,
        subject: req.body.subject,
        cohortTimeTableId: req.body.timeTableId,
      });

      topicNamesData.save(function (err, result) {
        if (err) {
          res.json({
            status: 400,
          });
        } else {
          res.json({
            data: result,
            status: 200,
          });
        }
      });
    }

  })


});

// Author megha update cohort attendance...Date:19-11-2021
router.put('/updateCohortAttendance', function (req, res) {
  var query = {
      _id: req.body._id,
    },
    update = {
      $set: {
        present: req.body.status,
      },
    };

  cohortAttendanceModel.updateMany(query, update, function (err, attendance) {
    if (err) {
      console.error(err);
    } else {
      res.json({
        status: 200,
        data: attendance
      });
    }
  });

});

router.get('/getCohortTimeTable', (req, res) => { //TeacherId and Today date wise  get cohort timetable  (megha)----date 19-11-2021
  cohortTimeTableModel.aggregate([{
      $match: {
        teacher_id: {
          $eq: req.query.user_id,
        },
        date: {
          $eq: req.query.date,
        },
      },
    },
    {
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $lookup: {
        from: "cohorttopicofthedays",
        localField: "id",
        foreignField: "cohortTimeTableId",
        as: "timeTableData",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
              $arrayElemAt: ["$timeTableData", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $project: {
        timeTableData: 0,
      },
    },
  ]).then(function (data) {
    setTimeout(function () {
      res.json({
        status: 200,
        data: data,
      });
    }, 500);
  });
})

//get cohort time table using cohortId and today date wise (megha Patil Date: 19-11-2021)
router.get("/getCohortDetailsById", function (req, res) {
  var count = 0;
  var view_data = [];
  cohortTimeTableModel.find({
    cohort_id: req.query.cohort_id,
    date: req.query.date,
  }).exec(function (err, cohorttimetables) {
    cohorttimetables.forEach(function (cohorttimetable) {
      cohortTopicOfTheDayModel.find({
        cohortTimeTableId: cohorttimetable._id,
        date: req.query.date,
      }).exec(function (err, cohortTopicData) {
        // console.log("cohortTopicData----",cohortTopicData)
        count++;
        view_data.push({
          _id: cohorttimetable._id,
          cohortName: cohorttimetable.cohortName,
          subject: cohorttimetable.subject,
          date: cohorttimetable.date,
          fromTime: cohorttimetable.fromTime,
          toTime: cohorttimetable.toTime,
          approval: cohorttimetable.approval,
          teacher_id: cohorttimetable.teacher_id,
          teacherName: cohorttimetable.teacherName,
          cohort_id: cohorttimetable.cohort_id,
          semester_id: cohorttimetable.semester_id,
          topicdata: cohortTopicData
        })
        if (count == cohorttimetables.length) {
          // console.log("view_data---------",view_data)
          res.json({
            status: 200,
            data: view_data,
          });
        }
      });
    });
    if (err) {
      res.json({
        status: 400,
      });
    } else if (cohorttimetables.length == 0) {
      res.json({
        status: 201,
      });
    }
  });
});

// subject wise cohort attendance date data  (Megha Patil -----date:19-11-2021)
router.get("/viewCohortValidDatesMonths", function (req, res) {
  var view_data = [];
  cohortAttendanceModel
    .find({
      subject: req.query.subject,
    })
    .exec(function (err, attendanceData) {
      // console.log("subject-----"+JSON.stringify(req.query.subject))
      // console.log("attendanceData-----"+JSON.stringify(attendanceData))
      if (attendanceData != "") {
        attendanceData.forEach(function (data) {
          if (data != "") {
            view_data.push(data.attendance_date);
          }
        });
        res.send({
          status: 200,
          data: view_data,
        });
      } else {
        res.send({
          status: 400,
        });
      }
    });
});


//batch wise cohort attendance date data (Megha Patil ----date:19-11-2021)
router.get("/cohortViewValidBatchMonth", function (req, res) {
  var view_data = [];
  cohortModel.find({
    _id: req.query.cohort_id,
  }).exec(function (err, cohort) {
    console.log("req.query.cohort_id----" + JSON.stringify(req.query.cohort_id))
    if (cohort != '') {
      cohort.forEach(function (cohorts) {
        if (cohorts != '') {
          var batches = cohorts.batchesArr;
          for (var i = 0; i < batches.length; i++) {
            // console.log("batches---"+JSON.stringify(batches))
            // console.log("batches[i]---"+JSON.stringify(batches[i]))
            var batchid = batches[i].split(" ")[0]
            // console.log("batchid----"+batchid);
            cohortAttendanceModel.find({
              batch_id: batchid,
            }).exec(function (err, attendanceData) {
              //    console.log("attendanceData^^^^^^^^^^^"+JSON.stringify(attendanceData))
              if (attendanceData != "") {
                attendanceData.forEach(function (data) {
                  if (data != "") {
                    view_data.push(data.attendance_date);
                  }
                });
                //    res.send({
                //   status: 200,
                //   data: view_data,
                //  });
              }
            });
          }
        }
      })
      res.send({
        status: 200,
        data: view_data,
      });
    } else {
      res.send({
        status: 400,
      });
    }
  })
});


//get cohort attendance subject and userId wise (Megha Patil ---- date:19-11-2021)
router.get("/getCohortattendanceIdwise", function (req, res) {
  // console.log("req.query--------",req.query)
  cohortTimeTableModel.aggregate([{
      $match: {
        subject: {
          $eq: req.query.subject,
        },
      },
    },
    {
      $addFields: {
        id: {
          $toString: "$_id"
        }
      }
    },
    {
      $lookup: {
        from: "cohortattendances",
        localField: "id",
        foreignField: "cohortTimeTableId",
        as: "cohortTimeTableData",
      },
    },

    {
      $project: {
        cohortTimeTableData: {
          $filter: {
            input: "$cohortTimeTableData",
            as: "pdf",
            cond: {
              $eq: ["$$pdf.user_id", req.query.id],
            },
          },
        },

        _id: 1,
        semesterName: 1,
        courseName: 1,
        batchName: 1,
        // divisionName: 1,
        subject: 1,
        date: 1,
        time: 1,
        location: 1,
        course_id: 1,
        batch_id: 1,
        // division_id: 1,
        semester_id: 1,
        cohortTimeTableId: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
              $arrayElemAt: ["$cohortTimeTableData", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $project: {
        cohortTimeTableData: 0,
      },
    },
  ]).then(function (data) {
    // console.log("data----",data)
    if (data != '') {
      setTimeout(function () {
        //  console.log("data---",data)
        res.json({
          status: 200,
          data: data
        })
      }, 500)
    } else {
      setTimeout(function () {
        //  console.log("data---",data)
        res.json({
          status: 400,
          data: data
        })
      }, 500)
    }
  });
});


// get cohort attendance using date, cohortId and subject (Megha Patil ---- date:19-11-2021)
router.get("/viewCohortBatchDateWiseData", function (req, res) {
  var view_data = [];
  cohortModel.find({
    _id: req.query.cohort_id,
  }).exec(function (err, cohort) {
    // console.log("req.query.cohort_id----"+JSON.stringify(req.query.cohort_id))
    if (cohort != '') {
      cohort.forEach(function (cohorts) {
        if (cohorts != '') {
          var batches = cohorts.batchesArr;
          for (var i = 0; i < batches.length; i++) {
            // console.log("batches---"+JSON.stringify(batches))
            // console.log("batches[i]---"+JSON.stringify(batches[i]))
            var courseid = batches[i].split(" ")[1];
            var batchid = batches[i].split(" ")[0];
            // console.log("batchid----"+batchid);
            // console.log("courseid----"+courseid);
            cohortAttendanceModel.find({
              attendance_date: req.query.date,
              batch_id: batchid,
              course_id: courseid,
              subject: req.query.subject,
            }).populate("user_id").exec(function (err, attendanceData) {
              // console.log(" attendance_date--" + JSON.stringify(req.query.date));
              // console.log("attendanceData--" + JSON.stringify(attendanceData));
              if (attendanceData != "") {
                attendanceData.forEach(function (data) {
                  if (data != "" && data["user_id"] != null) {
                    view_data.push({
                      student_name: data.user_id.fullName,
                      student_email: data.user_id.email,
                      student_course: data.course_id.courseName,
                      batchName: data.batch_id.batch_id,
                      attendance_date: data.attendance_date,
                      status: data.present,
                    });
                  }
                });
                //   setTimeout(function () {
                //   res.send({
                //     status: 200,
                //     data: view_data,
                //   });
                // },1000);
              }
            });
          }
        }
      })
      setTimeout(function () {
        res.send({
          status: 200,
          data: view_data,
        });
      }, 1000);
    } else {
      setTimeout(function () {
        res.send({
          status: 400,
        });
      }, 1000);
    }
  })
});


//get cohort attendance month wise (Megha Patil ---- date:19-11-2021)
router.get("/viewCohortMonthWiseAttendance", function (req, res) {
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  var batches = [];
  var studentInfo = [];
  var name;
  var subject;
  cohortModel.find({
    _id: req.query.cohort_id,
  }).exec(function (err, cohort) {
    // console.log("req.query.cohort_id----"+JSON.stringify(req.query.cohort_id))

    if (cohort) {
      cohort[0].batchesId.forEach(element => {
        batches.push({
          batch_id: element
        })
      })
      cohortAttendanceModel.find({
        $or: batches,
        subject: req.query.subject,
        attendance_date: {
          $regex: req.query.date, //'2019-07-.*'
        },
      }).populate("course_id", ["courseName"]).populate("user_id").distinct("user_id").exec(function (err, attendence) {
        // console.log("attendence----",attendence)
        // console.log("attendence----",attendence.length)
        if (err) {
          throw err;
        }
        if (attendence != "") {
          attendence.forEach((infoo) => {
            // console.log("infoo==== " + infoo);
            cohortAttendanceModel.find({
                $or: batches,
                subject: req.query.subject,
                user_id: infoo,
                attendance_date: {
                  $regex: req.query.date, //'2019-07-.*'
                },
              })
              .populate("course_id", ["courseName"])
              .populate("user_id")
              .exec(function (err, studentData) {
                studentData.forEach((element) => {
                  if (element["user_id"] != null) {
                    name = element["user_id"]["fullName"];
                    subject = element["subject"];
                  } else {
                    (name = ""), (subject = "");
                  }
                  if (element["user_id"] != null) {
                    if (element["present"] == "Present") {
                      if (
                        element["user_id"] != null &&
                        element["user_id"] != ""
                      ) {}

                      presentCount++;
                      count++;
                    } else if (element["present"] == "Absent") {
                      // name = element['user_id']['fullName']
                      // subject = element['subject']
                      absentCount++;
                      count++;
                    }
                  } else {
                    presentCount++;
                    count++;
                  }


                })
                var percentage = (100 * presentCount) / studentData.length;
                if (name != null && name != "") {
                  // console.log("count----",count)
                  if (studentData.length == count) {
                    // setTimeout(() => {
                    // console.log("name----",name,"studentData.length-----",studentData.length)
                    studentInfo.push({
                      Name: name,
                      subject: subject,
                      present: presentCount,
                      Absent: absentCount,
                      Total_lecture: studentData.length,
                      percentage: percentage,
                    });
                    // },1000)   

                  }
                }
                presentCount = 0;
                absentCount = 0;
                count = 0;
                totalCount++;
                //  console.log("totalCount--- " + totalCount);
                //  console.log("studentInfo=== "+JSON.stringify(studentInfo))
                // setTimeout(function () {
                if (attendence.length == totalCount) {
                  //  console.log("studentInfo=== "+JSON.stringify(studentInfo))
                  res.json({
                    status: 200,
                    data: studentInfo,
                  });
                }
                //  },1000);
              })
          })
        }

      })
    } else {
      res.json({
        status: 400,
        message: "Excel is Not generated!!!!!!........",
      });
    }
  })
});


// date wise cohort attendance save in excel(MP)
router.post("/cohortExcelToExportDateWise", function (req, res) {
  const view_data = [];
  // console.log("cohortExcelToExportDateWise called",req.body)
  //    var present;
  cohortModel.find({
    _id: req.body.cohort_id,
  }).exec(function (err, cohort) {
    // console.log("req.query.cohort_id----"+JSON.stringify(cohort))
    if (cohort != '') {
      cohort.forEach(function (cohorts) {
        if (cohorts != '') {
          var batches = cohorts.batchesArr;
          for (var i = 0; i < batches.length; i++) {
            // console.log("batches---"+JSON.stringify(batches))
            // console.log("batches[i]---"+JSON.stringify(batches[i]))
            var courseid = batches[i].split(" ")[1];
            var batchid = batches[i].split(" ")[0]
            // console.log("courseid----"+courseid);
            cohortAttendanceModel.find({
              course_id: courseid,
              batch_id: batchid,
              subject: req.body.subject,
              attendance_date: req.body.date,
            }).populate("batch_id", ["batch_id"]).populate("course_id", ["courseName", "subjects"]).populate("user_id").exec(function (err, attendancedata) {
              if (err) {
                throw err;
              } else if (attendancedata != "") {
                // console.log("attendancedata----"+JSON.stringify(attendancedata))
                attendancedata.forEach(function (data) {
                  if (data != "") {
                    view_data.push({
                      StudentName: data.user_id.fullName ? data.user_id.fullName : "-",
                      StudentEmail: data.user_id.email ? data.user_id.email : "-",
                      courseName: data.course_id.courseName ?
                        data.course_id.courseName : "-",
                      Subject: req.body.subject,
                      AttendanceStatus: data.present ? data.present : "-",
                    });
                  }
                });
                // console.log("data-----",view_data)

                var view_data_asc = vd(view_data, "StudentName");

                var xls = json2xls(view_data_asc);
                var currentPath = process.cwd();
                // console.log("currentPath-----",currentPath)

                fs.writeFileSync(
                  currentPath +
                  "/src/public/excel_sheets/CohortAttendanceDateWise.xlsx",
                  xls,
                  "binary"
                );

                var file_name = "CohortAttendanceDateWise.xlsx";
                var filepath =
                  currentPath +
                  "/src/public/excel_sheets/CohortAttendanceDateWise.xlsx";
                res.json({
                  status: 200,
                  data: filepath,
                });
              }
              // else {
              //   res.json({
              //     status: 400,
              //     message: "Excel is Not generated!!!!!!........",
              //   });
              // }
            });
          }
        }
      })
    } else {
      res.json({
        status: 400,
        message: "Excel is Not generated!!!!!!........",
      });
    }
  })
});

router.post("/excelToExportMonthSubjectWise", function (req, res) {
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  const studentInfo = [];
  var name;
  var subject;
  attendanceModel
    .find({
      course_id: req.body.course_id,
      // batch_id: req.body.batch_id,
      subject: req.body.subject,
      attendance_date: {
        $regex: req.body.date, //'2019-07-.*'
      },
    })
    .populate("course_id", ["courseName"])
    .populate("user_id")
    .distinct("user_id")
    .exec(function (err, attendancedata) {
      //console.log("attendancedata--- "+JSON.stringify(attendancedata))
      if (err) {
        throw err;
      }
      if (attendancedata != "") {
        attendancedata.forEach((infoo) => {
          // console.log("infoo==== " + infoo);
          attendanceModel
            .find({
              course_id: req.body.course_id,
              batch_id: req.body.batch_id,
              subject: req.body.subject,
              user_id: infoo,
              attendance_date: {
                $regex: req.body.date, //'2019-07-.*'
              },
            })
            .populate("course_id", ["courseName"])
            .populate("user_id")
            .exec(function (err, studentData) {
              //console.log("studentData--- "+JSON.stringify(studentData))
              // console.log(
              //   "studentData--- " + JSON.stringify(studentData.length)
              // );
              studentData.forEach((element) => {
                //console.log("element--- "+JSON.stringify(element))
                if (element["user_id"] != null) {
                  name = element["user_id"]["fullName"];
                  subject = element["subject"];
                } else {
                  (name = ""), (subject = "");
                }

                if (element["user_id"] != null) {
                  if (element["present"] == "Present") {
                    if (
                      element["user_id"] != null &&
                      element["user_id"] != ""
                    ) {}

                    presentCount++;
                    count++;
                  } else if (element["present"] == "Absent") {
                    // name = element['user_id']['fullName']
                    // subject = element['subject']
                    absentCount++;
                    count++;
                  }
                } else {
                  presentCount++;
                  count++;
                }
              });
              var percentage = (100 * presentCount) / studentData.length;
              if (name != null && name != "") {
                if (studentData.length == count) {
                  //setTimeout(() => {
                  studentInfo.push({
                    Name: name,
                    subject: subject,
                    present: presentCount,
                    Absent: absentCount,
                    Total_lecture: studentData.length,
                    percentage: percentage,
                  });
                  //},8000)
                }
              }

              presentCount = 0;
              absentCount = 0;
              count = 0;
              totalCount++;
              // console.log("totalCount--- " + totalCount);
              if (attendancedata.length == totalCount) {
                //console.log("studentInfo=== "+JSON.stringify(studentInfo))
                //setTimeout(() => {
                var studentInfo_asc = vd(studentInfo, "Name");
                var xls = json2xls(studentInfo_asc);
                var currentPath = process.cwd();
                // console.log("currentPath== " + currentPath);
                fs.writeFileSync(
                  currentPath +
                  "/src/public/excel_sheets/AttendanceMonthWise" +
                  req.body.date +
                  ".xlsx",
                  xls,
                  "binary"
                );
                //fs.writeFileSync('C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+".xlsx", xls, 'binary')
                var file_name = "AttendanceMonthWise.xlsx";
                var filepath =
                  currentPath +
                  "/src/public/excel_sheets/AttendanceMonthWise" +
                  req.body.date +
                  ".xlsx";
                //var filepath = 'C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+'.xlsx';
                //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
                res.json({
                  status: 200,
                  data: filepath,
                });
                //},3000)
              }
            });
        });
      } else {
        res.json({
          status: 400,
          message: "Excel is Not generated!!!!!!........",
        });
      }
    });
});

// Month wise cohort attendance save in excel (MP)
router.post("/cohortExcelToExportMonthSubjectWise", function (req, res) {
  var view_data = [];
  var presentCount = 0;
  var absentCount = 0;
  var count = 0;
  var totalCount = 0;
  const studentInfo = [];
  var name;
  var subject;
  cohortModel.find({
    _id: req.body.cohort_id,
  }).exec(function (err, cohort) {
    //  console.log("req.body.cohort_id----"+JSON.stringify(req.body.cohort_id))
    if (cohort != '') {
      cohort.forEach(function (cohorts) {
        if (cohorts != '') {
          var batches = cohorts.batchesArr;
          for (var i = 0; i < batches.length; i++) {
            // console.log("batches---"+JSON.stringify(batches))
            // console.log("batches[i]---"+JSON.stringify(batches[i]))
            var courseid = batches[i].split(" ")[1];
            var batchid = batches[i].split(" ")[0]
            // console.log("courseid----"+courseid);
            cohortAttendanceModel.find({
              course_id: courseid,
              batch_id: batchid,
              subject: req.body.subject,
              attendance_date: {
                $regex: req.body.date, //'2019-07-.*'
              },
            }).populate("course_id", ["courseName"]).populate("user_id").distinct("user_id").exec(function (err, attendancedata) {
              if (err) {
                throw err;
              }
              if (attendancedata != "") {
                attendancedata.forEach((infoo) => {
                  cohortAttendanceModel.find({
                    course_id: courseid,
                    batch_id: batchid,
                    subject: req.body.subject,
                    user_id: infoo,
                    attendance_date: {
                      $regex: req.body.date, //'2019-07-.*'
                    },
                  }).populate("course_id", ["courseName"]).populate("user_id").exec(function (err, studentData) {
                    studentData.forEach((element) => {
                      if (element["user_id"] != null) {
                        name = element["user_id"]["fullName"];
                        subject = element["subject"];
                      } else {
                        (name = ""), (subject = "");
                      }

                      if (element["user_id"] != null) {
                        if (element["present"] == "Present") {
                          if (
                            element["user_id"] != null &&
                            element["user_id"] != ""
                          ) {}

                          presentCount++;
                          count++;
                        } else if (element["present"] == "Absent") {
                          // name = element['user_id']['fullName']
                          // subject = element['subject']
                          absentCount++;
                          count++;
                        }
                      } else {
                        presentCount++;
                        count++;
                      }
                    });
                    var percentage = (100 * presentCount) / studentData.length;
                    if (name != null && name != "") {
                      if (studentData.length == count) {
                        //setTimeout(() => {
                        studentInfo.push({
                          Name: name,
                          subject: subject,
                          present: presentCount,
                          Absent: absentCount,
                          Total_lecture: studentData.length,
                          percentage: percentage,
                        });
                        //},8000)
                      }
                    }

                    presentCount = 0;
                    absentCount = 0;
                    count = 0;
                    totalCount++;
                    if (attendancedata.length == totalCount) {
                      //setTimeout(() => {
                      var studentInfo_asc = vd(studentInfo, "Name");
                      var xls = json2xls(studentInfo_asc);
                      var currentPath = process.cwd();
                      fs.writeFileSync(
                        currentPath +
                        "/src/public/excel_sheets/CohortAttendanceMonthWise" +
                        req.body.date +
                        ".xlsx",
                        xls,
                        "binary"
                      );
                      //fs.writeFileSync('C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+".xlsx", xls, 'binary')
                      var file_name = "CohortAttendanceMonthWise.xlsx";
                      var filepath =
                        currentPath +
                        "/src/public/excel_sheets/CohortAttendanceMonthWise" +
                        req.body.date +
                        ".xlsx";
                      //var filepath = 'C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/AttendanceMonthWise'+'.xlsx';
                      //var filepath = 'https://lms.sdbi.in/lmsserver/src/src/public/excel_sheets/AttendanceDateWise.xlsx'
                      res.json({
                        status: 200,
                        data: filepath,
                      });
                      //},3000)
                    }
                  });
                });
              }
              // else {
              //   res.json({
              //     status: 400,
              //     message: "Excel is Not generated!!!!!!........",
              //   });
              // }
            });
          }
        }
      })
    } else {
      res.json({
        status: 400,
        message: "Excel is Not generated!!!!!!........",
      });
    }
  })
});

// filter schedule teacher wise (Megha Date: 22-11-2021)
router.get('/getFilterTimeTableTeacherWise', function (req, res) {
  NewTimeTableModel.aggregate([{
      $match: {
        teacher_id: {
          $eq: req.query.teacher_id,
        }
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
        "from": "topicofthedays",
        "localField": "id",
        "foreignField": "timeTableId",
        "as": "timeTableData"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$timeTableData", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        timeTableData: 0
      }
    }
  ]).then(function (data) {

    setTimeout(function () {
      res.json({
        status: 200,
        data: data
      })
    }, 500)
  });

});

router.get('/UnmarkedDate', function (req, res) {
  var view_data = []
  NewTimeTableModel.aggregate([{
      $match: {
        course_id: req.query.course_id,
        batch_id: req.query.batch_id,
        subject: req.query.subject,
        date: {
          $regex: req.query.date
        }
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
      $lookup: {
        from: "attendances",
        let: {
          id: {
            $toString: "$_id"
          },
          userId: req.query.userId
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                  $eq: ["$timeTableId", "$$id"],
                },
                {
                  $eq: ["$user_id", "$$userId"],
                }
              ]
            }
          }
        }],
        as: "attendence"
      }
    },


    {
      $project: {
        "date": 1,
        "subject": 1,
        "teacherName": 1,
        "fromTime": 1,
        "toTime": 1,
        "count": {
          "$size": "$attendence"
        }
      }
    }


  ]).then(function (data) {
    data.forEach(info => {
      if (info.count == 0) {
        view_data.push({
          userId: info._id,
          subject: info.subject,
          teacherName: info.teacherName,
          date: info.date,
          fromTime: info.fromTime,
          toTime: info.toTime,
        });
      }
    })
    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      })
    }, 500)
  })


});

router.get('/cancelLectureDate', function (req, res) {
  // console.log("req.query",req.query)
  var view_data = []
  NewTimeTableModel.aggregate([{
      $match: {
        course_id: req.query.course_id,
        batch_id: req.query.batch_id,
        subject: req.query.subject,
        approval : 'Rejected',
        date: {
          $regex: req.query.date
        }
      }
    },
  ]).then(data=>{

    // console.log("data",data)
    res.json({
      status: 200,
      data: data
    })
  })
      
  })
  
router.post('/saveLeave', (req, res) => {
  saveLeave(req)
  var startDate = moment(req.body.startDate).format("YYYY-MM-DD")
  var endDate = moment(req.body.endDate).format("YYYY-MM-DD")
  if (req.body.role == 'student') {
    studentBatchModel.aggregate([{
        $match: {
          studentId: {
            $eq: req.body.userId
          },
        },
      },
      {
        $addFields: {
          batchId: {
            $toObjectId: "$batchId"
          }
        }
      },
      {
        $lookup: {
          from: "batchmasters",
          localField: "batchId",
          foreignField: "_id",
          as: "batch"
        }
      },

    ]).then(data => {
      data.forEach(elm => {
        if (elm.batch[0].batchStatus == 'true' ) {
          leavesModel.create({
            userId: req.body.userId,
            courseId: elm.courseId,
            batchId: elm.batchId,
            title: req.body.title,
            startDate: startDate,
            endDate: endDate,
            description: req.body.description,
            role: req.body.role,
            status: '',
            reasonForLeave: req.body.reasonForLeave,
            hide: false
          }).then(leave => {
            if (leave) {
              res.json({
                status: 200,
                data: leave
              })
            } else {
              res.json({
                status: 400,
              })
            }
          })
        }
      })
    })
  } else {
    leavesModel.create({
      userId: req.body.userId,
      title: req.body.title,
      startDate: startDate,
      endDate: endDate,
      description: req.body.description,
      role: req.body.role,
      status: '',
      hide: false,
      reasonForLeave: req.body.reasonForLeave,
    }).then(leave => {
      if (leave) {
        res.json({
          status: 200,
          data: leave
        })
      } else {
        res.json({
          status: 400,
        })
      }
    })
  }



});

async function saveLeave(req) {
  var startDate = moment(req.body.startDate).format("YYYY-MM-DD")
  var endDate = moment(req.body.endDate).format("YYYY-MM-DD")
  var user = await getId.getUserId(req.body.userId, '')
  if (req.body.role == 'student') {
    models.studentbatches.getstudentBatchforLeave(user.id).then(batches => {
      batches.forEach(elm => {
        if (elm.batchStatus == 'true') {
          models.leaves.create({
            userId: user.id,
            courseId: elm.courseId,
            batchId: elm.batchId,
            title: req.body.title,
            startDate: startDate,
            endDate: endDate,
            description: req.body.description,
            role: req.body.role,
            status: '',
            reasonForLeave: req.body.reasonForLeave,
            hide: false
          }).then(leaves => {
            console.log("leaves", leaves)
          })
        } 
      })
    })
  } else {
    models.leaves.create({
      userId: user.id,
      title: req.body.title,
      startDate: startDate,
      endDate: endDate,
      description: req.body.description,
      role: req.body.role,
      status: '',
      hide: false,
      reasonForLeave: req.body.reasonForLeave,
    }).then(leaves => {
      console.log("leaves", leaves)
    })
  }
}

router.get('/getLeavesData', (req, res) => {
  leavesModel.find({
    userId: req.query.userId,
    role: req.query.userRole,
    hide: false
  }).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      })
    } else {
      res.json({
        status: 400,
      })
    }
  })
})

router.get('/getLeaves', (req, res) => {
  leavesModel.find({
    _id: req.query.leaveId
  }).populate('batchId', ['batchName', 'year']).populate('courseId', ['courseName']).then(async data => {
    res.json({
      status: 200,
      data: data
    })
  })

})
router.get('/getLeaveByRole', (req, res) => {
  // var date = moment(new Date()).format('YYYY-MM');
  leavesModel.find({
      role: req.query.role,
      // startDate :	{
      // 							$regex:date
      // 						}
    }).populate('batchId', ['batchName', 'year']).populate('courseId', ['courseName']).populate('userId', ['fullName'])
    .then(data => {
      if (data) {
        res.json({
          status: 200,
          data: data
        })
      }
    })
})
router.get('/getLeavesFile', (req, res) => {
  leavesUploadModel.find({
    leaveId: req.query.leaveId
  }).then(data => {
    res.json({
      status: 200,
      data: data
    })
  })
})

router.post('/changeLeaveStatus', (req, res) => {
  changeLeaveStatus(req.body)
  var query = {
      _id: req.body.leaveId
    },
    update = {
      $set: {
        status: req.body.status,
        updatedOn: moment(new Date())
      },
    };
  leavesModel.updateMany(query, update, function (err, leaves_status) {
    if (err) {
      console.error(err);
    } else {
      res.json({
        status: 200,
        data: leaves_status
      });
    }
  });

})
async function changeLeaveStatus(body) {
  leavesModel.find({
    _id: body.leaveId
  }).then(async leave => {
    var batch = await getId.getBatchId(body.batchId, '')
    var course = await getId.getCourseId(body.courseId, '')
    var user = await getId.getUserId(body.userId, '')
    models.leaves.find({
      where: {
        userId: user.id,
        courseId: course.id,
        batchId: batch.id,
        title: body.title,
      }
    }).then(lev => {
      if(lev){
        lev.update({
          status: body.status
        }).then(data => {
          // console.log("data", data)
        })
      }
     
    })
  })
}
router.post('/changeHiddenStatus', (req, res) => {
  changeHiddenStatus(req.body)
  var query = {
      _id: req.body.leaveId
    },
    update = {
      $set: {
        hide: req.body.hide
      },
    };
  leavesModel.updateMany(query, update, function (err, leaves_status) {
    if (err) {
      console.error(err);
    } else {
      res.json({
        status: 200,
        data: leaves_status
      });
    }
  });

})
async function changeHiddenStatus(body) {
  leavesModel.find({
    _id: body.leaveId
  }).then(async leave => {
    var batch = await getId.getBatchId(leave[0].batchId, '')
    var course = await getId.getCourseId(leave[0].courseId, '')
    var user = await getId.getUserId(leave[0].userId, '')
    models.leaves.find({
      where: {
        userId: user.id,
        courseId: course.id,
        batchId: batch.id,
        title: body.title,
      }
    }).then(lev => {
      if(lev){
        lev.update({
          hide: body.hide
        }).then(data => {
          // console.log("data", data)
        })
      }
     
    })
  })
}
router.get('/getLeaveDateByFilter', (req, res) => {

  leavesModel.find({
      courseId: req.query.courseId,
      batchId: req.query.batchId,
      $or: [{
          startDate: {
            $gte: req.query.startDate,
            $lte: req.query.endDate
          },
        },
        {
          endDate: {
            $gte: req.query.startDate,
            $lte: req.query.endDate
          }
        },
      ]



    }).populate('batchId', ['batchName', 'year'])
    .populate('courseId', ['courseName'])
    .populate('userId', ['fullName']).
  then(data => {
    // console.log("data",data)
    if (data) {
      res.json({
        status: 200,
        data: data
      })
    }
  })
})
async function changeHiddenStatus(body) {
  leavesModel.find({
    _id: body.leaveId
  }).then(async leave => {
    var batch = await getId.getBatchId(leave[0].batchId, '')
    var course = await getId.getCourseId(leave[0].courseId, '')
    var user = await getId.getUserId(leave[0].userId, '')
    models.leaves.find({
      where: {
        userId: user.id,
        courseId: course.id,
        batchId: batch.id,
        title: body.title,
      }
    }).then(lev => {
      if(lev){
        lev.update({
          hide: body.hide
        }).then(data => {
          // console.log("data", data)
        })
      }
    
    })
  })
}

router.post('/getExcelExportLeaves', (req, res) => {
  var view_data = []
  const studentInfo = []
  leavesModel.find({
      courseId: req.body.courseId,
      batchId: req.body.batchId,
      $or: [{
          startDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
          },
        },
        {
          endDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
          }
        },
      ]



    }).populate('batchId', ['batchName', 'year'])
    .populate('courseId', ['courseName'])
    .populate('userId', ['fullName']).
  then(data => {
    data.forEach(elm => {
      view_data.push({
        studentName: elm.userId.fullName,
        courseName: elm.courseId.courseName,
        batchName: elm.batchId.batchName + elm.batchId.year,
        Title: elm.title,
        Status: elm.status,
        From: elm.startDate,
        To: elm.endDate,
      })
    })
    if (view_data) {
      var studentInfo_asc = vd(view_data, "studentName");
      var xls = json2xls(studentInfo_asc);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/StudentLeaves" + req.body.startDate + "-" + req.body.endDate + ".xlsx",
        xls,
        "binary"
      );
      var file_name = "StudentLeaves.xlsx";
      var filepath =
        currentPath +
        "/src/public/excel_sheets/StudentLeaves" +
        req.body.startDate + "-" + req.body.endDate +
        ".xlsx";
      res.json({
        status: 200,
        data: filepath,
      });
    }
  })
})

router.get('/getUserLeaveData', (req, res) => {
  leavesModel.find({
    userId: req.query.userId,
  }).populate('userId', ['fullName']).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      });
    }
  })
})

router.get('/getUserLeavesByDate', (req, res) => {
  leavesModel.find({
    userId: req.query.userId,
    $or: [{
        startDate: {
          $gte: req.query.startDate,
          $lte: req.query.endDate
        },
      },
      {
        endDate: {
          $gte: req.query.startDate,
          $lte: req.query.endDate
        }
      },
    ]

  }).populate('userId', ['fullName']).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      });
    }
  })
})
router.post('/getExcelExportUserLeaves', (req, res) => {
  console.log("req.body", req.body)
  var view_data = []
  if (req.body.startDate == '' && req.body.endDate == '') {
    leavesModel.find({
      userId: req.body.userId,
    }).populate('userId', ['fullName']).then(data => {
      data.forEach(async elm => {
        await view_data.push({
          TeacherName: elm.userId.fullName,
          Title: elm.title,
          Status: elm.status,
          From: elm.startDate,
          To: elm.endDate,
        })
      })
      if (view_data) {
        console.log("view_data", view_data)
        var studentInfo_asc = vd(view_data, "studentName");
        var xls = json2xls(studentInfo_asc);
        var currentPath = process.cwd();
        fs.writeFileSync(currentPath + "/src/public/excel_sheets/Leaves.xlsx",
          xls,
          "binary"
        );
        var file_name = "Leaves.xlsx";
        var filepath =
          currentPath +
          "/src/public/excel_sheets/Leaves.xlsx";
        res.json({
          status: 200,
          data: filepath,
        });
      }
    })
  } else {
    leavesModel.find({
      userId: req.body.userId,
      $or: [{
          startDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
          },
        },
        {
          endDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
          }
        },
      ]

    }).populate('userId', ['fullName']).then(data => {
      data.forEach(elm => {
        view_data.push({
          TeacherName: elm.userId.fullName,
          Title: elm.title,
          Status: elm.status,
          From: elm.startDate,
          To: elm.endDate,
        })
      })
      if (view_data) {
        var studentInfo_asc = vd(view_data, "studentName");
        var xls = json2xls(studentInfo_asc);
        var currentPath = process.cwd();
        fs.writeFileSync(currentPath + "/src/public/excel_sheets/Leaves" + req.body.startDate + "-" + req.body.endDate + ".xlsx",
          xls,
          "binary"
        );
        var file_name = "Leaves.xlsx";
        var filepath =
          currentPath +
          "/src/public/excel_sheets/Leaves" + req.body.startDate + "-" + req.body.endDate + ".xlsx";
        res.json({
          status: 200,
          data: filepath,
        });
      }
    })
  }
})

router.post('/getAllExcelExportUserLeaves', (req, res) => {
  console.log("req.body",req.body)
  var view_data =[]
  leavesModel.find({
    role : req.body.role
  }).populate('userId', ['fullName']).then(data =>{
    data.forEach(async elm => {
      await view_data.push({
        TeacherName: elm.userId.fullName,
        Title: elm.title,
        Status: elm.status,
        From: elm.startDate,
        To: elm.endDate,
      })
    })
    if (view_data) {
      console.log("view_data", view_data)
      var studentInfo_asc = vd(view_data, "studentName");
      var xls = json2xls(studentInfo_asc);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/AllLeaves.xlsx",
        xls,
        "binary"
      );
      var file_name = "AllLeaves.xlsx";
      var filepath =
        currentPath +
        "/src/public/excel_sheets/AllLeaves.xlsx";
      res.json({
        status: 200,
        data: filepath,
      });
    }
  })

})

router.get('/rejectedLecture', (req, res) => {
  NewTimeTableModel.find({
    approval: 'Rejected',
  }).populate('batch_id', ['year']).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data,
      });
    }
  })
})

router.get('/getRejectedLectureOfTeacher', (req, res) => {
  NewTimeTableModel.find({
    approval: 'Rejected',
    teacher_id: req.query.teacherId
  }).populate('batch_id', ['year']).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data,
      });
    }
  })
})


router.post('/excelToExportcancel', (req, res) => {
  var view_data = []
  NewTimeTableModel.find({
    approval: 'Rejected',
    teacher_id: req.body.teacherId
  }).populate('batch_id', ['year']).then(data => {
    data.forEach(async elm => {
      await view_data.push({
        TeacherName: elm.teacherName,
        CourseName: elm.courseName,
        BatchYear: elm.batch_id.year,
        Subject: elm.subject,
        Date: elm.date,
        SemesterName: elm.semesterName,
        timming: elm.fromTime + elm.toTime,
        reason: h2p(elm.reason)
      })
    })
    if (view_data) {
      // console.log("view_data", view_data)
      var teacherInfo_asc = vd(view_data, "studentName");
      var xls = json2xls(teacherInfo_asc);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/cancel.xlsx",
        xls,
        "binary"
      );
      var file_name = "cancel.xlsx";
      var filepath =
        currentPath +
        "/src/public/excel_sheets/cancel.xlsx";
      res.json({
        status: 200,
        data: filepath,
      });
    }
  })
});

router.post('/getexcelexportRejectedLecture', (req, res) => {
  var view_data = []
  NewTimeTableModel.find({
    approval: 'Rejected',
  }).populate('batch_id', ['year']).then(data => {
    data.forEach(async elm => {
      await view_data.push({
        TeacherName: elm.teacherName,
        CourseName: elm.courseName,
        BatchYear: elm.batch_id.year,
        Subject: elm.subject,
        Date: elm.date,
        SemesterName: elm.semesterName,
        timming: elm.fromTime + elm.toTime,
        reason: h2p(elm.reason)
      })

    })
    if (view_data) {
      var teacherInfo_asc = vd(view_data, "studentName");
      var xls = json2xls(teacherInfo_asc);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/Allcancel.xlsx",
        xls,
        "binary"
      );
      var file_name = "Allcancel.xlsx";
      var filepath =
        currentPath +
        "/src/public/excel_sheets/Allcancel.xlsx";
      res.json({
        status: 200,
        data: filepath,
      });
    }
  })

})

router.get('/getCancelTeacher', (req, res) => {
  var admin =[]
  var subadmin = []
  var teacher = []
  NewTimeTableModel.find({
    approval: 'Rejected',
    teacher_id: req.query.teacherId
  }).populate('batch_id', ['year']).then(async data =>{
    data.forEach(async reject => {
      if(reject.cancelByRole == 'admin'){
      await  admin.push({
         teacher: reject.teacherName,
         course: reject.courseName,
         subject: reject.subject,
         batch_id: reject.batch_id,
         batch: reject.batchName,
         date: reject.date,
         semester: reject.semesterName,
         division: reject.divisionName,
         approval: reject.appproval,
         reason: reject.reason,
         cancelRole: reject.cancelByRole,
         fromTime :reject.fromTime,
         toTime : reject.toTime, 
         createdOn: reject.createdOn,
         updatedOn: reject.updatedOn
   
        })
       }
       else if(reject.cancelByRole =='subadmin'){
       await  subadmin.push({
           teacher: reject.teacherName,
           course: reject.courseName,
           subject: reject.subject,
           batch_id: reject.batch_id,
           batch: reject.batchName,
           date: reject.date,
           semester: reject.semesterName,
           division: reject.divisionName,
           approval: reject.appproval,
           reason: reject.reason,
           cancelRole: reject.cancelByRole,
           createdOn: reject.createdOn,
           updatedOn: reject.updatedOn,
           fromTime :reject.fromTime,
           toTime : reject.toTime, 
     
          }) 
        }
       else if(reject.cancelByRole =='teacher'){
       await  teacher.push({
           teacher: reject.teacherName,
           course: reject.courseName,
           subject: reject.subject,
           batch_id: reject.batch_id,
           batch: reject.batchName,
           date: reject.date,
           semester: reject.semesterName,
           division: reject.divisionName,
           approval: reject.appproval,
           reason: reject.reason,
           cancelRole: reject.cancelByRole,
           createdOn: reject.createdOn,
           updatedOn: reject.updatedOn,
           fromTime :reject.fromTime,
           toTime : reject.toTime,
     
          })
       }
    })
   await res.json({
      status: 200,
      admin: admin,
      subadmin:subadmin,
      teacher :teacher
    });  
  })
})
router.get("/getcohortattendanceId", function (req, res) {
  NewTimeTableModel.aggregate([{
    $addFields: {
      id: {
        $toString: "$_id",
      },
    },
  },
  {
    $match: {
      course_id: {
        $eq: req.query.course_id,
      },
      batch_id: {
        $eq: req.query.batch_id
      },
      subject: {
        $eq: req.query.subject,
      },
      "semester_id": {
        $eq: req.query.semesterId
      },
    },
  },
  {
    $lookup: {
      from: "attendances",
      localField: "id",
      foreignField: "timeTableId",
      as: "timeTableData",
    },
  },
  {
    $lookup: {
      from: "topicofthedays",
      localField: "id",
      foreignField: "timeTableId",
      as: "topics",
    },
  },
  {
    $project: {
      timeTableData: {
        $filter: {
          input: "$timeTableData",
          as: "pdf",
          cond: {
            $eq: ["$$pdf.user_id", req.query.id],
          },
        },
      },
      topics: {
        $filter: {
          input: "$topics",
          as: "pdf",
          cond: {},
        },
      },

      _id: 1,
      semesterName: 1,
      courseName: 1,
      batchName: 1,
      subject: 1,
      date: 1,
      fromTime: 1,
      toTime: 1,
      location: 1,
      course_id: 1,
      batch_id: 1,
      semester_id: 1,
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$timeTableData", 0],
        },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$topics", 0],
        },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      timeTableData: 0,
      topics: 0,
    },
  },
  ])
    .then(function (data) {
      setTimeout(function () {
        res.json({
          status: 200,
          data: data,
        });
      }, 500);
    });
});

router.post("/studentExcelRangeWise", function (req, res) {
  var view_data = []
  NewTimeTableModel.aggregate([
    {
      $match: {
        course_id: {
          $eq: req.body.course_id
        },
        batch_id: {
          $eq: req.body.batch_id
        },
        subject: {$eq:req.body.subject},
        date: {
          $gte: req.body.startDate,
          $lte: req.body.endDate
        }
      }
    },
    {
      $addFields: {
        studentId: {
          $toObjectId: req.body.user_id,
        }
      }
    }, {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "studentName"
      }
    },
    {
      $addFields: {
        course_id: {
          $toObjectId: req.body.course_id,
        }
      }
    },
     {
      $lookup: {
        from: "collegecourses",
        localField: "course_id",
        foreignField: "_id",
        as: "courseName"
      }
    },
    {
      $addFields: {
        batch_id: {
          $toObjectId: req.body.batch_id,
        }
      }
    },
  {
      $lookup: {
        from: "batchmasters",
        localField: "batch_id",
        foreignField: "_id",
        as: "batchName"
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
      $lookup: {
        from: "attendances",
        let: {
          userid: req.body.user_id,
          timeTableId: '$id'
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                $eq: ["$user_id", "$$userid"],
              },
              {
                $eq: ["$timeTableId", "$$timeTableId"],
              },

              ]
            }
          }
        }],
        as: "result",
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{
            $arrayElemAt: ["$result", 0]
          }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        result: 0,
      }
    }
  ]).then(data => {
    data.forEach(elm => {
      view_data.push({
        studentname: elm.studentName[0].fullName,
        teacherName: elm.teacherName,
        course: elm.courseName[0].courseName,
        batch: elm.batchName[0].batchName,
        Subject: elm.subject,
        Date: elm.date,
        toTime: elm.toTime,
        fromTime: elm.fromTime,
        status: elm.present ?  elm.present : 'UnMarked'
      })
    })
    setTimeout(() => {
      if (view_data != []) {
        var view_data_asc = vd(view_data, "StudentName");
        var xls = json2xls(view_data_asc);
        var currentPath = process.cwd();
        fs.writeFileSync(
          currentPath +
          "/src/public/excel_sheets/AttendanceRangeWise.xlsx",
          xls,
          "binary"
        );
        var file_name = "AttendanceRangeWise.xlsx";
        var filepath = currentPath +
          "/src/public/excel_sheets/AttendanceRangeWise.xlsx";
        res.json({
          status: 200,
          data: filepath,
        });


      } else {
        res.json({
          status: 400,
          message: "Excel is Not generated!!!!!!........",
        });

      }
    }, 2000);
  })
 
})


module.exports = router;