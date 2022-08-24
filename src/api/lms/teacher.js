var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var vd = require('sort-objects-array');
var QuestionsSchema = require('../../app/models/question');
var questionModel = mongoose.model('Questions');
var mcqSchema = require('../../app/models/MCQ');
var mcqModel = mongoose.model('MCQ');
var mcqScoreSchema = require('../../app/models/mcqScore');
var mcqScoreModel = mongoose.model('MCQScore');
var CourseSchema = require('../../app/models/course');
var courseModel = mongoose.model('Course');
var studentDivisionSchema = require('../../app/models/studentDivision');
var studentDivisionModel = mongoose.model('StudentDivision');
require('../../app/models/chapter');
var chapterModel = mongoose.model('Chapter');
var userSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var shortid = require("shortid");
var root_path = path.dirname(require.main.filename);
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var SemesterNewSchema = require('../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
var BatchMasterSchema = require('../../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
var StudentBatchSchema = require('../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var notification_function = require('./../../utils/function');
require('../../app/models/teacher');
var teachersModel = mongoose.model('Teacher');
var moment = require('moment');
require('../../app/models/newtimetable');
var NewTimeTableModel = mongoose.model('NewTimeTable');
var json2xls = require('json2xls');
var fs = require('fs');
var h2p = require('html2plaintext');
var self_PDF = require('../lms/pdfMake');
require('../../app/models/EmailTracker');
var EmailTrackerModel = mongoose.model('EmailTracker');
//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

const config = require('config');
var sendgrid = require('@sendgrid/mail');
const { key } = config.get('sendGrid');
const sengrid_key = key;
router.post('/addQuestion', function (req, res) {
    var today = Date.now();
    var questionEvent = new questionModel({

        Id: shortid.generate(),
        question: req.body.question,
        createdOn: today,
        updatedOn: today
    })
    questionEvent.save(function (err, result) {
        if (err) {

        }
        res.send(err + "result @@@@@@@@@@@@@@" + result);
    });

})

router.get("/getQuestion", function (request, response) {

    questionModel.find((err, data) => {

        if (err) return response.status(500).send(err)
        return response.status(200).send(data);
    });
});

router.post('/updateMCQ1', function (req, res) {
    mcqModel.find({
        "set._id": req.body.questionId
    }).then(mcq => {
        mcq[0]['set'].forEach(setData => {

            if (setData['_id'] == req.body.questionId) {

                setData['question'] = req.body.question
                setData['options'] = req.body.options
                setData['answer'] = req.body.answer
                mcq[0].save();
                res.json({
                    status: 200
                })
            }
        })

    })
})

router.get("/getMCQ", function (request, response) {

    mcqModel.find((err, data) => {
        if (err) return response.status(500).send(err)
        return response.status(200).send(data);
    });
});

router.post('/showQuestion', function (req, res) {


    let checkData = req.body.data
    let id = req.body.id

    if (req.body.data == true) {

        questionModel.findByIdAndUpdate(id,
            { showQuestion: checkData },
            function (err, questionModel) {
                if (err) throw err;


            });

    } else if (req.body.data == false) {

        questionModel.findByIdAndUpdate(id,
            { showQuestion: checkData },
            function (err, questionModel) {
                if (err) throw err;


            });
    }


})

router.post('/showMCQ2student', function (req, res) {
    let checkData = req.body.value
    let id = req.body.id
    if (req.body.value == true) {
        mcqModel.findByIdAndUpdate(id,
            { showQuestion: checkData },
            function (err, mcqModel) {
                if (err) throw err;


            });

    } else if (req.body.value == false) {
        mcqModel.findByIdAndUpdate(id,
            { showQuestion: checkData },
            function (err, mcqModel) {
                if (err) throw err;


            });
    }


})

router.delete('/deleteQuestinn/:ID', function (request, response) {
    var today = Date.now();
    var db;
    var ques_id = request.params.ID;
    var myquery = { id: ques_id };
    mongoClient.connect(url, function (err, client) {
        if (err) {
        } else {

            var collection = client.db('final').collection('events');
            collection.deleteOne({

                myquery
            }, function (err, results) {
            });


        }
    });
})

router.delete('/deleteQuestin/:ID', function (request, response) {
    var today = Date.now();
    var db;
    var ques_id = request.params.ID;

    questionModel.remove({ _id: ques_id }, function (err) {
        if (!err) {
        }
        else {
        }
    });

})

router.get("/studentQuestn", function (req, res) {
    var data;
    questionModel.find({ showQuestion: "true" }, (err, data) => {
        if (data !== null) {

            cres.send({
                status: 200,
                data: data
            })
        } else {
            res.send({
                status: 400

            })
        }

    });
});


router.get('/allcourse', function (req, res) {
    courseModel.find({}).select('courseName subjects').exec((err, data) => {
        if (data !== null) {
            res.send({
                status: 200,
                data: data
            })
        } else {
            res.send({
                status: 400

            })
        }
    })
})

router.post('/storeMCQS', function (req, res) {
    body_data = req.body.data

    body_data.forEach(element => {
        var mcqEvent = new mcqModel({

            Id: shortid.generate(),
            question: element.question,
            option1: element.option1,
            option2: element.option2,
            Option3: element.option3,
            option4: element.option4,
            Answer: element.Answer,
        })

        mcqEvent.save(function (err, result) {
            if (err) {
                // response.send("error "+err);
            } else {

            }

        });


    });
    res.send({
        status: 200
    })



});

router.get('/getStudentScores', function (req, res) {
    var studentData = [];
    var data = {
        quizName: '',
        studentData: []
    }
    var finalData = [];
    mcqModel.find({
        chapterId: req.query.chapterId
    }).then(function (mcqs) {
        if (mcqs.length > 0) {
            mcqs.forEach(mcq => {
                chapterModel.findById(req.query.chapterId).then(function (chapter) {
                    studentDivisionModel.find({
                        courseId: chapter.courseId
                    }).then(function (students) {
                        students.forEach(student => {
                            var scoreDetails = {
                                name: '',
                                email: '',
                                score: '',
                                outOf: ''
                            };
                            userModel.findById(student.studentId).then(function (user) {
                                mcqScoreModel.findOne({
                                    user_id: user._id,
                                    mcq_id: mcq._id
                                }).then(function (mcqScore) {
                                    scoreDetails.name = user.fullName;
                                    scoreDetails.email = user.email;
                                    scoreDetails.score = (mcqScore) ? mcqScore.score : '-';
                                    scoreDetails.outOf = (mcqScore) ? mcqScore.outOf : '-';
                                });
                            });
                            setTimeout(() => {
                                studentData.push(scoreDetails);

                            }, 500)

                        });
                        data.quizName = mcq.name;
                        data.studentData = studentData;
                        finalData.push(data);
                    })
                })
            })
            setTimeout(() => {
                console.log(JSON.stringify(finalData));
                res.json({
                    status: 200,
                    mcqData: mcqs,
                    studentData: finalData
                })
            }, 2500)
        } else {
            mcqData = null;
        }
    })
})


router.get('/getMcqs', function (req, res) {
    mcqModel.findOne({
        course_id: req.query.course_id,
        subject: req.query.subject,
        semester_id: req.query.semesterId
    }).then(function (mcqs) {
        if (mcqs) {
            res.json({
                status: 200,
                data: mcqs
            })
        } else {
            res.json({
                status: 200,
                data: null
            })
        }
    })
})

router.post('/addMCQ', function (req, res) {
    addMCQ(req.body)
    var today = Date.now();
    var question = req.body.question.replace(new RegExp('\r?\n','g'), '<br/>');
    if (req.body.update == 'true') {
        mcqModel.findById(req.body.quizName).then(function (mcq) {
            mcq.update({
                '$addToSet': {
                    set: [{
                        question: req.body.question,
                        options: req.body.options,
                        answer: req.body.answer,
                    }],
                }
            }).then(function (updateMcq) {
                res.json({
                    status: 200
                })
            })
        })
    } else if (req.body.update == 'false') {
        var mcqEvent = new mcqModel({
            Id: shortid.generate(),
            chapterId: req.body.chapterId,
            name: req.body.quizName,
            set: [{
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer,
            }],
            createdOn: today,
            updatedOn: today
        })
        mcqEvent.save(function (err, result) {
            if (err) {
                res.json({
                    status: 400
                })
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
                                        var activity_action = "Added Quiz.";
                                        var activity_data = userdetails[0].fullName + " Added Quiz for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                                        notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                                    }
                                })
                                studentBatchModel.find({
                                    courseId: chapter[0].courseId,
                                    batchId: batch[0]._id
                                }).then(function (studentData) {
                                    var action = "Admin Added Quiz.";
                                    var notification_data = " Added Quiz for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                                    studentData.forEach(function (student) {
                                        notification_function.notification(action, notification_data, student.studentId);
                                    });
                                })
                            })
                        })
                        //   studentBatchModel.find({
                        //     courseId:chapter[0].courseId
                        //   }).then(function(studentData){
                        //     var action = "Admin Added Quiz.";
                        //     var notification_data =" Added Quiz for Chapter "+chapter[0].chapterName+" and Subject "+chapter[0].subject;
                        //     studentData.forEach(function(student){
                        //       notification_function.notification(action, notification_data, student.studentId);
                        //     });
                        //   })
                    }
                })
                res.json({
                    status: 200
                })
            }
        });
    }

})
async function addMCQ(body) {
    var today = Date.now();
    if (body.update == 'true') {
        models.mcqs.find({
            where: {
                name: body.quizName
            }
        }).then(mcq => {
            if(mcq){
                mcq.update({
                    sets: [{
                        question: body.question,
                        options: body.options,
                        answer: body.answer,
                    }],
                })
            }
          
        })
    } else if (body.update == 'false') {
        var chapter = await getId.getChapterId(body.chapterId, '')
        models.mcqs.create({
            chapterId: chapter.id,
            name: body.quizName,
            sets: [{
                question: body.question,
                options: body.options,
                answer: body.answer,
            }],
        }).then(mcqCreate => {
            // if (mcqCreate) {
            //     models.chapters.getSubject(chapter.id).then(chapter => {  
            //         if (chapter.length > 0) {
            //             models.batchsemester.findAll({
            //                 where: {
            //                     semesterId: chapter[0].semesterId
            //                 }
            //             }).then(batchsem => {
            //                 // console.log("batchsem",batchsem)
            //                 models.studentbatches.findAll({
            //                     where: {
            //                         batchId: batchsem.batchId,
            //                         courseId: batchsem.courseId
            //                     }
            //                 }).then(async studentData => {

            //                     var action = "Admin Added Quiz.";
            //                     var notification_data = " Added Quiz for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
            //                     studentData.forEach(function (student) {
            //                         notification_function.notification(action, notification_data, student.studentId);
            //                     });
            //                     var user = await getId.getUserId(body.user_id, '')
            //                     models.users.findAll({
            //                         where: {
            //                             id: user.id
            //                         }
            //                     }).then(userdetails => {
            //                         if (userdetails) {
            //                             var activity_action = "Added Quiz.";
            //                             var activity_data = userdetails[0].fullName + " Added Quiz for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
            //                             notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0].id);
            //                         }
            //                     })


            //                 })
            //             })
            //         }
            //     })
            // }
        })
    }
}
router.post('/setScore', function (req, res) {
    setScore(req)
    var today = Date.now();
    mcqScoreModel.findOne({
        mcq_id: req.body.mcq_id,
        user_id: req.body.user_id
    }).then(function (mcqScore) {
        if (mcqScore) {
            mcqScore.update({
                score: req.body.score,
                outOf: req.body.outOf,
            }).then(function (updatedMcqScore) {
                res.json({
                    status: 200
                })
            })
        } else {
            var mcqScoreEvent = new mcqScoreModel({
                mcq_id: req.body.mcq_id,
                user_id: req.body.user_id,
                score: req.body.score,
                outOf: req.body.outOf
            });
            mcqScoreEvent.save(function (err, result) {
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
        }
    })
})
async function setScore(req) {
    mcqModel.find({
        _id: req.body.mcq_id
    }).then(async mcq => {
        var chapter = await getId.getChapterId(mcq.chapterId, '')
        models.mcqs.find({
            where: {
                chapterId: chapter.id,
                name: mcq.name
            }
        }).then(async data => {
            if (data) {
                var user = await getId.getUserId(req.body.user_id, '')
                models.mcqscores.find({
                    where: {
                        id: data.id,
                        userId: user.id
                    }
                }).then(mcqScroe => {
                    if (mcqScroe) {
                        mcqScroe.update({
                            score: req.body.score,
                            outOf: req.body.outOf,
                        }).then(update => {
                            console.log(update)
                        })
                    } else {
                        models.mcqscores.create({
                            mcq_id: data.id,
                            user_id: user.id,
                            score: req.body.score,
                            outOf: req.body.outOf
                        }).then(createdData => {
                            console.log(createdData)
                        })
                    }
                })
            }

        })
    })
}
router.get('/getQuizData', function (req, res) {
    mcqModel.find({
        chapterId: req.query.chapterId
    }).then(function (quizes) {
        if (quizes.length > 0) {
            res.json({
                status: 200,
                data: quizes
            })
        } else {
            res.json({
                status: 400,
                data: null
            })
        }
    })
})

router.get('/getTeachersTracking', async function (req, res) {
    var viewData = [];
    await teachersModel.aggregate([
        {
            $addFields: {
                id: {
                    $toObjectId: "$teacher_id",
                },
            },
        },
        {
            $match: {
                teacher_id: {
                    $eq: req.query.id
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $addFields: {
                semId: {
                    $toObjectId: "$semesterId",
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
            "$lookup": {
                "from": "chapters",
                let: {
                    semId: { $toString: "$semesterId" },
                    subject: "$subject"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$semesterId", "$$semId"],
                            },
                            {
                                $eq: ["$subject", "$$subject"],
                            }
                            ]
                        }
                    }
                }],
                as: "chapters",
            }
        },
        {
            $project: {
                completed: {
                    $size: {
                        $filter: {
                            input: "$chapters",
                            as: "att",
                            cond: {
                                $and: {
                                    $eq: ["$$att.completed", 'true'],

                                }
                            },

                        },
                    }
                },
                "user._id": 1,
                "user.fullName": 1,
                "user.email": 1,
                "subject": 1,
                "course_id": 1,
                "semesterId": 1,
                "teacher_id": 1,
                "semesters": "$semesters",
                "total": {
                    "$size": "$chapters"
                },

            }

        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            $arrayElemAt: ["$user", 0],
                        },
                        "$$ROOT",
                    ],
                },
            },
        },
        {
            $project: {
                user: 0,
            },
        },

    ]).then(async function (teachers) {
        await teachers.forEach(function (teacher) {
            viewData.push({
                completed: Math.floor(teacher.completed / teacher.total * 100),
                total: teacher.total,
                subject: teacher.subject,
                courseId: teacher.course_id,
                semesterId: teacher.semesterId,
                teacher_id: teacher.teacher_id,
                fullName: teacher.fullName,
                semesterName: teacher.semesters[0].semesterName,
            })
        });
        setTimeout(() => {
            if (teachers.length > 0) {
                res.json({
                    status: 200,
                    data: viewData
                })
            } else {
                res.json({
                    status: 400,
                    data: null
                })
            }
        }, 1000);
    })
})

