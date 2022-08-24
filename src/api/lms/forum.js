var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');

var fs = require('fs');

const Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs;

var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');

var EnrollmentSchema = require('../../app/models/enrollment');
var enrollmentModel = mongoose.model('Enrollment');

var QuestionSchema = require('../../app/models/question');
var questionModel = mongoose.model('Questions');

var QuestionAnswerSchema = require('../../app/models/question_answer');
var questionanswerModel = mongoose.model('QuestionAnswer');

var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');

var NewDivisionSchema = require('../../app/models/newDivision')
var newDivisionModel = mongoose.model('newDivision');

var StudentBatchSchema = require('../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');

var TeacherSchema = require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');




const config = require('config');
const { filelink } = config.get('api');
require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');

var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');

var SemesterNewSchema = require('../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');

var utilFunction = require('../../utils/function')

var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();
var multer = require('multer');
router.get("/getCourseWiseTopic", function (req, res) {
    var dataset = [];
    questionModel.find({})
        .sort({ 'createdOn': -1 }).exec(function (err, datas) {
            if (err) {
                res.send({
                    status: 400,
                    err: err
                })
            } else {

                if (datas) {
                    datas.forEach(function (data) {
                        questionanswerModel.find({
                            question_id: data._id
                        }).then(function (answer) {
                            userModel.findOne({ "_id": data.user_id }).then(function (user) {
                                if (user) {
                                    dataset.push({
                                        question_id: data._id,
                                        user_email: user.email,
                                        user_name: user.fullName,
                                        question: data.question,
                                        created_at: moment(data.createdOn).format("DD/MM/YYYY"),
                                        course_id: data.course_id,
                                        sem_id: data.sem_id,
                                        chapterName: data.chapterName,
                                        viewCount: data.viewCount,
                                        answerCount: answer.length
                                    })
                                }
                            })
                        })
                    })
                    setTimeout(() => {

                        res.send({
                            status: 200,
                            data: dataset
                        })
                    }, 2000);
                } else {
                    res.send({
                        status: 200,
                        data: dataset
                    })
                }
            }
        });



});


router.get("/getTopicWiseAnswer", function (req, res) {
    var dataset = [];
    var question_data;
    var created_by;
    questionModel.findOne({ "_id": req.query.question_id }).then(function (ques) {
        question_data = ques.question;
        userModel.findOne({ "_id": ques.user_id }).then(function (user) {
            created_by = user.fullName;
        })

        questionanswerModel.find({ "question_id": req.query.question_id }).then(function (datas) {
            if (datas) {
                datas.forEach(function (data) {
                    userModel.findOne({ "_id": data.user_id }).then(function (user) {

                        dataset.push({
                            answer_id: data.id,
                            user_email: user.email,
                            user_name: user.fullName,
                            answer: data.answer,
                            filename: data.name,
                            doc_id: data.doc_id,
                            type: data.type,
                            path: data.path ? `${filelink}/files/+${data.path}` : '',
                            created_at: moment(data.createdOn).format("DD/MM/YYYY"),
                            file_link: data.doc_id ? `${filelink}/api/viewCourse/download?document_id=${data.doc_id}` : '',
                        })
                    })
                })
                setTimeout(() => {
                    res.send({
                        status: 200,
                        data: dataset,
                        question_data: question_data,
                        created_by: created_by
                    })
                }, 2000);

            }
        })
    })

})

