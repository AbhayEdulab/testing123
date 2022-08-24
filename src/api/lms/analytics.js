var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CollegeDepartmentSchema = require('../../app/models/collegeDepartment');
var collegeDepartmentModel = mongoose.model('CollegeDepartment');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var SemesterSchema = require('../../app/models/semester');
var semesterModel = mongoose.model('Semester');
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
const { google } = require('googleapis');
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
var noticeUploadSchema = require('../../app/models/noticeUpload');
const { json } = require('express');
var moment = require('moment');
var noticeUploadModel = mongoose.model('NoticeUpload');
var emailService = require('../../utils/emailService');
require('../../app/models/onlineSubjectLink');
var onlineSubjectLinkModel = mongoose.model('OnlineSubjectLink');
require('../../app/models/onlineLectureLink');
var onlineLectureLinkModel = mongoose.model('OnlineLectureLink');
require('../../app/models/subjectViewTracking');
var subjectViewTrackingModel = mongoose.model('SubjectViewTracking');
var mcqSchema = require('../../app/models/MCQ');
const { query } = require('../../utils/logger');
var mcqModel = mongoose.model('MCQ');
var studentLoginTimeSchema = require('../../app/models/studentLoginTime');
var studentLoginTimeModel = mongoose.model('StudentLoginTime');
require('../../app/models/studentLoginCount');
var studentLoginCountModel = mongoose.model('studentLoginCount');
var studentAnalyticModel = require('./../../app/models/studentAnalytics')
require('../../app/models/EmailTracker');
var EmailTrackerModel = mongoose.model('EmailTracker');
var json2xls = require('json2xls');
var fs = require('fs');
var vd = require('sort-objects-array');
var self_PDF = require('../lms/pdfMake');

const config = require('config');
var sendgrid = require('@sendgrid/mail');
const { key } = config.get('sendGrid');
const sengrid_key = key;

router.post('/addSubjectViewTracking', function (req, res) {
  var fileData = [];
  var count = 0;
  var data1 = {
    pptNotes_practiseQuestion_dataSet: [],
    prerequisite: [],
    onlineLecture: [],
    quiz: [],
  };
  var ppt_notes = 0;
  var practise_question = 0;
  var dataSet = 0;
  var prerequisite = 0;
  var onlineLecture = 0;
  var quiz = 0;
  chapterModel.find({
    courseId: req.body.courseId,
    subject: req.body.subject,
    semesterId: req.body.semesterId
  }).then(function (chapter) {
    if (chapter != '') {
      uploads.find({
        lessonId: req.body.chapterId,
      }).then(function (upload) {
        if (upload != '') {
          fileData.push({
            count: upload.length
          });
        } else {
          fileData.push({
            count: upload.length
          });
        }
      });

      youTubeLinkModel.find({
        chapterId: req.body.chapterId,
      }).then(function (youtube) {
        if (youtube != '') {
          fileData.push({
            count: youtube.length
          });
        } else {
          fileData.push({
            count: youtube.length
          });
        }
      });

      onlineLectureLinkModel.find({
        chapterId: req.body.chapterId,
      }).then(function (online) {
        if (online != '') {
          fileData.push({
            count: online.length
          });
        } else {
          fileData.push({
            count: online.length
          });
        }
      });

      mcqModel.find({
        chapterId: req.body.chapterId,
      }).then(function (mcq) {
        if (mcq != '') {
          fileData.push({
            count: mcq.length
          });
        } else {
          fileData.push({
            count: mcq.length
          });
        }
      });

      setTimeout(function () {
        var filedata1 = fileData[0].count ? fileData[0].count : 0;
        var filedata2 = fileData[1].count ? fileData[1].count : 0;
        var filedata3 = fileData[2].count ? fileData[2].count : 0;
        var filedata4 = fileData[3].count ? fileData[3].count : 0;
        var totalFiles = filedata1 + filedata2 + filedata3 + filedata4;
        subjectViewTrackingModel.find({
          courseId: req.body.courseId,
          subject: req.body.subject,
          semesterId: req.body.semesterId
        }).then(function (subjectView) {
          if (subjectView != '') {
            var subViewCount = subjectView[0].subjectViewCount;
            var subViewCounts = subViewCount + req.body.subjectCount;
            var totalPercentage = parseInt(subViewCounts / totalFiles * 100).toFixed(2);
            var query = {
              _id: subjectView[0]._id
            },
              update = {
                $set: {
                  subjectViewCount: subViewCounts,
                  percentage: totalPercentage,
                  totalFiles: totalFiles
                }
              };
            subjectViewTrackingModel.updateMany(query, update, function (err, subjectView) {
              if (err) {
                res.send({
                  status: 500
                })
              } else {
                res.json({
                  status: 200,
                  data: subjectView
                });
              }
            })
          } else {
            var subjectviewCount = req.body.subjectCount;
            var totalPercentage = parseInt(subjectviewCount / totalFiles * 100).toFixed(2);
            var subjectViewCount = new subjectViewTrackingModel({
              courseId: req.body.courseId,
              subject: req.body.subject,
              semesterId: req.body.semesterId,
              subjectViewCount: req.body.subjectCount,
              percentage: totalPercentage,
              totalFiles: totalFiles
            });
            subjectViewCount.save(function (err, result) {
              if (err) {
                console.error("error=====>" + err);
              } else {
                res.json({
                  status: 200,
                  data: result
                })
              }
            });
          }
        });
      }, 2000);

    }
  })

});

router.get('/subjectView', function (req, res) {

  var course_subjects = [];
  var data1 = {
    subject1: [],
    subject2: [],
    subject3: [],
    subject4: [],
    subject5: [],
    subject6: [],
    subject7: [],
    subject_name1: [],
    subject_name2: [],
    subject_name3: [],
    subject_name4: [],
    subject_name5: [],
    subject_name6: [],
    subject_name7: [],

  }
  var subjectName = '';
  if (req.query.role == 'teacher') {
    if (req.query.semesterId == 'undefined' || req.query.semesterId == undefined) {

      teacherModel.aggregate([
        {
          $match: {
            "teacher_id": {
              $eq: req.query.userId
            }
          }
        },
        {
          $group: {
            _id: {
              COURSE: "$course_id",
              SEMESTER: "$semesterId",
              SUBJECT: "$subject",
              BATCH: "$batch_id"
            },
            count: {
              "$sum": 1
            }
          }
        },
        {
          $group: {
            _id: "$_id.COURSE",
            course_GROUP: {
              $push: {
                semester: "$_id.SEMESTER",
                subject: "$_id.SUBJECT",
                count: "$count"
              }
            }
          }
        }
      ]).then(function (courses) {

        collegeCourseModel.find({
          courseName: req.query.title
        }).then(function (checkcourses) {
          courses.forEach(function (course) {
            if (checkcourses[0]._id == course._id) {
              var spe_count = 0
              course.course_GROUP.forEach((g_data) => {

                course_subjects.push(g_data.subject);
                spe_count++;
                semesterNewModel.find({
                  _id: g_data.semester
                }).sort({ 'createdOn': -1 }).exec(function (err, semesters) {
                 
                  data1["subject_name" + spe_count].push(['subject_name', g_data.subject])

                  subjectViewTrackingModel.find({
                    subject: g_data.subject,
                    courseId: course._id,
                    semesterId: semesters[0]._id
                  }).then(function (subjectView) {

                    if (subjectView != '') {
                      data1['subject' + spe_count].push(['count', subjectView[0].subjectViewCount]);
                    } else {
                      data1['subject' + spe_count].push(['count'], '');
                    }
                  });
                })

              })
            }
          });

          setTimeout(function () {
            res.json({
              status: 200,
              data: data1
            })
          }, 9000);
        });
      })

    } else if (req.query.semesterId != 'undefined' || req.query.semesterId != undefined) {
      teacherModel.aggregate([
        {
          $match: {
            "teacher_id": {
              $eq: req.query.userId
            },
            "semesterId": {
              $eq: req.query.semesterId
            }
          }
        },
        {
          $group: {
            _id: {
              COURSE: "$course_id",
              SEMESTER: "$semesterId",
              SUBJECT: "$subject",
              BATCH: "$batch_id"
            },
            count: {
              "$sum": 1
            }
          }
        },
        {
          $group: {
            _id: "$_id.COURSE",
            course_GROUP: {
              $push: {
                semester: "$_id.SEMESTER",
                subject: "$_id.SUBJECT",
                count: "$count"
              }
            }
          }
        }
      ]).then(function (courses) {

        collegeCourseModel.find({
          courseName: req.query.title
        }).then(function (checkcourses) {

          courses.forEach(function (course) {
            console.log("course==>" + JSON.stringify(course));
            if (checkcourses[0]._id == course._id) {
              var spe_count = 0
              course.course_GROUP.forEach((g_data) => {
                console.log(spe_count + " is spe_count and g_data.subject==>" + g_data.subject)
                course_subjects.push(g_data.subject);
                spe_count++;
                semesterNewModel.find({
                  _id: g_data.semester
                }).sort({ 'createdOn': -1 }).exec(function (err, semesters) {


                  subjectViewTrackingModel.find({
                    subject: g_data.subject,
                    courseId: course._id,
                    semesterId: req.query.semesterId
                  }).then(function (subjectView) {
                    if (subjectView != '') {
                      data1["subject_name" + spe_count].push(['subject_name', g_data.subject])


                      data1['subject' + spe_count].push(['count', subjectView[0].subjectViewCount]);
                    } else {
                      data1["subject_name" + spe_count].push(['subject_name', g_data.subject])


                      data1['subject' + spe_count].push(['count'], '');
                    }
                  });
                })

              })
            }
          });
          setTimeout(function () {
            res.json({
              status: 200,
              data: data1
            })
          }, 9000);
        });
      })
    }

  } else {

    if (req.query.semesterId == 'undefined' || req.query.semesterId == undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (courses) {
        semesterNewModel.find({}).sort({ 'createdOn': -1 }).exec(function (err, semesters) {
         
          if (err) {
            console.error(err)
          } else {
            if (semesters != '') {
              subjectModel.find({
                courseId: courses[0]._id,
                semesterId: semesters[0]._id
              }).then(function (subject) {
                if (subject != '') {
                  
                  subject.forEach(subjectData => {
                    var sub1 = subjectData.subject;
                    var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                    var sub = sub2.replace(/^"(.*)"$/, '$1');
                    var strs = sub.split('","');
                    strs.forEach(function (courseSubject) {
                      course_subjects.push(courseSubject);
                    });

                  });


                  if (course_subjects[0]) {
                    subjectName = course_subjects[0];
                    data1.subject_name1.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[0],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject1.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject1.push(['count'], '');
                      }
                    });

                  } else {
                    data1.subject_name1.push(['subject_name', '']);
                    data1.subject1.push(['count'], '');
                  }

                  //subject1 end

                  if (course_subjects[1]) {
                    subjectName = course_subjects[1];
                    data1.subject_name2.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[1],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject2.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject2.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name2.push(['subject_name', '']);
                    data1.subject2.push(['count'], '');
                  }
                  // subject2 end

                  if (course_subjects[2]) {
                    subjectName = course_subjects[2];
                    data1.subject_name3.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[2],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject3.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject3.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name3.push(['subject_name', '']);
                    data1.subject3.push(['count'], '');
                  }
                  // subject3 end

                  if (course_subjects[3]) {
                    subjectName = course_subjects[3];
                    data1.subject_name4.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[3],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject4.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject4.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name4.push(['subject_name', '']);
                    data1.subject4.push(['count'], '');
                  }

                  // subject4 end

                  if (course_subjects[4]) {
                    subjectName = course_subjects[4];
                    data1.subject_name5.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[4],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject5.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject5.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name5.push(['subject_name', '']);
                    data1.subject5.push(['count'], '');
                  }

                  //subject5 end

                  if (course_subjects[5]) {
                    subjectName = course_subjects[5];
                    data1.subject_name6.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[5],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject6.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject6.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name6.push(['subject_name', '']);
                    data1.subject6.push(['count'], '');
                  }

                  //subject6 end

                  if (course_subjects[6]) {
                    subjectName = course_subjects[6];
                    data1.subject_name7.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[6],
                      courseId: courses[0]._id,
                      semesterId: semesters[0]._id
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject7.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject7.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name7.push(['subject_name', '']);
                    data1.subject7.push(['count'], '');
                  }

                }
                //  semester1end
                else if (subject == '') {
                  subjectModel.find({
                    courseId: courses[0]._id,
                    semesterId: semesters[1]._id
                  }).then(function (subject1) {
                    if (subject1 != '') {
                      var semesterName = semesters[1]._id
                      data1.semesterName.push(['semester_name', semesterName])
                      subject1.forEach(subjectData => {
                        var sub1 = subjectData.subject;
                        var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                        var sub = sub2.replace(/^"(.*)"$/, '$1');
                        var strs = sub.split('","');
                        strs.forEach(function (courseSubject) {
                          course_subjects.push(courseSubject);
                        });

                      });

                      if (course_subjects[0]) {
                        subjectName = course_subjects[0];
                        data1.subject_name1.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[0],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject1.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject1.push(['count'], '');
                          }
                        });

                      } else {
                        data1.subject_name1.push(['subject_name', ''])
                        data1.subject1.push(['count'], '');
                      }

                      //subject1 end

                      if (course_subjects[1]) {
                        subjectName = course_subjects[1];
                        data1.subject_name2.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[1],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject2.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject2.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name2.push(['subject_name', ''])
                        data1.subject2.push(['count'], '');
                      }
                      // subject2 end

                      if (course_subjects[2]) {
                        subjectName = course_subjects[2];
                        data1.subject_name3.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[2],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject3.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject3.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name3.push(['subject_name', ''])
                        data1.subject3.push(['count'], '');
                      }
                      // subject3 end

                      if (course_subjects[3]) {
                        subjectName = course_subjects[3];
                        data1.subject_name4.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[3],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject4.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject4.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name4.push(['subject_name', ''])
                        data1.subject4.push(['count'], '');
                      }

                      // subject4 end

                      if (course_subjects[4]) {
                        subjectName = course_subjects[4];
                        data1.subject_name5.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[4],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject5.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject5.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name5.push(['subject_name', ''])
                        data1.subject5.push(['count'], '');
                      }

                      //subject5 end

                      if (course_subjects[5]) {
                        subjectName = course_subjects[5];
                        data1.subject_name6.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[5],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject6.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject6.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name6.push(['subject_name', ''])
                        data1.subject6.push(['count'], '');
                      }

                      //subject6 end

                      if (course_subjects[6]) {
                        subjectName = course_subjects[6];
                        data1.subject_name7.push(['subject_name', subjectName])
                        subjectViewTrackingModel.find({
                          subject: course_subjects[6],
                          courseId: courses[0]._id,
                          semesterId: semesters[1]._id
                        }).then(function (subjectView) {
                          if (subjectView != '') {
                            data1.subject7.push(['count', subjectView[0].subjectViewCount]);
                          } else {
                            data1.subject7.push(['count'], '');
                          }
                        });
                      } else {
                        data1.subject_name7.push(['subject_name', ''])
                        data1.subject7.push(['count'], '');
                      }
                    } else if (subject1 == '') {
                      subjectModel.find({
                        courseId: courses[0]._id,
                        semesterId: semesters[2]._id
                      }).then(function (subject2) {
                        if (subject2 != '') {
                          var semesterName = semesters[2]._id
                          data1.semesterName.push(['semester_name', semesterName])
                          subject2.forEach(subjectData => {
                            var sub1 = subjectData.subject;
                            var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                            var sub = sub2.replace(/^"(.*)"$/, '$1');
                            var strs = sub.split('","');
                            strs.forEach(function (courseSubject) {
                              course_subjects.push(courseSubject);
                            });

                          });

                          if (course_subjects[0]) {
                            subjectName = course_subjects[0];
                            data1.subject_name1.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[0],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject1.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject1.push(['count'], '');
                              }
                            });

                          } else {
                            data1.subject_name1.push(['subject_name', ''])
                            data1.subject1.push(['count'], '');
                          }

                          //subject1 end

                          if (course_subjects[1]) {
                            subjectName = course_subjects[1];
                            data1.subject_name2.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[1],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject2.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject2.push(['count'], '');
                              }
                            });
                          } else {
                            data1.subject_name2.push(['subject_name', '']);
                            data1.subject2.push(['count'], '');
                          }
                          // subject2 end

                          if (course_subjects[2]) {
                            subjectName = course_subjects[2];
                            data1.subject_name3.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[2],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject3.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject3.push(['']);
                              }
                            });
                          } else {
                            data1.subject_name3.push(['subject_name', ''])
                          }
                          // subject3 end

                          if (course_subjects[3]) {
                            subjectName = course_subjects[3];
                            data1.subject_name4.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[3],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject4.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject4.push(['count'], '');
                              }
                            });
                          } else {
                            data1.subject_name4.push(['subject_name', ''])
                            data1.subject4.push(['count'], '');
                          }

                          // subject4 end

                          if (course_subjects[4]) {
                            subjectName = course_subjects[4];
                            data1.subject_name5.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[4],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject5.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject5.push(['count'], '');
                              }
                            });
                          } else {
                            data1.subject_name5.push(['subject_name', ''])
                            data1.subject5.push(['count'], '');
                          }

                          //subject5 end

                          if (course_subjects[5]) {
                            subjectName = course_subjects[5];
                            data1.subject_name6.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[5],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject6.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject6.push(['count'], '');
                              }
                            });
                          } else {
                            data1.subject_name6.push(['subject_name', '']);
                            data1.subject6.push(['count'], '');
                          }

                          //subject6 end

                          if (course_subjects[6]) {
                            subjectName = course_subjects[6];
                            data1.subject_name7.push(['subject_name', subjectName])
                            subjectViewTrackingModel.find({
                              subject: course_subjects[6],
                              courseId: courses[0]._id,
                              semesterId: semesters[2]._id
                            }).then(function (subjectView) {
                              if (subjectView != '') {
                                data1.subject7.push(['count', subjectView[0].subjectViewCount]);
                              } else {
                                data1.subject7.push(['count'], '');
                              }
                            });
                          } else {
                            data1.subject_name7.push(['subject_name', '']);
                            data1.subject7.push(['count'], '');
                          }
                        } else if (subject2 == '') {
                          subjectModel.find({
                            courseId: courses[0]._id,
                            semesterId: semesters[3]._id
                          }).then(function (subject3) {
                            if (subject3 != '') {
                              var semesterName = semesters[3]._id
                              data1.semesterName.push(['semester_name', semesterName])
                              subject3.forEach(subjectData => {
                                var sub1 = subjectData.subject;
                                var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                                var sub = sub2.replace(/^"(.*)"$/, '$1');
                                var strs = sub.split('","');
                                strs.forEach(function (courseSubject) {
                                  course_subjects.push(courseSubject);
                                });

                              });

                              if (course_subjects[0]) {
                                subjectName = course_subjects[0];
                                data1.subject_name1.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[0],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject1.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject1.push(['count'], '');
                                  }
                                });

                              } else {
                                data1.subject_name1.push(['subject_name', '']);
                                data1.subject1.push(['count'], '');
                              }

                              //subject1 end

                              if (course_subjects[1]) {
                                subjectName = course_subjects[1];
                                data1.subject_name2.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[1],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject2.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject2.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name2.push(['subject_name', '']);
                                data1.subject2.push(['count'], '');
                              }
                              // subject2 end

                              if (course_subjects[2]) {
                                subjectName = course_subjects[2];
                                data1.subject_name3.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[2],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject3.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject3.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name3.push(['subject_name', '']);
                                data1.subject3.push(['count'], '');
                              }
                              // subject3 end

                              if (course_subjects[3]) {
                                subjectName = course_subjects[3];
                                data1.subject_name4.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[3],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject4.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject4.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name4.push(['subject_name', '']);
                                data1.subject4.push(['count'], '');
                              }

                              // subject4 end

                              if (course_subjects[4]) {
                                subjectName = course_subjects[4];
                                data1.subject_name5.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[4],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject5.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject5.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name5.push(['subject_name', '']);
                                data1.subject5.push(['count'], '');
                              }

                              //subject5 end

                              if (course_subjects[5]) {
                                subjectName = course_subjects[5];
                                data1.subject_name6.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[5],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject6.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject6.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name6.push(['subject_name', '']);
                                data1.subject6.push(['count'], '');
                              }

                              //subject6 end

                              if (course_subjects[6]) {
                                subjectName = course_subjects[6];
                                data1.subject_name7.push(['subject_name', subjectName])
                                subjectViewTrackingModel.find({
                                  subject: course_subjects[6],
                                  courseId: courses[0]._id,
                                  semesterId: semesters[3]._id
                                }).then(function (subjectView) {
                                  if (subjectView != '') {
                                    data1.subject7.push(['count', subjectView[0].subjectViewCount]);
                                  } else {
                                    data1.subject7.push(['count'], '');
                                  }
                                });
                              } else {
                                data1.subject_name7.push(['subject_name', '']);
                                data1.subject7.push(['count'], '');
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
              setTimeout(function () {
                res.json({
                  status: 200,
                  data: data1
                })
              }, 9000)
            }
          }
        });
      });
    } else if (req.query.semesterId != 'undefined' || req.query.semesterId != undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (courses) {
        semesterNewModel.find({}).sort({ 'createdOn': -1 }).exec(function (err, semesters) {
          // semesters.forEach(function(semData){
          //   data1.semesterData.push({semData});
          // });
          if (err) {
            console.error(err)
          } else {
            if (semesters != '') {
              subjectModel.find({
                courseId: courses[0]._id,
                semesterId: req.query.semesterId
              }).then(function (subject) {
                if (subject != '') {
                  // var semesterName = req.query.semesterId;
                  // data1.semesterName.push(['semester_name',semesterName])
                  subject.forEach(subjectData => {
                    var sub1 = subjectData.subject;
                    var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                    var sub = sub2.replace(/^"(.*)"$/, '$1');
                    var strs = sub.split('","');
                    strs.forEach(function (courseSubject) {
                      course_subjects.push(courseSubject);
                    });

                  });
                  if (course_subjects[0]) {
                    subjectName = course_subjects[0];
                    data1.subject_name1.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[0],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject1.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject1.push(['count'], '');
                      }
                    });

                  } else {
                    data1.subject_name1.push(['subject_name', '']);
                    data1.subject1.push(['count'], '');
                  }

                  //subject1 end

                  if (course_subjects[1]) {
                    subjectName = course_subjects[1];
                    data1.subject_name2.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[1],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject2.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject2.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name2.push(['subject_name', '']);
                    data1.subject2.push(['count'], '');
                  }
                  // subject2 end

                  if (course_subjects[2]) {
                    subjectName = course_subjects[2];
                    data1.subject_name3.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[2],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject3.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject3.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name3.push(['subject_name', '']);
                    data1.subject3.push(['count'], '');
                  }
                  // subject3 end

                  if (course_subjects[3]) {
                    subjectName = course_subjects[3];
                    data1.subject_name4.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[3],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject4.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject4.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name4.push(['subject_name', '']);
                    data1.subject4.push(['count'], '');
                  }

                  // subject4 end

                  if (course_subjects[4]) {
                    subjectName = course_subjects[4];
                    data1.subject_name5.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[4],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject5.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject5.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name5.push(['subject_name', '']);
                    data1.subject5.push(['count'], '');
                  }

                  //subject5 end

                  if (course_subjects[5]) {
                    subjectName = course_subjects[5];
                    data1.subject_name6.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[5],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject6.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject6.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name6.push(['subject_name', '']);
                    data1.subject6.push(['count'], '');
                  }

                  //subject6 end

                  if (course_subjects[6]) {
                    subjectName = course_subjects[6];
                    data1.subject_name7.push(['subject_name', subjectName])
                    subjectViewTrackingModel.find({
                      subject: course_subjects[6],
                      courseId: courses[0]._id,
                      semesterId: req.query.semesterId
                    }).then(function (subjectView) {
                      if (subjectView != '') {
                        data1.subject7.push(['count', subjectView[0].subjectViewCount]);
                      } else {
                        data1.subject7.push(['count'], '');
                      }
                    });
                  } else {
                    data1.subject_name7.push(['subject_name', '']);
                    data1.subject7.push(['count'], '');
                  }

                }
              });

              setTimeout(function () {
                res.json({
                  status: 200,
                  data: data1
                })
              }, 4000)
            }
          }
        });
      });
    }
  }

});