router.get('/getTeachers', function (req, res) {
    userModel.find({
        role: "teacher"
    }).then(function (users) {
        res.json({
            status: 200,
            data: users
        })
    })
})


router.get('/getTeacherLectureData', (req, res) => {
    var totalMinutes;
    var data1 = [];
    teachersModel.aggregate([{
        $match: {
            teacher_id: req.query.teacherId
        }
    },
    {
        $addFields: {
            courseId: {
                $toObjectId: "$course_id"
            }

        }
    },
    {
        $lookup: {
            from: "newtimetables",
            let: {
                courseId: "$course_id",
                userId: "$teacher_id",
                semester_id: "$semesterId",
                startDate: req.query.startDate,
                endDate: req.query.endDate
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
                            $eq: ["$semester_id", "$$semester_id"],
                        },
                        {
                            $gte: ["$date", "$$startDate"]
                        },
                        {
                            $lte: ["$date", "$$endDate"]
                        }

                        ]
                    }
                }
            }],
            as: "timeTable"
        }
    },

    {
        $lookup: {
            from: "collegecourses",
            localField: "courseId",
            foreignField: "_id",
            as: "Course"
        }
    },
    {
        $addFields: {
            batchId: {
                $toObjectId: "$batch_id"
            }

        }
    }, {
        $lookup: {
            from: "batchmasters",
            localField: "batchId",
            foreignField: "_id",
            as: "Batch"
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
        $lookup: {
            from: "semesterNew",
            localField: "semesterId",
            foreignField: "_id",
            as: "Semester"
        }
    },
    {
        $project: {
            "teacher_id": 1,
            "batch_id": 1,
            "semesterId": 1,
            "ratePerHour": 1,
            "subject": 1,
            "timeTable": 1,
            "Course.courseName": 1,
            "Batch.batchName": 1,
            "Batch.year": 1,
            "Semester.semesterName": 1,
        }
    }
    ]).then(data => {
        data.forEach(elm => {
            if(elm.timetable.length > 0){

            var totalTime = 0;
            elm.timeTable.forEach(element => {
                const MOMENT = require('moment');
                const TimeDiff = (startTime, endTime, format) => {

                    startTime = MOMENT(startTime, 'YYYY-MM-DD HH:mm:ss');
                    endTime = MOMENT(endTime, 'YYYY-MM-DD HH:mm:ss');
                    return endTime.diff(startTime, format);
                }

                date = element.date;
                fromTime = element.fromTime;
                toTime = element.toTime;
                var start = date + " " + fromTime;
                var end = date + " " + toTime;

                let startTime = new Date(start);
                let endTime = new Date(end);
                if (element.totalMinutes > 0) {
                    totalMinutes = element.totalMinutes
                } else {
                    totalMinutes = TimeDiff(startTime, endTime, 'minutes');
                }

                totalTime = totalTime + parseInt(totalMinutes);
            })
        }

            var d = totalTime;
            var h = Math.floor(d / 60);
            var m = Math.floor(d % 60 % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";

            data1.push({
                subject: elm.subject,
                teacherName: elm.timeTable[0].teacherName,
                hours: hDisplay ? hDisplay : '0 hours',
                min: mDisplay ? mDisplay : '0 minutes',
                courseName: elm.Course[0].courseName,
                semesterName: elm.Semester[0].semesterName,
                batchName: elm.Batch[0].batchName,
                batchYear: elm.Batch[0].year

            })

        })
        if (data1) {
            var studentInfo_asc = vd(data1, "Name");
            var xls = json2xls(studentInfo_asc);
            var currentPath = process.cwd();
            fs.writeFileSync(
                currentPath +
                "/src/public/excel_sheets/TeacherLectureData" +
                req.query.startDate + "to" + req.query.endDate +
                ".xlsx",
                xls,
                "binary"
            );
            var file_name = "TeacherLectureData.xlsx";
            var filepath =
                currentPath +
                "/src/public/excel_sheets/TeacherLectureData" +
                req.query.startDate + "to" + req.query.endDate +
                ".xlsx";
            res.json({
                status: 200,
                filepath: filepath,
                data: data1
            });
        }

    })

});