router.post('/upload', async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;
    var today = Date.now();

    var semId = req.body.sem_id;
    var courseId = req.body.course_id;
    var chapterName = req.body.chapterName;
    var notificationData = `Started a new discussion on ${req.body.chapterName}`;
    var action = 'New Discussion started';

    if (file) {
        let writeStream = gfs.createWriteStream({
            filename: `${file.name}`,
            mode: 'w',
            content_type: file.mimetype
        })

        writeStream.on('close', function (uploadedFile) {
            var viewCount = 0;
            var questionData = new questionModel({
                question: req.body.discussionName,
                user_id: req.body.user_id,
                course_id: req.body.course_id,
                sem_id: req.body.sem_id,
                chapterName: req.body.chapterName,
                viewCount: viewCount,
                createdOn: today,
                updatedOn: today
            });

            questionData.save(function (err, result) {
                if (err) {
                    res.send({
                        status: 400,
                        message: err
                    })

                } else {

                    var questionanswerData = new questionanswerModel({
                        answer: req.body.content,
                        user_id: req.body.user_id,
                        question_id: result._id,
                        createdOn: today,
                        updatedOn: today,
                        doc_id: uploadedFile._id,
                        length: uploadedFile.length,
                        name: uploadedFile.filename,
                        type: uploadedFile.contentType
                    });

                    questionanswerData.save(function (err, data) {
                        if (err) {
                            res.send({
                                status: 400,
                                message: err
                            })

                        } else {
                            res.send({
                                status: 200,
                                data: data
                            })

                            //Updating the notification collection
                            newDivisionModel.find({
                                semesterId: semId,
                                courseId: courseId
                            }).exec((err, batches) => {
                                if (err) {
                                    console.log(`\n\n Error: ${err} \n\n`);
                                }

                                batches.forEach(batch => {
                                    studentBatchModel.find({
                                        batchId: batch.batchId
                                    }).then((students) => {
                                        // students.forEach( student => {
                                        //     utilFunction.notification(action,notificationData,student.studentId)

                                        // });
                                    })
                                });
                            })

                            //Adding notification for teachers

                            teacherModel.find({
                                semesterId: semId,
                                subject: chapterName
                            }).exec(teachers => {
                                if (teachers) {
                                    // teachers.forEach( teacher => {
                                    //     utilFunction.notification(action,notificationData,teacher.teacher_id);
                                    // })
                                }

                            })


                        }
                    });
                }
            });
        });
        writeStream.write(file.data);
        writeStream.end();
    } else {
        var viewCount = 0;
        var questionData = new questionModel({
            question: req.body.discussionName,
            user_id: req.body.user_id,
            course_id: req.body.course_id,
            sem_id: req.body.sem_id,
            chapterName: req.body.chapterName,
            viewCount: viewCount,
            createdOn: today,
            updatedOn: today
        });

        questionData.save(function (err, result) {
            if (err) {
                res.send({
                    status: 400,
                    message: err
                })

            } else {

                var questionanswerData = new questionanswerModel({
                    answer: req.body.content,
                    user_id: req.body.user_id,
                    question_id: result._id,
                    createdOn: today,
                    updatedOn: today
                });

                questionanswerData.save(function (err, data) {
                    if (err) {
                        res.send({
                            status: 400,
                            message: err
                        })

                    } else {
                        res.send({
                            status: 200,
                            data: data
                        })

                        //Updating the notification collection
                        newDivisionModel.find({
                            semesterId: semId,
                            courseId: courseId
                        }).exec((err, batches) => {
                            if (err) {
                                console.log(`\n\n Error: ${err} \n\n`);
                            }


                            batches.forEach(batch => {
                                studentBatchModel.find({
                                    batchId: batch.batchId
                                }).then((students) => {
                                    //    students.forEach( student => {
                                    //         utilFunction.notification(action,notificationData,student.studentId)

                                    //    });
                                })
                            });
                        })
                        //Adding notification for teachers

                        teacherModel.find({
                            semesterId: semId,
                            subject: chapterName,
                            course_id: courseId

                        }).then(teachers => {
                            if (teachers) {
                                //  teachers.forEach( teacher => {
                                //     utilFunction.notification(action,notificationData,teacher.teacher_id);
                                //  })
                            }

                        })


                    }
                });
            }
        });
    }
    //SQL upload

    var today = Date.now();
    var course = await getId.getCourseId(req.body.course_id, '')
    var semester = await getId.getSemesterId(req.body.sem_id, '');
    var subject = await getId.getSubjectId(req.body.chapterName, course.id, semester.id)
    var user = await getId.getUserId(req.body.user_id, '')
    var semId = semester.id;
    var courseId = course.id;
    var subjectId = subject.id;
    var notificationData = `Started a new discussion on subject ${req.body.subject}`;
    var action = 'New Discussion started';
    var userId = user.id
    var content = req.body.content
    if (file) {
        var fileName = file.name;
        var type = file.mimetype;
        var length = file.size;
        var viewCount = 0;
     await   models.questions.create({
            question: req.body.discussionName,
            userId: userId,
            courseId: courseId,
            semesterId: semId,
            subjectId: subjectId,
            viewCount: viewCount,
        }).then(function (result) {
            if (result != '') {
                var currentPath = process.cwd();
                var dir = currentPath + '/src/public/forum/' + result.id + '/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var storage = multer.diskStorage({
                    filename: function (req, file, callback) {
                        console.log(file);
                        callback(null, file.originalname);
                        uploadFile = file.originalname;
                    },
                    destination: function (req, file, callback) {
                        callback(null, dir);
                    },

                });

                var upload = multer({
                    storage: storage,
                }).single('file');
                upload(req, res, function (err, data) {
                    fs.writeFile(dir + file.name, file.data, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                    models.questionanswers.create({
                        userId: userId,
                        questionId: result.id,
                        answer: content,
                        name: fileName,
                        filePath: currentPath + '/src/public/forum/' + result.id + '/' + fileName,
                        length: length,
                        type: type
                    }).then(function (questionAnswer) {
                        if (questionAnswer) {
                            models.division.findAll({
                                where: {
                                    courseId: courseId,
                                    semesterId: semId
                                }
                            }).then(function (divisions) {
                                divisions.forEach(division => {
                                    models.studentbatches.findAll({
                                        where: {
                                            batchId: division.batchId,
                                        }
                                    }).then(function (students) {
                                        students.forEach(student => {
                                            utilFunction.notification(action, notificationData, student.studentId)

                                        });
                                    })
                                });

                                //Adding notification for teachers

                                models.teachers.findAll({
                                    where: {
                                        semesterId: semId,
                                        subjectId: chapterName
                                    }
                                }).then(function (teachers) {
                                    if (teachers) {
                                        teachers.forEach(teacher => {
                                            utilFunction.notification(action, notificationData, teacher.teacherId);
                                        })
                                    }

                                })
                            })
                            // res.send({
                            //     status: 200,
                            //     data: questionAnswer
                            // })
                        } else {
                            // res.send({
                            //     status: 400,
                            //     message: "Error occured while updated question answer."
                            // })
                        }
                    })
                })
            }
        })
    } else {
        var viewCount = 0;
      await  models.questions.create({
            question: req.body.discussionName,
            userId: userId,
            courseId: courseId,
            semesterId: semId,
            subjectId: subjectId,
            viewCount: viewCount,
        }).then(function (result) {
            if (result != '') {
                models.questionanswers.create({
                    answer: req.body.content,
                    userId: userId,
                    questionId: result.id,
                }).then(function (data) {
                    if (data) {
                        models.division.findAll({
                            where: {
                                courseId: courseId,
                                semesterId: semId
                            }
                        }).then(function (divisions) {
                            divisions.forEach(division => {
                                models.studentbatches.findAll({
                                    where: {
                                        batchId: division.batchId,
                                    }
                                }).then(function (students) {
                                    students.forEach(student => {
                                        utilFunction.notification(action, notificationData, student.studentId)

                                    });
                                })
                            });

                            //Adding notification for teachers

                            models.teachers.findAll({
                                where: {
                                    semesterId: semId,
                                    subjectId: subjectId
                                }
                            }).then(function (teachers) {
                                if (teachers) {
                                    teachers.forEach(teacher => {
                                        utilFunction.notification(action, notificationData, teacher.teacherId);
                                    })
                                }

                            })
                        })

                        // res.send({
                        //     status: 200,
                        //     data: data
                        // })                                         
                    } else {
                        // res.send({
                        //     status: 400,
                        //     message: "Error occured while creating question answers."
                        // })
                    }
                })
            } else {
                // res.send({
                //     status: 400,
                //     message: "Error occured while creating forum."
                // })
            }
        })
    }
});