router.get('/getSubjectWiseFiles', function (req, res) {
  var course_subjects = [];
  var pptData1 = [];
  var pptData11 = [];
  var practiseData = [];
  var practiseData11 = [];
  var datasetData1 = [];
  var datasetData11 = [];
  var prerequisiteData1 = [];
  var prerequisiteData11 = [];
  var onlineLectureData1 = [];
  var onlineLectureData11 = [];

  var pptData2 = [];
  var pptData22 = [];
  var practiseData2 = [];
  var practiseData22 = [];
  var dataSetData2 = [];
  var dataSetData22 = [];
  var prerequisiteData2 = [];
  var prerequisiteData22 = [];
  var onlineLectureData2 = [];
  var onlineLectureData22 = [];

  var pptData3 = [];
  var pptData33 = [];
  var practiseData3 = [];
  var practiseData33 = [];
  var datasetData3 = [];
  var datasetData33 = [];
  var prerequisiteData3 = [];
  var prerequisiteData33 = [];
  var onlineLectureData3 = [];
  var onlineLectureData33 = [];

  var pptData4 = [];
  var pptData44 = [];
  var practiseData4 = [];
  var practiseData44 = [];
  var datasetData4 = [];
  var datasetData44 = [];
  var prerequisiteData4 = [];
  var prerequisiteData44 = [];
  var onlineLectureData4 = [];
  var onlineLectureData44 = [];

  var pptData5 = [];
  var pptData55 = [];
  var practiseData5 = [];
  var practiseData55 = [];
  var datasetData5 = [];
  var datasetData55 = [];
  var prerequisiteData5 = [];
  var prerequisiteData55 = [];
  var onlineLectureData5 = [];
  var onlineLectureData55 = [];

  var pptData6 = [];
  var pptData66 = [];
  var practiseData6 = [];
  var practiseData66 = [];
  var datasetData6 = [];
  var datasetData66 = [];
  var prerequisiteData6 = [];
  var prerequisiteData66 = [];
  var onlineLectureData6 = [];
  var onlineLectureData66 = [];

  var pptData7 = [];
  var pptData77 = [];
  var practiseData7 = [];
  var practiseData77 = [];
  var datasetData7 = [];
  var datasetData77 = [];
  var prerequisiteData7 = [];
  var prerequisiteData77 = [];
  var onlineLectureData7 = [];
  var onlineLectureData77 = [];


  var data1 = {
    subject1: [
    ],
    subject2: [],
    subject3: [],
    subject4: [],
    subject5: [],
    subject6: [],
    subject7: [],
    //subject8 :[],
    subject_name1: [],
    subject_name2: [],
    subject_name3: [],
    subject_name4: [],
    subject_name5: [],
    subject_name6: [],
    subject_name7: [],
    semesterName: [],
    semesterData: [],


  };
  var ppt_notes = 0;
  var practise_question = 0;
  var dataSet = 0;
  var prerequisite = 0;
  var onlineLecture = 0;
  var subjectName = '';
  if (req.query.role == 'admin') {
    if (req.query.semesterId == 'undefined' || req.query.semesterId == undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (course) {
        if (course != '') {
          semesterNewModel.find({}).sort({ 'createdOn': -1 }).exec(function (err, semesters) {
            if (err) {
              console.error(err)
            } else {
              subjectModel.find({
                courseId: course[0]._id,
                semesterId: semesters[0]._id
              }).then(function (subject) {
                if (subject != '') {
                  var semesterName = semesters[0]._id
                  data1.semesterName.push(['semester_name', semesterName])
                  subject.forEach(subjectData => {
                    var sub1 = subjectData.subject;
                    var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                    var sub = sub2.replace(/^"(.*)"$/, '$1');
                    var strs = sub.split('","');
                    strs.forEach(function (courseSubject) {
                      course_subjects.push(courseSubject);
                    });

                  });
                  if (course_subjects[0] != '') {
                    subjectName = course_subjects[0]
                    data1.subject_name1.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[0]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData1.push(upload.length)
                              var sum = pptData1.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData11.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData.push(upload1.length)
                              var sum = practiseData.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData11.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length
                              datasetData1.push(upload2.length)
                              var sum = datasetData1.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData11.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          });

                          youTubeLinkModel.find({
                            chapterId: chapter._id,
                            type_of_upload: 'prerequisite'
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length
                              prerequisiteData1.push(youtube.length)
                              var sum = prerequisiteData1.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData11.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;

                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id,
                            type_of_upload: 'onlineLecture'
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length
                              onlineLectureData1.push(online.length)
                              var sum = onlineLectureData1.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData11.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });
                        })
                      } else if (chapters == '') {
                        data1.subject1.push(['']);
                      }
                    })
                  } else {
                    data1.subject_name1.push({ subject_name: '' })
                  }
                  // subject1 end
                  if (course_subjects[1] != '') {
                    subjectName = course_subjects[1]
                    data1.subject_name2.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[1]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData2.push(upload.length)
                              var sum = pptData2.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData22.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData2.push(upload1.length)
                              var sum = practiseData2.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData22.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              dataSetData2.push(upload2.length)
                              var sum = dataSetData2.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              dataSetData22.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData2.push(youtube.length)
                              var sum = prerequisiteData2.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData22.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData2.push(youtube.length)
                              var sum = onlineLectureData2.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData22.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });

                        })
                      } else if (chapters == '') {
                        data1.subject2.push(['']);
                      }

                    });
                  } else {
                    data1.subject_name2.push({ subject_name: '' })
                  }
                  // subject2 end
                  if (course_subjects[2] != '') {
                    subjectName = course_subjects[2]
                    data1.subject_name3.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[2]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData3.push(upload.length)
                              var sum = pptData3.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData33.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData3.push(upload1.length)
                              var sum = practiseData3.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData33.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              datasetData3.push(upload2.length)
                              var sum = datasetData3.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData33.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData3.push(youtube.length)
                              var sum = prerequisiteData3.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData33.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData3.push(online.length)
                              var sum = onlineLectureData3.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData33.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });

                        })
                      } else if (chapters == '') {
                        data1.subject3.push(['']);
                      }

                    })
                  } else {
                    data1.subject_name3.push({ subject_name: '' })
                  }
                  // subject3 end
                  if (course_subjects[3] != '') {
                    subjectName = course_subjects[3]
                    data1.subject_name4.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[3]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData4.push(upload.length)
                              var sum = pptData4.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData44.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData4.push(upload1.length)
                              var sum = practiseData4.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData44.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              datasetData4.push(upload2.length)
                              var sum = datasetData4.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData44.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData4.push(youtube.length)
                              var sum = prerequisiteData4.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData44.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData4.push(online.length)
                              var sum = onlineLectureData4.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData44.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });
                        })
                      } else if (chapters == '') {
                        data1.subject4.push(['']);
                      }

                    })
                  } else {
                    data1.subject_name4.push({ subject_name: '' })
                  }
                  // subject4 end

                  if (course_subjects[4] != '') {
                    subjectName = course_subjects[4]
                    data1.subject_name5.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[4]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData5.push(upload.length)
                              var sum = pptData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData55.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData5.push(upload1.length)
                              var sum = practiseData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData55.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              datasetData5.push(upload2.length)
                              var sum = datasetData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData55.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData5.push(youtube.length)
                              var sum = prerequisiteData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData55.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData5.push(online.length)
                              var sum = onlineLectureData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData55.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });
                        })
                      } else if (chapters == '') {
                        data1.subject5.push(['']);
                      }

                    })
                  } else {
                    data1.subject_name5.push({ subject_name: '' })
                  }
                  // subject5 end

                  if (course_subjects[5] != '') {
                    subjectName = course_subjects[5]
                    data1.subject_name6.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[5]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData6.push(upload.length)
                              var sum = pptData6.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData66.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData6.push(upload1.length)
                              var sum = practiseData6.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData66.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              datasetData6.push(upload2.length)
                              var sum = datasetData6.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData66.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData6.push(youtube.length)
                              var sum = prerequisiteData6.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData66.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData6.push(online.length)
                              var sum = onlineLectureData5.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData55.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });
                        })
                      } else if (chapters == '') {
                        data1.subject6.push(['']);
                      }

                    })
                  } else {
                    data1.subject_name6.push({ subject_name: '' })
                  }
                  // subject6 end

                  if (course_subjects[6] != '') {
                    subjectName = course_subjects[6]
                    data1.subject_name7.push(['subject_name', subjectName])
                    chapterModel.find({
                      courseId: course[0]._id,
                      semesterId: semesters[0]._id,
                      subject: course_subjects[6]
                    }).then(function (chapters) {
                      if (chapters != '') {
                        chapters.forEach(function (chapter) {
                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'ppt/notes'
                          }).then(function (upload) {
                            if (upload != '') {
                              ppt_notes = upload.length;
                              pptData7.push(upload.length)
                              var sum = pptData7.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              pptData77.push(sum);
                            } else if (upload == '') {
                              ppt_notes = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'practise question'
                          }).then(function (upload1) {
                            if (upload1 != '') {
                              practise_question = upload1.length;
                              practiseData7.push(upload1.length)
                              var sum = practiseData7.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              practiseData77.push(sum);
                            } else if (upload1 == '') {
                              practise_question = 0;
                            }
                          })

                          uploads.find({
                            lessonId: chapter._id,
                            type_of_upload: 'dataSet'
                          }).then(function (upload2) {
                            if (upload2 != '') {
                              dataSet = upload2.length;
                              datasetData7.push(upload2.length)
                              var sum = datasetData7.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              datasetData77.push(sum);
                            } else if (upload2 == '') {
                              dataSet = 0;
                            }
                          })

                          youTubeLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (youtube) {
                            if (youtube != '') {
                              prerequisite = youtube.length;
                              prerequisiteData7.push(youtube.length)
                              var sum = prerequisiteData7.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              prerequisiteData77.push(sum);
                            } else if (youtube == '') {
                              prerequisite = 0;
                            }
                          });

                          onlineLectureLinkModel.find({
                            chapterId: chapter._id
                          }).then(function (online) {
                            if (online != '') {
                              onlineLecture = online.length;
                              onlineLectureData7.push(online.length)
                              var sum = onlineLectureData7.reduce(function (a, b) {
                                return a + b;
                              }, 0);
                              onlineLectureData77.push(sum);
                            } else if (online == '') {
                              onlineLecture = 0;
                            }
                          });
                        })
                      } else if (chapters == '') {
                        data1.subject7.push(['']);
                      }

                    })
                  } else {
                    data1.subject_name7.push({ subject_name: '' })
                  }
                }

                // semester3 start
                else if (subject == '') {
                  subjectModel.find({
                    courseId: course[0]._id,
                    semesterId: semesters[1]._id
                  }).then(function (subject1) {
                    if (subject1 != '') {
                      var semesterName = semesters[1]._id
                      data1.semesterName.push(['semester_name', semesterName])
                      subject1.forEach(subjectData => {
                        var sub1 = subjectData.subject;
                        var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                        var sub = sub2.replace(/^"(.*)"$/, '$1');
                        var strs = sub.split('","');
                        strs.forEach(function (courseSubject) {
                          course_subjects.push(courseSubject);
                        });

                      });

                      if (course_subjects[0] != '') {
                        subjectName = course_subjects[0]
                        data1.subject_name1.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[0]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData1.push(upload.length)
                                  var sum = pptData1.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData11.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData.push(upload1.length)
                                  var sum = practiseData.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData11.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length
                                  datasetData1.push(upload2.length)
                                  var sum = datasetData1.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData11.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              });

                              youTubeLinkModel.find({
                                chapterId: chapter._id,
                                type_of_upload: 'prerequisite'
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length
                                  prerequisiteData1.push(youtube.length)
                                  var sum = prerequisiteData1.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData11.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;

                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id,
                                type_of_upload: 'onlineLecture'
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length
                                  onlineLectureData1.push(online.length)
                                  var sum = onlineLectureData1.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData11.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })

                          } else if (chapters == '') {
                            data1.subject1.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name1.push({ subject_name: '' })
                      }
                      // subject1 end
                      if (course_subjects[1] != '') {
                        subjectName = course_subjects[1]
                        data1.subject_name2.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[1]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData2.push(upload.length)
                                  var sum = pptData2.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData22.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData2.push(upload1.length)
                                  var sum = practiseData2.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData22.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  dataSetData2.push(upload2.length)
                                  var sum = dataSetData2.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  dataSetData22.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData2.push(youtube.length)
                                  var sum = prerequisiteData2.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData22.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData2.push(online.length)
                                  var sum = onlineLectureData2.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData22.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })
                          }
                          else if (chapters == '') {
                            data1.subject2.push(['']);
                          }
                        });
                      } else {
                        data1.subject_name2.push(['subject_name', ''])
                      }

                      // subject2 end
                      if (course_subjects[2] != '') {
                        subjectName = course_subjects[2]
                        data1.subject_name3.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[2]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData3.push(upload.length)
                                  var sum = pptData3.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData33.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData3.push(upload1.length)
                                  var sum = practiseData3.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData33.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  datasetData3.push(upload2.length)
                                  var sum = datasetData3.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData33.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData3.push(youtube.length)
                                  var sum = prerequisiteData3.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData33.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData3.push(online.length)
                                  var sum = onlineLectureData3.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData33.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })
                          } else if (chapters == '') {
                            data1.subject3.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name3.push(['subject_name', ''])
                      }
                      // subject3 end
                      if (course_subjects[3] != '') {
                        subjectName = course_subjects[3]
                        data1.subject_name4.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[3]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData4.push(upload.length)
                                  var sum = pptData4.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData44.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData4.push(upload1.length)
                                  var sum = practiseData4.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData44.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  datasetData4.push(upload2.length)
                                  var sum = datasetData4.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData44.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData4.push(youtube.length)
                                  var sum = prerequisiteData4.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData44.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData4.push(online.length)
                                  var sum = onlineLectureData4.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData44.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })
                          } else if (chapters == '') {
                            data1.subject4.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name4.push(['subject_name', ''])
                      }
                      // subject4 end
                      if (course_subjects[4] != '') {
                        subjectName = course_subjects[4]
                        data1.subject_name5.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[4]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData5.push(upload.length)
                                  var sum = pptData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData55.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData5.push(upload1.length)
                                  var sum = practiseData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData55.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  datasetData5.push(upload2.length)
                                  var sum = datasetData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData55.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData5.push(youtube.length)
                                  var sum = prerequisiteData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData55.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData5.push(online.length)
                                  var sum = onlineLectureData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData55.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });
                            })
                          } else if (chapters == '') {
                            data1.subject5.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name5.push(['subject_name', ''])
                      }

                      // subject5 end
                      if (course_subjects[5] != '') {
                        subjectName = course_subjects[5]
                        data1.subject_name6.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[5]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData6.push(upload.length)
                                  var sum = pptData6.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData66.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData6.push(upload1.length)
                                  var sum = practiseData6.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData66.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  datasetData6.push(upload2.length)
                                  var sum = datasetData6.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData66.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData6.push(youtube.length)
                                  var sum = prerequisiteData6.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData66.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData6.push(online.length)
                                  var sum = onlineLectureData5.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData55.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })
                          } else if (chapters == '') {
                            data1.subject6.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name6.push(['subject_name', ''])
                      }
                      // subject6 end
                      if (course_subjects[6] != '') {
                        subjectName = course_subjects[6]
                        data1.subject_name7.push(['subject_name', subjectName])
                        chapterModel.find({
                          courseId: course[0]._id,
                          semesterId: semesters[1]._id,
                          subject: course_subjects[6]
                        }).then(function (chapters) {
                          if (chapters != '') {
                            chapters.forEach(function (chapter) {
                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'ppt/notes'
                              }).then(function (upload) {
                                if (upload != '') {
                                  ppt_notes = upload.length;
                                  pptData7.push(upload.length)
                                  var sum = pptData7.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  pptData77.push(sum);
                                } else if (upload == '') {
                                  ppt_notes = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'practise question'
                              }).then(function (upload1) {
                                if (upload1 != '') {
                                  practise_question = upload1.length;
                                  practiseData7.push(upload1.length)
                                  var sum = practiseData7.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  practiseData77.push(sum);
                                } else if (upload1 == '') {
                                  practise_question = 0;
                                }
                              })

                              uploads.find({
                                lessonId: chapter._id,
                                type_of_upload: 'dataSet'
                              }).then(function (upload2) {
                                if (upload2 != '') {
                                  dataSet = upload2.length;
                                  datasetData7.push(upload2.length)
                                  var sum = datasetData7.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  datasetData77.push(sum);
                                } else if (upload2 == '') {
                                  dataSet = 0;
                                }
                              })

                              youTubeLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (youtube) {
                                if (youtube != '') {
                                  prerequisite = youtube.length;
                                  prerequisiteData7.push(youtube.length)
                                  var sum = prerequisiteData7.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  prerequisiteData77.push(sum);
                                } else if (youtube == '') {
                                  prerequisite = 0;
                                }
                              });

                              onlineLectureLinkModel.find({
                                chapterId: chapter._id
                              }).then(function (online) {
                                if (online != '') {
                                  onlineLecture = online.length;
                                  onlineLectureData7.push(online.length)
                                  var sum = onlineLectureData7.reduce(function (a, b) {
                                    return a + b;
                                  }, 0);
                                  onlineLectureData77.push(sum);
                                } else if (online == '') {
                                  onlineLecture = 0;
                                }
                              });

                            })
                          } else if (chapters == '') {
                            data1.subject7.push(['']);
                          }
                        })
                      } else {
                        data1.subject_name7.push(['subject_name', ''])
                      }

                    }
                    // semester2 start
                    else if (subject1 == '') {
                      subjectModel.find({
                        courseId: course[0]._id,
                        semesterId: semesters[2]._id
                      }).then(function (subject2) {
                        if (subject2 != '') {
                          var semesterName = semesters[2]._id
                          data1.semesterName.push(['semester_name', semesterName])
                          subject2.forEach(subjectData => {
                            var sub1 = subjectData.subject;
                            var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                            var sub = sub2.replace(/^"(.*)"$/, '$1');
                            var strs = sub.split('","');
                            strs.forEach(function (courseSubject) {
                              course_subjects.push(courseSubject);
                            });

                          });

                          if (course_subjects[0] != '') {
                            subjectName = course_subjects[0]
                            data1.subject_name1.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[0]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData1.push(upload.length)
                                      var sum = pptData1.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData11.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData.push(upload1.length)
                                      var sum = practiseData.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData11.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length
                                      datasetData1.push(upload2.length)
                                      var sum = datasetData1.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData11.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  });

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id,
                                    type_of_upload: 'prerequisite'
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length
                                      prerequisiteData1.push(youtube.length)
                                      var sum = prerequisiteData1.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData11.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;

                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id,
                                    type_of_upload: 'onlineLecture'
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length
                                      onlineLectureData1.push(online.length)
                                      var sum = onlineLectureData1.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData11.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });

                                })
                              } else if (chapters == '') {
                                data1.subject1.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name1.push({ subject_name: '' })
                          }
                          // subject1 end
                          if (course_subjects[1] != '') {
                            subjectName = course_subjects[1]
                            data1.subject_name2.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[1]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData2.push(upload.length)
                                      var sum = pptData2.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData22.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData2.push(upload1.length)
                                      var sum = practiseData2.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData22.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      dataSetData2.push(upload2.length)
                                      var sum = dataSetData2.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      dataSetData22.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData2.push(youtube.length)
                                      var sum = prerequisiteData2.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData22.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData2.push(youtube.length)
                                      var sum = onlineLectureData2.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData22.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });

                                })
                              }
                              else if (chapters == '') {
                                data1.subject2.push(['']);
                              }
                            });
                          } else {
                            data1.subject_name2.push(['subject_name', ''])
                          }

                          // subject2 end
                          if (course_subjects[2] != '') {
                            subjectName = course_subjects[2]
                            data1.subject_name3.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[2]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData3.push(upload.length)
                                      var sum = pptData3.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData33.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData3.push(upload1.length)
                                      var sum = practiseData3.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData33.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      datasetData3.push(upload2.length)
                                      var sum = datasetData3.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData33.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData3.push(youtube.length)
                                      var sum = prerequisiteData3.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData33.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData3.push(online.length)
                                      var sum = onlineLectureData3.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData33.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });

                                })
                              } else if (chapters == '') {
                                data1.subject3.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name3.push(['subject_name', ''])
                          }
                          // subject3 end
                          if (course_subjects[3] != '') {
                            subjectName = course_subjects[3]
                            data1.subject_name4.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[3]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData4.push(upload.length)
                                      var sum = pptData4.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData44.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData4.push(upload1.length)
                                      var sum = practiseData4.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData44.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      datasetData4.push(upload2.length)
                                      var sum = datasetData4.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData44.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData4.push(youtube.length)
                                      var sum = prerequisiteData4.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData44.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData4.push(online.length)
                                      var sum = onlineLectureData4.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData44.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });

                                })
                              } else if (chapters == '') {
                                data1.subject4.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name4.push(['subject_name', ''])
                          }
                          // subject4 end
                          if (course_subjects[4] != '') {
                            subjectName = course_subjects[4]
                            data1.subject_name5.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[4]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData5.push(upload.length)
                                      var sum = pptData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData55.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData5.push(upload1.length)
                                      var sum = practiseData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData55.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      datasetData5.push(upload2.length)
                                      var sum = datasetData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData55.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData5.push(youtube.length)
                                      var sum = prerequisiteData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData55.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData5.push(online.length)
                                      var sum = onlineLectureData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData55.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });

                                })
                              } else if (chapters == '') {
                                data1.subject5.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name5.push(['subject_name', ''])
                          }

                          // subject5 end
                          if (course_subjects[5] != '') {
                            subjectName = course_subjects[5]
                            data1.subject_name6.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[5]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData6.push(upload.length)
                                      var sum = pptData6.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData66.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData6.push(upload1.length)
                                      var sum = practiseData6.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData66.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      datasetData6.push(upload2.length)
                                      var sum = datasetData6.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData66.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData6.push(youtube.length)
                                      var sum = prerequisiteData6.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData66.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData6.push(online.length)
                                      var sum = onlineLectureData5.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData55.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });
                                })
                              } else if (chapters == '') {
                                data1.subject6.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name6.push(['subject_name', ''])
                          }
                          // subject6 end
                          if (course_subjects[6] != '') {
                            subjectName = course_subjects[6]
                            data1.subject_name7.push(['subject_name', subjectName])
                            chapterModel.find({
                              courseId: course[0]._id,
                              semesterId: semesters[2]._id,
                              subject: course_subjects[6]
                            }).then(function (chapters) {
                              if (chapters != '') {
                                chapters.forEach(function (chapter) {
                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'ppt/notes'
                                  }).then(function (upload) {
                                    if (upload != '') {
                                      ppt_notes = upload.length;
                                      pptData7.push(upload.length)
                                      var sum = pptData7.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      pptData77.push(sum);
                                    } else if (upload == '') {
                                      ppt_notes = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'practise question'
                                  }).then(function (upload1) {
                                    if (upload1 != '') {
                                      practise_question = upload1.length;
                                      practiseData7.push(upload1.length)
                                      var sum = practiseData7.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      practiseData77.push(sum);
                                    } else if (upload1 == '') {
                                      practise_question = 0;
                                    }
                                  })

                                  uploads.find({
                                    lessonId: chapter._id,
                                    type_of_upload: 'dataSet'
                                  }).then(function (upload2) {
                                    if (upload2 != '') {
                                      dataSet = upload2.length;
                                      datasetData7.push(upload2.length)
                                      var sum = datasetData7.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      datasetData77.push(sum);
                                    } else if (upload2 == '') {
                                      dataSet = 0;
                                    }
                                  })

                                  youTubeLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (youtube) {
                                    if (youtube != '') {
                                      prerequisite = youtube.length;
                                      prerequisiteData7.push(youtube.length)
                                      var sum = prerequisiteData7.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      prerequisiteData77.push(sum);
                                    } else if (youtube == '') {
                                      prerequisite = 0;
                                    }
                                  });

                                  onlineLectureLinkModel.find({
                                    chapterId: chapter._id
                                  }).then(function (online) {
                                    if (online != '') {
                                      onlineLecture = online.length;
                                      onlineLectureData7.push(online.length)
                                      var sum = onlineLectureData7.reduce(function (a, b) {
                                        return a + b;
                                      }, 0);
                                      onlineLectureData77.push(sum);
                                    } else if (online == '') {
                                      onlineLecture = 0;
                                    }
                                  });
                                })
                              } else if (chapters == '') {
                                data1.subject7.push(['']);
                              }
                            })
                          } else {
                            data1.subject_name7.push(['subject_name', ''])
                          }


                        }
                        // semester1 start
                        else if (subject2 == '') {
                          subjectModel.find({
                            courseId: course[0]._id,
                            semesterId: semesters[3]._id
                          }).then(function (subject3) {
                            if (subject3 != '') {
                              var semesterName = semesters[3]._id
                              data1.semesterName.push(['semester_name', semesterName])
                              subject3.forEach(subjectData => {
                                var sub1 = subjectData.subject;
                                var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                                var sub = sub2.replace(/^"(.*)"$/, '$1');
                                var strs = sub.split('","');
                                strs.forEach(function (courseSubject) {
                                  course_subjects.push(courseSubject);
                                });

                              });
                              if (course_subjects[0] != '') {
                                subjectName = course_subjects[0]
                                data1.subject_name1.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[0]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData1.push(upload.length)
                                          var sum = pptData1.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData11.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData.push(upload1.length)
                                          var sum = practiseData.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData11.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length
                                          datasetData1.push(upload2.length)
                                          var sum = datasetData1.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData11.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      });

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id,
                                        type_of_upload: 'prerequisite'
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length
                                          prerequisiteData1.push(youtube.length)
                                          var sum = prerequisiteData1.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData11.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;

                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id,
                                        type_of_upload: 'onlineLecture'
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length
                                          onlineLectureData1.push(online.length)
                                          var sum = onlineLectureData1.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData11.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  } else if (chapters == '') {
                                    data1.subject1.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name1.push({ subject_name: '' })
                              }
                              // subject1 end
                              if (course_subjects[1] != '') {
                                subjectName = course_subjects[1]
                                data1.subject_name2.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[1]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData2.push(upload.length)
                                          var sum = pptData2.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData22.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData2.push(upload1.length)
                                          var sum = practiseData2.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData22.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          dataSetData2.push(upload2.length)
                                          var sum = dataSetData2.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          dataSetData22.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData2.push(youtube.length)
                                          var sum = prerequisiteData2.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData22.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData2.push(youtube.length)
                                          var sum = onlineLectureData2.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData22.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  }
                                  else if (chapters == '') {
                                    data1.subject2.push(['']);
                                  }
                                });
                              } else {
                                data1.subject_name2.push(['subject_name', ''])
                              }

                              // subject2 end
                              if (course_subjects[2] != '') {
                                subjectName = course_subjects[2]
                                data1.subject_name3.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[2]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData3.push(upload.length)
                                          var sum = pptData3.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData33.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData3.push(upload1.length)
                                          var sum = practiseData3.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData33.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          datasetData3.push(upload2.length)
                                          var sum = datasetData3.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData33.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData3.push(youtube.length)
                                          var sum = prerequisiteData3.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData33.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData3.push(online.length)
                                          var sum = onlineLectureData3.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData33.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  } else if (chapters == '') {
                                    data1.subject3.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name3.push(['subject_name', ''])
                              }
                              // subject3 end
                              if (course_subjects[3] != '') {
                                subjectName = course_subjects[3]
                                data1.subject_name4.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[3]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData4.push(upload.length)
                                          var sum = pptData4.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData44.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData4.push(upload1.length)
                                          var sum = practiseData4.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData44.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          datasetData4.push(upload2.length)
                                          var sum = datasetData4.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData44.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData4.push(youtube.length)
                                          var sum = prerequisiteData4.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData44.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData4.push(online.length)
                                          var sum = onlineLectureData4.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData44.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  } else if (chapters == '') {
                                    data1.subject4.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name4.push(['subject_name', ''])
                              }
                              // subject4 end
                              if (course_subjects[4] != '') {
                                subjectName = course_subjects[4]
                                data1.subject_name5.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[4]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData5.push(upload.length)
                                          var sum = pptData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData55.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData5.push(upload1.length)
                                          var sum = practiseData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData55.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          datasetData5.push(upload2.length)
                                          var sum = datasetData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData55.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData5.push(youtube.length)
                                          var sum = prerequisiteData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData55.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData5.push(online.length)
                                          var sum = onlineLectureData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData55.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  } else if (chapters == '') {
                                    data1.subject5.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name5.push(['subject_name', ''])
                              }

                              // subject5 end
                              if (course_subjects[5] != '') {
                                subjectName = course_subjects[5]
                                data1.subject_name6.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[5]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData6.push(upload.length)
                                          var sum = pptData6.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData66.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData6.push(upload1.length)
                                          var sum = practiseData6.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData66.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          datasetData6.push(upload2.length)
                                          var sum = datasetData6.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData66.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData6.push(youtube.length)
                                          var sum = prerequisiteData6.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData66.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData6.push(online.length)
                                          var sum = onlineLectureData5.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData55.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });


                                    })
                                  } else if (chapters == '') {
                                    data1.subject6.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name6.push(['subject_name', ''])
                              }
                              // subject6 end
                              if (course_subjects[6] != '') {
                                subjectName = course_subjects[6]
                                data1.subject_name7.push(['subject_name', subjectName])
                                chapterModel.find({
                                  courseId: course[0]._id,
                                  semesterId: semesters[3]._id,
                                  subject: course_subjects[6]
                                }).then(function (chapters) {
                                  if (chapters != '') {
                                    chapters.forEach(function (chapter) {
                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'ppt/notes'
                                      }).then(function (upload) {
                                        if (upload != '') {
                                          ppt_notes = upload.length;
                                          pptData7.push(upload.length)
                                          var sum = pptData7.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          pptData77.push(sum);
                                        } else if (upload == '') {
                                          ppt_notes = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'practise question'
                                      }).then(function (upload1) {
                                        if (upload1 != '') {
                                          practise_question = upload1.length;
                                          practiseData7.push(upload1.length)
                                          var sum = practiseData7.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          practiseData77.push(sum);
                                        } else if (upload1 == '') {
                                          practise_question = 0;
                                        }
                                      })

                                      uploads.find({
                                        lessonId: chapter._id,
                                        type_of_upload: 'dataSet'
                                      }).then(function (upload2) {
                                        if (upload2 != '') {
                                          dataSet = upload2.length;
                                          datasetData7.push(upload2.length)
                                          var sum = datasetData7.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          datasetData77.push(sum);
                                        } else if (upload2 == '') {
                                          dataSet = 0;
                                        }
                                      })

                                      youTubeLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (youtube) {
                                        if (youtube != '') {
                                          prerequisite = youtube.length;
                                          prerequisiteData7.push(youtube.length)
                                          var sum = prerequisiteData7.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          prerequisiteData77.push(sum);
                                        } else if (youtube == '') {
                                          prerequisite = 0;
                                        }
                                      });

                                      onlineLectureLinkModel.find({
                                        chapterId: chapter._id
                                      }).then(function (online) {
                                        if (online != '') {
                                          onlineLecture = online.length;
                                          onlineLectureData7.push(online.length)
                                          var sum = onlineLectureData7.reduce(function (a, b) {
                                            return a + b;
                                          }, 0);
                                          onlineLectureData77.push(sum);
                                        } else if (online == '') {
                                          onlineLecture = 0;
                                        }
                                      });

                                    })
                                  } else if (chapters == '') {
                                    data1.subject7.push(['']);
                                  }
                                })
                              } else {
                                data1.subject_name7.push(['subject_name', ''])
                              }

                            }

                          });

                        }
                      })
                    }

                  })
                }
              })

              setTimeout(function () {
                if (pptData11.length > 0) {
                  var max1 = pptData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['ppt/notes', max1]);
                } else {
                  var max1 = 0;
                  data1.subject1.push(['ppt/notes', max1]);
                }
                if (practiseData11.length > 0) {
                  var max2 = practiseData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['practise question', max2]);
                } else {
                  var max2 = 0;
                  data1.subject1.push(['practise question', max2]);
                }
                if (datasetData11.length > 0) {
                  var max3 = datasetData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['dataSet', max3]);
                } else {
                  var max3 = 0;
                  data1.subject1.push(['dataSet', max3]);
                }

                if (prerequisiteData11.length > 0) {
                  var max4 = prerequisiteData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['prerequisite', max4]);
                } else {
                  var max4 = 0;
                  data1.subject1.push(['prerequisite', max4]);
                }
                if (onlineLectureData11.length > 0) {
                  var max5 = onlineLectureData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['onlineLecture', max5]);
                } else {
                  var max5 = 0;
                  data1.subject1.push(['onlineLecture', max5]);
                }

                //  sub2
                if (pptData22.length > 0) {
                  var ppt2 = pptData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['ppt/notes', ppt2]);
                } else {
                  var ppt2 = 0;
                  data1.subject2.push(['ppt/notes', ppt2]);
                }
                if (practiseData22.length > 0) {
                  var practise2 = practiseData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['practise question', practise2]);
                } else {
                  var practise2 = 0;
                  data1.subject2.push(['practise question', practise2]);
                }
                if (dataSetData22.length > 0) {
                  var dataset2 = dataSetData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['dataSet', dataset2]);
                } else {
                  var dataset2 = 0;
                  data1.subject2.push(['dataSet', dataset2]);
                }

                if (prerequisiteData22.length > 0) {
                  var prerequisite2 = prerequisiteData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['prerequisite', prerequisite2]);
                } else {
                  var prerequisite2 = 0;
                  data1.subject2.push(['prerequisite', prerequisite2]);
                }
                if (onlineLectureData22.length > 0) {
                  var onlinelecture2 = onlineLectureData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['onlineLecture', onlinelecture2]);
                } else {
                  var onlinelecture2 = 0;
                  data1.subject2.push(['onlineLecture', onlinelecture2]);
                }
                //  sub3
                if (pptData33.length > 0) {
                  var ppt3 = pptData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['ppt/notes', ppt3]);
                } else {
                  var ppt3 = 0;
                  data1.subject3.push(['ppt/notes', ppt3]);
                }
                if (practiseData33.length > 0) {
                  var practise3 = practiseData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['practise question', practise3]);
                } else {
                  var practise3 = 0;
                  data1.subject3.push(['practise question', practise3]);
                }
                if (datasetData33.length > 0) {
                  var dataset3 = datasetData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['dataSet', dataset3]);
                } else {
                  var dataset3 = 0;
                  data1.subject3.push(['dataSet', dataset3]);
                }

                if (prerequisiteData33.length > 0) {
                  var prerequisite3 = prerequisiteData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['prerequisite', prerequisite3]);
                } else {
                  var prerequisite3 = 0;
                  data1.subject3.push(['prerequisite', prerequisite3]);
                }
                if (onlineLectureData33.length > 0) {
                  var onlinelecture3 = onlineLectureData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['onlineLecture', onlinelecture3]);
                } else {
                  var onlinelecture3 = 0;
                  data1.subject3.push(['onlineLecture', onlinelecture3]);
                }
                // sub4
                if (pptData44.length > 0) {
                  var ppt4 = pptData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['ppt/notes', ppt4]);
                } else {
                  var ppt4 = 0;
                  data1.subject4.push(['ppt/notes', ppt4]);
                }
                if (practiseData44.length > 0) {
                  var practise4 = practiseData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['practise question', practise4]);
                } else {
                  var practise4 = 0;
                  data1.subject4.push(['practise question', practise4]);
                }
                if (datasetData44.length > 0) {
                  var dataset4 = datasetData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['dataSet', dataset4]);
                } else {
                  var dataset4 = 0;
                  data1.subject3.push(['dataSet', dataset4]);
                }

                if (prerequisiteData44.length > 0) {
                  var prerequisite4 = prerequisiteData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['prerequisite', prerequisite4]);
                } else {
                  var prerequisite4 = 0;
                  data1.subject4.push(['prerequisite', prerequisite4]);
                }
                if (onlineLectureData44.length > 0) {
                  var onlinelecture4 = onlineLectureData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['onlineLecture', onlinelecture4]);
                } else {
                  var onlinelecture4 = 0;
                  data1.subject4.push(['onlineLecture', onlinelecture4]);
                }

                // sub5
                if (pptData55.length > 0) {
                  var ppt5 = pptData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['ppt/notes', ppt5]);
                } else {
                  var ppt5 = 0;
                  data1.subject5.push(['ppt/notes', ppt5]);
                }
                if (practiseData55.length > 0) {
                  var practise5 = practiseData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['practise question', practise5]);
                } else {
                  var practise5 = 0;
                  data1.subject5.push(['practise question', practise5]);
                }
                if (datasetData55.length > 0) {
                  var dataset5 = datasetData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['dataSet', dataset5]);
                } else {
                  var dataset5 = 0;
                  data1.subject5.push(['dataSet', dataset5]);
                }

                if (prerequisiteData55.length > 0) {
                  var prerequisite5 = prerequisiteData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['prerequisite', prerequisite5]);
                } else {
                  var prerequisite5 = 0;
                  data1.subject5.push(['prerequisite', prerequisite5]);
                }
                if (onlineLectureData55.length > 0) {
                  var onlinelecture5 = onlineLectureData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['onlineLecture', onlinelecture5]);
                } else {
                  var onlinelecture5 = 0;
                  data1.subject5.push(['onlineLecture', onlinelecture5]);
                }
                // sub6
                if (pptData66.length > 0) {
                  var ppt6 = pptData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['ppt/notes', ppt6]);
                } else {
                  var ppt6 = 0;
                  data1.subject6.push(['ppt/notes', ppt6]);
                }
                if (practiseData66.length > 0) {
                  var practise6 = practiseData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['practise question', practise6]);
                } else {
                  var practise6 = 0;
                  data1.subject6.push(['practise question', practise6]);
                }
                if (datasetData66.length > 0) {
                  var dataset6 = datasetData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['dataSet', dataset6]);
                } else {
                  var dataset6 = 0;
                  data1.subject6.push(['dataSet', dataset6]);
                }

                if (prerequisiteData66.length > 0) {
                  var prerequisite6 = prerequisiteData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['prerequisite', prerequisite6]);
                } else {
                  var prerequisite6 = 0;
                  data1.subject6.push(['prerequisite', prerequisite6]);
                }
                if (onlineLectureData66.length > 0) {
                  var onlinelecture6 = onlineLectureData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['onlineLecture', onlinelecture6]);
                } else {
                  var onlinelecture6 = 0;
                  data1.subject6.push(['onlineLecture', onlinelecture6]);
                }

                // sub7
                if (pptData77.length > 0) {
                  var ppt7 = pptData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['ppt/notes', ppt7]);
                } else {
                  var ppt7 = 0;
                  data1.subject7.push(['ppt/notes', ppt7]);
                }
                if (practiseData77.length > 0) {
                  var practise7 = practiseData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['practise question', practise7]);
                } else {
                  var practise7 = 0;
                  data1.subject7.push(['practise question', practise7]);
                }
                if (datasetData77.length > 0) {
                  var dataset7 = datasetData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['dataSet', dataset7]);
                } else {
                  var dataset7 = 0;
                  data1.subject7.push(['dataSet', dataset7]);
                }

                if (prerequisiteData77.length > 0) {
                  var prerequisite7 = prerequisiteData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['prerequisite', prerequisite7]);
                } else {
                  var prerequisite7 = 0;
                  data1.subject7.push(['prerequisite', prerequisite7]);
                }
                if (onlineLectureData77.length > 0) {
                  var onlinelecture7 = onlineLectureData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['onlineLecture', onlinelecture7]);
                } else {
                  var onlinelecture7 = 0;
                  data1.subject7.push(['onlineLecture', onlinelecture7]);
                }
                res.json({
                  status: 200,
                  data: data1
                })
              }, 10000)

            }

          });
        }
      })
    } else if (req.query.semesterId != 'undefined' || req.query.semesterId != undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (course) {
        if (course != '') {
          subjectModel.find({
            courseId: course[0]._id,
            semesterId: req.query.semesterId
          }).then(function (subject) {
            if (subject != '') {
              var semesterName = req.query.semesterId
              data1.semesterName.push(['semester_name', semesterName])
              subject.forEach(subjectData => {
                var sub1 = subjectData.subject;
                var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                var sub = sub2.replace(/^"(.*)"$/, '$1');
                var strs = sub.split('","');
                strs.forEach(function (courseSubject) {
                  course_subjects.push(courseSubject);
                });

              });
              if (course_subjects[0] != '') {
                subjectName = course_subjects[0]
                data1.subject_name1.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[0]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData1.push(upload.length)
                          var sum = pptData1.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData11.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData.push(upload1.length)
                          var sum = practiseData.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData11.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length
                          datasetData1.push(upload2.length)
                          var sum = datasetData1.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData11.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      });

                      youTubeLinkModel.find({
                        chapterId: chapter._id,
                        type_of_upload: 'prerequisite'
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length
                          prerequisiteData1.push(youtube.length)
                          var sum = prerequisiteData1.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData11.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;

                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id,
                        type_of_upload: 'onlineLecture'
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length
                          onlineLectureData1.push(online.length)
                          var sum = onlineLectureData1.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData11.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject1.push(['']);
                  }

                })
              } else {
                data1.subject_name1.push(['subject_name', ''])
              }
              // subject1 end
              if (course_subjects[1] != '') {
                subjectName = course_subjects[1]
                data1.subject_name2.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[1]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData2.push(upload.length)
                          var sum = pptData2.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData22.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData2.push(upload1.length)
                          var sum = practiseData2.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData22.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          dataSetData2.push(upload2.length)
                          var sum = dataSetData2.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          dataSetData22.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData2.push(youtube.length)
                          var sum = prerequisiteData2.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData22.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData2.push(online.length)
                          var sum = onlineLectureData2.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData22.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject2.push(['']);
                  }

                });
              } else {
                data1.subject_name2.push(['subject_name', ''])
              }

              // subject2 end
              if (course_subjects[2] != '') {
                subjectName = course_subjects[2]
                data1.subject_name3.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[2]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData3.push(upload.length)
                          var sum = pptData3.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData33.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData3.push(upload1.length)
                          var sum = practiseData3.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData33.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          datasetData3.push(upload2.length)
                          var sum = datasetData3.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData33.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData3.push(youtube.length)
                          var sum = prerequisiteData3.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData33.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData3.push(online.length)
                          var sum = onlineLectureData3.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData33.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject3.push(['']);
                  }

                })
              } else {
                data1.subject_name3.push(['subject_name', ''])
              }
              // subject3 end
              if (course_subjects[3] != '') {
                subjectName = course_subjects[3]
                data1.subject_name4.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[3]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData4.push(upload.length)
                          var sum = pptData4.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData44.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData4.push(upload1.length)
                          var sum = practiseData4.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData44.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          datasetData4.push(upload2.length)
                          var sum = datasetData4.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData44.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData4.push(youtube.length)
                          var sum = prerequisiteData4.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData44.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData4.push(online.length)
                          var sum = onlineLectureData4.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData44.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject4.push(['']);
                  }

                })
              } else {
                data1.subject_name4.push(['subject_name', ''])
              }
              // subject4 end
              if (course_subjects[4] != '') {
                subjectName = course_subjects[4]
                data1.subject_name5.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[4]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData5.push(upload.length)
                          var sum = pptData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData55.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData5.push(upload1.length)
                          var sum = practiseData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData55.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          datasetData5.push(upload2.length)
                          var sum = datasetData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData55.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData5.push(youtube.length)
                          var sum = prerequisiteData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData55.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData5.push(online.length)
                          var sum = onlineLectureData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData55.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject5.push(['']);
                  }

                })
              } else {
                data1.subject_name5.push(['subject_name', ''])
              }

              // subject5 end
              if (course_subjects[5] != '') {
                subjectName = course_subjects[5]
                data1.subject_name6.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[5]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData6.push(upload.length)
                          var sum = pptData6.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData66.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData6.push(upload1.length)
                          var sum = practiseData6.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData66.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          datasetData6.push(upload2.length)
                          var sum = datasetData6.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData66.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData6.push(youtube.length)
                          var sum = prerequisiteData6.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData66.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData6.push(online.length)
                          var sum = onlineLectureData5.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData55.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });

                    })
                  } else if (chapters == '') {
                    data1.subject6.push(['']);
                  }

                })
              } else {
                data1.subject_name6.push(['subject_name', ''])
              }
              // subject6 end

              if (course_subjects[6] != '') {
                subjectName = course_subjects[6]
                data1.subject_name7.push(['subject_name', subjectName])
                chapterModel.find({
                  courseId: course[0]._id,
                  semesterId: req.query.semesterId,
                  subject: course_subjects[6]
                }).then(function (chapters) {
                  if (chapters != '') {
                    chapters.forEach(function (chapter) {
                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'ppt/notes'
                      }).then(function (upload) {
                        if (upload != '') {
                          ppt_notes = upload.length;
                          pptData7.push(upload.length)
                          var sum = pptData7.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          pptData77.push(sum);
                        } else if (upload == '') {
                          ppt_notes = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'practise question'
                      }).then(function (upload1) {
                        if (upload1 != '') {
                          practise_question = upload1.length;
                          practiseData7.push(upload1.length)
                          var sum = practiseData7.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          practiseData77.push(sum);
                        } else if (upload1 == '') {
                          practise_question = 0;
                        }
                      })

                      uploads.find({
                        lessonId: chapter._id,
                        type_of_upload: 'dataSet'
                      }).then(function (upload2) {
                        if (upload2 != '') {
                          dataSet = upload2.length;
                          datasetData7.push(upload2.length)
                          var sum = datasetData7.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          datasetData77.push(sum);
                        } else if (upload2 == '') {
                          dataSet = 0;
                        }
                      })

                      youTubeLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (youtube) {
                        if (youtube != '') {
                          prerequisite = youtube.length;
                          prerequisiteData7.push(youtube.length)
                          var sum = prerequisiteData7.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          prerequisiteData77.push(sum);
                        } else if (youtube == '') {
                          prerequisite = 0;
                        }
                      });

                      onlineLectureLinkModel.find({
                        chapterId: chapter._id
                      }).then(function (online) {
                        if (online != '') {
                          onlineLecture = online.length;
                          onlineLectureData7.push(online.length)
                          var sum = onlineLectureData7.reduce(function (a, b) {
                            return a + b;
                          }, 0);
                          onlineLectureData77.push(sum);
                        } else if (online == '') {
                          onlineLecture = 0;
                        }
                      });
                    })
                  } else if (chapters == '') {
                    data1.subject7.push(['']);
                  }

                })
              } else {
                data1.subject_name7.push(['subject_name', ''])
              }
              setTimeout(function () {
                if (pptData11.length > 0) {
                  var max1 = pptData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['ppt/notes', max1]);
                } else {
                  var max1 = 0;
                  data1.subject1.push(['ppt/notes', max1]);
                }
                if (practiseData11.length > 0) {
                  var max2 = practiseData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['practise question', max2]);
                } else {
                  var max2 = 0;
                  data1.subject1.push(['practise question', max2]);
                }
                if (datasetData11.length > 0) {
                  var max3 = datasetData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['dataSet', max3]);
                } else {
                  var max3 = 0;
                  data1.subject1.push(['dataSet', max3]);
                }

                if (prerequisiteData11.length > 0) {
                  var max4 = prerequisiteData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['prerequisite', max4]);
                } else {
                  var max4 = 0;
                  data1.subject1.push(['prerequisite', max4]);
                }
                if (onlineLectureData11.length > 0) {
                  var max5 = onlineLectureData11.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject1.push(['onlineLecture', max5]);
                } else {
                  var max5 = 0;
                  data1.subject1.push(['onlineLecture', max5]);
                }

                //  sub2
                if (pptData22.length > 0) {
                  var ppt2 = pptData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['ppt/notes', ppt2]);
                } else {
                  var ppt2 = 0;
                  data1.subject2.push(['ppt/notes', ppt2]);
                }
                if (practiseData22.length > 0) {
                  var practise2 = practiseData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['practise question', practise2]);
                } else {
                  var practise2 = 0;
                  data1.subject2.push(['practise question', practise2]);
                }
                if (dataSetData22.length > 0) {
                  var dataset2 = dataSetData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['dataSet', dataset2]);
                } else {
                  var dataset2 = 0;
                  data1.subject2.push(['dataSet', dataset2]);
                }

                if (prerequisiteData22.length > 0) {
                  var prerequisite2 = prerequisiteData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['prerequisite', prerequisite2]);
                } else {
                  var prerequisite2 = 0;
                  data1.subject2.push(['prerequisite', prerequisite2]);
                }
                if (onlineLectureData22.length > 0) {
                  var onlinelecture2 = onlineLectureData22.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject2.push(['onlineLecture', onlinelecture2]);
                } else {
                  var onlinelecture2 = 0;
                  data1.subject2.push(['onlineLecture', onlinelecture2]);
                }
                //  sub3
                if (pptData33.length > 0) {
                  var ppt3 = pptData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['ppt/notes', ppt3]);
                } else {
                  var ppt3 = 0;
                  data1.subject3.push(['ppt/notes', ppt3]);
                }
                if (practiseData33.length > 0) {
                  var practise3 = practiseData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['practise question', practise3]);
                } else {
                  var practise3 = 0;
                  data1.subject3.push(['practise question', practise3]);
                }
                if (datasetData33.length > 0) {
                  var dataset3 = datasetData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['dataSet', dataset3]);
                } else {
                  var dataset3 = 0;
                  data1.subject3.push(['dataSet', dataset3]);
                }

                if (prerequisiteData33.length > 0) {
                  var prerequisite3 = prerequisiteData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['prerequisite', prerequisite3]);
                } else {
                  var prerequisite3 = 0;
                  data1.subject3.push(['prerequisite', prerequisite3]);
                }
                if (onlineLectureData33.length > 0) {
                  var onlinelecture3 = onlineLectureData33.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject3.push(['onlineLecture', onlinelecture3]);
                } else {
                  var onlinelecture3 = 0;
                  data1.subject3.push(['onlineLecture', onlinelecture3]);
                }
                // sub4
                if (pptData44.length > 0) {
                  var ppt4 = pptData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['ppt/notes', ppt4]);
                } else {
                  var ppt4 = 0;
                  data1.subject4.push(['ppt/notes', ppt4]);
                }
                if (practiseData44.length > 0) {
                  var practise4 = practiseData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['practise question', practise4]);
                } else {
                  var practise4 = 0;
                  data1.subject4.push(['practise question', practise4]);
                }
                if (datasetData44.length > 0) {
                  var dataset4 = datasetData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['dataSet', dataset4]);
                } else {
                  var dataset4 = 0;
                  data1.subject4.push(['dataSet', dataset4]);
                }

                if (prerequisiteData44.length > 0) {
                  var prerequisite4 = prerequisiteData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['prerequisite', prerequisite4]);
                } else {
                  var prerequisite4 = 0;
                  data1.subject4.push(['prerequisite', prerequisite4]);
                }
                if (onlineLectureData44.length > 0) {
                  var onlinelecture4 = onlineLectureData44.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject4.push(['onlineLecture', onlinelecture4]);
                } else {
                  var onlinelecture4 = 0;
                  data1.subject4.push(['onlineLecture', onlinelecture4]);
                }

                // sub5
                if (pptData55.length > 0) {
                  var ppt5 = pptData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['ppt/notes', ppt5]);
                } else {
                  var ppt5 = 0;
                  data1.subject5.push(['ppt/notes', ppt5]);
                }
                if (practiseData55.length > 0) {
                  var practise5 = practiseData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['practise question', practise5]);
                } else {
                  var practise5 = 0;
                  data1.subject5.push(['practise question', practise5]);
                }
                if (datasetData55.length > 0) {
                  var dataset5 = datasetData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['dataSet', dataset5]);
                } else {
                  var dataset5 = 0;
                  data1.subject5.push(['dataSet', dataset5]);
                }

                if (prerequisiteData55.length > 0) {
                  var prerequisite5 = prerequisiteData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['prerequisite', prerequisite5]);
                } else {
                  var prerequisite5 = 0;
                  data1.subject5.push(['prerequisite', prerequisite5]);
                }
                if (onlineLectureData55.length > 0) {
                  var onlinelecture5 = onlineLectureData55.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject5.push(['onlineLecture', onlinelecture5]);
                } else {
                  var onlinelecture5 = 0;
                  data1.subject5.push(['onlineLecture', onlinelecture5]);
                }
                // sub6
                if (pptData66.length > 0) {
                  var ppt6 = pptData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['ppt/notes', ppt6]);
                } else {
                  var ppt6 = 0;
                  data1.subject6.push(['ppt/notes', ppt6]);
                }
                if (practiseData66.length > 0) {
                  var practise6 = practiseData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['practise question', practise6]);
                } else {
                  var practise6 = 0;
                  data1.subject6.push(['practise question', practise6]);
                }
                if (datasetData66.length > 0) {
                  var dataset6 = datasetData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['dataSet', dataset6]);
                } else {
                  var dataset6 = 0;
                  data1.subject6.push(['dataSet', dataset6]);
                }

                if (prerequisiteData66.length > 0) {
                  var prerequisite6 = prerequisiteData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['prerequisite', prerequisite6]);
                } else {
                  var prerequisite6 = 0;
                  data1.subject6.push(['prerequisite', prerequisite6]);
                }
                if (onlineLectureData66.length > 0) {
                  var onlinelecture6 = onlineLectureData66.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject6.push(['onlineLecture', onlinelecture6]);
                } else {
                  var onlinelecture6 = 0;
                  data1.subject6.push(['onlineLecture', onlinelecture6]);
                }

                // sub7
                if (pptData77.length > 0) {
                  var ppt7 = pptData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['ppt/notes', ppt7]);
                } else {
                  var ppt7 = 0;
                  data1.subject7.push(['ppt/notes', ppt7]);
                }
                if (practiseData77.length > 0) {
                  var practise7 = practiseData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['practise question', practise7]);
                } else {
                  var practise7 = 0;
                  data1.subject7.push(['practise question', practise7]);
                }
                if (datasetData77.length > 0) {
                  var dataset7 = datasetData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['dataSet', dataset7]);
                } else {
                  var dataset7 = 0;
                  data1.subject7.push(['dataSet', dataset7]);
                }

                if (prerequisiteData77.length > 0) {
                  var prerequisite7 = prerequisiteData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['prerequisite', prerequisite7]);
                } else {
                  var prerequisite7 = 0;
                  data1.subject7.push(['prerequisite', prerequisite7]);
                }
                if (onlineLectureData77.length > 0) {
                  var onlinelecture7 = onlineLectureData77.reduce(function (a, b) {
                    return Math.max(a, b);
                  });
                  data1.subject7.push(['onlineLecture', onlinelecture7]);
                } else {
                  var onlinelecture7 = 0;
                  data1.subject7.push(['onlineLecture', onlinelecture7]);
                }
                res.json({
                  status: 200,
                  data: data1
                })
              }, 8000)
            } else if (subject == '') {
              res.json({
                status: 400,
                message: 'bad request!!!..'
              })
            }
          })
        }
      });
    }
  } else if (req.query.role == 'teacher') {
    if (req.query.semesterId == 'undefined' || req.query.semesterId == undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (course) {
        if (course != '') {
          semesterNewModel.find({}).sort({ 'createdOn': -1 }).exec(function (err, semesters) {
            var spe_count = 0;
            semesters.forEach((sem) => {
              spe_count++;
              teacherModel.find({
                course_id: course[0]._id,
                teacher_id: req.query.user_id,
                semesterId: sem._id
              }).populate('course_id').populate('semesterId').exec(function (err, semester1) {

                if (err) {
                  console.error(err)
                } else if (semester1 != '') {


                  var semesterName = semester1[0].semesterId._id;
                  data1.semesterName.push(['semester_name', semesterName]);
                  if (semester1.length > 0) {
                    if (semester1[0].subject != '') {
                      data1.semesterData.push(semester1[0].semesterId);

                      subjectName = semester1[0].subject
                      data1.subject_name1.push(['subject_name', subjectName])
                      chapterModel.find({
                        courseId: course[0]._id,
                        semesterId: semester1[0].semesterId._id,
                        subject: semester1[0].subject
                      }).then(function (chapters) {
                        if (chapters != '') {
                          chapters.forEach(function (chapter) {
                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'ppt/notes'
                            }).then(function (upload) {
                              if (upload != '') {
                                ppt_notes = upload.length;
                                pptData1.push(upload.length)
                                var sum = pptData1.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                pptData11.push(sum);
                              } else if (upload == '') {
                                ppt_notes = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'practise question'
                            }).then(function (upload1) {
                              if (upload1 != '') {
                                practise_question11 = upload1.length;
                                practiseData.push(upload1.length)
                                var sum = practiseData.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                practiseData11.push(sum);
                              } else if (upload1 == '') {
                                practise_question = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'dataSet'
                            }).then(function (upload2) {
                              if (upload2 != '') {
                                dataSet = upload2.length
                                datasetData1.push(upload2.length)
                                var sum = datasetData1.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                datasetData11.push(sum);
                              } else if (upload2 == '') {
                                dataSet = 0;
                              }
                            });

                            youTubeLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'prerequisite'
                            }).then(function (youtube) {
                              if (youtube != '') {
                                prerequisite = youtube.length
                                prerequisiteData1.push(youtube.length)
                                var sum = prerequisiteData1.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                prerequisiteData11.push(sum);
                              } else if (youtube == '') {
                                prerequisite = 0;

                              }
                            });

                            onlineLectureLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'onlineLecture'
                            }).then(function (online) {
                              if (online != '') {
                                onlineLecture = online.length
                                onlineLectureData1.push(online.length)
                                var sum = onlineLectureData1.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                onlineLectureData11.push(sum);
                              } else if (online == '') {
                                onlineLecture = 0;
                              }
                            });
                          })
                        } else if (chapters == '') {
                          data1.subject1.push(['']);
                        }
                      })
                    }
                  }
                  if (semester1.length > 1) {
                    if (semester1[1].subject != '') {
                      data1.semesterData.push(semester1[1].semesterId);

                      subjectName = semester1[1].subject
                      data1.subject_name1.push(['subject_name', subjectName])
                      chapterModel.find({
                        courseId: course[0]._id,
                        semesterId: semester1[1].semesterId._id,
                        subject: semester1[0].subject
                      }).then(function (chapters) {
                        if (chapters != '') {
                          chapters.forEach(function (chapter) {
                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'ppt/notes'
                            }).then(function (upload) {
                              if (upload != '') {
                                ppt_notes = upload.length;
                                pptData2.push(upload.length)
                                var sum = pptData2.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                pptData22.push(sum);
                              } else if (upload == '') {
                                ppt_notes = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'practise question'
                            }).then(function (upload1) {
                              if (upload1 != '') {
                                practise_question = upload1.length;
                                practiseData2.push(upload1.length)
                                var sum = practiseData2.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                practiseData22.push(sum);
                              } else if (upload1 == '') {
                                practise_question = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'dataSet'
                            }).then(function (upload2) {
                              if (upload2 != '') {
                                dataSet = upload2.length
                                dataSetData2.push(upload2.length)
                                var sum = dataSetData2.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                dataSetData22.push(sum);
                              } else if (upload2 == '') {
                                dataSet = 0;
                              }
                            });

                            youTubeLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'prerequisite'
                            }).then(function (youtube) {
                              if (youtube != '') {
                                prerequisite = youtube.length
                                prerequisiteData2.push(youtube.length)
                                var sum = prerequisiteData2.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                prerequisiteData22.push(sum);
                              } else if (youtube == '') {
                                prerequisite = 0;

                              }
                            });

                            onlineLectureLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'onlineLecture'
                            }).then(function (online) {
                              if (online != '') {
                                onlineLecture = online.length
                                onlineLectureData2.push(online.length)
                                var sum = onlineLectureData2.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                onlineLectureData22.push(sum);
                              } else if (online == '') {
                                onlineLecture = 0;
                              }
                            });
                          })
                        } else if (chapters == '') {
                          data1.subject2.push(['']);
                        }
                      })
                    } else {
                      data1.subject_name2.push({ subject_name: '' })
                    }
                  }
                  if (semester1.length > 2) {
                    if (semester1[2].subject != '') {
                      data1.semesterData.push(semester1[2].semesterId);

                      subjectName = semester1[2].subject
                      data1.subject_name1.push(['subject_name', subjectName])
                      chapterModel.find({
                        courseId: course[0]._id,
                        semesterId: semester1[0].semesterId._id,
                        subject: semester1[2].subject
                      }).then(function (chapters) {
                        if (chapters != '') {
                          chapters.forEach(function (chapter) {
                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'ppt/notes'
                            }).then(function (upload) {
                              if (upload != '') {
                                ppt_notes = upload.length;
                                pptData3.push(upload.length)
                                var sum = pptData3.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                pptData33.push(sum);
                              } else if (upload == '') {
                                ppt_notes = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'practise question'
                            }).then(function (upload1) {
                              if (upload1 != '') {
                                practise_question = upload1.length;
                                practiseData3.push(upload1.length)
                                var sum = practiseData3.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                practiseData33.push(sum);
                              } else if (upload1 == '') {
                                practise_question = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'dataSet'
                            }).then(function (upload2) {
                              if (upload2 != '') {
                                dataSet = upload2.length
                                datasetData3.push(upload2.length)
                                var sum = datasetData3.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                datasetData33.push(sum);
                              } else if (upload2 == '') {
                                dataSet = 0;
                              }
                            });

                            youTubeLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'prerequisite'
                            }).then(function (youtube) {
                              if (youtube != '') {
                                prerequisite = youtube.length
                                prerequisiteData3.push(youtube.length)
                                var sum = prerequisiteData3.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                prerequisiteData33.push(sum);
                              } else if (youtube == '') {
                                prerequisite = 0;

                              }
                            });

                            onlineLectureLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'onlineLecture'
                            }).then(function (online) {
                              if (online != '') {
                                onlineLecture = online.length
                                onlineLectureData3.push(online.length)
                                var sum = onlineLectureData3.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                onlineLectureData33.push(sum);
                              } else if (online == '') {
                                onlineLecture = 0;
                              }
                            });
                          })
                        } else if (chapters == '') {
                          data1.subject3.push(['']);
                        }
                      })
                    } else {
                      data1.subject_name3.push({ subject_name: '' })
                    }
                  }
                  if (semester1.length > 3) {
                    if (semester1[3].subject != '') {
                      data1.semesterData.push(semester1[3].semesterId);

                      subjectName = semester1[3].subject
                      data1.subject_name1.push(['subject_name', subjectName])
                      chapterModel.find({
                        courseId: course[0]._id,
                        semesterId: semester1[0].semesterId._id,
                        subject: semester1[3].subject
                      }).then(function (chapters) {
                        if (chapters != '') {
                          chapters.forEach(function (chapter) {
                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'ppt/notes'
                            }).then(function (upload) {
                              if (upload != '') {
                                ppt_notes = upload.length;
                                pptData4.push(upload.length)
                                var sum = pptData4.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                pptData44.push(sum);
                              } else if (upload == '') {
                                ppt_notes = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'practise question'
                            }).then(function (upload1) {
                              if (upload1 != '') {
                                practise_question = upload1.length;
                                practiseData4.push(upload1.length)
                                var sum = practiseData4.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                practiseData44.push(sum);
                              } else if (upload1 == '') {
                                practise_question = 0;
                              }
                            })

                            uploads.find({
                              lessonId: chapter._id,
                              type_of_upload: 'dataSet'
                            }).then(function (upload2) {
                              if (upload2 != '') {
                                dataSet = upload2.length
                                datasetData4.push(upload2.length)
                                var sum = datasetData4.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                datasetData44.push(sum);
                              } else if (upload2 == '') {
                                dataSet = 0;
                              }
                            });

                            youTubeLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'prerequisite'
                            }).then(function (youtube) {
                              if (youtube != '') {
                                prerequisite = youtube.length
                                prerequisiteData4.push(youtube.length)
                                var sum = prerequisiteData4.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                prerequisiteData44.push(sum);
                              } else if (youtube == '') {
                                prerequisite = 0;

                              }
                            });

                            onlineLectureLinkModel.find({
                              chapterId: chapter._id,
                              type_of_upload: 'onlineLecture'
                            }).then(function (online) {
                              if (online != '') {
                                onlineLecture = online.length
                                onlineLectureData4.push(online.length)
                                var sum = onlineLectureData4.reduce(function (a, b) {
                                  return a + b;
                                }, 0);
                                onlineLectureData44.push(sum);
                              } else if (online == '') {
                                onlineLecture = 0;
                              }
                            });
                          })
                        } else if (chapters == '') {
                          data1.subject4.push(['']);
                        }
                      })
                    } else {
                      data1.subject_name4.push({ subject_name: '' })
                    }
                  }

                  if (semester1.length > 4) {
                  }
                  if (semester1.length > 5) {
                  }
                  if (semester1.length > 6) {
                  }

                } else if (semester1 == '') {
                  teacherModel.find({
                    course_id: course[0]._id,
                    teacher_id: req.query.user_id,
                    semesterId: semesters[1]._id
                  }).populate('course_id', '[courseName]').populate('semesterId', '[semesterName]').exec(function (err, semester2) {
                    if (err) {
                      console.error(err)
                    } else if (semester2 != '') {
                      var semesterName = semester2[0].semesterId._id;
                      data1.semesterName.push(['semester_name', semesterName]);
                      if (semester2.length > 0) {
                        if (semester2[0].subject != '') {
                          data1.semesterData.push(semester2[0].semesterId);

                          subjectName = semester2[0].subject
                          data1.subject_name1.push(['subject_name', subjectName])
                          chapterModel.find({
                            courseId: course[0]._id,
                            semesterId: semester2[0].semesterId._id,
                            subject: semester2[0].subject
                          }).then(function (chapters) {
                            if (chapters != '') {
                              chapters.forEach(function (chapter) {
                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'ppt/notes'
                                }).then(function (upload) {
                                  if (upload != '') {
                                    ppt_notes = upload.length;
                                    pptData1.push(upload.length)
                                    var sum = pptData1.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    pptData11.push(sum);
                                  } else if (upload == '') {
                                    ppt_notes = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'practise question'
                                }).then(function (upload1) {
                                  if (upload1 != '') {
                                    practise_question11 = upload1.length;
                                    practiseData.push(upload1.length)
                                    var sum = practiseData.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    practiseData11.push(sum);
                                  } else if (upload1 == '') {
                                    practise_question = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'dataSet'
                                }).then(function (upload2) {
                                  if (upload2 != '') {
                                    dataSet = upload2.length
                                    datasetData1.push(upload2.length)
                                    var sum = datasetData1.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    datasetData11.push(sum);
                                  } else if (upload2 == '') {
                                    dataSet = 0;
                                  }
                                });

                                youTubeLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'prerequisite'
                                }).then(function (youtube) {
                                  if (youtube != '') {
                                    prerequisite = youtube.length
                                    prerequisiteData1.push(youtube.length)
                                    var sum = prerequisiteData1.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    prerequisiteData11.push(sum);
                                  } else if (youtube == '') {
                                    prerequisite = 0;

                                  }
                                });

                                onlineLectureLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'onlineLecture'
                                }).then(function (online) {
                                  if (online != '') {
                                    onlineLecture = online.length
                                    onlineLectureData1.push(online.length)
                                    var sum = onlineLectureData1.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    onlineLectureData11.push(sum);
                                  } else if (online == '') {
                                    onlineLecture = 0;
                                  }
                                });
                              })
                            } else if (chapters == '') {
                              data1.subject1.push(['']);
                            }
                          })
                        } else {
                          data1.subject_name1.push({ subject_name: '' })
                        }
                      } else {
                        data1.subject_name1.push({ subject_name: '' })
                      }
                      if (semester2.length > 1) {
                        if (semester2[1].subject != '') {
                          data1.semesterData.push(semester2[1].semesterId);

                          subjectName = semester2[1].subject
                          data1.subject_name1.push(['subject_name', subjectName])
                          chapterModel.find({
                            courseId: course[0]._id,
                            semesterId: semester2[1].semesterId._id,
                            subject: semester2[0].subject
                          }).then(function (chapters) {
                            if (chapters != '') {
                              chapters.forEach(function (chapter) {
                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'ppt/notes'
                                }).then(function (upload) {
                                  if (upload != '') {
                                    ppt_notes = upload.length;
                                    pptData2.push(upload.length)
                                    var sum = pptData2.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    pptData22.push(sum);
                                  } else if (upload == '') {
                                    ppt_notes = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'practise question'
                                }).then(function (upload1) {
                                  if (upload1 != '') {
                                    practise_question = upload1.length;
                                    practiseData2.push(upload1.length)
                                    var sum = practiseData2.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    practiseData22.push(sum);
                                  } else if (upload1 == '') {
                                    practise_question = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'dataSet'
                                }).then(function (upload2) {
                                  if (upload2 != '') {
                                    dataSet = upload2.length
                                    dataSetData2.push(upload2.length)
                                    var sum = dataSetData2.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    dataSetData22.push(sum);
                                  } else if (upload2 == '') {
                                    dataSet = 0;
                                  }
                                });

                                youTubeLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'prerequisite'
                                }).then(function (youtube) {
                                  if (youtube != '') {
                                    prerequisite = youtube.length
                                    prerequisiteData2.push(youtube.length)
                                    var sum = prerequisiteData2.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    prerequisiteData22.push(sum);
                                  } else if (youtube == '') {
                                    prerequisite = 0;

                                  }
                                });

                                onlineLectureLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'onlineLecture'
                                }).then(function (online) {
                                  if (online != '') {
                                    onlineLecture = online.length
                                    onlineLectureData2.push(online.length)
                                    var sum = onlineLectureData2.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    onlineLectureData22.push(sum);
                                  } else if (online == '') {
                                    onlineLecture = 0;
                                  }
                                });
                              })
                            } else if (chapters == '') {
                              data1.subject2.push(['']);
                            }
                          })
                        } else {
                          data1.subject_name2.push({ subject_name: '' })
                        }
                      } else {
                        data1.subject_name2.push({ subject_name: '' })
                      }
                      if (semester2.length > 2) {
                        if (semester2[2].subject != '') {
                          data1.semesterData.push(semester2[2].semesterId);

                          subjectName = semester2[2].subject
                          data1.subject_name1.push(['subject_name', subjectName])
                          chapterModel.find({
                            courseId: course[0]._id,
                            semesterId: semester2[0].semesterId._id,
                            subject: semester2[2].subject
                          }).then(function (chapters) {
                            if (chapters != '') {
                              chapters.forEach(function (chapter) {
                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'ppt/notes'
                                }).then(function (upload) {
                                  if (upload != '') {
                                    ppt_notes = upload.length;
                                    pptData3.push(upload.length)
                                    var sum = pptData3.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    pptData33.push(sum);
                                  } else if (upload == '') {
                                    ppt_notes = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'practise question'
                                }).then(function (upload1) {
                                  if (upload1 != '') {
                                    practise_question = upload1.length;
                                    practiseData3.push(upload1.length)
                                    var sum = practiseData3.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    practiseData33.push(sum);
                                  } else if (upload1 == '') {
                                    practise_question = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'dataSet'
                                }).then(function (upload2) {
                                  if (upload2 != '') {
                                    dataSet = upload2.length
                                    datasetData3.push(upload2.length)
                                    var sum = datasetData3.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    datasetData33.push(sum);
                                  } else if (upload2 == '') {
                                    dataSet = 0;
                                  }
                                });

                                youTubeLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'prerequisite'
                                }).then(function (youtube) {
                                  if (youtube != '') {
                                    prerequisite = youtube.length
                                    prerequisiteData3.push(youtube.length)
                                    var sum = prerequisiteData3.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    prerequisiteData33.push(sum);
                                  } else if (youtube == '') {
                                    prerequisite = 0;

                                  }
                                });

                                onlineLectureLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'onlineLecture'
                                }).then(function (online) {
                                  if (online != '') {
                                    onlineLecture = online.length
                                    onlineLectureData3.push(online.length)
                                    var sum = onlineLectureData3.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    onlineLectureData33.push(sum);
                                  } else if (online == '') {
                                    onlineLecture = 0;
                                  }
                                });
                              })
                            } else if (chapters == '') {
                              data1.subject3.push(['']);
                            }
                          })
                        } else {
                          data1.subject_name3.push({ subject_name: '' })
                        }
                      } else {
                        data1.subject_name3.push({ subject_name: '' })
                      }
                      if (semester2.length > 3) {
                        if (semester2[3].subject != '') {
                          data1.semesterData.push(semester2[3].semesterId);

                          subjectName = semester2[3].subject
                          data1.subject_name1.push(['subject_name', subjectName])
                          chapterModel.find({
                            courseId: course[0]._id,
                            semesterId: semester2[0].semesterId._id,
                            subject: semester2[3].subject
                          }).then(function (chapters) {
                            if (chapters != '') {
                              chapters.forEach(function (chapter) {
                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'ppt/notes'
                                }).then(function (upload) {
                                  if (upload != '') {
                                    ppt_notes = upload.length;
                                    pptData4.push(upload.length)
                                    var sum = pptData4.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    pptData44.push(sum);
                                  } else if (upload == '') {
                                    ppt_notes = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'practise question'
                                }).then(function (upload1) {
                                  if (upload1 != '') {
                                    practise_question = upload1.length;
                                    practiseData4.push(upload1.length)
                                    var sum = practiseData4.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    practiseData44.push(sum);
                                  } else if (upload1 == '') {
                                    practise_question = 0;
                                  }
                                })

                                uploads.find({
                                  lessonId: chapter._id,
                                  type_of_upload: 'dataSet'
                                }).then(function (upload2) {
                                  if (upload2 != '') {
                                    dataSet = upload2.length
                                    datasetData4.push(upload2.length)
                                    var sum = datasetData4.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    datasetData44.push(sum);
                                  } else if (upload2 == '') {
                                    dataSet = 0;
                                  }
                                });

                                youTubeLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'prerequisite'
                                }).then(function (youtube) {
                                  if (youtube != '') {
                                    prerequisite = youtube.length
                                    prerequisiteData4.push(youtube.length)
                                    var sum = prerequisiteData4.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    prerequisiteData44.push(sum);
                                  } else if (youtube == '') {
                                    prerequisite = 0;

                                  }
                                });

                                onlineLectureLinkModel.find({
                                  chapterId: chapter._id,
                                  type_of_upload: 'onlineLecture'
                                }).then(function (online) {
                                  if (online != '') {
                                    onlineLecture = online.length
                                    onlineLectureData4.push(online.length)
                                    var sum = onlineLectureData4.reduce(function (a, b) {
                                      return a + b;
                                    }, 0);
                                    onlineLectureData44.push(sum);
                                  } else if (online == '') {
                                    onlineLecture = 0;
                                  }
                                });
                              })
                            } else if (chapters == '') {
                              data1.subject4.push(['']);
                            }
                          })
                        } else {
                          data1.subject_name4.push({ subject_name: '' })
                        }
                      } else {
                        data1.subject_name4.push({ subject_name: '' })
                      }

                      if (semester2.length > 4) {
                      } else {
                        data1.subject_name5.push({ subject_name: '' })
                      }
                      if (semester2.length > 5) {
                      } else {
                        data1.subject_name6.push({ subject_name: '' })
                      }
                      if (semester2.length > 6) {
                      } else {
                        data1.subject_name7.push({ subject_name: '' })
                      }
                    }

                    // sem 3 end
                    else if (semester2 == '') {
                      teacherModel.find({
                        course_id: course[0]._id,
                        teacher_id: req.query.user_id,
                        semesterId: semesters[2]._id
                      }).populate('course_id', '[courseName]').populate('semesterId', '[semesterName]').exec(function (err, semester3) {
                        if (err) {
                          console.error(err)
                        } else if (semester3 != '') {
                          data1.semesterData.push(semester3[0].semesterId);

                          var semesterName = semester3[0].semesterId._id;
                          data1.semesterName.push(['semester_name', semesterName]);
                          if (semester3.length > 0) {
                            if (semester3[0].subject != '') {
                              subjectName = semester3[0].subject
                              data1.subject_name1.push(['subject_name', subjectName])
                              chapterModel.find({
                                courseId: course[0]._id,
                                semesterId: semester3[0].semesterId._id,
                                subject: semester3[0].subject
                              }).then(function (chapters) {
                                if (chapters != '') {
                                  chapters.forEach(function (chapter) {
                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'ppt/notes'
                                    }).then(function (upload) {
                                      if (upload != '') {
                                        ppt_notes = upload.length;
                                        pptData1.push(upload.length)
                                        var sum = pptData1.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        pptData11.push(sum);
                                      } else if (upload == '') {
                                        ppt_notes = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'practise question'
                                    }).then(function (upload1) {
                                      if (upload1 != '') {
                                        practise_question11 = upload1.length;
                                        practiseData.push(upload1.length)
                                        var sum = practiseData.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        practiseData11.push(sum);
                                      } else if (upload1 == '') {
                                        practise_question = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'dataSet'
                                    }).then(function (upload2) {
                                      if (upload2 != '') {
                                        dataSet = upload2.length
                                        datasetData1.push(upload2.length)
                                        var sum = datasetData1.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        datasetData11.push(sum);
                                      } else if (upload2 == '') {
                                        dataSet = 0;
                                      }
                                    });

                                    youTubeLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'prerequisite'
                                    }).then(function (youtube) {
                                      if (youtube != '') {
                                        prerequisite = youtube.length
                                        prerequisiteData1.push(youtube.length)
                                        var sum = prerequisiteData1.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        prerequisiteData11.push(sum);
                                      } else if (youtube == '') {
                                        prerequisite = 0;

                                      }
                                    });

                                    onlineLectureLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'onlineLecture'
                                    }).then(function (online) {
                                      if (online != '') {
                                        onlineLecture = online.length
                                        onlineLectureData1.push(online.length)
                                        var sum = onlineLectureData1.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        onlineLectureData11.push(sum);
                                      } else if (online == '') {
                                        onlineLecture = 0;
                                      }
                                    });
                                  })
                                } else if (chapters == '') {
                                  data1.subject1.push(['']);
                                }
                              })
                            } else {
                              data1.subject_name1.push({ subject_name: '' })
                            }
                          } else {
                            data1.subject_name1.push({ subject_name: '' })
                          }
                          if (semester3.length > 1) {
                            if (semester3[1].subject != '') {
                              data1.semesterData.push(semester3[1].semesterId);
                              subjectName = semester3[1].subject
                              data1.subject_name1.push(['subject_name', subjectName])
                              chapterModel.find({
                                courseId: course[0]._id,
                                semesterId: semester3[1].semesterId._id,
                                subject: semester3[0].subject
                              }).then(function (chapters) {
                                if (chapters != '') {
                                  chapters.forEach(function (chapter) {
                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'ppt/notes'
                                    }).then(function (upload) {
                                      if (upload != '') {
                                        ppt_notes = upload.length;
                                        pptData2.push(upload.length)
                                        var sum = pptData2.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        pptData22.push(sum);
                                      } else if (upload == '') {
                                        ppt_notes = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'practise question'
                                    }).then(function (upload1) {
                                      if (upload1 != '') {
                                        practise_question = upload1.length;
                                        practiseData2.push(upload1.length)
                                        var sum = practiseData2.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        practiseData22.push(sum);
                                      } else if (upload1 == '') {
                                        practise_question = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'dataSet'
                                    }).then(function (upload2) {
                                      if (upload2 != '') {
                                        dataSet = upload2.length
                                        dataSetData2.push(upload2.length)
                                        var sum = dataSetData2.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        dataSetData22.push(sum);
                                      } else if (upload2 == '') {
                                        dataSet = 0;
                                      }
                                    });

                                    youTubeLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'prerequisite'
                                    }).then(function (youtube) {
                                      if (youtube != '') {
                                        prerequisite = youtube.length
                                        prerequisiteData2.push(youtube.length)
                                        var sum = prerequisiteData2.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        prerequisiteData22.push(sum);
                                      } else if (youtube == '') {
                                        prerequisite = 0;

                                      }
                                    });

                                    onlineLectureLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'onlineLecture'
                                    }).then(function (online) {
                                      if (online != '') {
                                        onlineLecture = online.length
                                        onlineLectureData2.push(online.length)
                                        var sum = onlineLectureData2.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        onlineLectureData22.push(sum);
                                      } else if (online == '') {
                                        onlineLecture = 0;
                                      }
                                    });
                                  })
                                } else if (chapters == '') {
                                  data1.subject2.push(['']);
                                }
                              })
                            } else {
                              data1.subject_name2.push({ subject_name: '' })
                            }
                          } else {
                            data1.subject_name2.push({ subject_name: '' })
                          }
                          if (semester3.length > 2) {
                            if (semester3[2].subject != '') {
                              data1.semesterData.push(semester1[0].semesterId);

                              subjectName = semester3[2].subject
                              data1.subject_name1.push(['subject_name', subjectName])
                              chapterModel.find({
                                courseId: course[0]._id,
                                semesterId: semester3[0].semesterId._id,
                                subject: semester3[2].subject
                              }).then(function (chapters) {
                                if (chapters != '') {
                                  chapters.forEach(function (chapter) {
                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'ppt/notes'
                                    }).then(function (upload) {
                                      if (upload != '') {
                                        ppt_notes = upload.length;
                                        pptData3.push(upload.length)
                                        var sum = pptData3.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        pptData33.push(sum);
                                      } else if (upload == '') {
                                        ppt_notes = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'practise question'
                                    }).then(function (upload1) {
                                      if (upload1 != '') {
                                        practise_question = upload1.length;
                                        practiseData3.push(upload1.length)
                                        var sum = practiseData3.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        practiseData33.push(sum);
                                      } else if (upload1 == '') {
                                        practise_question = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'dataSet'
                                    }).then(function (upload2) {
                                      if (upload2 != '') {
                                        dataSet = upload2.length
                                        datasetData3.push(upload2.length)
                                        var sum = datasetData3.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        datasetData33.push(sum);
                                      } else if (upload2 == '') {
                                        dataSet = 0;
                                      }
                                    });

                                    youTubeLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'prerequisite'
                                    }).then(function (youtube) {
                                      if (youtube != '') {
                                        prerequisite = youtube.length
                                        prerequisiteData3.push(youtube.length)
                                        var sum = prerequisiteData3.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        prerequisiteData33.push(sum);
                                      } else if (youtube == '') {
                                        prerequisite = 0;

                                      }
                                    });

                                    onlineLectureLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'onlineLecture'
                                    }).then(function (online) {
                                      if (online != '') {
                                        onlineLecture = online.length
                                        onlineLectureData3.push(online.length)
                                        var sum = onlineLectureData3.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        onlineLectureData33.push(sum);
                                      } else if (online == '') {
                                        onlineLecture = 0;
                                      }
                                    });
                                  })
                                } else if (chapters == '') {
                                  data1.subject3.push(['']);
                                }
                              })
                            } else {
                              data1.subject_name3.push({ subject_name: '' })
                            }
                          } else {
                            data1.subject_name3.push({ subject_name: '' })
                          }
                          if (semester3.length > 3) {
                            if (semester3[3].subject != '') {
                              subjectName = semester3[3].subject
                              data1.subject_name1.push(['subject_name', subjectName])
                              chapterModel.find({
                                courseId: course[0]._id,
                                semesterId: semester3[0].semesterId._id,
                                subject: semester3[3].subject
                              }).then(function (chapters) {
                                if (chapters != '') {
                                  chapters.forEach(function (chapter) {
                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'ppt/notes'
                                    }).then(function (upload) {
                                      if (upload != '') {
                                        ppt_notes = upload.length;
                                        pptData4.push(upload.length)
                                        var sum = pptData4.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        pptData44.push(sum);
                                      } else if (upload == '') {
                                        ppt_notes = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'practise question'
                                    }).then(function (upload1) {
                                      if (upload1 != '') {
                                        practise_question = upload1.length;
                                        practiseData4.push(upload1.length)
                                        var sum = practiseData4.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        practiseData44.push(sum);
                                      } else if (upload1 == '') {
                                        practise_question = 0;
                                      }
                                    })

                                    uploads.find({
                                      lessonId: chapter._id,
                                      type_of_upload: 'dataSet'
                                    }).then(function (upload2) {
                                      if (upload2 != '') {
                                        dataSet = upload2.length
                                        datasetData4.push(upload2.length)
                                        var sum = datasetData4.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        datasetData44.push(sum);
                                      } else if (upload2 == '') {
                                        dataSet = 0;
                                      }
                                    });

                                    youTubeLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'prerequisite'
                                    }).then(function (youtube) {
                                      if (youtube != '') {
                                        prerequisite = youtube.length
                                        prerequisiteData4.push(youtube.length)
                                        var sum = prerequisiteData4.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        prerequisiteData44.push(sum);
                                      } else if (youtube == '') {
                                        prerequisite = 0;

                                      }
                                    });

                                    onlineLectureLinkModel.find({
                                      chapterId: chapter._id,
                                      type_of_upload: 'onlineLecture'
                                    }).then(function (online) {
                                      if (online != '') {
                                        onlineLecture = online.length
                                        onlineLectureData4.push(online.length)
                                        var sum = onlineLectureData4.reduce(function (a, b) {
                                          return a + b;
                                        }, 0);
                                        onlineLectureData44.push(sum);
                                      } else if (online == '') {
                                        onlineLecture = 0;
                                      }
                                    });
                                  })
                                } else if (chapters == '') {
                                  data1.subject4.push(['']);
                                }
                              })
                            } else {
                              data1.subject_name4.push({ subject_name: '' })
                            }
                          } else {
                            data1.subject_name4.push({ subject_name: '' })
                          }

                          if (semester3.length > 4) {
                          } else {
                            data1.subject_name5.push({ subject_name: '' })
                          }
                          if (semester3.length > 5) {
                          } else {
                            data1.subject_name6.push({ subject_name: '' })
                          }
                          if (semester3.length > 6) {
                          } else {
                            data1.subject_name7.push({ subject_name: '' })
                          }
                        }
                        //  sem2 end

                        else if (semester3 == '') {
                          teacherModel.find({
                            course_id: course[0]._id,
                            teacher_id: req.query.user_id,
                            semesterId: semesters[3]._id
                          }).populate('course_id', '[courseName]').populate('semesterId', '[semesterName]').exec(function (err, semester4) {
                            if (err) {
                              console.error(err);
                            } else if (semester4 != '') {
                              var semesterName = semester4[0].semesterId._id;
                              data1.semesterName.push(['semester_name', semesterName]);
                              if (semester4.length > 0) {
                                if (semester4[0].subject != '') {
                                  subjectName = semester4[0].subject
                                  data1.subject_name1.push(['subject_name', subjectName])
                                  chapterModel.find({
                                    courseId: course[0]._id,
                                    semesterId: semester4[0].semesterId._id,
                                    subject: semester4[0].subject
                                  }).then(function (chapters) {
                                    if (chapters != '') {
                                      chapters.forEach(function (chapter) {
                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'ppt/notes'
                                        }).then(function (upload) {
                                          if (upload != '') {
                                            ppt_notes = upload.length;
                                            pptData1.push(upload.length)
                                            var sum = pptData1.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            pptData11.push(sum);
                                          } else if (upload == '') {
                                            ppt_notes = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'practise question'
                                        }).then(function (upload1) {
                                          if (upload1 != '') {
                                            practise_question11 = upload1.length;
                                            practiseData.push(upload1.length)
                                            var sum = practiseData.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            practiseData11.push(sum);
                                          } else if (upload1 == '') {
                                            practise_question = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'dataSet'
                                        }).then(function (upload2) {
                                          if (upload2 != '') {
                                            dataSet = upload2.length
                                            datasetData1.push(upload2.length)
                                            var sum = datasetData1.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            datasetData11.push(sum);
                                          } else if (upload2 == '') {
                                            dataSet = 0;
                                          }
                                        });

                                        youTubeLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'prerequisite'
                                        }).then(function (youtube) {
                                          if (youtube != '') {
                                            prerequisite = youtube.length
                                            prerequisiteData1.push(youtube.length)
                                            var sum = prerequisiteData1.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            prerequisiteData11.push(sum);
                                          } else if (youtube == '') {
                                            prerequisite = 0;

                                          }
                                        });

                                        onlineLectureLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'onlineLecture'
                                        }).then(function (online) {
                                          if (online != '') {
                                            onlineLecture = online.length
                                            onlineLectureData1.push(online.length)
                                            var sum = onlineLectureData1.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            onlineLectureData11.push(sum);
                                          } else if (online == '') {
                                            onlineLecture = 0;
                                          }
                                        });
                                      })
                                    } else if (chapters == '') {
                                      data1.subject1.push(['']);
                                    }
                                  })
                                } else {
                                  data1.subject_name1.push({ subject_name: '' })
                                }
                              } else {
                                data1.subject_name1.push({ subject_name: '' })
                              }
                              if (semester4.length > 1) {
                                if (semester4[1].subject != '') {
                                  subjectName = semester4[1].subject
                                  data1.subject_name1.push(['subject_name', subjectName])
                                  chapterModel.find({
                                    courseId: course[0]._id,
                                    semesterId: semester4[1].semesterId._id,
                                    subject: semester4[0].subject
                                  }).then(function (chapters) {
                                    if (chapters != '') {
                                      chapters.forEach(function (chapter) {
                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'ppt/notes'
                                        }).then(function (upload) {
                                          if (upload != '') {
                                            ppt_notes = upload.length;
                                            pptData2.push(upload.length)
                                            var sum = pptData2.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            pptData22.push(sum);
                                          } else if (upload == '') {
                                            ppt_notes = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'practise question'
                                        }).then(function (upload1) {
                                          if (upload1 != '') {
                                            practise_question = upload1.length;
                                            practiseData2.push(upload1.length)
                                            var sum = practiseData2.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            practiseData22.push(sum);
                                          } else if (upload1 == '') {
                                            practise_question = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'dataSet'
                                        }).then(function (upload2) {
                                          if (upload2 != '') {
                                            dataSet = upload2.length
                                            dataSetData2.push(upload2.length)
                                            var sum = dataSetData2.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            dataSetData22.push(sum);
                                          } else if (upload2 == '') {
                                            dataSet = 0;
                                          }
                                        });

                                        youTubeLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'prerequisite'
                                        }).then(function (youtube) {
                                          if (youtube != '') {
                                            prerequisite = youtube.length
                                            prerequisiteData2.push(youtube.length)
                                            var sum = prerequisiteData2.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            prerequisiteData22.push(sum);
                                          } else if (youtube == '') {
                                            prerequisite = 0;

                                          }
                                        });

                                        onlineLectureLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'onlineLecture'
                                        }).then(function (online) {
                                          if (online != '') {
                                            onlineLecture = online.length
                                            onlineLectureData2.push(online.length)
                                            var sum = onlineLectureData2.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            onlineLectureData22.push(sum);
                                          } else if (online == '') {
                                            onlineLecture = 0;
                                          }
                                        });
                                      })
                                    } else if (chapters == '') {
                                      data1.subject2.push(['']);
                                    }
                                  })
                                } else {
                                  data1.subject_name2.push({ subject_name: '' })
                                }
                              } else {
                                data1.subject_name2.push({ subject_name: '' })
                              }
                              if (semester4.length > 2) {
                                if (semester4[2].subject != '') {
                                  subjectName = semester4[2].subject
                                  data1.subject_name1.push(['subject_name', subjectName])
                                  chapterModel.find({
                                    courseId: course[0]._id,
                                    semesterId: semester4[0].semesterId._id,
                                    subject: semester4[2].subject
                                  }).then(function (chapters) {
                                    if (chapters != '') {
                                      chapters.forEach(function (chapter) {
                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'ppt/notes'
                                        }).then(function (upload) {
                                          if (upload != '') {
                                            ppt_notes = upload.length;
                                            pptData3.push(upload.length)
                                            var sum = pptData3.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            pptData33.push(sum);
                                          } else if (upload == '') {
                                            ppt_notes = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'practise question'
                                        }).then(function (upload1) {
                                          if (upload1 != '') {
                                            practise_question = upload1.length;
                                            practiseData3.push(upload1.length)
                                            var sum = practiseData3.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            practiseData33.push(sum);
                                          } else if (upload1 == '') {
                                            practise_question = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'dataSet'
                                        }).then(function (upload2) {
                                          if (upload2 != '') {
                                            dataSet = upload2.length
                                            datasetData3.push(upload2.length)
                                            var sum = datasetData3.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            datasetData33.push(sum);
                                          } else if (upload2 == '') {
                                            dataSet = 0;
                                          }
                                        });

                                        youTubeLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'prerequisite'
                                        }).then(function (youtube) {
                                          if (youtube != '') {
                                            prerequisite = youtube.length
                                            prerequisiteData3.push(youtube.length)
                                            var sum = prerequisiteData3.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            prerequisiteData33.push(sum);
                                          } else if (youtube == '') {
                                            prerequisite = 0;

                                          }
                                        });

                                        onlineLectureLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'onlineLecture'
                                        }).then(function (online) {
                                          if (online != '') {
                                            onlineLecture = online.length
                                            onlineLectureData3.push(online.length)
                                            var sum = onlineLectureData3.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            onlineLectureData33.push(sum);
                                          } else if (online == '') {
                                            onlineLecture = 0;
                                          }
                                        });
                                      })
                                    } else if (chapters == '') {
                                      data1.subject3.push(['']);
                                    }
                                  })
                                } else {
                                  data1.subject_name3.push({ subject_name: '' })
                                }
                              } else {
                                data1.subject_name3.push({ subject_name: '' })
                              }
                              if (semester4.length > 3) {
                                if (semester4[3].subject != '') {
                                  subjectName = semester4[3].subject
                                  data1.subject_name1.push(['subject_name', subjectName])
                                  chapterModel.find({
                                    courseId: course[0]._id,
                                    semesterId: semester4[0].semesterId._id,
                                    subject: semester4[3].subject
                                  }).then(function (chapters) {
                                    if (chapters != '') {
                                      chapters.forEach(function (chapter) {
                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'ppt/notes'
                                        }).then(function (upload) {
                                          if (upload != '') {
                                            ppt_notes = upload.length;
                                            pptData4.push(upload.length)
                                            var sum = pptData4.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            pptData44.push(sum);
                                          } else if (upload == '') {
                                            ppt_notes = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'practise question'
                                        }).then(function (upload1) {
                                          if (upload1 != '') {
                                            practise_question = upload1.length;
                                            practiseData4.push(upload1.length)
                                            var sum = practiseData4.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            practiseData44.push(sum);
                                          } else if (upload1 == '') {
                                            practise_question = 0;
                                          }
                                        })

                                        uploads.find({
                                          lessonId: chapter._id,
                                          type_of_upload: 'dataSet'
                                        }).then(function (upload2) {
                                          if (upload2 != '') {
                                            dataSet = upload2.length
                                            datasetData4.push(upload2.length)
                                            var sum = datasetData4.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            datasetData44.push(sum);
                                          } else if (upload2 == '') {
                                            dataSet = 0;
                                          }
                                        });

                                        youTubeLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'prerequisite'
                                        }).then(function (youtube) {
                                          if (youtube != '') {
                                            prerequisite = youtube.length
                                            prerequisiteData4.push(youtube.length)
                                            var sum = prerequisiteData4.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            prerequisiteData44.push(sum);
                                          } else if (youtube == '') {
                                            prerequisite = 0;

                                          }
                                        });

                                        onlineLectureLinkModel.find({
                                          chapterId: chapter._id,
                                          type_of_upload: 'onlineLecture'
                                        }).then(function (online) {
                                          if (online != '') {
                                            onlineLecture = online.length
                                            onlineLectureData4.push(online.length)
                                            var sum = onlineLectureData4.reduce(function (a, b) {
                                              return a + b;
                                            }, 0);
                                            onlineLectureData44.push(sum);
                                          } else if (online == '') {
                                            onlineLecture = 0;
                                          }
                                        });
                                      })
                                    } else if (chapters == '') {
                                      data1.subject4.push(['']);
                                    }
                                  })
                                } else {
                                  data1.subject_name4.push({ subject_name: '' })
                                }
                              } else {
                                data1.subject_name4.push({ subject_name: '' })
                              }

                              if (semester4.length > 4) {
                              } else {
                                data1.subject_name5.push({ subject_name: '' })
                              }
                              if (semester4.length > 5) {
                              } else {
                                data1.subject_name6.push({ subject_name: '' })
                              }
                              if (semester4.length > 6) {
                              } else {
                                data1.subject_name7.push({ subject_name: '' })
                              }

                            }
                          })
                        }

                        //  sem1 end
                      });

                    }
                  });
                }



              });

            })
            setTimeout(function () {

              if (pptData11.length > 0) {
                var max1 = pptData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['ppt/notes', max1]);
              } else {
                var max1 = 0;
                data1.subject1.push(['ppt/notes', max1]);
              }
              if (practiseData11.length > 0) {
                var max2 = practiseData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['practise question', max2]);
              } else {
                var max2 = 0;
                data1.subject1.push(['practise question', max2]);
                // data1.subject1.push(['']);
              }
              if (datasetData11.length > 0) {
                var max3 = datasetData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['dataSet', max3]);
              } else {
                var max3 = 0;
                data1.subject1.push(['dataSet', max3]);
                // data1.subject1.push(['']);
              }

              if (prerequisiteData11.length > 0) {
                var max4 = prerequisiteData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['prerequisite', max4]);
              } else {
                var max4 = 0;
                data1.subject1.push(['prerequisite', max4]);
                //  data1.subject1.push(['']);
              }
              if (onlineLectureData11.length > 0) {
                var max5 = onlineLectureData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['onlineLecture', max5]);
              } else {
                var max5 = 0;
                data1.subject1.push(['onlineLecture', max5]);
              }
              res.json({
                status: 200,
                data: data1
              });

            }, 5000);

          });

        }
      });
    } else if (req.query.semesterId != 'undefined' || req.query.semesterId != undefined) {
      collegeCourseModel.find({
        courseName: req.query.title
      }).then(function (course) {
        if (course != '') {
          teacherModel.find({
            course_id: course[0]._id,
            teacher_id: req.query.user_id,
            semesterId: req.query.semesterId
          }).populate('course_id', '[courseName]').populate('semesterId').exec(function (err, semester1) {
            if (err) {
              console.error(err)
            } else if (semester1 != '') {

              var semesterName = semester1[0].semesterId._id;
              data1.semesterName.push(['semester_name', semesterName]);
              if (semester1.length > 0) {
                if (semester1[0].subject != '') {
                  data1.semesterData.push(semester1[0].semesterId);

                  subjectName = semester1[0].subject
                  data1.subject_name1.push(['subject_name', subjectName])
                  chapterModel.find({
                    courseId: course[0]._id,
                    semesterId: semester1[0].semesterId._id,
                    subject: semester1[0].subject
                  }).then(function (chapters) {
                    if (chapters != '') {
                      chapters.forEach(function (chapter) {
                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'ppt/notes'
                        }).then(function (upload) {
                          if (upload != '') {
                            ppt_notes = upload.length;
                            pptData1.push(upload.length)
                            var sum = pptData1.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            pptData11.push(sum);
                          } else if (upload == '') {
                            ppt_notes = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'practise question'
                        }).then(function (upload1) {
                          if (upload1 != '') {
                            practise_question11 = upload1.length;
                            practiseData.push(upload1.length)
                            var sum = practiseData.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            practiseData11.push(sum);
                          } else if (upload1 == '') {
                            practise_question = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'dataSet'
                        }).then(function (upload2) {
                          if (upload2 != '') {
                            dataSet = upload2.length
                            datasetData1.push(upload2.length)
                            var sum = datasetData1.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            datasetData11.push(sum);
                          } else if (upload2 == '') {
                            dataSet = 0;
                          }
                        });

                        youTubeLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'prerequisite'
                        }).then(function (youtube) {
                          if (youtube != '') {
                            prerequisite = youtube.length
                            prerequisiteData1.push(youtube.length)
                            var sum = prerequisiteData1.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            prerequisiteData11.push(sum);
                          } else if (youtube == '') {
                            prerequisite = 0;

                          }
                        });

                        onlineLectureLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'onlineLecture'
                        }).then(function (online) {
                          if (online != '') {
                            onlineLecture = online.length
                            onlineLectureData1.push(online.length)
                            var sum = onlineLectureData1.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            onlineLectureData11.push(sum);
                          } else if (online == '') {
                            onlineLecture = 0;
                          }
                        });
                      })
                    } else if (chapters == '') {
                      data1.subject1.push(['']);
                    }
                  })
                } else {
                  data1.subject_name1.push({ subject_name: '' })
                }
              } else {
                data1.subject_name1.push({ subject_name: '' })
              }
              if (semester1.length > 1) {
                if (semester1[1].subject != '') {
                  data1.semesterData.push(semester1[1].semesterId);

                  subjectName = semester1[1].subject
                  data1.subject_name1.push(['subject_name', subjectName])
                  chapterModel.find({
                    courseId: course[0]._id,
                    semesterId: semester1[1].semesterId._id,
                    subject: semester1[0].subject
                  }).then(function (chapters) {
                    if (chapters != '') {
                      chapters.forEach(function (chapter) {
                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'ppt/notes'
                        }).then(function (upload) {
                          if (upload != '') {
                            ppt_notes = upload.length;
                            pptData2.push(upload.length)
                            var sum = pptData2.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            pptData22.push(sum);
                          } else if (upload == '') {
                            ppt_notes = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'practise question'
                        }).then(function (upload1) {
                          if (upload1 != '') {
                            practise_question = upload1.length;
                            practiseData2.push(upload1.length)
                            var sum = practiseData2.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            practiseData22.push(sum);
                          } else if (upload1 == '') {
                            practise_question = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'dataSet'
                        }).then(function (upload2) {
                          if (upload2 != '') {
                            dataSet = upload2.length
                            dataSetData2.push(upload2.length)
                            var sum = dataSetData2.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            dataSetData22.push(sum);
                          } else if (upload2 == '') {
                            dataSet = 0;
                          }
                        });

                        youTubeLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'prerequisite'
                        }).then(function (youtube) {
                          if (youtube != '') {
                            prerequisite = youtube.length
                            prerequisiteData2.push(youtube.length)
                            var sum = prerequisiteData2.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            prerequisiteData22.push(sum);
                          } else if (youtube == '') {
                            prerequisite = 0;

                          }
                        });

                        onlineLectureLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'onlineLecture'
                        }).then(function (online) {
                          if (online != '') {
                            onlineLecture = online.length
                            onlineLectureData2.push(online.length)
                            var sum = onlineLectureData2.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            onlineLectureData22.push(sum);
                          } else if (online == '') {
                            onlineLecture = 0;
                          }
                        });
                      })
                    } else if (chapters == '') {
                      data1.subject2.push(['']);
                    }
                  })
                } else {
                  data1.subject_name2.push({ subject_name: '' })
                }
              } else {
                data1.subject_name2.push({ subject_name: '' })
              }
              if (semester1.length > 2) {
                if (semester1[2].subject != '') {
                  data1.semesterData.push(semester1[2].semesterId);

                  subjectName = semester1[2].subject
                  data1.subject_name1.push(['subject_name', subjectName])
                  chapterModel.find({
                    courseId: course[0]._id,
                    semesterId: semester1[0].semesterId._id,
                    subject: semester1[2].subject
                  }).then(function (chapters) {
                    if (chapters != '') {
                      chapters.forEach(function (chapter) {
                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'ppt/notes'
                        }).then(function (upload) {
                          if (upload != '') {
                            ppt_notes = upload.length;
                            pptData3.push(upload.length)
                            var sum = pptData3.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            pptData33.push(sum);
                          } else if (upload == '') {
                            ppt_notes = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'practise question'
                        }).then(function (upload1) {
                          if (upload1 != '') {
                            practise_question = upload1.length;
                            practiseData3.push(upload1.length)
                            var sum = practiseData3.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            practiseData33.push(sum);
                          } else if (upload1 == '') {
                            practise_question = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'dataSet'
                        }).then(function (upload2) {
                          if (upload2 != '') {
                            dataSet = upload2.length
                            datasetData3.push(upload2.length)
                            var sum = datasetData3.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            datasetData33.push(sum);
                          } else if (upload2 == '') {
                            dataSet = 0;
                          }
                        });

                        youTubeLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'prerequisite'
                        }).then(function (youtube) {
                          if (youtube != '') {
                            prerequisite = youtube.length
                            prerequisiteData3.push(youtube.length)
                            var sum = prerequisiteData3.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            prerequisiteData33.push(sum);
                          } else if (youtube == '') {
                            prerequisite = 0;

                          }
                        });

                        onlineLectureLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'onlineLecture'
                        }).then(function (online) {
                          if (online != '') {
                            onlineLecture = online.length
                            onlineLectureData3.push(online.length)
                            var sum = onlineLectureData3.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            onlineLectureData33.push(sum);
                          } else if (online == '') {
                            onlineLecture = 0;
                          }
                        });
                      })
                    } else if (chapters == '') {
                      data1.subject3.push(['']);
                    }
                  })
                } else {
                  data1.subject_name3.push({ subject_name: '' })
                }
              } else {
                data1.subject_name3.push({ subject_name: '' })
              }
              if (semester1.length > 3) {
                if (semester1[3].subject != '') {
                  data1.semesterData.push(semester1[3].semesterId);

                  subjectName = semester1[3].subject
                  data1.subject_name1.push(['subject_name', subjectName])
                  chapterModel.find({
                    courseId: course[0]._id,
                    semesterId: semester1[0].semesterId._id,
                    subject: semester1[3].subject
                  }).then(function (chapters) {
                    if (chapters != '') {
                      chapters.forEach(function (chapter) {
                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'ppt/notes'
                        }).then(function (upload) {
                          if (upload != '') {
                            ppt_notes = upload.length;
                            pptData4.push(upload.length)
                            var sum = pptData4.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            pptData44.push(sum);
                          } else if (upload == '') {
                            ppt_notes = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'practise question'
                        }).then(function (upload1) {
                          if (upload1 != '') {
                            practise_question = upload1.length;
                            practiseData4.push(upload1.length)
                            var sum = practiseData4.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            practiseData44.push(sum);
                          } else if (upload1 == '') {
                            practise_question = 0;
                          }
                        })

                        uploads.find({
                          lessonId: chapter._id,
                          type_of_upload: 'dataSet'
                        }).then(function (upload2) {
                          if (upload2 != '') {
                            dataSet = upload2.length
                            datasetData4.push(upload2.length)
                            var sum = datasetData4.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            datasetData44.push(sum);
                          } else if (upload2 == '') {
                            dataSet = 0;
                          }
                        });

                        youTubeLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'prerequisite'
                        }).then(function (youtube) {
                          if (youtube != '') {
                            prerequisite = youtube.length
                            prerequisiteData4.push(youtube.length)
                            var sum = prerequisiteData4.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            prerequisiteData44.push(sum);
                          } else if (youtube == '') {
                            prerequisite = 0;

                          }
                        });

                        onlineLectureLinkModel.find({
                          chapterId: chapter._id,
                          type_of_upload: 'onlineLecture'
                        }).then(function (online) {
                          if (online != '') {
                            onlineLecture = online.length
                            onlineLectureData4.push(online.length)
                            var sum = onlineLectureData4.reduce(function (a, b) {
                              return a + b;
                            }, 0);
                            onlineLectureData44.push(sum);
                          } else if (online == '') {
                            onlineLecture = 0;
                          }
                        });
                      })
                    } else if (chapters == '') {
                      data1.subject4.push(['']);
                    }
                  })
                } else {
                  data1.subject_name4.push({ subject_name: '' })
                }
              } else {
                data1.subject_name4.push({ subject_name: '' })
              }

              if (semester1.length > 4) {
              } else {
                data1.subject_name5.push({ subject_name: '' })
              }
              if (semester1.length > 5) {
              } else {
                data1.subject_name6.push({ subject_name: '' })
              }
              if (semester1.length > 6) {
              } else {
                data1.subject_name7.push({ subject_name: '' })
              }
            }
            setTimeout(function () {
              if (pptData11.length > 0) {
                var max1 = pptData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['ppt/notes', max1]);
              } else {
                var max1 = 0;
                data1.subject1.push(['ppt/notes', max1]);
              }
              if (practiseData11.length > 0) {
                var max2 = practiseData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['practise question', max2]);
              } else {
                var max2 = 0;
                data1.subject1.push(['practise question', max2]);
              }
              if (datasetData11.length > 0) {
                var max3 = datasetData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['dataSet', max3]);
              } else {
                var max3 = 0;
                data1.subject1.push(['dataSet', max3]);
              }

              if (prerequisiteData11.length > 0) {
                var max4 = prerequisiteData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['prerequisite', max4]);
              } else {
                var max4 = 0;
                data1.subject1.push(['prerequisite', max4]);
              }
              if (onlineLectureData11.length > 0) {
                var max5 = onlineLectureData11.reduce(function (a, b) {
                  return Math.max(a, b);
                });
                data1.subject1.push(['onlineLecture', max5]);
              } else {
                var max5 = 0;
                data1.subject1.push(['onlineLecture', max5]);
              }
              res.json({
                status: 200,
                data: data1
              });

            }, 8000);

          });
        }
      });
    }
  }

});