router.get('/getAllTeacherMonthData', (req, res) => {
    var data1 = []
    semesterNewModel.aggregate([{
        $match: {
            semesterStatus: 'true'
        }
    },
    {
        $addFields: {
            semesterId: {
                $toString: "$_id"
            }

        }
    },
    ]).then(sem => {
        sem.forEach(async elm => {

            var data1
            data1 = await notification_function.hoursCalculate(elm.semesterId)
            if (data1.length > 0) {
                sendgrid.setApiKey(sengrid_key);
                var teacherData = {
                    data: data1
                }
                var emailOptions = {
                    to: "abhay@edulab.in",
                    toName: "Admin",
                    subject: `${moment().subtract(1, 'months').format('MMMM-YYYY')} Teacher Analaytic ${data1[0].courseName} / ${data1[0].batchName}  (${data1[0].batchYear}) / ${data1[0].semesterName}`,
                    template: process.cwd() + '/src/utils/TeacherCron.jade',
                    data: teacherData
                };

                require('fs').readFile(emailOptions.template, 'utf8', function (err, file) {
                    console.log("++++++++++22++++++++++++++++++" + err);

                    //if (err) return callback(err);

                    var fn = require('jade').compile(file);
                    var html = fn(emailOptions.data);

                    var mailOptions = {
                        from: 'updates@sdbi.in',
                        fromname: "School of data science and business intelligence",
                        to: emailOptions.to,
                        toname: (emailOptions.toName != null) ? emailOptions.toName : '',
                        subject: emailOptions.subject,
                        html: html
                    };
                    sendgrid.send(mailOptions, function (err, json) {
                        if (err) {
                            console.log("++++++++++44++++++++++++++++++", err);
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

                                }

                            })
                            // callback();
                        }
                    });
                });
                data1 = []

            }
        })
        res.json({
            status: 200,
        });
    })

})