router.post("/addAnswer", async function (req, res) {
    gfs = Grid(connect.db);

    let { file } = req.files;
    var today = Date.now();

    var today = Date.now();
    if (file) {
        let writeStream = gfs.createWriteStream({
            filename: `${file.name}`,
            mode: 'w',
            content_type: file.mimetype
        })

        writeStream.on('close', function (uploadedFile) {

            var questionanswerData = new questionanswerModel({
                answer: req.body.content,
                user_id: req.body.user_id,
                question_id: req.body.question_id,
                createdOn: today,
                updatedOn: today,
                doc_id: uploadedFile._id,
                length: uploadedFile.length,
                name: uploadedFile.filename,
                type: uploadedFile.contentType
            });

            questionanswerData.save(function (err, data) {
                if (err) {
                    res.send({
                        status: 400,
                        message: "error while saving the data."
                    })

                } else {
                    res.send({
                        status: 200,
                        data: data
                    })
                }
            });
        });
        writeStream.write(file.data);
        writeStream.end();
    } else {
        var questionanswerData = new questionanswerModel({
            answer: req.body.content,
            user_id: req.body.user_id,
            question_id: req.body.question_id,
            createdOn: today,
            updatedOn: today
        });

        questionanswerData.save(function (err, data) {
            if (err) {
                res.send({
                    status: 400,
                    message: "error while saving the data."
                })
            } else {
                res.send({
                    status: 200,
                    data: data
                })
            }
        });

    }

    var today = Date.now();
    var user = await getId.getUserId(req.body.user_id, '')
    if (file) {
        var fileName = file.name;
        var type = file.mimetype;
        var length = file.size;
        var viewCount = 0;
        var currentPath = process.cwd();
        questionModel.find({
            _id: req.body.question_id
        }).then(async question => {
            var Course = await getId.getCourseId(question[0].course_id, '')
            var Semester = await getId.getSemesterId(question[0].sem_id, '');
            var Subject = await getId.getSubjectId(question[0].chapterName, Course.id, Semester.id)
            var User = await getId.getUserId(question[0].user_id, '')
         await   models.questions.find({
                where: {
                    courseId: Course.id,
                    semesterId: Semester.id,
                    userId: User.id,
                    subjectId: Subject.id,
                }
            }).then(que => {
                models.questionanswers.create({
                    userId: user.id,
                    questionId: que.id,
                    answer: req.body.content,
                    name: fileName,
                    filePath: currentPath + '/src/public/forum/' + que.id + '/' + fileName,
                    length: length,
                    type: type
                }).then(function (questionAnswer) {
                    console.log("questionAnswer")
                    var dir = currentPath + '/src/public/forum/' + que.id + '/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    var storage = multer.diskStorage({
                        filename: function (req, file, callback) {
                            console.log(file);
                            callback(null, file.originalname);
                            uploadFile = file.originalname;
                        },
                        destination: function (req, file, callback) {
                            callback(null, dir);
                        },
            
            
                    });
                    var upload = multer({
                        storage: storage,
                    }).single('file');
                    upload(req, res, function (err, data) {
                        fs.writeFile(dir + file.name, file.data, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });
                       
                    })
                })
            })
        })

       

    } else {
        questionModel.find({
            _id: req.body.question_id
        }).then(async question => {
            var Course = await getId.getCourseId(question[0].course_id, '')
            var Semester = await getId.getSemesterId(question[0].sem_id, '');
            var Subject = await getId.getSubjectId(question[0].chapterName, course.id, semester.id)
            var User = await getId.getUserId(question[0].user_id, '')
          await  models.questions.find({
                where: {
                    courseId: Course.id,
                    semesterId: Semester.id,
                    userId: User.id,
                    subjectId: Subject.id
                }
            }).then(que => {
                models.questionanswers.create({
                    answer: req.body.content,
                    user_id: user.id,
                    question_id: que.id,
                }).then(createqa => {
                    console.log("createqa")
                })
            })
        })
    }
});
router.get("/getDataForFilter", function (req, res) {
    var dataset = [];
    questionModel.find({
        course_id: req.query.course_id,
        sem_id: req.query.sem_id,
        chapterName: req.query.chapterName
    }).sort({ 'createdOn': -1 }).exec(function (err, datas) {
        if (err) {
            res.send({
                status: 400,
                err: err
            })
        } else {
            if (datas) {
                datas.forEach(function (data) {
                    questionanswerModel.find({
                        question_id: data._id
                    }).then(function (answer) {
                        userModel.findOne({ "_id": data.user_id }).then(function (user) {
                            dataset.push({
                                question_id: data._id,
                                user_email: user.email,
                                user_name: user.fullName,
                                question: data.question,
                                created_at: moment(data.createdOn).format("DD/MM/YYYY"),
                                course_id: data.course_id,
                                sem_id: data.sem_id,
                                chapterName: data.chapterName,
                                viewCount: data.viewCount,
                                answerCount: answer.length
                            })
                        })
                    })
                })
                setTimeout(() => {

                    res.send({
                        status: 200,
                        data: dataset
                    })
                }, 2000);
            } else {
                res.send({
                    status: 200,
                    data: dataset
                })
            }
        }
    });

});

router.put('/viewCountSave', function (req, res) {
    viewCountSave(req)
    var query = {
        _id: req.body.question_id,
    },
        update = {
            $set: {
                _id: req.body.question_id,
            },
            $inc: {
                viewCount: 1
            }
        };

    questionModel.updateMany(query, update, function (err, viewCount) {
        if (err) {
            console.error(err);
        } else {
            res.json({
                status: 200,
                data: viewCount
            });
        }
    });
});
async function viewCountSave(req) {
    questionModel.find({
        _id: req.body.question_id
    }).then(async question => {
        var course = await getId.getCourseId(question[0].course_id, '')
        var semester = await getId.getSemesterId(question[0].sem_id, '');
        var user = await getId.getUserId(question[0].user_id, '')
        models.questions.find({
            where: {
                userId: user.id,
                courseId: course.id,
                semesterId: semester.id,
                question: question[0].question
            }
        }).then(ques => {
            if (ques) {
                ques.update({
                    viewCount: ques.viewCount + 1
                }
                ).then(updateView => {
                    console.log("updateView")
                })
            }
        })
    })
}
module.exports = router;