router.get('/getStudentAnalytics', (req, res) => {
  if (req.query.endDate) {
    let home_component = 0;
    let forum_component = 0;
    let assingment_component = 0;
    let schedule_component = 0;
    let submission_component = 0;
    let chat_component = 0;
    let library_component = 0;
    let chapter_component = 0;
    let lesson_component = 0;
    let attendance_component = 0;
    let settings_component = 0;

    studentAnalyticModel.find({

      user_id: req.query.user_id,
      analytic_date: {
        "$gte": parseInt(req.query.startDate),
        "$lte": parseInt(req.query.endDate)
      }
    }).then((data) => {

      if (!data.length || data == undefined || data == null) {
        res.status(200).json({ status: false, message: "No data for the user for that range" })
      } else {
        data.forEach(day => {
          home_component += day['home_component'];
          forum_component += day['forum_component'];
          assingment_component += day['assingment_component']
          schedule_component += day['schedule_component'],
            submission_component += day['submission_component']
          chat_component += day['chat_component']
          library_component += day['library_component']
          chapter_component += day['chapter_component']
          lesson_component += day['lesson_component']
          attendance_component += day['attendance_component']
          settings_component += day['settings_component']
        })

        var analytics_data = {
          home_component,
          forum_component,
          assingment_component,
          schedule_component,
          submission_component,
          chat_component,
          library_component,
          chapter_component,
          lesson_component,
          attendance_component,
          settings_component
        }


        res.status(200).json({ status: true, analytics_data: analytics_data })
      }
    }).catch(err => {
      res.status(500).json({ status: false, message: "Error while retrieving analytics" });
    })




  }
  else {
    studentAnalyticModel.find({
      user_id: req.query.user_id,
      analytic_date: req.query.startDate
    })
      .select('home_component assignment_component chat_component forum_component library_component schedule_component settings_component submission_component -_id')
      .then(data => {
        if (!data.length || data == undefined || data == null) {
          res.status(200).json({ status: false, message: "No data for the user" })
        }
        else {
          res.status(200).json({ status: true, analytics_data: data[0] })
        }

      })
  }
})