router.get('/getAllTeacherWeekData', (req, res) => {
    var data1 = []
    semesterNewModel.aggregate([{
        $match: {
            semesterStatus: 'true'
        }
    },
    {
        $addFields: {
            semesterId: {
                $toString: "$_id"
            }

        }
    },
    ]).then(sem => {
        sem.forEach(async elm => {

            var data1
            data1 = await notification_function.hoursCalculate(elm.semesterId)
            if (data1.length > 0) {
                sendgrid.setApiKey(sengrid_key);
                var teacherData = {
                    data: data1
                }
                var emailOptions = {
                    to: "abhay@edulab.in",
                    toName: "Admin",
                    subject: `${ moment().format('DD-MMM-YYYY')}  Teacher Analaytic [ ${data1[0].courseName} / ${data1[0].batchName}  (${data1[0].batchYear}) / ${data1[0].semesterName}]`,
                    template: process.cwd() + '/src/utils/TeacherCron.jade',
                    data: teacherData
                };

                require('fs').readFile(emailOptions.template, 'utf8', function (err, file) {

                    //if (err) return callback(err);

                    var fn = require('jade').compile(file);
                    var html = fn(emailOptions.data);

                    var mailOptions = {
                        from: 'updates@sdbi.in',
                        fromname: "School of data science and business intelligence",
                        to: emailOptions.to,
                        toname: (emailOptions.toName != null) ? emailOptions.toName : '',
                        subject: emailOptions.subject,
                        html: html
                    };
                    sendgrid.send(mailOptions, function (err, json) {
                        if (err) {
                            console.log("++++++++++44++++++++++++++++++", err);
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

                                }

                            })
                          //  callback();
                        }
                    });
                });
                data1 = []

            }
        })
        res.json({
            status: 200,
        });
    })
})

