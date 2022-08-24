const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
const CamtasiaAnalyticsModel = require('../../../app/models/camtasiaAnalytics');
require('../../../app/models/course');
var courseModel = mongoose.model('Course');
require('../../../app/models/lessons');
var lessonsModel = mongoose.model('lessons');
var userModel = mongoose.model('User');
var batchModel = mongoose.model('Batch');
var uploads = require('../../../app/models/uploads');
const Grid = require('gridfs-stream');
const connect = mongoose.connection;
const fileType = require('file-type');
var EnrollmentDetailsSchema = require('../../../app/models/enrollmentdetails');
var enrollmentDetailModel = mongoose.model('EnrollmentDetail');
var batchModel = mongoose.model('Batch');
var notification_function = require('./../../../utils/function');
var CollegeCourseSchema = require('../../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var CollegeDegreeSchema = require('../../../app/models/collegeDegree');
var collegeDegreeModel = mongoose.model('CollegeDegree');
var NewCourseSchema = require('../../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
var NewLessonsSchema = require('../../../app/models/newLessons');
var newLessonsModel = mongoose.model('newLessons');
const logger = require('../../../utils/logger');
var ChapterSchema = require('../../../app/models/chapter');
var chapterModel = mongoose.model('Chapter');
require('../../../app/models/division');
var divisionModel = mongoose.model('Division');
var subjectSchema = require('../../../app/models/subject');
var subjectModel = mongoose.model('Subject');
require("../../../app/models/videoRecord");
const videoRecordModel = mongoose.model("VideoRecord");
var SemesterSchema = require('../../../app/models/semesterNew');
var semesterModel = mongoose.model('semesterNew');
require('../../../app/models/catasiaLinks');
var camtasiaLinksModel = mongoose.model('CamtasiaLinks');

require('../../../app/models/subjectReference');
var subjectRefModel = mongoose.model('SubjectReference');
const xlsx = require('xlsx');
require('../../../app/models/referenceFiles');
var referenceFilesModel = mongoose.model('ReferenceFiles');
require('../../../app/models/pdfTracking');
var PdfTracking = mongoose.model('PdfTracking');
var SyllabusOverviewSchema = require('../../../app/models/syllabusFiles');
var syllabusFilesModel = mongoose.model('SyllabusFiles');
require('../../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
var StudentBatchSchema = require('../../../app/models/studentBatch');
const { json } = require('body-parser');
var studentBatchModel = mongoose.model('StudentBatch');
require('../../../app/models/chapteryoutubelinks');
var youTubeLinkModel = mongoose.model('YouTubeLink');
const config = require('config');
const { filelink } = config.get('api');
require('../../../app/models/onlineLectureLink');
var onlineLectureLinkModel = mongoose.model('OnlineLectureLink');
var UnapprovedSyllabusSchema = require('../../../app/models/unapprovedSyllabus');
var UnapprovedSyllabusModel = mongoose.model('UnapprovedSyllabus')
var vimeoLinkSchema = require('../../../app/models/vimeoLink');
var vimeoLinkModel = mongoose.model('VimeoLink');
var SyllabusOverviewSchema = require('../../../app/models/syllabusFiles');
var syllabusFilesModel = mongoose.model('SyllabusFiles');
require('../../../app/models/youtubeTracking')
var youTubeTrackingModel = mongoose.model('YouTubeTracking')


router.get('/showLessons', (req, res) => {
  var data = [];
  var videoArray = [];
  if (req.query.role == 'student') {
    chapterModel.aggregate([
      {
        $match: {
          "courseId": req.query.courseId,
          "subject": req.query.subject,
          "status": "Approved",
          "semesterId" :req.query.semesterId,
        }
      },
      {
        $sort: {
          "chapterName": 1
        }
      },
      {
        $addFields: {
          lessId: {
            $toString: "$_id"
          }
        }
      },
      {
        $lookup: {
          from: "youtubelinks",
          localField: "lessId",
          foreignField: "chapterId",
          as: "youTubeLinks"
        }
      },

    ]).then(function (lessons) {
      lessons.forEach(lesson => {

        var uploadedFiles;
        var data = {
          _id: lesson._id,
          doc_id: lesson.doc_id,
          user_id: lesson.user_id,
          course_id: lesson.course_id,
          icon: lesson.icon,
          status: lesson.status,
          chapterName: lesson.chapterName,
          youTubeLinks: lesson.youTubeLinks

        }
        uploads.find({ $and: [{ lessonId: lesson._id }, { type: 'application/pdf' }] })
          .exec()
          .then(files => {
            var data2 = [];
            uploadedFiles = files.map(file => ({
              file_name: file.name,
              doc_id: file.doc_id,
              file_type: file.type,
              file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
            })
            );

            uploadedFiles.forEach(file => {
              var data1 = {
                doc_id: file.doc_id,
                file_name: file.file_name,
                file_type: file.type,
                file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`

              }
              PdfTracking.find(
                {
                  chapterId: lesson._id,
                  doc_id: file.doc_id,
                  user_id: req.query.user_id
                }
              ).then(function (pdfTrack) {
                data2.push({
                  doc_id: file.doc_id,
                  file_name: file.file_name,
                  file_type: file.type,
                  file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`,
                  totalPages: (pdfTrack.length > 0) ? pdfTrack[0].totalPages : '',
                  percentage: (pdfTrack.length > 0) ? pdfTrack[0].percentage : '',
                  page_count: (pdfTrack.length > 0) ? pdfTrack[0].page_count : '',
                })
                data.pdf = data2;
              })
            })

          })
        videoArray.push(data)
      });
      setTimeout(() => {
        res.json({
          status: 200,
          data: videoArray
        })
      }, 5000);
    });
  } else if (req.query.role == 'teacher') {
    studentBatchModel.aggregate([
      {
        $match: {
          batchId: {
            $eq: req.query.batchId,
          }
        }
      },
      {
        $count: "count"
      }
    ]).then(function (count) {

      chapterModel.aggregate([
        {
          $match: {
            "courseId": req.query.courseId,
            "subject": req.query.subject,
            "status": "Approved"
          }
        },
        {
          $sort: {
            "chapterName": 1
          }
        },
        {
          $addFields: {
            lessId: {
              $toString: "$_id"
            }
          }
        },
        {
          $lookup: {
            from: "youtubelinks",
            localField: "lessId",
            foreignField: "chapterId",
            as: "youTubeLinks"
          }
        },

      ]).then(function (lessons) {
        lessons.forEach(lesson => {

          var uploadedFiles;
          var data = {
            _id: lesson._id,
            doc_id: lesson.doc_id,
            course_id: lesson.course_id,
            icon: lesson.icon,
            status: lesson.status,
            chapterName: lesson.chapterName,
            lastUpdated: lesson.lastUpdated,
            youTubeLinks: lesson.youTubeLinks

          }
          uploads.find({ $and: [{ lessonId: lesson._id }, { type: 'application/pdf' }] })
            .exec()
            .then(files => {
              var data2 = [];
              uploadedFiles = files.map(file => ({
                file_name: file.name,
                doc_id: file.doc_id,
                file_type: file.type,
                file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
              })
              );

              uploadedFiles.forEach(file => {
                var data1 = {
                  doc_id: file.doc_id,
                  file_name: file.file_name,
                  file_type: file.type,
                  file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`

                }
                var chapterId = lesson._id.toString();
                PdfTracking.aggregate([
                  {
                    $match: {
                      chapterId: chapterId,
                    }
                  },
                  {
                    $group: { _id: "$doc_id", pTrack: { $push: "$$ROOT" } }
                  }
                ]).then(function (pdfTrack) {
                  var overAllCount = 0;
                  pdfTrack.forEach(teachPdf => {
                    var percentCount = 0;
                    var p_Track = teachPdf.pTrack
                    p_Track.forEach(overAllProgress => {
                      percentCount += overAllProgress.percentage
                    })
                    overAllCount = Math.round(percentCount / count[0].count)
                  })
                  data2.push({
                    doc_id: file.doc_id,
                    file_name: file.file_name,
                    file_type: file.type,
                    file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`,
                    overAllCount: overAllCount,
                  })
                  data.pdf = data2;
                })
              })

            })
          videoArray.push(data)
        });
        setTimeout(() => {
          res.json({
            status: 200,
            data: videoArray
          })
        }, 5000);
      });

    });
  }

});