router.post('/saveStudentAnalytics', async (req, res) => {
  let client_type = "web"
  const component_name = req.body.component_name
  const user_id = req.body.user_id
  const user_name = req.body.user_name
  const time_spent = req.body.time_spent

  if (req.body.client_type == "android") {
    client_type = 'android'
  }

  studentAnalyticModel.find({
    user_id: req.body.user_id,
    analytic_date: parseInt(moment().utcOffset("+05:30").format('YYYYMMDD'))
  }).then((data) => {
    if (data.length) {
      const newTimeSpent = data[0][component_name] + parseInt(time_spent)
      studentAnalyticModel.findOneAndUpdate({
        user_id: user_id,
        analytic_date: parseInt(moment().utcOffset("+05:30").format('YYYYMMDD'))
      }, {
        [component_name]: newTimeSpent,
        client_type: client_type

      }, {
        new: true,
        useFindAndModify: false
      }).then((data) => res.status(200).json({ status: true, data: data }))
        .catch((err) => {
          console.log(`Error while updating the time spent ${err}`);
          res.status(500).json({ status: false, message: "Can't update the timespent" })
        })
    }
    else {
      const studentAnalytic = new studentAnalyticModel({
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        [component_name]: parseInt(req.body.time_spent),
        client_type: client_type,
        analytic_date: parseInt(moment().utcOffset("+05:30").format('YYYYMMDD'))

      })

      studentAnalytic.save()
        .then((data) => res.status(200).json({ status: true, data: data }))
        .catch((err) => res.status(500).json({ status: false, error: err }))
    }
  })
})