router.get('/getTeacherSelectData', (req, res) => {
    NewTimeTableModel.find({
        cancelByUser: req.query.teacherId,
        approval: 'Rejected'
    }).then(function (data) {
        if (data.length > 0) {
            res.json({
                status: 200,
                data: data
            })
        } else {
            res.json({
                status: 400,
                message: "Wrong Details"
            })
        }
    })
});

router.get('/getTeachersByCourse', function (req, res) {
    var teachers = [];
    teachersModel.find({
        semesterId: req.query.semid,
        course_id: req.query.courseid

    }).populate('teacher_id', ['fullName']).then(function (teacher_id) {
        if (teacher_id != null || teacher_id == true) {
            teacher_id.forEach(element => {
                teachers.push({
                    teacher_id: element.teacher_id._id,
                    teacherName: element.teacher_id.fullName,
                })
            })
            res.json({
                status: 200,
                data: teachers
            })
        } else {
            res.json({
                status: 400,
                message: "No Sems found..."
            })
        }
    })
});

router.get('/getTeacherLectureAnalytic', function (req, res) {
    NewTimeTableModel.aggregate([
        {
            $match: {
                semester_id: req.query.semid,
                course_id: req.query.courseid,
                teacher_id: req.query.teachId
            }
        }, {
            $addFields: {
                timetableId: {
                    $toString: "$_id",
                },
            },
        },


        {
            $lookup: {
                from: "topicofthedays",
                localField: "timetableId",
                foreignField: "timeTableId",
                as: "topic",
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        $arrayElemAt: ["$topic", 0]
                    }, "$$ROOT"]
                }
            }
        },
        {
            $group: {
                _id: {
                    COURSE: "$course_id",
                    SEMESTER: "$semesterId",
                    SUBJECT: "$subject",
                    BATCH: "$batch_id",
                    TEACHER: "$teacher_id"
                },
                count: {
                    "$sum": 1
                }
            }
        },
    ]).then(data => {
        if (data.length > 0) {
            res.json({ status: 200, message: 'datacolllected ', data: data })

        } else {
            res.json({ status: 400, message: "no data found" })
        }
    })
})


router.get('/getSubjectAnalytic', function (req, res) {
    NewTimeTableModel.aggregate([
        {
            $match: {
                subject: req.query.subject,
                course_id: req.query.courseid,
                teacher_id: req.query.teachId,
                batch_id: req.query.batchid
            }
        }, {
            $addFields: {
                timetableId: {
                    $toString: "$_id",
                },
            },
        },


        {
            $lookup: {
                from: "topicofthedays",
                localField: "timetableId",
                foreignField: "timeTableId",
                as: "topic",
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        $arrayElemAt: ["$topic", 0]
                    }, "$$ROOT"]
                }
            }
        },
    ]).then(data => {
        if (data.length > 0) {
            res.json({ status: 200, message: 'datacolllected ', data: data })
        } else {
            res.json({ status: 400, message: "no data found" })
        }
    })
})
module.exports = router;