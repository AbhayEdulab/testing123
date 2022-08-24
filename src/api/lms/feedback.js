var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var fbmodel = require('../../app/models/feedback');
var feedbackModel = mongoose.model('feedback');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const xlsx = require('xlsx');
var fs = require('fs');
require('../../app/models/facultySubject');
var facultySubjectModel = mongoose.model('facultySubject');
var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var studentFeedbackSchema = require("../../app/models/studentfeedback");
var studentFeedbackModel = mongoose.model("studentFeedback");
var systemFeedbackSchema = require("../../app/models/systemFeedback");
var systemFeedbackModel = mongoose.model("systemFeedback");
var studentBatchModel = mongoose.model('StudentBatch');
var StudentBatchSchema = require('../../app/models/studentBatch');
var feedbackCommentSchema = require('../../app/models/feedbackcomment');
var FeedbackCommentModel = mongoose.model("feedbackComment");
var TeacherSchema = require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
var feedbackQuestionSchema = require('../../app/models/feedbackQuestions');
var feedbackQuestionModel = mongoose.model('feedbackQuestion');
var vd = require('sort-objects-array');
var json2xls = require('json2xls');
//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();
router.post('/getData', (req, res) => {
  getData(req)
  const str = JSON.stringify(req.body);
  const words = str.split('|');
  var ts = words[0];
  var rt = words[1];
  var aut = words[2];
  var sr = words[3]
  var cmd = words[4];
  var sub = words[5];
  if (sr == 1) {
    mongoose.connection.db.dropCollection('feedbacks', function (err, result) {
      console.log(err)
    });
  }
  feedbackModel.create({
    srno: sr,
    Timestamp: ts,
    Rating: rt,
    Author: aut,
    Comment: cmd,
    Subject: sub

  }, (err, dataInserted) => { }

  );
  res.sendStatus(200);


});
function getData(req) {
  const str = JSON.stringify(req.body);
  const words = str.split('|');
  var ts = words[0];
  var rt = words[1];
  var aut = words[2];
  var sr = words[3]
  var cmd = words[4];
  var sub = words[5];
  if (sr == 1) {
    models.feedbacks.destroy({
      where: {},
      truncate: true
    }).then(data => {

    })
  }
  models.feedbacks.create({
    srNo: sr,
    timeStamp: ts,
    rating: rt,
    author: aut,
    comment: cmd,
    subject: sub
  }).then(create => {
  })
  res.sendStatus(200);
}
router.get('/getFeedbackData', function (req, res) {
  view_data = [];
  var count = 0;
  feedbackModel.find({}).sort({ 'createdOn': -1 }).exec((err, feedbackdata) => {
    if (err) {
      res.json({
        status: 400
      })
    } else if (feedbackdata) {
      feedbackdata.forEach((feedback) => {
        var author = feedback.Author.replace(" (temp)", '').replace(/\s\s/g, '').trim();
        var rating = feedback.Rating.replace(/\D/g, '');
        var Comment = feedback.Comment.replace(/\":"\"}/, '').trim();
        var date = feedback.Timestamp.replace(/\{\"/, '').trim();

        facultySubjectModel.find({ bbb_roomName: feedback.Subject.replace(/\":"\"}/, '').trim() }).then((facultysubData) => {
          var facultyName;
          if (facultysubData[0] != undefined) {
            facultyName = facultysubData[0].Faculty
          }

          view_data.push({
            _id: feedback._id,
            srno: feedback.srno,
            date: date,
            Author: author,
            Rating: rating,
            Comment: Comment,
            Subject: feedback.Subject.replace(/\":"\"}/, '').trim(),
            facultyName: facultyName
          })

        })
        count++;
      })
      setTimeout(() => {
        res.json({
          status: 200,
          data: view_data
        })
      }, 4000);

    }

  })
})

router.get('/getAdminfilterStructure', function (req, res) {
  view_data = [];
  var count = 0;
  facultySubjectModel.aggregate([
    {
      $group: {
        _id: {
          Course: "$Course",
          Semester: "$Semester",
          Subject: "$Subject",
          Faculty: "$Faculty",
        }, count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.Course",
        CourseWiseGROUP: {

          $push: {
            Semester: "$_id.Semester",
            Subject: "$_id.Subject",
            Faculty: "$_id.Faculty"
          },
        }
      }
    }
  ]).sort({ createdOn: -1 }).exec((err, facultySubject) => {
    if (err) {
      res.json({
        status: 400
      })
    } else if (facultySubject) {
      facultySubject.forEach((facultywithsub) => {

      })
      setTimeout(() => {
        res.json({
          status: 200,
          data: facultySubject
        })
      }, 1000);
    }
  })
})

router.get('/getTeacherFeedbackData', function (req, res) {
  view_data = [];
  var count = 0;
  facultySubjectModel.find({ user_id: req.query.user_id })
    .sort({ createdOn: -1 }).exec((err, facultySubject) => {
      if (err) {
        res.json({
          status: 400
        })
      } else if (facultySubject) {
        res.json({
          status: 200,
          data: facultySubject
        })
      }
    })
})

router.get('/getfilteredData', function (req, res) {
  view_data = [];
  var count = 0;
  facultySubjectModel.find({
    user_id: req.query.user_id,
    Course: req.query.courseName,
    Semester: req.query.SemName,
    Subject: req.query.Subject
  }).sort({ createdOn: -1 }).exec((err, facultySubject) => {
    if (err) {
      res.json({
        status: 400
      })
    } else if (facultySubject) {

      feedbackModel.find({ Subject: new RegExp(facultySubject[0].bbb_roomName) }).sort({ 'createdOn': -1 }).exec((err, feedbackdata) => {
        if (err) {
          res.json({
            status: 400
          })
        } else if (feedbackdata) {
          feedbackdata.forEach((feedback) => {
            var author = feedback.Author.replace(" (temp)", '').replace(/\s\s/g, '').trim();
            var rating = feedback.Rating.replace(/\D/g, '');
            var Comment = feedback.Comment.replace(/\":"\"}/, '').trim();
            var date = feedback.Timestamp.replace(/\{\"/, '').trim();

            facultySubjectModel.find({ bbb_roomName: feedback.Subject.replace(/\":"\"}/, '').trim() }).then((facultysubData) => {
              var facultyName;
              if (facultysubData[0] != undefined) {
                facultyName = facultysubData[0].Faculty
              }

              view_data.push({
                _id: feedback._id,
                srno: feedback.srno,
                date: date,
                Author: author,
                Rating: rating,
                Comment: Comment,
                Subject: feedback.Subject.replace(/\":"\"}/, '').trim(),

              })

            })
            count++;
          })

        }
        setTimeout(() => {
          if (count == feedbackdata.length) {
            res.json({
              status: 200,
              data: view_data
            })
          }
        }, 4000);
      })

    }
  })

})

router.get('/getSem', function (req, res) {
  facultySubjectModel.aggregate([
    {
      $match: {
        Course: req.query.course
      }
    },
    {
      $group: {
        _id: {
          Semester: "$Semester",
          Subject: "$Subject",
          Faculty: "$Faculty",
          user_id: "$user_id",
        }, count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.Semester",
        semWiseGROUP: {
          $push: {
            Subject: "$_id.Subject",
            Faculty: "$_id.Faculty",
            user_id: "$_id.user_id",
          },
        }
      }
    }
  ]).sort({ createdOn: -1 }).exec((err, facultySubject) => {
    if (err) {
      res.json({
        status: 400
      })
    } else if (facultySubject) {
      facultySubject.forEach((facultywithsub) => {

      })
      setTimeout(() => {
        res.json({
          status: 200,
          data: facultySubject
        })
      }, 1000);
    }
  })

})

router.get("/studentfeedback", function (req, res) {
  view_data = [];
  studentBatchModel
    .aggregate([
      {
        $match: {
          studentId: {
            $eq: req.query.user_id,
          },
        },
      },
      {
        $lookup: {
          from: "batchsemestermasters",
          localField: "batchId",
          foreignField: "batchId",
          as: "batchSemesters",
        },
      },
      {
        $unwind: {
          path: "$batchSemesters",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          batchId: {
            $toObjectId: "$batchId",
          },
        },
      },
      {
        $lookup: {
          from: "batchmasters",
          localField: "batchId",
          foreignField: "_id",
          as: "batches",
        },
      },
      {
        $addFields: {
          semId: {
            $toObjectId: "$batchSemesters.semesterId",
          },
        },
      },
      {
        $lookup: {
          from: "semesterNew",
          localField: "semId",
          foreignField: "_id",
          as: "semesters",
        },
      },
      {
        $addFields: {
          course: {
            $toObjectId: "$courseId",
          },
        },
      },
      {
        $lookup: {
          from: "collegecourses",
          localField: "course",
          foreignField: "_id",
          as: "courses",
        },
      },
      {
        $project: {
          "batchId": 1,
          "batches.batchName": 1,
          "batches.year": 1,
          "courseId": 1,
          "courses.courseName": 1,
          "batchSemesters.semesterId": 1,
          "semesters.semesterName": 1,
        },
      },
    ])
    .then((data) => {
      data.forEach(elm => {
        view_data.push({
          batchId: elm.batchId,
          batchName: elm.batches[0].batchName,
          batchYear: elm.batches[0].year,
          courseId: elm.courseId,
          courseName: elm.courses[0].courseName,
          semesterId: elm.batchSemesters.semesterId,
          semesterName: elm.semesters[0].semesterName
        })
      })
      res.json({
        status: 200,
        data: view_data
      })
    });
});

router.post('/addstudentfeedback', function (req, res) {
  addstudentfeedback(req)
  if (req.body.feedback_id) {
    var query = {
      _id: req.body.feedback_id
    },
      update = {
        $set: {
          feedback: req.body.feedback
        }
      };
    studentFeedbackModel.updateMany(query, update, function (err, feedback) {
      res.json({
        status: 200,
        data: feedback
      });
    })

  } else {
    var feedbackdata = new studentFeedbackModel({
      questionId: req.body.questionId,
      batchId: req.body.batchId,
      studentId: req.body.studentId,
      teacherId: req.body.teacherId,
      semesterId: req.body.semesterId,
      feedback: req.body.feedback,
      Complete: 'false'
    });
    feedbackdata.save(function (err, result) {
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
async function addstudentfeedback(req) {
  if (req.body.feedback_id) {
    studentFeedbackModel.find({
      _id: req.body.feedback_id
    }).then(async Student => {
      if (Student != '') {
        var batch = await getId.getBatchId(Student[0].batchId, '')
        var semester = await getId.getSemesterId(Student[0].semesterId, '');
        var student = await getId.getUserId(Student[0].studentId, '')
        var teacher = await getId.getUserId(Student[0].teacherId, '')
        models.studentfeedback.find({
          where: {
            batchId: batch.id,
            studentId: student.id,
            semesterId: semester.id,
            teacherId: teacher.id,
            questionId: Student[0].questionId
          }
        }).then(studentfeedback => {
          if (studentfeedback) {
            studentfeedback.update({
              feedback: req.body.feedback
            }).then(update => {
              console.log("update")
            })
          }
        })
      }

    })
  } else {
    var batch = await getId.getBatchId(req.body.batchId, '')
    var semester = await getId.getSemesterId(req.body.semesterId, '');
    var student = await getId.getUserId(req.body.studentId, '')
    var teacher = await getId.getUserId(req.body.teacherId, '')
    models.studentfeedback.create({
      questionId: req.body.questionId,
      batchId: batch.id,
      studentId: student.id,
      teacherId: teacher.id,
      semesterId: semester.id,
      feedback: req.body.feedback,
      Complete: 'false'
    }).then(create => {
      console.log("create")
    })
  }

}


router.get('/getstudentfeedback', function (req, res) {
  teacherModel.aggregate([{
    $match: {
      course_id: req.query.courseId,
      semesterId: req.query.semesterId
    }
  },
  {
    $addFields: {
      techId: {
        $toObjectId: "$teacher_id"
      }

    }
  },
  {
    $lookup: {
      from: "users",
      localField: "techId",
      foreignField: "_id",
      as: "teacher"
    }
  },
  {
    $lookup: {
      from: "studentfeedbacks",
      let: {
        teacherId: "$teacher_id",
        semesterId: "$semesterId",
        studentId: req.query.user_id,
        questionId: req.query.QuestionId,


      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$teacherId", "$$teacherId"],
            }, {
              $eq: ["$semesterId", "$$semesterId"],

            },
            {
              $eq: ["$studentId", "$$studentId"],

            },
            {
              $eq: ["$questionId", "$$questionId"],

            }]
          }
        }
      }],
      as: "FeedBack"
    }
  },

  ]).then(data => {
    if (data.length > 0) {
      res.json({
        status: 200,
        data: data,

      })
    }
  })

});


router.get('/getstudentFeedbackTeacherWise', function (req, res) {
  studentFeedbackModel.find({
    semesterId: req.query.semesterId,
    teacherId: req.query.teacherId,
    batchId: req.query.batch_id,
    studentId: req.query.studentId
  }).populate('studentId', ['fullName']).populate('teacherId', ['fullName']).sort({ 'questionId': 1 }).collation({ locale: "en_US", numericOrdering: true })
    .then(function (data) {
      if (data) {
        res.json({
          status: 200,
          data: data,

        })
      } else {
        res.json({
          status: 400,
          message: 'Bad Request'
        })
      }
    })
});

router.post('/addFeedbackcomment', function (req, res) {
  addFeedbackcomment(req)
  var feedbackcommentdata = new FeedbackCommentModel({
    userId: req.body.user_id,
    feedbackId: req.body.feedback_id,
    feedbackcomments: req.body.feedbackcomment
  });
  feedbackcommentdata.save(function (err, result) {
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

});

async function addFeedbackcomment(req) {
  studentFeedbackModel.find({
    _id: req.body.feedback_id
  }).then(async feedback => {
    var batch = await getId.getBatchId(Student[0].batchId, '')
    var semester = await getId.getSemesterId(Student[0].semesterId, '');
    var student = await getId.getUserId(Student[0].studentId, '')
    var teacher = await getId.getUserId(Student[0].teacherId, '')
    models.studentfeedback.find({
      where: {
        batchId: batch.id,
        studentId: student.id,
        semesterId: semester.id,
        teacherId: teacher.id,
        questionId: feedback[0].questionId
      }
    }).then(async data => {
      var user = await getId.getUserId(req.body.user_id, '')
      models.feedbackcomment.create({
        userId: user.id,
        feedbackId: data.id,
        feedbackcomments: req.body.feedbackcomment
      }).then(comment => {
        console.log("comment")
      })
    })

  })

}


router.get('/getFeedbackcomment', function (req, res) {
  FeedbackCommentModel.find({
    feedbackId: req.query.feedbackId,
  }).populate('userId', ['fullName'])
    .then(function (data) {
      if (data) {
        res.json({
          status: 200,
          data: data,

        })
      } else {
        res.json({
          status: 400,
          message: 'Bad Request'
        })
      }
    })
});

router.get('/getTeacherstudentFeedback', function (req, res) {
  studentFeedbackModel.aggregate([
    {
      $match: {
        semesterId: req.query.semesterId,
        batchId: req.query.batch_id,
        teacherId: req.query.user_id,
      }
    },
    {
      $group: {
        _id: {
          student: "$studentId"
        },

        feeds: {
          $push: "$$ROOT"
        },

        count: {
          "$sum": 1
        }
      }
    },
  ])
    .then(function (data) {
      if (data) {
        res.json({
          status: 200,
          data: data,
        })
      } else {
        res.json({
          status: 400,
          message: 'Bad Request'
        })
      }
    })
});

router.post('/addstudentComment', function (req, res) {
  addstudentComment(req)
  var query = {
    _id: req.body.feedback_id
  },
    update = {
      $set: {
        Comment: req.body.comment
      }
    };

  studentFeedbackModel.updateMany(query, update, function (err, feedback) {
    res.json({
      status: 200,
      data: feedback
    });
  })
});


async function addstudentComment(req) {
  studentFeedbackModel.find({
    _id: req.body.feedback_id
  }).then(async feedback => {
    var batch = await getId.getBatchId(feedback[0].batchId, '')
    var semester = await getId.getSemesterId(feedback[0].semesterId, '');
    var student = await getId.getUserId(feedback[0].studentId, '')
    var teacher = await getId.getUserId(feedback[0].teacherId, '')
    models.studentfeedback.find({
      where: {
        batchId: batch.id,
        studentId: student.id,
        semesterId: semester.id,
        teacherId: teacher.id,
        questionId: feedback[0].questionId
      }
    }).then(data => {
      if (data) {
        data.update({
          Comment: req.body.comment
        }).then(update => {
          console.log("update")
        })
      }
    })
  })
}



router.post('/studentformComplete', (req, res) => {
  studentformComplete(req)
  studentFeedbackModel.find({
    studentId: req.body.user_id,
    semesterId: req.body.semesterId,
    batchId: req.body.batchId

  }).then(data => {
    data.forEach(elm => {
      elm.update({
        Complete: 'true'
      }).then(data => {

      })
    })
    res.json({
      status: 200,
    });
  })

})
async function studentformComplete(req) {
  var batch = await getId.getBatchId(req.body.batchId, '')
  var semester = await getId.getSemesterId(req.body.semesterId, '');
  var student = await getId.getUserId(req.body.user_id, '')
  models.studentfeedback.find({
    studentId: student.id,
    semesterId: semester.id,
    batchId: batch.id
  }).thne(data => {
    if (data.length > 0) {
      data.forEach(elm => {
        elm.update({
          Complete: 'true'
        }).then(update => {
          console.log("update")
        })
      })

    }
  })
}



router.post('/addsystemFeedback', function (req, res) {
  addsystemFeedback(req)
  if (req.body.feedback_id) {
    var query = {
      _id: req.body.feedback_id
    },
      update = {
        $set: {
          feedback: req.body.feedback
        }
      };
    systemFeedbackModel.updateMany(query, update, function (err, feedback) {
      res.json({
        status: 200,
        data: feedback
      });
    })

  } else {
    var feedbackdata = new systemFeedbackModel({
      questionId: req.body.questionId,
      batchId: req.body.batchId,
      studentId: req.body.studentId,
      semesterId: req.body.semesterId,
      feedback: req.body.feedback,
      Comment: req.body.Comment,
      hours: req.body.hours,
      percentage: req.body.percentage,
      process: req.body.process,
      clarity: req.body.clarity,
      capability: req.body.capability,
      commentRecommendation: req.body.commentRecommendation,
      comment: req.body.comment,
      recommendation: req.body.recommendation,
      suggestion: req.body.suggestion,
      suggest: req.body.suggest,
    });
    feedbackdata.save(function (err, result) {
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

async function addsystemFeedback(req) {
  var batch = await getId.getBatchId(req.body.batchId, '')
  var semester = await getId.getSemesterId(req.body.semesterId, '');
  var student = await getId.getUserId(req.body.user_id, '')

  models.systemfeedback.create({
    batchId: batch.id,
    studentId: student.id,
    semesterId: semester.id,
    Comment: req.body.Comment,
    hours: req.body.hours,
    percentage: req.body.percentage,
    process: req.body.process,
    clarity: req.body.clarity,
    capability: req.body.capability,
    commentRecommendation: req.body.commentRecommendation,
    comment: req.body.comment,
    recommendation: req.body.recommendation,
    suggestion: req.body.suggestion,
    suggest: req.body.suggest,
  }).then(system => {
    console.log("system")
  })
}


router.get('/getSystemFeedBack', (req, res) => {
  systemFeedbackModel.find({
    studentId: req.query.studentId,
    batchId: req.query.batch_id,
    semesterId: req.query.semesterId
  }).then(data => {
    if (data) {
      res.json({
        status: 200,
        data: data
      });
    }

  })
})
router.get('/getAllFeedBackData', (req, res) => {
  teacherModel.aggregate([{
    $match: {
      course_id: req.query.course_id,
      semesterId: req.query.semesterId
    }
  }, {
    $addFields: {
      techId: {
        $toObjectId: "$teacher_id"
      }
    }
  }, {
    $lookup: {
      from: "users",
      localField: "techId",
      foreignField: "_id",
      as: "teacher"
    }
  }, {
    $lookup: {
      from: "studentfeedbacks",
      let: {
        teacherId: "$teacher_id",
        semesterId: "$semesterId",
        studentId: req.query.user_id
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$teacherId", "$$teacherId"],

            }, {
              $eq: ["$semesterId", "$$semesterId"],

            }, {
              $eq: ["$studentId", "$$studentId"],

            },]
          }
        }
      }],
      as: "FeedBack"
    }
  },
  {
    $unwind: {
      path: '$FeedBack',
      preserveNullAndEmptyArrays: false
    }
  }, {
    $unwind: {
      path: '$teacher',
      preserveNullAndEmptyArrays: false
    }
  }, {
    $group: {
      _id: '$FeedBack.questionId',
      data: {
        $push: {
          Subject: "$subject",
          TeacherName: "$teacher.fullName",
          feedback: '$FeedBack.feedback',
          Comments: '$FeedBack.Comment'
        }
      },

    }
  },]).then(data => {
    res.json({
      status: 200,
      data: data
    });
  })
})

router.get('/getFeedbackStudentWise', function (req, res) {
  studentFeedbackModel.find({
    studentId: req.query.studentId,
    teacherId: req.query.teacherId,
    batchId: req.query.batchId,
    semesterId: req.query.semesterId
  }).populate('studentId', ['fullName']).populate('teacherId', ['fullName']).sort({ 'questionId': 1 }).collation({ locale: "en_US", numericOrdering: true })
    .then(function (data) {
      if (data) {
        res.json({
          status: 200,
          data: data,
        })
      } else {
        res.json({
          status: 400,
          message: 'Bad Request'
        })
      }
    })
});

router.get('/getExcelTeacherData', (req, res) => {
  var view_data =[]
 feedbackQuestionModel.aggregate([
	{
    $lookup: {
      from: "studentfeedbacks",
      let: {
        teacherId:req.query.teacherId,
        batchId: req.query.batchId,
        semesterId:req.query.semesterId,
				questionId : "$questionId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$teacherId", "$$teacherId"],
            },
            {
              $eq: ["$batchId", "$$batchId"],
            },
            {
              $eq: ["$semesterId", "$$semesterId"],
            },
						{
              $eq: ["$questionId", "$$questionId"],
            }
            ]
          }
        }
      }],
      as: "feedback"
    }
  },
  	{
       $unwind: {
           path: '$feedback',
           preserveNullAndEmptyArrays: false
       }
   },
		 {
       $addFields: {
           studentId: {
               $toObjectId: "$feedback.studentId"
           }
       }
   },
		{
       $lookup: {
           from: "users",
           localField: "studentId",
           foreignField: "_id",
           as: "student"
       }
   },
		{
       $addFields: {
           batchId: {
               $toObjectId: "$feedback.batchId"
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
   {
    $unwind: {
        path: '$batch',
        preserveNullAndEmptyArrays: false
    }
},
{
  $addFields: {
      courseId: {
          $toObjectId: "$batch.courseId"
      }
  }
},
{
  $lookup: {
      from: "collegecourses",
      localField: "courseId",
      foreignField: "_id",
      as: "course"
  }
},
	 {
       $addFields: {
           semId: {
               $toObjectId: "$feedback.semesterId"
           }
       }
   },
	 {
       $lookup: {
           from: "semesterNew",
           localField: "semId",
           foreignField: "_id",
           as: "semester"
       }
   },
	 {
       $addFields: {
           tecId: {
               $toObjectId: "$feedback.teacherId"
           }
       }
   },
	 {
       $lookup: {
           from: "users",
           localField: "tecId",
           foreignField: "_id",
           as: "teacher"
       }
   }, 
]).then(data=>{
  if(data){
    data.map(elm=>{
      view_data.push({
        studentName : elm.student[0].fullName, 
        QuestionNo :  elm.questionId,
        Qusetion : elm.questions,
        Review : elm.feedback.feedback,
        Comment : elm.feedback.Comment ? elm.feedback.Comment : ''
       })
    })
    var view_data_asc = vd(view_data, 'Feedback');
    var xls = json2xls(view_data_asc);
    var currentPath = process.cwd();
    fs.writeFileSync(currentPath + "/src/public/excel_sheets/"+data[0].teacher[0].fullName+"_"+data[0].course[0].courseName +"_"+ data[0].batch.batchName +"_"+ data[0].batch.year+".xlsx", xls, 'binary');

    var file_name = data[0].teacher[0].fullName+"_"+data[0].course[0].courseName +"_"+ data[0].batch.batchName +"_"+ data[0].batch.year+".xlsx";
    var filepath = currentPath + "/src/public/excel_sheets/"+data[0].teacher[0].fullName+"_"+data[0].course[0].courseName +"_"+ data[0].batch.batchName +"_"+ data[0].batch.year+".xlsx";
    res.json({
      status: 200,
      data: filepath,
      filename :file_name
    });
  }
})
})
module.exports = router;