router.get("/getSubjectData", function (req, res) {
  var view_data = [];
  teacherModel.find({
    course_id: req.query.course_id,
    semesterId: req.query.id
  }).populate('semesterId', ['semesterName']).populate('divisionId', ['name']).populate('course_id', ['courseName', 'chapterName', 'chapterId']).populate('batch_id', ['batchName']).exec(function (err, subjects) {
    if (subjects) {
      subjects.forEach(function (subject) {
        view_data.push({
          semesterName: subject.semesterId.semesterName,
          semesterId: subject.semesterId._id,
          courseName: subject.course_id.courseName,
          subject: subject.subject,
          courseId: subject.course_id._id,
          batchId: subject.batch_id._id,
          batchName: subject.batch_id.batchName,
          divisionName: subject.divisionId.name,
          divisionId: subject.divisionId._id
        });
      });
      res.json({
        status: 200,
        data: view_data
      });
    } else if (err) {
      res.json({
        status: 400,
      });
    }

  });
});


router.get('/getCoursewisebatchTeacher', (req, res) => {
  var data = {
    semesterdata: []
  };
  teacherModel.aggregate([
    {
      $match: {
        "teacher_id": {
          $eq: req.query.userId
        }
      }
    },
    {
      $group: {
        _id: {
          COURSE: "$course_id",
          SEMESTER: "$semesterId",
          SUBJECT: "$subject",
          BATCH: "$batch_id"
        },
        count: {
          "$sum": 1
        }
      }
    },
    {
      $group: {
        _id: "$_id.COURSE",
        course_GROUP: {
          $push: {
            semester: "$_id.SEMESTER",
            subject: "$_id.SUBJECT",
            batch: "$_id.BATCH",
            count: "$count"
          }
        }
      }
    }
  ]).then(function (courses) {

    collegeCourseModel.find({
      courseName: req.query.title
    }).then(function (checkcourses) {
      courses.forEach(function (course) {
        if (checkcourses[0]._id == course._id) {
          course.course_GROUP.forEach((g_data) => {
            var batchdata = g_data.batch;
            semesterNewModel.find({
              _id: g_data.semester
            }).sort({ 'createdOn': -1 }).exec(function (err, semesters) {

              semesters.forEach(function (semData) {
                var insertdata = {
                  semesterStatus: semData.semesterStatus,
                  _id: semData._id,
                  semesterName: semData.semesterName,
                  semester_start_date: semData.semester_start_date,
                  semester_end_date: semData.semester_end_date,
                  createdOn: semData.createdOn,
                  updatedOn: semData.updatedOn,
                  batchdata: batchdata,
                  semYear: semData.semYear
                }
                data.semesterdata.push(insertdata);
              });

            })

          })
        }
      });

      setTimeout(function () {
        res.json({
          status: 200,
          data: data
        })
      }, 1000);
    });
  })
});