router.get('/uploads', (req, res) => {
  var queryuploads = {
    lessonId: req.query.lessonId
  };

  uploads.find(queryuploads)
    .exec()
    .then(files => {
      let uploadedFiles = files.map(file => ({
        file_name: file.name,
        file_type: file.type,
        file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
      }));
      res.json({
        status: 200,
        data: files,
        data2: uploadedFiles
      })
    })
    .catch(err => {
      logger.error(`[*] Error, while getting all uploaded file, with error:  ${err}`);
      res.status(400).send({
        message: `Error, while getting all uploaded file, with error: ${err}`
      });
    });
});




router.get('/uploadsWithType', (req, res) => {


  if (req.query.type == 'ppt') {

    uploads.find({ $and: [{ lessonId: req.query.lessonId }, { type: { $in: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"] } }] })
      .exec()
      .then(files => {

        let uploadedFiles = files.map(file => ({
          file_name: file.name,
          file_type: file.type,
          file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
        }));

        res.json({
          status: 200,
          data: files,
          data2: uploadedFiles
        })
      })
      .catch(err => {
        logger.error(`[*] Error, while getting all uploaded file, with error:  ${err}`);
        res.status(400).send({
          message: `Error, while getting all uploaded file, with error: ${err}`
        });
      });
  } if (req.query.type == 'video') {
    uploads.find({ $and: [{ lessonId: req.query.lessonId }, { type: { $in: ["video/mp4", "video/x-flv", "application/x-mpegURL", "video/MP2T", "video/3gpp", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"] } }] })
      .exec()
      .then(files => {
        let uploadedFiles = files.map(file => ({
          file_name: file.name,
          file_type: file.type,
          file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
        }));

        res.json({
          status: 200,
          data: files,
          data2: uploadedFiles
        })
      })
      .catch(err => {
        logger.error(`[*] Error, while getting all uploaded file, with error:  ${err}`);
        res.status(400).send({
          message: `Error, while getting all uploaded file, with error: ${err}`
        });
      });
  } else {
    uploads.find({ $and: [{ lessonId: req.query.lessonId }, { type: req.query.type }] })
      .exec()
      .then(files => {
        let uploadedFiles = files.map(file => ({
          file_name: file.name,
          doc_id: file.doc_id,
          file_type: file.type,
          file_link: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
        }));

        res.json({
          status: 200,
          data: files,
          data2: uploadedFiles
        })
      })
      .catch(err => {
        logger.error(`[*] Error, while getting all uploaded file, with error:  ${err}`);
        res.status(400).send({
          message: `Error, while getting all uploaded file, with error: ${err}`
        });
      });

  }
});


router.get('/lessons/:id', (req, res) => {

  var query = {
    _id: req.params.id
  };
  newLessonsModel.findOne(query, function (err, lesson) {
    if (err) {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    }
    res.json({
      status: 200,
      data: lesson
    })
  });
});

router.put('/lessons/:id', function (req, res) {

  var query = {
    _id: req.params.id
  },
    update = {
      $set: {
        title: req.body.title,
        objective: req.body.objective,
        lastUpdated: req.body.date,
        instructions: req.body.instructions,
        text: req.body.text,
        status: "Approved",
        videoLink: req.body.videoLink
      }
    };

  newLessonsModel.findOneAndUpdate(query, update, function (err, lessons) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else {
      var action = req.body.teacher_name + " Updated Lesson";
      var notification_data = req.body.teacher_name + " updated lesson " + req.body.title + " for Subject " + req.body.subjects;
      var query_params = "course_id:" + req.body.courseId + ", subjects:" + req.body.subjects;
      var url = "pages/addCourse";
      userModel.find({
        "role": 'admin'
      }).then(function (users) {
        users.forEach(function (user) {
          notification_function.notification(action, notification_data, user._id, url, query_params);
        })
      });

      res.json({
        status: 200,
        data: lessons
      })
    }

  });
});

router.delete('/lessons/:id', function (req, res) {
  var query = {
    _id: req.params.id
  };
  var query1 = {
    courseId: req.params.id
  };
  newLessonsModel.findOneAndRemove(query, function (err, lessons) {
    if (err) {
      res.json({
        status: 500,
        message: 'Bad Request'
      });
    } else {
      syllabusFilesModel.find({
        courseId: req.params.id
      }).then(function (syllabus) {
        if (syllabus != '') {
          syllabusFilesModel.findOneAndRemove(query1, function (err, syllabusData) {
            if (err) {
              res.json({
                status: 500,
                message: 'Bad Request'
              })
            } else {
              res.json({
                status: 200
              });
            }
          })
        } else if (syllabus == '') {
          res.json({
            status: 200
          });
        }
      });
    }
  });
});

router.get('/course', function (req, res) {
  var view_data = [];
  var type = req.query.type
  var query = {
    _id: req.query.courseId,
    subjects: req.query.subject
  };
  newCourseModel.findOne(query, function (err, course) {
    if (err) {
      res.json({
        status: 500,
        message: 'Bad Request'
      });
    } else {
      if (type == 'all') {
        newCourseModel.find({
          _id: req.query.courseId
        }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).populate('teacher_id', ['fullName']).populate('semesterId', ['semesterName']).then(function (courses) {
          if (courses != '') {
            courses.forEach(function (courseData) {
              view_data.push({
                courseId: courseData._id,
                collegeCourseId: courseData.courseId._id,
                courseName: courseData.courseId.courseName,
                departmentName: courseData.departmentId.departmentName,
                departmentId: courseData.departmentId._id,
                teacher_id: courseData.teacher_id._id,
                teacher_name: courseData.teacher_id.teacher_name,
                subject: courseData.subjects,
                semesterId: courseData.semesterId._id,
                semesterName: courseData.semesterId.semesterName,
                courseOverview: courseData.overview,
                courseDescription: courseData.description,
                coursefromdate: courseData.coursefromdate,
                coursetodate: courseData.coursetodate,
                approval: courseData.approval

              })

            });
          }
        })
        setTimeout(function () {
          res.json({
            status: 200,
            data: view_data,
          })
        }, 1500)
      } else {
        newCourseModel.find({
          _id: req.query.courseId
        }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).populate('teacher_id', ['fullName']).populate('semesterId', ['semesterName']).then(function (courses) {
          if (courses != '') {
            courses.forEach(function (courseData) {
              view_data.push({
                courseId: courseData._id,
                collegeCourseId: courseData.courseId._id,
                courseName: courseData.courseId.courseName,
                departmentName: courseData.departmentId.departmentName,
                departmentId: courseData.departmentId._id,
                teacher_id: courseData.teacher_id._id,
                teacher_name: courseData.teacher_id.teacher_name,
                subject: courseData.subject,
                courseOverview: courseData.overview,
                courseDescription: courseData.description,
                coursefromdate: courseData.coursefromdate,
                coursetodate: courseData.coursetodat,
                semesterId: courseData.semesterId._id,
                semesterName: courseData.semesterId.semesterName,
                approval: courseData.approval
              })

            });
          }
        })
        setTimeout(function () {

          res.json({
            status: 200,
            data: view_data
          })
        }, 2000)
      }

    }

  });
});


router.post('/lessons', function (req, res) {
  var query = {
    courseId: req.body.courseId,
    chapterId: req.body.chapterId,
    title: req.body.title,
    objective: req.body.objective,
    lastUpdated: req.body.date,
    instructions: req.body.instructions,
    text: req.body.text,
    status: "Unapproved",
    videoLink: req.body.videoLink
  };

  newLessonsModel.create(query, function (err, lessons) {
    if (err) {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    } else {

      var action = "Teacher Added Lesson";
      var notification_data = req.body.teacher_name + " added new lesson " + req.body.title + " in Subject " + req.body.subjects;
      var query_params = "course_id:" + req.body.courseId + ", subjects:" + req.body.subjects;
      var url = "pages/addCourse";
      userModel.find({
        "role": 'admin'
      }).then(function (users) {
        users.forEach(function (user) {
          notification_function.notification(action, notification_data, user._id, url, query_params);
        })
      });
      res.json({
        status: 200,
        data: lessons
      })
    }
  });
});

router.get('/download', (req, res) => {
  gfs = Grid(connect.db);
  let {
    document_id
  } = req.query;
  gfs.findOne({
    _id: document_id
  }, (err, file) => {

    if (!file) {
      return res.status(404).send({
        message: 'File was not found'
      });
    }
    let data = [];
    let readstream = gfs.createReadStream({
      filename: file.filename
    });
    readstream.on('data', (chunk) => {
      data.push(chunk);
    });
    readstream.on('end', () => {
      data = Buffer.concat(data);
      let type = fileType(data);
      res.writeHead(200, {
        'Content-Type': type.mime,
        'Content-disposition': 'attachment; filename=' + file.filename + '.' + type.ext,
        'Content-Length': file.length
      });

      res.end(data);

    });
    readstream.on('error', (err) => {
      logger.error(`[*] Error, while downloading a file, with error:  ${err}`);
      res.status(400).send({
        message: `Error, while downloading a file, with error:  ${err}`
      });
    });
  });
});


router.post('/addCollegeCourse', function (req, res) {
  var subjects = JSON.stringify(req.body.courseSubject);

  var collegeCourseData = new collegeCourseModel({
    degree: req.body.collegeDegree,
    courseName: req.body.courseName,
    courseSubject: subjects,
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

router.get('/getCollegeCourse', function (req, res) {
  var view_data = [];
  collegeCourseModel.find({}).exec(function (err, course) {
    if (err) {
      console.error(err);
    } else if (course != '' || course != undefined || course != 'undefined' || course != null) {
      course.forEach(function (courses) {
        view_data.push({
          courseName: courses.courseName,
          courseId: courses._id,

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
  var subjects = JSON.stringify(req.body.courseSubject);
  var query = {
    _id: req.body.course_id
  },
    update = {
      $set: {
        degree: req.body.collegeDegree,
        courseName: req.body.courseName,
        courseSubject: subjects

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

router.get('/getUpdateCourseData', function (req, res) {
  var view_data = [];
  collegeCourseModel.find({
    _id: req.query.course_id
  }).exec(function (err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (course != '' || course != null || course != 'undefined' || course != undefined) {
      course.forEach(function (courses) {
        course.forEach(function (courses) {
          var course_subjects = [];
          var sub1 = courses.courseSubject;
          var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
          var sub = sub2.replace(/^"(.*)"$/, '$1');
          var strs = sub.split('","');
          strs.forEach(function (courseSubject) {
            course_subjects.push(courseSubject);
          });
          view_data.push({
            degreeName: courses.degree,
            courseName: courses.courseName,
            courseId: courses._id,
            courseSubject: course_subjects
          });

        })


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

router.delete('/deleteCollegeCourse', function (req, res) {
  var query = {
    _id: req.query.course_id
  }
  collegeCourseModel.find({
    _id: req.query.course_id
  }).exec(function (err, deleteCourse) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    } else if (deleteCourse != '' || deleteCourse != null || deleteCourse != 'undefined' || deleteCourse != undefined) {
      collegeCourseModel.findOneAndRemove(query).exec(function (err, course) {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error!!!....'
          });
        } else {
          res.json({
            status: 200,
            data: course,
            message: 'Course Deleted Successfully!!!....'
          });
        }

      });

    }
  });

});


router.get('/getCourseWiseSubjectforTeacher', function (req, res) {
  var subjects = [];
  teacherModel.find({
    course_id: req.query.courseId,
    semesterId: req.query.semesterId,
    teacher_id: req.query.userId
  }).exec(function (err, subject) {
    if (subject != '') {
      subject.forEach(element => {
        subjects.push(element.subject)
      })
      res.json({
        status: 200,
        data: subjects,
      });
    }
    else {
      res.json({
        status: 400
      });
    }

  });
});


router.get('/getCourseWiseSubject', function (req, res) {
  var course_subjects = [];
  subjectModel.find({
    courseId: req.query.courseId,
    semesterId: req.query.semesterId
  })
    .exec(function (err, course) {
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
        res.json({
          status: 200,
          data: course_subjects,
        });
      }
      else {
        res.json({
          status: 400
        });
      }

    });
});

router.get('/getCourseWiseSubjectAllocateToTeacher', function (req, res) {
  var course_subjects = [];
  teacherModel.find({
    course_id: req.query.courseId,
    semesterId: req.query.semesterId,
    teacher_id: req.query.userId
  })
    .then(function (subject) {
      if (subject != '') {
        subject.forEach(function (subjects) {
          course_subjects.push({
            subject: subjects.subject
          })
        })
        res.json({
          status: 200,
          data: course_subjects
        });
      } else {
        res.json({
          status: 400
        });
      }

    });

});


router.post('/addDegree', function (req, res) {

  var collegeDegreeData = new collegeDegreeModel({
    degreeName: req.body.degreeName
  });
  collegeDegreeData.save(function (err, result) {
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

router.put('/updateDegree', function (req, res) {
  var query = {
    _id: req.body._id
  },
    update = {
      $set: {
        degreeName: req.body.degreeName,

      }
    };
  collegeDegreeModel.updateMany(query, update, function (err, course) {
    if (err) {
      console.error("err" + err)
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




router.get('/getlistAllTeachers', function (req, res) {
  view_data = [
  ];
  var counter = 0;
  userModel.find({
    "role": "teacher"
  }).then(function (teacher) {
    if (teacher.length > 0) {
      teacher.forEach(function (teacherData) {

        courseModel.find({
          teacher_id: teacherData._id,
          _id: req.query.course_id
        }).then(function (allTeacher) {
          if (allTeacher != '') {
            view_data.push({
              teacher_name: teacherData.fullName,
              teacher_id: teacherData._id,
              teacher_select: allTeacher[0].teacher_select

            })
          }
          else {
            view_data.push({
              teacher_name: teacherData.fullName,
              teacher_id: teacherData._id,
              teacher_select: false

            })
          }

        });
      })

      setTimeout(function () {
        res.json({
          status: 200,
          data: view_data,
        })
      }, 3000)
    } else {
      res.send({
        status: 400
      });
    }

  });

});


router.put('/courseteacher', function (req, res) {


  var user = req.body.teacher_id;

  var query = {
    _id: req.body.courseid
  },
    update = {
      $set: {
        teacher_id: req.body.teacher_id,
        teacher_name: req.body.teacher_name,
        teacher_select: req.body.teacher_select
      }
    };

  courseModel.findOneAndUpdate(query, update, function (err, course) {
    if (err) {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    } else {
      enrollmentDetailModel.find({
        batch_id: req.body.batchID,
        course_id: req.body.courseid
      }).then(function (userData) {
        if (userData != '') {
          var action = "Teacher Changed";
          var notification_data = "Changed Teacher For Batch" + " " + req.body.batchName;
          userData.forEach(function (user) {

          });

        }

      });
      res.json({
        status: 200,
        data: course
      })
    }

  });
});


router.put('/batchteacher', function (req, res) {

  var user = req.body.teacher_id;


  var query = {
    _id: req.body.batchID
  },
    update = {
      $set: {

        teacher_id: req.body.teacher_id,
        teacher_select: req.body.teacher_select,

      }
    };

  batchModel.findOneAndUpdate(query, update, function (err, batch) {
    if (err) {
      res.json({
        status: 400,
        message: 'Bad Request'
      });
    } else {
      res.json({
        status: 200,
        data: batch
      })
    }

  });
});



router.put('/updateVideoRecord', function (req, res) {

  videoRecordModel.find({
    user_id: req.body._id,
    lessons_id: req.body.lessonId,
    videoLink: req.body.videoId

  })
    .then(function (timeRecord) {

      if (timeRecord == '' || timeRecord == '0.0' || timeRecord == null || timeRecord == undefined || timeRecord == 'undefined') {

        var studentlessonData = new videoRecordModel({
          user_id: req.body._id,
          lessons_id: req.body.lessonId,
          videoLink: req.body.videoId,
          timeRecord: req.body.percent,
          seconds: req.body.seconds,
          duration: req.body.duration
        })
        studentlessonData.save(function (err, result) {
          if (err) {
            res.send({
              status: 400
            });
          } else {

            res.send({
              status: 200,
              data: result
            });
          }
        });

      } else {

        var query = {
          user_id: req.body._id,
          lessons_id: req.body.lessonId,
          videoLink: req.body.videoId
        },
          update = {
            $set: {
              timeRecord: req.body.percent,
              seconds: req.body.seconds,
              duration: req.body.duration
            }
          };
        videoRecordModel.updateMany(query, update, function (err, updateVideoRecord) {
          if (err) {
            console.error(err);
          } else {
            res.json({
              status: 200,
              data: updateVideoRecord
            });
          }
        });
      }
    })
});

router.get('/getVideoRecord', function (req, res) {
  CamtasiaAnalyticsModel.find({
    userId: req.query.user_id,
    chapter: req.query.chapterId,
    linkName: req.query.linkName
  }).select(' seconds ')
    .then(data => {
      res.status(200).json({ status: true, data: data })
    }).catch(err => {
      console.log(`Error ${err}`)
      res.status(500).json({ status: false })
    })


})

router.get('/getsubjectReferences', function (req, res) {
  var view_data = [];
  subjectRefModel.aggregate([
    {
      $match: {
        subject: {
          $eq: req.query.subject
        },
      }
    }
  ]).then(function (ref) {
    ref.forEach(function (data) {
      if (data != '') {
        referenceFilesModel.find({
          subjectId: data._id
        }).then(function (files) {
          if (data != '' && (files != '' || files == '')) {
            view_data.push({
              _id: data._id,
              subjectId: data.subjectId,
              description: data.description,
              subject: data.subject,
              files: files

            })
          }
        })
      } else {
        res.json({
          status: 400,
          message: 'bad request'
        })
      }
    })

    setTimeout(function () {
      res.json({
        status: 200,
        data: view_data
      })
    }, 2000)
  });
});

router.post('/uploadExcelFileChapters', (req, res) => {
  var data = new Uint8Array(req.files.file.data);
  var workbook = xlsx.read(data, { type: 'buffer', cellDates: true, cellNF: false, cellText: false });
  var sheet_name_list = workbook.SheetNames;
  var columns = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { raw: false, dateNF: "YYYY-MM-DD" });
  var counter = 0;


  columns.map(data => {

    chapterModel.insertMany({
      chapterName: data.ChapterName,
      courseId: columns[0].CourseId,
      subject: data.CourseSubject,
      lastUpdated: data.Date,
      semesterId: columns[0].SemesterId,
      status: 'Approved'

    }, (err, chapterUpdated) => {
      counter++;
      if (err) {
        console.error(err);
      }
      else {
        if (counter == columns.length) {
          res.json({
            status: 200
          })
        }
      }
    })
  })
})

router.get('/getTeacherID', (req, res) => {
  var subject = req.query.subject;
  var divisionId = req.query.divisionId;
  var course_id = req.query.course_id;

  teacherdata = [];
  teacherModel.find({
    divisionId: divisionId,
    subject: subject,
    course_id: course_id
  }).populate('teacher_id', ['fullname', 'email']).exec(function (err, data) {

    data.forEach((item) => {

      teacherdata.push(item.teacher_id)
    })
    if (err) {
      res.json({
        status: 400,
      })
    } else if (data) {
      if (data.length == teacherdata.length) {
        res.json({
          status: 200,
          data: teacherdata
        })
      } else {
        res.json({
          status: 400,
        })
      }
    }
  })
})

router.get('/getChapters', (req, res) => {
  chapterModel.find({
    courseId: req.query.courseId,
    subject: req.query.subject,
    semesterId: req.query.semesterId
  }).sort({ 'chapterName': 1 }).then(function (chapters) {
    res.json({
      status: 200,
      data: chapters
    })
  })
})

router.get('/getMaterial', (req, res) => {
  var view_data = [];
  if (req.query.type == 'prerequisite') {
    youTubeLinkModel.aggregate([
      {
        $addFields: {
          id: {
            $toString: "$_id"
          }
        }
      },
      {
        $match: {
          "chapterId": {
            $eq: req.query.id,
          },

        }
      },
      {
        "$lookup": {
          "from": "youtubetrackings",
          "localField": "id",
          "foreignField": "youtubeId",
          "as": "youtubeTrack"
        }
      },
      {
        $project: {
          youtube: {
            $filter: {
              input: "$youtubeTrack",
              as: "data",
              cond: {
                $eq: ["$$data.user_id", req.query.user_id]
              }
            }
          },
          "chapterId": 1,
          "type_of_upload": 1,
          "youTubeLink": 1,
          "videoName": 1,
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{
              $arrayElemAt: ["$youtube", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        $project: {
          youtube: 0
        }
      }
    ]).then(function (youTubeLinks) {
      var data = [];
      if (youTubeLinks != '') {
        res.json({
          status: 200,
          videoLinkFlag: false,
          data: youTubeLinks
        });
      } else {
        res.json({
          status: 500
        });
      }
    })
  } else if (req.query.type == 'lecture') {
    chapterModel.find({
      _id: req.query.id,
    }).then(lecture => {
      lecture.forEach(videoLecture => {
        data = videoLecture,
          videoLinkFlag = true
        res.json({
          status: 200,
          videoLinkFlag: videoLinkFlag,
          data: data
        });

        var video = lecture.videoLink
      })
      for (var i = 0; i <= lecture.length; i++) {

      }
    })
  } else if (req.query.type == 'onlineLecture') {
    onlineLectureLinkModel.find({
      chapterId: req.query.id,
      type_of_upload: req.query.type
    }).then(function (onlineLecture) {
      var data = [];
      if (onlineLecture != '') {
        res.json({
          status: 200,
          videoLinkFlag: false,
          data: onlineLecture
        });
      } else {
        res.json({
          status: 500
        });
      }
    })
  } else if (req.query.type == 'vimeoLink') {
    vimeoLinkModel.find({
      chapterId: req.query.id,
      type_of_upload: req.query.type
    }).then(function (vimeoLink) {
      var data = [];
      if (vimeoLink != '') {
        res.json({
          status: 200,
          videoLinkFlag: false,
          data: vimeoLink
        });
      } else {
        res.json({
          status: 500
        });
      }
    })
  } else {

    uploads.find({ $and: [{ lessonId: req.query.id }, { type_of_upload: req.query.type }] })
      .exec()
      .then(files => {
        files.forEach((el) => {

          PdfTracking.find({
            doc_id: el.doc_id,
            user_id: req.query.user_id
          }).then(function (pdfTrack) {
            view_data.push({
              file_name: el.name,
              doc_id: el.doc_id,
              file_type: el.type,
              file_link: `${filelink}/api/viewCourse/download?document_id=${el.doc_id}`,
              totalPages: (pdfTrack.length > 0) ? pdfTrack[0].totalPages : '',
              percentage: (pdfTrack.length > 0) ? pdfTrack[0].percentage : '',
              page_count: (pdfTrack.length > 0) ? pdfTrack[0].page_count : '',
            })

          })
        })
        setTimeout(function () {
          res.json({
            status: 200,
            data2: files,
            videoLinkFlag: false,
            data: view_data

          })
        }, 500)

      })

  }
})


function splitByComma(...videolink) {
  var newVideoLink = [];
  var newarray = [];
  for (var i = 0; i < videolink.length; i++) {
    newVideoLink.push(videolink[i].replace(/\"/g, "").split(","));
  }
  newVideoLink.forEach(data => {
    data.forEach(items => {
      newarray.push({ videoLink: items })
    })
  })
  return newarray;
}

router.get('/getReportData', (req, res) => {
  var view_data = [];
  studentBatchModel.find({
    studentId: req.query.id
  }).then(function (batches) {
    if (batches.length > 0) {
      subjectModel.find({
        courseId: batches[0].courseId,
        semesterId: req.query.semesterId
      }).then(function (subject) {
        if (subject != '') {
          subject.forEach(subjectData => {
            var sub1 = subjectData.subject;
            var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
            var sub = sub2.replace(/^"(.*)"$/, '$1');
            var strs = sub.split('","');
            strs.forEach(function (courseSubject) {
              var pptNotes = 0;
              var practiceQue = 0;
              var dataset = 0;
              var youTubeLinks = 0;
              var onlineLectures = 0;
              chapterModel.find({
                courseId: batches[0].courseId,
                semesterId: req.query.semesterId,
                subject: courseSubject
              }).then(function (chapters) {
                chapters.forEach(function (chapter) {

                  uploads.find({
                    lessonId: chapter._id,
                    type_of_upload: 'ppt/notes'
                  }).then(function (upload) {
                    pptNotes += upload.length;
                  })

                  uploads.find({
                    lessonId: chapter._id,
                    type_of_upload: 'practise question'
                  }).then(function (upload) {
                    practiceQue += upload.length;
                  })

                  uploads.find({
                    lessonId: chapter._id,
                    type_of_upload: 'dataSet'
                  }).then(function (upload) {
                    dataset += upload.length;

                  })

                  youTubeLinkModel.find({
                    chapterId: chapter._id,
                    type_of_upload: 'prerequisite'
                  }).then(function (youtube) {
                    youTubeLinks += youtube.length;

                  })

                  onlineLectureLinkModel.find({
                    chapterId: chapter._id,
                    type_of_upload: 'onlineLecture'
                  }).then(function (online) {
                    onlineLectures += online.length;
                  })

                })
              });
              setTimeout(() => {
                view_data.push({
                  courseId: batches[0].courseId,
                  semesterId: req.query.semesterId,
                  subject: courseSubject,
                  pptNotes: pptNotes,
                  onlineLectures: onlineLectures,
                  youTubeLinks: youTubeLinks,
                  dataset: dataset,
                  practiceQue: practiceQue
                })
              }, 1000);

            });
          });
        }

      })

      setTimeout(() => {
        res.json({
          status: 200,
          data: view_data
        })
      }, 2000);

    }
  })
});

router.get('/getCurrentSem', (req, res) => {
  studentBatchModel.find({
    studentId: req.query.id
  }).populate('batchId', ['batchName']).then(function (batches) {
    console.log("batch--" + batches.length)
    if (batches.length == '3') {
      semesterModel.find({
        semesterStatus: 'true',
        $or: [
          {
            semesterName: "Semester 5"
          },
          {
            semesterName: "Semester 6"
          },]
      }).exec(function (err, semesters) {
        res.json({
          status: 200,
          data: semesters
        })
      })
    } else if (batches.length == '2') {
      semesterModel.find({
        $or: [
          {
            semesterName: "Semester 4"
          },
          {
            semesterName: "Semester 3"
          },]
      }).exec(function (err, semesters) {
        res.json({
          status: 200,
          data: semesters
        })
      })
    } else {
      semesterModel.find({
        $or: [
          {
            semesterName: "Semester 2"
          },
          {
            semesterName: "Semester 1"
          },]
      }).exec(function (err, semesters) {
        res.json({
          status: 200,
          data: semesters
        })
      })
    }

  })
});


router.get('/changeSyllabusStatus', function (req, res) {
  var view_data = {
    statusFlag: false
  }
  UnapprovedSyllabusModel.find({
    syllabusFilesId: req.query.syllabusId
  }).then(function (course) {
    if (course != '') {
      var query1 = {
        syllabusFilesId: req.query.syllabusId
      };
      update1 = {
        $set: {
          approval: req.query.approval,
        }
      }
      var query = {
        _id: req.query.syllabusId
      };

      update = {
        $set: {
          description: course[0].description,
          overview: course[0].overview,
          approval: req.query.approval,
        }
      };

      if (course[0].approval == 'false') {
        if (req.query.approval == 'true') {
          syllabusFilesModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              UnapprovedSyllabusModel.findOneAndUpdate(query1, update1, function (err, approvalStatus) {

              })
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.approval == 'false') {
          syllabusFilesModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              UnapprovedSyllabusModel.findOneAndUpdate(query1, update1, function (err, approvalStatus) {
              })
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

      } else if (course[0].approval == 'true') {
        if (req.query.approval == 'true') {
          syllabusFilesModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              UnapprovedSyllabusModel.findOneAndUpdate(query1, update1, function (err, approvalStatus) {
              })
              if (changeStatus != '') {
                view_data.statusFlag = true
                res.json({
                  status: 200,
                  data: view_data
                })
              }

            }
          })
        } else if (req.query.approval == 'false') {
          syllabusFilesModel.findOneAndUpdate(query, update, function (err, changeStatus) {
            if (err) {
              return res.status(400).json({
                message: 'Bad Request'
              });
            } else {
              UnapprovedSyllabusModel.findOneAndUpdate(query1, update1, function (err, approvalStatus) {
              })
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

  })
});


router.get('/unapprovedSyllabus', function (req, res) {
  var view_data = [];
  if (req.query.degree == "All" || req.query.degree == null || req.query.degree == undefined || req.query.degree == "") {
    UnapprovedSyllabusModel.find({}).populate('syllabusFilesId').populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).populate('teacher_id', ['fullName']).populate('semesterId', ['semesterName']).then(function (course) {
      course.forEach(function (courseData) {
        view_data.push({
          syllabusId: courseData.syllabusFilesId._id,
          name: courseData.syllabusFilesId.name,
          length: courseData.syllabusFilesId.length,
          doc_id: courseData.syllabusFilesId.doc_id,
          type: courseData.syllabusFilesId.type,
          courseName: courseData.courseId.courseName,
          courseId: courseData.courseId._id,
          subjects: courseData.subjects,
          description: courseData.description,
          semesterId: courseData.semesterId._id,
          semesterName: courseData.semesterId.semesterName,
          teacher_id: courseData.teacher_id._id,
          teacher_name: courseData.teacher_id.teacher_name,
          approval: courseData.approval
        });
      });
      if (course != '') {
        res.send({
          status: 200,
          data: view_data
        })
      } else {
        res.send({
          status: 500
        })
      }
    });
  } else {
    UnapprovedSyllabusModel.find({
      "degreeName": req.query.degree
    }).then(function (course) {
      course.forEach(function (courseData) {
        view_data.push({
          syllabusId: courseData.syllabusFilesId._id,
          name: courseData.syllabusFilesId.name,
          length: courseData.syllabusFilesId.length,
          doc_id: courseData.syllabusFilesId.doc_id,
          type: courseData.syllabusFilesId.type,
          courseName: courseData.courseName,
          subjects: courseData.subjects,
          description: courseData.description,
          semesterId: courseData.semesterId._id,
          semesterName: courseData.semesterId.semesterName,
          teacher_id: courseData.teacher_id._id,
          teacher_name: courseData.teacher_id.teacher_name,
          approval: courseData.approval
        });
      });
      if (course != '') {
        res.send({
          status: 200,
          data: view_data
        })
      } else {
        res.send({
          status: 500
        })
      }
    });
  }
})

router.get('/getCamtasiaLink', (req, res) => {
  var resData = [];
  camtasiaLinksModel.find({
    course: req.query.courseId,
    semester: req.query.semesterId,
    subject: req.query.subject,
    chapter: req.query.chapter
  }).then(async (camtasiaLinks) => {

    for (let link of camtasiaLinks) {
      let percentage;
      analytics = await CamtasiaAnalyticsModel.find({
        userId: req.query.user_id,
        linkName: link.linkName
      })

      if (analytics.length > 0) {
        percentage = analytics[0].percent;
      } else {
        percentage = 0
      }
      let newObject = {
        subject: link.subject,
        linkName: link.linkName,
        link: link.link,
        course: link.course,
        semester: link.semester,
        chapter: link.chapter,
        percentage: percentage
      }
      resData.push(newObject);
    }

    res.status(200).json({ status: true, data: resData })

  }).catch(err => {
    res.status(500).send("Server Side Error")
  })
})

router.post('/updateCamtasiaVideoRecord', function (req, res) {
  CamtasiaAnalyticsModel.update(
    {
      userId: req.body.userId,
      chapter: req.body.chapter,
      link: req.body.link
    }, {
    userId: req.body.userId,
    chapter: req.body.chapter,
    link: req.body.link,
    percent: req.body.percent,
    seconds: req.body.seconds,
    duration: req.body.duration,
    linkName: req.body.linkName,
    course: req.body.course,
    semester: req.body.semester,
  }, {
    upsert: true
  }
  ).then(data => {
    res.status(200).json({ status: true, data: "Data Updated" })
  }).catch(err => {
    res.status(500).json({ status: false, data: "Server Side Error" })
  })
});

router.get('/videoAnalytics/:id', (req, res) => {

  const userId = req.params.id;
  CamtasiaAnalyticsModel.find({
    userId: userId
  }).populate('chapter')
    .populate('course')
    .then(data => {
      console.log(`data ${typeof data}`)
      res.status(200).json({ status: true, data })
    })
    .catch(err => {
      res.status(500).json({ status: false, data: "Server Side Error" })
    })


})

router.get('/pdfAnalytics/:id', async (req, res) => {
  const start = Date.now()

  let resData = [];
  console.log("Reached here");
  await PdfTracking.find({
    user_id: req.params.id
  }).then(async data => {
    for (let analytics of data) {
      const returnData = await uploads.find({
        doc_id: analytics.doc_id
      }).populate('lessonId')
      if (returnData.length > 0) {
        if (returnData[0].lessonId != null) {
          let newObject = {
            read_pages: analytics.page_count,
            total_pages: analytics.totalPages,
            read_percentage: analytics.percentage,
            doc_name: returnData[0].name,
            type: returnData[0].type,
            subject: returnData[0].lessonId.subject,
            chapterName: returnData[0].lessonId.chapterName,
            courseId: returnData[0].lessonId.courseId,
            semesterId: returnData[0].lessonId.semesterId
          }
          resData.push(newObject)
        }
      }
    }
  })
  const stop = Date.now()
  res.json({
    status: 200,
    data: resData,
    timeTaken: (stop - start) / 1000
  })

})

router.post('/saveYouTubeTracking', function (req, res) {
  youTubeTrackingModel.find({
    user_id: req.body.user_id,
    youtubeId: req.body.youTubeId,
    chapterId: req.body.chapterId,
  }).then(function (user) {
    if (user == null || user == '' || user == 'undefined' || user == undefined) {
      var youtubeTracking = new youTubeTrackingModel({
        youtubeId: req.body.youTubeId,
        user_id: req.body.user_id,
        totalTime: req.body.totalTime,
        percentage: req.body.percentage,
        watchTime: req.body.watchTime,
        chapterId: req.body.chapterId,
      });
      youtubeTracking.save(function (err, result) {
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
      var query = {
        user_id: req.body.user_id,
        youtubeId: req.body.youTubeId,
        chapterId: req.body.chapterId,
      },
        update = {
          $set: {
            watchTime: req.body.watchTime,
            percentage: req.body.percentage,
            updatedOn: new Date()
          }
        };
      youTubeTrackingModel.updateMany(query, update, function (err, result) {
        if (err) {
          res.send({
            status: 500
          })
        } else {
          res.json({
            status: 200,
            data: result
          })
        }
      })
    }

  });
});

module.exports = router;