router.get('/getstudentbatchwise', (req, res) => {
  var arrayOfStudent = [];
  studentBatchModel.aggregate([{
    $match: {
      batchId: req.query.batchId
    }
  },
  {
    $addFields: {
      studentId: {
        $toObjectId: "$studentId"
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
    $project: {
      "studentName.fullName": 1,
      "studentName._id": 1,
      "studentName.picture": 1,
      "studentName.status": 1,
      "studentName.role": 1,
      "studentName.email": 1,
      "studentName.lastLoginDate": 1,
      "studentName.lastLoginTime": 1,
      "studentName.flag": 1,
      "_id": 0,
      "courseId": 1,
      "departmentId": 1

    }
  }
  ]).exec(function (err, student) {
    if (err) {
      console.error(err)
    } else {
      student.forEach(items => {
        items.studentName.forEach(second => {
          arrayOfStudent.push({
            id: second._id,
            name: second.fullName,
            picture: second.picture,
            status: second.status,
            role: second.role,
            email: second.email,
            lastLoginDate: second.lastLoginDate,
            lastLoginTime: second.lastLoginTime,
            flag: second.flag,
            courseId: items.courseId,
            departmentId: items.departmentId
          })
        })
      })
      setTimeout(() => {
        res.json({
          status: 200,
          student: arrayOfStudent
        });
      }, 2000)

    }
  })
})

router.post('/getExcelBatchWise', function (req, res) {
  let userlist = [];
  let batchName = '';
  let year = '';
  studentBatchModel.aggregate([
    {
      $match: {
        batchId: {
          $eq: req.body.batchId
        }
      }
    },
    {
      "$lookup": {
        "from": "studentanalytics",
        "localField": "studentId",
        "foreignField": "user_id",
        "as": "list"
      }
    },
    {
      $addFields: {
        studId: {
          $toObjectId: "$studentId"
        }

      }
    },
    {
      "$lookup": {
        "from": "users",
        "localField": "studId",
        "foreignField": "_id",
        "as": "user"
      }
    },
    {
      $addFields: {
        bId: {
          $toObjectId: "$batchId"
        }
      }
    },
    {
      "$lookup": {
        "from": "batchmasters",
        "localField": "bId",
        "foreignField": "_id",
        "as": "batch"
      }
    },
    {
      $project: {
        list: {
          $filter: {
            input: "$list",
            as: "element",
            cond: {
              $and: [
                { $gte: ["$$element.analytic_date", parseInt(req.body.startDate)] },
                { $lte: ["$$element.analytic_date", parseInt(req.body.endDate)] }
              ]
            }
          }
        },

        "_id": 1,
        "user.fullName": 1,
        "batch.batchName": 1,
        "batch.year": 1,

      }
    },
  ]).then(function (analytics) {
    analytics.forEach(user => {
      batchName = user.batch[0].batchName;
      year = user.batch[0].year;
      let home_component = 0;
      let forum_component = 0;
      let assingment_component = 0;
      let schedule_component = 0;
      let submission_component = 0;
      let chat_component = 0;
      let library_component = 0;
      let chapter_component = 0;
      let lesson_component = 0;
      let attendance_component = 0;
      let settings_component = 0;
      user.list.forEach(day => {
        home_component += day['home_component'];
        forum_component += day['forum_component'];
        assingment_component += day['assingment_component']
        schedule_component += day['schedule_component'],
          submission_component += day['submission_component']
        chat_component += day['chat_component']
        library_component += day['library_component']
        chapter_component += day['chapter_component']
        lesson_component += day['lesson_component']
        attendance_component += day['attendance_component']
        settings_component += day['settings_component']
      })
      userlist.push({
        name: user.user[0].fullName,
        Home: home_component,
        Forum: forum_component,
        Assingment: assingment_component,
        Schedule: schedule_component,
        Submission: submission_component,
        Chat: chat_component,
        Library: library_component,
        Chapter: chapter_component,
        Lesson: lesson_component,
        Attendance: attendance_component,
        Settings: settings_component
      })

    });

    setTimeout(function () {

      var xls = json2xls(userlist);
      var file_name = batchName + "-" + year + ".xlsx";
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/" + file_name + ".xlsx", xls, 'binary');

      var filepath = currentPath + "/src/public/excel_sheets/" + file_name + ".xlsx";
      res.json({
        status: 200,
        data: filepath,
        batchName: batchName,
        year: year,
      });
    }, 20000)

  })
});

router.get('/download', function (req, res) {

  var location = req.query.pdf;
  const downloadData = location;
  res.download(downloadData);
});

router.get("/getPerticularSubjectAnalytics", async function (req, res) {
  let view_data = [];
  studentBatchModel.aggregate([{
    $match: {
      batchId: req.query.batchId
    }
  },
  {
    $addFields: {
      studId: {
        $toObjectId: "$studentId"
      }

    }
  },
  {
    $lookup: {
      from: "users",
      localField: "studId",
      foreignField: "_id",
      as: "studentName"
    }
  },
  {
    $lookup: {
      from: "newtimetables",
      let: {
        subject: req.query.subject,
        batchId: "$batchId",
        semId: req.query.semId
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$subject", "$$subject"],
            },
            {
              $eq: ["$batch_id", "$$batchId"],
            },
            {
              $eq: ["$semester_id", "$$semId"],
            }
            ]
          }
        }
      }],
      as: "timetable"
    }
  },
  {
    $lookup: {
      from: "attendances",
      let: {
        subject: req.query.subject,
        userId: "$studentId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$subject", "$$subject"],
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
    "$lookup": {
      "from": "chapters",
      "pipeline": [
        { "$match": { "semesterId": req.query.semId, "subject": req.query.subject } },
      ],
      "as": "subdocument"
    }
  },
  {
    $unwind: {
      path: "$subdocument",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "uploads",
      localField: "subdocument._id",
      foreignField: "lessonId",
      as: "upload"
    }
  },
  {
    $unwind: {
      path: "$upload",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "youtubetrackings",
      let: {
        chaptId: { $toString: "$subdocument._id" },
        userId: "$studentId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$chapterId", "$$chaptId"],
            },
            {
              $eq: ["$user_id", "$$userId"],
            }
            ]
          }
        }
      }],
      as: "youtubes",
    }
  },
  {
    $lookup: {
      from: "pdftrackings",
      let: {
        docId: "$upload.doc_id",
        userId: "$studentId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$doc_id", "$$docId"],
            },
            {
              $eq: ["$user_id", "$$userId"],
            }
            ]
          }
        }
      }],
      as: "pdfs",
    }
  },
  {
    $project: {
      present: {
        $size: {
          $filter: {
            input: "$attendence",
            as: "att",
            cond: {
              $and: {
                $eq: ["$$att.present", 'Present'],

              }
            },

          },

        }
      },
      absent: {
        $size: {
          $filter: {
            input: "$attendence",
            as: "att",
            cond: {
              $and: {
                $eq: ["$$att.present", 'Absent'],

              }
            },

          },

        }
      },
      "studentName._id": 1,
      "studentName.fullName": 1,
      "studentName.email": 1,
      "studentName.lastLoginDate": 1,
      "studentName.lastLoginTime": 1,
      "studId": 1,
      "_id": 0,
      "total": {
        "$size": "$attendence"
      },
      "ttTotal": {
        "$size": "$timetable"
      },
      "page_count": { "$sum": "$pdfs.page_count" },
      "totalPages": { "$sum": "$pdfs.totalPages" },
      "watchTime": { "$sum": "$youtubes.watchTime" },
      "totalTime": { "$sum": "$youtubes.totalTime" },
    }
  }
  ]).then(async function (users) {
    toatlUser = users.length;
    var user = await users.filter(function (a) {
      return !this[a.studId] && (this[a.studId] = true);
    }, Object.create(null));
    await user.map(elm => {
      view_data.push({
        Name: elm.studentName[0].fullName,
        Email: elm.studentName[0].email,
        LastLoginDate: elm.studentName[0].lastLoginDate,
        LastLoginTime: elm.studentName[0].lastLoginTime,
        Attend_Present: elm.present,
        Attend_Absent: elm.absent,
        Attend_Total: elm.total,
        Unmarked: elm.ttTotal - elm.total,
        Attend_Percent: calculatePercent(elm.present, elm.total),
        PDF_ReadPages: elm.page_count,
        PDF_Total: elm.totalPages,
        PDF_Percent: calculatePercent(elm.page_count, elm.totalPages),
        YouTube_Watch: elm.watchTime,
        YouTube_Total: elm.totalTime,
        YouTube_Percent: calculatePercent(elm.watchTime, elm.totalTime),
      })
    })
    setTimeout(function () {

      var xls = json2xls(view_data);
      var currentPath = process.cwd();
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/Report.xlsx", xls, 'binary');

      var file_name = "Attendance.xlsx";
      var filepath = currentPath + "/src/public/excel_sheets/Report.xlsx";
      res.json({
        status: 200,
        data1: filepath,
        data: view_data
      });
    }, 2000)
  })
});

function calculatePercent(number, total) {
  if (total > 0) {
    return Math.floor(number * 100 / total) + "%"
  } else {
    return "0%"
  }
}

router.get("/getAllAttendenceWithSubject", async (req, res) => {
  console.log("req.quary--->>", req.query);
  await studentBatchModel.aggregate([{
    $match: {
      batchId: req.query.batchId
    }
  },
  {
    $addFields: {
      studId: {
        $toObjectId: "$studentId"
      }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "studId",
      foreignField: "_id",
      as: "studentName"
    }
  },

  {
    $lookup: {
      from: "subjects",
      let: {
        courseId: "$courseId",
        semesterId: req.query.semId,
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$courseId", "$$courseId"],
            },
            {
              $eq: ["$semesterId", "$$semesterId"],
            },

            ]
          }
        }
      }],
      as: "subjects"
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$studentName", 0]
        }, "$$ROOT"]
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{
          $arrayElemAt: ["$subjects", 0]
        }, "$$ROOT"]
      }
    }
  },
  {
    $project: {
      subjects: 0
    }
  },
  { $project: { city_state: { $split: [{ $trim: { input: "$subject", chars: '[""]' } }, '","'] }, studentId: 1, batchId: 1, courseId: 1, fullName: 1, lastLoginDate: 1, lastLoginTime: 1 } },
  {
    $unwind: {
      path: "$city_state",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "attendances",
      let: {
        subject: "$city_state",
        userId: "$studentId"

      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$subject", "$$subject"],
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
    $lookup: {
      from: "newtimetables",
      let: {
        subject: "$city_state",
        batchId: "$batchId",
        courseId: "$courseId",
        semesterId: req.query.semId,
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$subject", "$$subject"],
            },
            {
              $eq: ["$batch_id", "$$batchId"],
            },
            {
              $eq: ["$course_id", "$$courseId"],
            },
            {
              $eq: ["$semester_id", "$$semesterId"],
            }
            ]
          }
        }
      }],
      as: "timeTable"
    }
  },

  {
    "$group": {
      "_id": "$studentId",
      "values": {
        "$push": {
          "total": { $size: "$timeTable" },
          "attendence": { $size: "$attendence" },
          present: {
            $size: {
              $filter: {
                input: "$attendence",
                as: "att",
                cond: {
                  $and: {
                    $eq: ["$$att.present", 'Present'],

                  }
                },

              },

            }
          },
          absent: {
            $size: {
              $filter: {
                input: "$attendence",
                as: "att",
                cond: {
                  $and: {
                    $eq: ["$$att.present", 'Absent'],

                  }
                },

              },
            }
          },
          "subject": "$city_state"
        }
      },
      fullName: {
        $first: '$fullName'
      },
      lastLoginDate: {
        $first: '$lastLoginDate'
      },
      lastLoginTime: {
        $first: '$lastLoginTime'
      },

    }
  }
  ]).then(async function (users) {
    let view_data = [];
    await users.map(user => {
      user.values.map((elm, index) => {
        if (index === 1) {
          view_data.push({
            Name: user.fullName,
            LastLoginDate: user.lastLoginDate,
            LastLoginTime: user.lastLoginTime,
            Subject: elm.subject,
            NoOfLectures: elm.total,
            Total: elm.attendence,
            Present: elm.present,
            Absent: elm.absent,
            Unmarked: elm.total - elm.attendence,
            Attend_Percent: calculatePercent(elm.present, elm.attendence),
            Lectures_Percent: calculatePercent(elm.attendence, elm.total),
          })
        } else {
          view_data.push({
            Name: '',
            LastLoginDate: '',
            LastLoginTime: '',
            Subject: elm.subject,
            NoOfLectures: elm.total,
            Total: elm.attendence,
            Present: elm.present,
            Absent: elm.absent,
            Unmarked: elm.total - elm.attendence,
            Attend_Percent: calculatePercent(elm.present, elm.attendence),
            Lectures_Percent: calculatePercent(elm.attendence, elm.total),
          })
        }

      })

    })
    setTimeout(function () {

      var xls = json2xls(view_data);
      var currentPath = process.cwd();
      var date = moment(new Date()).format('DD-MM-YYYY');
      fs.writeFileSync(currentPath + "/src/public/excel_sheets/" + date + "-Report.xlsx", xls, 'binary');

      var filepath = currentPath + "/src/public/excel_sheets/" + date + "-Report.xlsx";
      res.json({
        status: 200,
        data1: filepath,
        data: users
      });
    }, 2000)
  })

})


router.get('/getTeacherDataSemesterWise',async (req, res) => {
var data1 
  data1 = await notification_function.hoursCalculate(req.query.semesterId)
   if (data1) {
    var studentInfo_asc = vd(data1, "Name");
    var xls = json2xls(studentInfo_asc);
    var currentPath = process.cwd();
    fs.writeFileSync(
      currentPath +
      "/src/public/excel_sheets/TeacherSemesterLectureData.xlsx",
      xls,
      "binary"
    );
    var file_name = "TeacherSemesterLectureData.xlsx";
    var filepath =
      currentPath +
      "/src/public/excel_sheets/TeacherSemesterLectureData.xlsx";
  await  res.json({
      status: 200,
      filepath: filepath,
      data: data1
    });
  }
})

router.post('/sendMailToFaulty', (req, res) => {
  let data = req.body.data;
  sendgrid.setApiKey(sengrid_key);
  data.forEach(elm => {
    var teacherData = {
      teacherName: elm.teacherName,
      batchName: req.body.batchName,
      batchYear: req.body.batchYear,
      courseName: req.body.courseName,
      semesterName : req.body.semesterName,
      tableData: elm.data,
      content: req.body.context
    };
    var emailOptions = {
      to: elm.email,
      toName: elm.teacherName,
      subject: req.body.subject,
      template: process.cwd() + '/src/utils/Teacher.jade',
      data: teacherData
    };
    require('fs').readFile(emailOptions.template, 'utf8', function (err, file) {
      if (err) return callback(err);

      var fn = require('jade').compile(file);
      var html = fn(emailOptions.data);

      var mailOptions = {
        from: 'info@sdbi.in',
        fromname: "School of data science and business intelligence",
        to: emailOptions.to,
        toname: (emailOptions.toName != null) ? emailOptions.toName : '',
        subject: emailOptions.subject,
        html: html
      };
      sendgrid.send(mailOptions, function (err, json) {
        if (err) {
        } else {
          var a = JSON.stringify(json);
          var b = a[0];
          var c = json[0].headers;
          var d = c['x-message-id'];
          EmailTrackerModel.create({
            email: emailOptions.to,
            subject: emailOptions.subject,
            x_msg_id: d,
            sent_on: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          }).then(email => {
            if (email) {
              res.json({
                status: 200,
              });
            }

          })
        }
      });
    });
  })
})

router.get("/getTeacherSubjectData", function (req, res) {
  var view_data = [];
  teacherModel.find({
    course_id: req.query.course_id,
    semesterId: req.query.id,
    teacher_id:req.query.user_id
  }).populate('semesterId', ['semesterName']).populate('divisionId', ['name']).populate('course_id', ['courseName', 'chapterName', 'chapterId']).populate('batch_id', ['batchName']).exec(function (err, subjects) {
    if (subjects) {
      subjects.forEach(function (subject) {
        view_data.push({
          semesterName: subject.semesterId.semesterName,
          semesterId: subject.semesterId._id,
          courseName: subject.course_id.courseName,
          subject: subject.subject,
          courseId: subject.course_id._id,
          batchId: subject.batch_id._id,
          batchName: subject.batch_id.batchName,
          divisionName: subject.divisionId.name,
          divisionId: subject.divisionId._id
        });
      });
      res.json({
        status: 200,
        data: view_data
      });
    } else if (err) {
      res.json({
        status: 400,
      });
    }

  });
});


module.exports = router;