const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const assign = require('../../../app/models/assignments');
const Assignments = mongoose.model('Assignments');
require('../../../app/models/newCourse')
var newCourseModel = mongoose.model('NewCourse');
var moment = require('moment');
require('../../../app/models/enrollmentdetails');
const courseEnrolledStudent = mongoose.model('EnrollmentDetail');
require('../../../app/models/collegeDepartment');
departmentModel = mongoose.model('CollegeDepartment');
require('../../../app/models/batchMaster');
batchMasterModel = mongoose.model('BatchMaster');
require('../../../app/models/division');
divisionModel = mongoose.model('Division');
require('../../../app/models/collegeCourse');
courseModel = mongoose.model('CollegeCourse');
require('../../../app/models/studentDivision');
studentDivisionModel = mongoose.model('StudentDivision');
require('../../../app/models/subject');
subjectModel = mongoose.model('Subject');
require('../../../app/models/user');
const userModel = mongoose.model('User');
require('../../../app/models/semester');
const semesterModel = mongoose.model('Semester');
var newDivisionSchema = require('../../../app/models/newDivision');
var newDivisionModel = mongoose.model('newDivision');
var StudentBatchSchema = require('../../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var SemesterNewSchema = require('../../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
var ObjectId = require('mongodb').ObjectID;
const Grid = require('gridfs-stream');
const logger = require('../../../utils/logger');
const notification = require('../../../utils/function')
const fileType = require('file-type');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
const fs = require('fs');
var gfs;
const config = require('config');
const {
    filelink
} = config.get('api');
require('../../../app/models/projectSubmission');
var projectSubmissionModel = mongoose.model('ProjectSubmission');
require('../../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
const caseStudy = require('../../../app/models/caseStudyAccess');
const caseStudyAccessModel = mongoose.model('CaseStudyAccess');
const cipher = require('../auth/cipherHelper');
const userService = require('../user/userService');
const {
    json
} = require('body-parser');
var emailService = require('../../../utils/emailService');
require('../../../app/models/uploadedProject');
const uploadedProject = mongoose.model('UploadedProject');
const path = require('path');
var CollegeCourseSchema = require('../../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var batchSemesterMaster = mongoose.model('BatchSemesterMaster');
var CollegeCourseSchema = require('../../../app/models/batchSemesterMaster');
//Sql
var root_path = path.dirname(require.main.filename);
var models = require('../../../models');
const getSqlId = require('./../../../utils/getSqlId');
var getId = new getSqlId();

router.post('/assignments', async (req, res) => {
    gfs = Grid(connect.db)
    let {
        file
    } = req.files;
    var date = req.body.assignmentDate;
    var currentPath = process.cwd();

    var stuDetails = JSON.parse(req.body.studentDetails);
    if (req.body.evaluators != undefined) {
        var evaluator = JSON.parse(req.body.evaluators);
    }
    var counter = 0;
    if (stuDetails.length == 0) {
        res.json({
            status: 404,
            message: 'No student got assignment'
        })
    }
    if (stuDetails.length > 0) {
        var cloneId = mongoose.Types.ObjectId();
        stuDetails.forEach(element => {
            if (JSON.stringify(cloneId) != null && JSON.stringify(cloneId) != undefined && JSON.stringify(cloneId) != "") {
                var dateFormat = date.replace('T18:30:00.000Z', '');
                let writeStream = gfs.createWriteStream({
                    filename: `${file.name}`,
                    mode: 'w',
                    content_type: file.mimetype
                })

                writeStream.on('close', function (uploadAssignments) {
                    let assignments = new Assignments({
                        courseId: req.body.courseId,
                        assignmentName: req.body.assignmentName,
                        Point: req.body.assignmentPoints,
                        DueDate: dateFormat,
                        BatchId: req.body.batchId,
                        subjects: req.body.subject,
                        userId: element.userId,
                        fullName: element.studentName,
                        groupId: cloneId,
                        doc_id: uploadAssignments._id,
                        fileLength: uploadAssignments.length,
                        name: uploadAssignments.filename,
                        type: uploadAssignments.contentType,
                        teacherName: req.body.teacherName,
                        role: req.body.role,
                        divisionName: req.body.divisionName,
                        teacherId: req.body.teacherId,
                        typeOfAssignment: req.body.typeofassignment

                    })
                    var query_params = "userId:" + req.body.userId + " , groupid:" + req.body.groupId;
                    assignments.save((err, data) => {
                        if (err) {
                            console.error(err)
                        } else {
                            if (data) {
                                counter++;
                                var action = "Assignment Notitfication";
                                var notificationData = "You have got new assignment of " + req.body.subject + " and due date is " + req.body.assignmentDate;
                                var userId = element.userId;
                                notification.notification(action, notificationData, userId, query_params, '')
                                if (counter == stuDetails.length) {
                                    res.json({
                                        status: 200
                                    })
                                }
                            }

                        }

                    })
                });
                writeStream.write(file.data);
                writeStream.end();

                if (req.body.teacher_id != 'undefined') {
                    var dateFormat = date.replace('T18:30:00.000Z', '');
                    let writeStream = gfs.createWriteStream({
                        filename: `${file.name}`,
                        mode: 'w',
                        content_type: file.mimetype
                    })

                    writeStream.on('close', function (uploadAssignments) {
                        let caseStudyAccess = new caseStudyAccessModel({
                            courseId: req.body.courseId,
                            assignmentName: req.body.assignmentName,
                            Point: req.body.assignmentPoints,
                            DueDate: dateFormat,
                            BatchId: req.body.batchId,
                            subjects: req.body.subject,
                            userId: element.userId,
                            fullName: element.studentName,
                            groupId: cloneId,
                            doc_id: uploadAssignments._id,
                            fileLength: uploadAssignments.length,
                            name: uploadAssignments.filename,
                            type: uploadAssignments.contentType,
                            teacherName: req.body.TeacherName,
                            role: req.body.teacherRole,
                            divisionName: req.body.divisionName,
                            teacherId: req.body.teacher_id,
                            typeOfAssignment: req.body.typeofassignment

                        })
                        caseStudyAccess.save((err, data) => {
                            if (err) {
                                console.error(err)
                            } else {
                                if (data) {
                                    counter++;
                                    var action = "Assignment Notitfication";
                                    var notificationData = "You have got new assignment of " + req.body.subject + " and due date is " + req.body.assignmentDate;
                                    var userId = element.userId;
                                    notification.notification(action, notificationData, userId)
                                    if (counter == stuDetails.length) {
                                        res.json({
                                            status: 200
                                        })
                                    }
                                }

                            }

                        })
                    });
                    writeStream.write(file.data);
                    writeStream.end();
                }
            }
        })

    }

    if (stuDetails.length > 0 && req.body.evaluators != undefined) {
        var cloneId = mongoose.Types.ObjectId();
        stuDetails.forEach(element => {
            evaluator.forEach(element1 => {
                if (JSON.stringify(cloneId) != null && JSON.stringify(cloneId) != undefined && JSON.stringify(cloneId) != "") {
                    var dateFormat = date.replace('T18:30:00.000Z', '');
                    let writeStream = gfs.createWriteStream({
                        filename: `${file.name}`,
                        mode: 'w',
                        content_type: file.mimetype
                    })

                    writeStream.on('close', function (uploadAssignments) {
                        let casrStudyAccess = new caseStudyAccessModel({
                            courseId: req.body.courseId,
                            assignmentName: req.body.assignmentName,
                            Point: req.body.assignmentPoints,
                            DueDate: dateFormat,
                            BatchId: req.body.batchId,
                            subjects: req.body.subject,
                            userId: element.userId,
                            fullName: element.studentName,
                            groupId: cloneId,
                            doc_id: uploadAssignments._id,
                            fileLength: uploadAssignments.length,
                            name: uploadAssignments.filename,
                            type: uploadAssignments.contentType,
                            teacherName: element1.evaluatorname,
                            role: element1.evaluatorrole,
                            divisionName: req.body.divisionName,
                            teacherId: element1.evaluatorid,
                            typeOfAssignment: req.body.typeofassignment

                        })
                        casrStudyAccess.save((err, data) => {
                            if (err) {
                                console.error(err)
                            } else {
                                if (data) {
                                    counter++;
                                    if (counter == stuDetails.length) {
                                        res.json({
                                            status: 200
                                        })
                                    }
                                }

                            }

                        })
                    });
                    writeStream.write(file.data);
                    writeStream.end();
                }
            });
        })

    }
    if (file) {
        var date = req.body.assignmentDate;
        var stuDetails = JSON.parse(req.body.studentDetails);
        var course = await getId.getCourseId(req.body.courseId, '')
        var semester = await getId.getSemesterId(req.body.semesterId, '');
        var batch = await getId.getBatchId(req.body.batchId, '')
        var subject = await getId.getSubjectId(req.body.subject, course.id, semester.id)
        var division = await getId.getDivisionId(req.body.divisionName, '')
        var user = await getId.getUserId(req.body.teacher_id, '')
        if (req.body.evaluators != undefined) {
            var evaluator = JSON.parse(req.body.evaluators);
        }
        if (file) {
            var fileName = file.name;
            var type = file.mimetype;
            var length = file.size;

            if (stuDetails.length == 0) {
                res.json({
                    status: 404,
                    message: 'No student got assignment'
                })
            }
            if (stuDetails.length > 0) {

              await  models.assignments.create({
                    courseId: course.id,
                    batchId: batch.id,
                    divisionId: division.id,
                    subjectId: subject.id,
                    teacherId: user.id,
                    role: req.body.teacherRole,
                    assignmentName: req.body.assignmentName,
                    dueDate: req.body.assignmentDate,
                    point: req.body.assignmentPoints,
                    fileName: fileName,
                    type: type,
                    fileLength: length,
                    typeOfAssignments: req.body.typeofassignment,
                }).then(assignment => {
                    if (assignment) {
                        stuDetails.forEach(async student => {
                            var studentId = await getId.getUserId(student.userId, '')
                            models.uploadedassignments.create({
                                assignmentId: assignment.id,
                                userId: studentId.id,
                                length: null,
                                fileName: '',
                                type: '',
                                assignmentName: assignment.assignmentName,
                                marksObtained: null,
                                uploaded: 'false',
                                viewStatus: 'false',
                                feedback: "",
                            }).then(upload => {
                                if (upload) {
                                    var dir = currentPath + '/src/public/assignment/' + assignment.id;

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
                                            callback(null, currentPath + '/src/public/assignment/' + assignment.id);
                                        },
                                    });

                                    var upload = multer({
                                        storage: storage,
                                    }).single('file');
                                    upload(req, res, function (err, data) {
                                        fs.writeFile(dir + '/' + file.name, file.data, function (err) {
                                            if (err) throw err;
                                        });
                                    })
                                    models.subject.find({
                                        where: {
                                            id: assignment.subjectId
                                        }
                                    }).then(async subject => {
                                        var student = await getId.getUserId(req.body.userId, '')
                                        var query_params = "userId:" + student.id;
                                        counter++;
                                        var action = "Assignment Notitfication";
                                        var notificationData = "You have got new assignment of " + subject.subject + " subject and due date is " + req.body.assignmentDate;
                                        var userId = studentId.id;
                                        notification.notification(action, notificationData, userId, query_params, '')
                                        if (counter == stuDetails.length) {
                                            // res.json({
                                            //     status: 200,
                                            //     data: result
                                            // })
                                            console.log("data save successfully")
                                        }
                                    })

                                }
                            })
                            if (req.body.teacher_id != 'undefined') {
                                var course = await getId.getCourseId(req.body.courseId, '')
                                var semester = await getId.getSemesterId(req.body.semesterId, '');
                                var batch = await getId.getBatchId(req.body.batchId, '')
                                var subjectId = await getId.getSubjectId(req.body.subject, course.id, semester.id)
                                var division = await getId.getDivisionId(req.body.divisionName, '')
                                var user = await getId.getUserId(req.body.teacher_id, '')
                              await  models.casestudyaccesses.create({
                                    courseId: course.id,
                                    batchId: batch.id,
                                    divisionId: division.id,
                                    subjectId: subjectId.id,
                                    teacherId: user.Id,               // assignment allocated teacher id saved
                                    userId: studentId.id,                     // assignment get student id saved
                                    assignmentId: assignment.id,
                                    role: req.body.teacherRole,                        // assignment allocated teacher role saved
                                    assignmentName: req.body.assignmentName,
                                    points: req.body.assignmentPoints,
                                    dueDate: req.body.assignmentDate,
                                    name: fileName,
                                    type: type,
                                    fileLength: length,
                                    filePath: currentPath + '/src/public/assignment/' + assignment.id + '/' + fileName,
                                    typeOfAssignments: req.body.typeofassignment,
                                }).then(casestudy => {
                                    if (casestudy != '') {
                                        models.subject.find({
                                            where: {
                                                id: assignment.subjectId
                                            }
                                        }).then(subject => {
                                            counter++;
                                            var action = "Assignment Notitfication";
                                            var notificationData = "You have got new assignment of " + subject.subject + " subject and due date is " + req.body.assignmentDate;
                                            var userId = element.userId;
                                            notification.notification(action, notificationData, userId)
                                            if (counter == stuDetails.length) {
                                                // res.json({
                                                //     status: 200,
                                                //     data: caseStudy
                                                // })
                                                console.log("data save successfully2")
                                            }
                                        })

                                    }
                                    else {
                                        res.json({
                                            status: 400,
                                            message: "Error occured while creating casestudyaccesses."
                                        })
                                    }
                                })

                            }

                        })
                    }
                })
            }

        }

    }

});

router.post('/assignmentsForEvaluator', async (req, res) => {
    var evaluator = JSON.parse(req.body.evaluators);
    gfs = Grid(connect.db)
    let {
        file
    } = req.files;
    var date = req.body.assignmentDate;
    var stuDetails = JSON.parse(req.body.studentDetails);
    var counter = 0;
    if (stuDetails.length == 0) {
        res.json({
            status: 404,
            message: 'No student got assignment'
        })
    }

    if (stuDetails.length > 0) {
        var cloneId = mongoose.Types.ObjectId();
        stuDetails.forEach(element => {
            if (JSON.stringify(cloneId) != null && JSON.stringify(cloneId) != undefined && JSON.stringify(cloneId) != "") {
                var dateFormat = date.replace('T18:30:00.000Z', '');
                let writeStream = gfs.createWriteStream({
                    filename: `${file.name}`,
                    mode: 'w',
                    content_type: file.mimetype
                })

                writeStream.on('close', function (uploadAssignments) {
                    let assignment = new Assignments({
                        courseId: req.body.courseId,
                        assignmentName: req.body.assignmentName,
                        Point: req.body.assignmentPoints,
                        DueDate: dateFormat,
                        BatchId: req.body.batchId,
                        subjects: req.body.subject,
                        userId: element.userId,
                        fullName: element.studentName,
                        groupId: cloneId,
                        doc_id: uploadAssignments._id,
                        fileLength: uploadAssignments.length,
                        name: uploadAssignments.filename,
                        type: uploadAssignments.contentType,
                        teacherName: req.body.teacherName,
                        role: req.body.role,
                        divisionName: req.body.divisionName,
                        teacherId: req.body.teacherId,
                        typeOfAssignment: req.body.typeofassignment

                    })
                    assignment.save((err, data) => {
                        if (err) {
                            console.error(err)
                        } else {
                            if (data) {
                                counter++;
                                if (counter == stuDetails.length) {
                                    res.json({
                                        status: 200
                                    })
                                }
                            }

                        }

                    })
                });
                writeStream.write(file.data);
                writeStream.end();
            }
        })
    }
    if (stuDetails.length > 0 && evaluator.length > 0) {
        var cloneId = mongoose.Types.ObjectId();
        stuDetails.forEach(element => {
            evaluator.forEach(element1 => {
                if (JSON.stringify(cloneId) != null && JSON.stringify(cloneId) != undefined && JSON.stringify(cloneId) != "") {
                    var dateFormat = date.replace('T18:30:00.000Z', '');
                    let writeStream = gfs.createWriteStream({
                        filename: `${file.name}`,
                        mode: 'w',
                        content_type: file.mimetype
                    })

                    writeStream.on('close', function (uploadAssignments) {
                        let casrStudyAccess = new caseStudyAccessModel({
                            courseId: req.body.courseId,
                            assignmentName: req.body.assignmentName,
                            Point: req.body.assignmentPoints,
                            DueDate: dateFormat,
                            BatchId: req.body.batchId,
                            subjects: req.body.subject,
                            userId: element.userId,
                            fullName: element.studentName,
                            groupId: cloneId,
                            doc_id: uploadAssignments._id,
                            fileLength: uploadAssignments.length,
                            name: uploadAssignments.filename,
                            type: uploadAssignments.contentType,
                            teacherName: element1.evaluatorname,
                            role: element1.evaluatorrole,
                            divisionName: req.body.divisionName,
                            teacherId: element1.evaluatorid,
                            typeOfAssignment: req.body.typeofassignment

                        })
                        casrStudyAccess.save((err, data) => {
                            if (err) {
                                console.error(err)
                            } else {
                                if (data) {
                                    counter++;
                                    if (counter == stuDetails.length) {
                                        res.json({
                                            status: 200
                                        })
                                    }
                                }

                            }

                        })
                    });
                    writeStream.write(file.data);
                    writeStream.end();
                }
            });
        })

    }
    if (file) {
        var evaluator = JSON.parse(req.body.evaluators);
        var date = req.body.assignmentDate;
        var stuDetails = JSON.parse(req.body.studentDetails);
        var course = await getId.getCourseId(req.body.courseId, '')
        var batch = await getId.getBatchId(req.body.batchId, '')
        var subject = await getId.getSubjectId(req.body.subject)//remaining
        var division = await getId.getDivisionId(req.body.divisionName, '')
        var user = await getId.getUserId(req.body.teacher_id, '')
        var counter = 0;
        var fileName = file.name;
        var type = file.mimetype;
        var length = file.size;
        if (stuDetails.length == 0) {
            res.json({
                status: 404,
                message: 'No student got assignment'
            })
        }
        if (stuDetails.length > 0) {
         await   models.assigments.create({
                courseId: course.id,
                batchId: batch.id,
                divisionId: division.id,
                subjectId: subject.id,
                teacherId: user.id,
                role: req.body.teacherRole,
                assignmentName: req.body.assignmentName,
                dueDate: req.body.assignmentDate,
                point: req.body.assignmentPoints,
                fileName: fileName,
                type: type,
                fileLength: length,
                typeOfAssignments: req.body.typeofassignment,
                assignmentCreatedOn: today
            }).then(assignment => {
                if (assignment) {
                    stuDetails.forEach(async student => {
                        var studentId = await getId.getUserId(student.userId, '')
                        models.uploadedassignments.create({
                            assignmentId: assignment.id,
                            userId: studentId.id,
                            length: null,
                            fileName: '',
                            type: '',
                            assignmentName: assignment.assignmentName,
                            marksObtained: null,
                            uploaded: false,
                            viewStatus: false,
                            feedback: "",
                        }).then(upload => {
                            if (upload) {
                                var dir = currentPath + '/src/public/assignment/' + assignment.id;

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
                                        callback(null, currentPath + '/src/public/assignment/' + assignment.id);
                                    },
                                });

                                var upload = multer({
                                    storage: storage,
                                }).single('file');
                                upload(req, res, function (err, data) {
                                    fs.writeFile(dir + '/' + file.name, file.data, function (err) {
                                        if (err) throw err;
                                    });
                                })
                                models.subject.find({
                                    where: {
                                        id: assignment.subjectId
                                    }
                                }).then(async subject => {
                                    var student = await getId.getUserId(req.body.userId, '')
                                    var query_params = "userId:" + student.id;
                                    counter++;
                                    var action = "Assignment Notitfication";
                                    var notificationData = "You have got new assignment of " + subject.subject + " subject and due date is " + req.body.assignmentDate;
                                    var userId = studentId.id;
                                    notification.notification(action, notificationData, userId, query_params, '')
                                    if (counter == stuDetails.length) {
                                        // res.json({
                                        //     status: 200,
                                        //     data: result
                                        // })
                                        console.log("data save successfully")
                                    }
                                })

                            }
                        })
                        if (req.body.teacher_id != 'undefined') {
                            models.casestudyaccesses.create({
                                courseId: course.id,
                                batchId: batch.id,
                                divisionId: division.id,
                                subjectId: subjectId,
                                teacherId: user.Id,               // assignment allocated teacher id saved
                                userId: studentId.id,                     // assignment get student id saved
                                assignmentId: assignment.id,
                                role: req.body.teacherRole,                        // assignment allocated teacher role saved
                                assignmentName: req.body.assignmentName,
                                points: req.body.assignmentPoints,
                                dueDate: req.body.assignmentDate,
                                name: fileName,
                                type: type,
                                fileLength: length,
                                filePath: currentPath + '/src/public/assignment/' + assignment.id + '/' + fileName,
                                typeOfAssignments: req.body.typeofassignment,
                                assignmentCreatedOn: today
                            }).then(casestudy => {
                                if (casestudy != '') {
                                    models.subject.find({
                                        where: {
                                            id: assignment.subjectId
                                        }
                                    }).then(subject => {
                                        counter++;
                                        var action = "Assignment Notitfication";
                                        var notificationData = "You have got new assignment of " + subject.subject + " subject and due date is " + req.body.assignmentDate;
                                        var userId = element.userId;
                                        notification.notification(action, notificationData, userId)
                                        if (counter == stuDetails.length) {
                                            // res.json({
                                            //     status: 200,
                                            //     data: caseStudy
                                            // })
                                            console.log("data save successfully2")
                                        }
                                    })

                                }
                                else {
                                    res.json({
                                        status: 400,
                                        message: "Error occured while creating casestudyaccesses."
                                    })
                                }
                            })

                        }

                    })
                }
            })
        }
    }

});

router.post('/addEvaluator', function (req, res) {
    addEvaluator(req.body)
    var password = 'ultrabrowser52';
    var fullname = req.body.firstName + ' ' + req.body.lastName;
    const {
        salt,
        passwordHash
    } = cipher.saltHashPassword(password);
    userModel.find({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    }).then(function (evaluator) {
        if (evaluator != '') {
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
                role: 'evaluator',
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
                        // emailService.evaluatorLoginEmail(req.body.email, password, fullname);
                    }
                })
            }, 100)
        }
    });
});

async function addEvaluator(body) {
    var password = 'ultrabrowser52';
    var fullname = body.firstName + ' ' + body.lastName;
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
    }).then(evaluator => {
        console.log("evaluator",evaluator)
        if (evaluator != null) {
            // res.json({
            //     status: 200,
            //     message: 'User already exists!!!..'
            // });
        } else {
            models.users.create({
                firstName: body.firstName,
                lastName: body.lastName,
                status: 'active',
                login: body.email,
                email: body.email,
                fullName: body.firstName + ' ' + body.lastName,
                role: 'evaluator',
                salt,
                passwordHash,
                loginCount: 0,
                onboarding: 'no',
            }).then(user => {
                console.log("user", user)
                if (user) {
                    models.users.find({
                        where: {
                            firstName: body.firstName,
                            lastName: body.lastName,
                            email: body.email,
                        }
                    }).then(data => {
                        if (data) {
                            // emailService.evaluatorLoginEmail(body.email, password, fullname);

                        }

                    })
                }
            })
        }
    })
}

router.get('/getEvaluatorData', function (req, res) {
    userModel.find({
        role: 'evaluator'
    }).sort({ createdOn: -1 }).then(function (evaluator) {
        if (evaluator != '') {
            res.json({
                status: 200,
                data: evaluator
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request!!!'
            });
        }
    })
});


router.delete('/deleteEvaluator', function (req, res) {
    var query = {
        _id: req.query.evaluatorId
    }
    userModel.find({
        _id: req.query.evaluatorId
    }).exec(function (err, deleteEvaluator) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else if (deleteEvaluator != '' || deleteEvaluator != null || deleteEvaluator != 'undefined' || deleteEvaluator != undefined) {
            userModel.findOneAndRemove(query).exec(function (err, evaluator) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: evaluator,
                        message: 'Deleted Successfully!!!....'
                    });
                }

            });

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
            let extension = path.extname(file.filename);
            const justFileName = path.basename(file.filename, extension);
            res.writeHead(200, {
                'Content-Type': type.mime,
                'Content-disposition': 'attachment; filename=' + justFileName + extension,
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



router.get('/getAssignments', (req, res) => {
    Assignments.aggregate([{
        $group: {
            _id: "$groupId",
            assignmentName: {
                $first: "$assignmentName"
            },
            assignmentDue: {
                $first: "$DueDate"
            },
            assignmentDescription: {
                $first: "$assignmentDescription"
            },
            createdAt: {
                $first: "$createdAt"
            },
            Point: {
                $first: "$Point"
            },
            groupId: {
                $first: "$groupId"
            },
            teacherName: {
                $first: "$teacherName"
            },
            subject: {
                $first: "$subjects"
            },
            doc_id: {
                $first: "$doc_id"
            },
        }
    }]).sort({
        createdAt: -1
    }).then(async function (assignOfAssignments) {
        res.json({
            status: 200,
            data: assignOfAssignments
        })
    })
})



router.get('/getFilterAssignments', (req, res) => {
    var viewData = {
        studentData: []
    }
    Assignments.distinct('groupId', (err, groups) => {
        if (err) {
            console.error(err)
        } else {
            groups.forEach(data => {
                Assignments.find({
                    groupId: data,
                    courseId: req.query.courseId,
                    BatchId: req.query.batchId
                }).then(function (assignOfAssignments) {

                    var arrayOfStudent = [];
                    assignOfAssignments.forEach(assignOfAssignment => {
                        arrayOfStudent.push(assignOfAssignment.fullName);
                    })
                    if (assignOfAssignments != '' && assignOfAssignments != null && assignOfAssignments != undefined) {
                        viewData.studentData.push({
                            doc_id: assignOfAssignments[0].doc_id,
                            fileName: assignOfAssignments[0].name,
                            fullName: arrayOfStudent,
                            assignmentName: assignOfAssignments[0].assignmentName,
                            assignmentDue: assignOfAssignments[0].DueDate,
                            assignmentDescription: assignOfAssignments[0].assignmentDescription,
                            createdAt: assignOfAssignments[0].createdAt,
                            Point: assignOfAssignments[0].Point,
                            groupId: assignOfAssignments[0].groupId,
                            teacherName: assignOfAssignments[0].teacherName,
                            subject: assignOfAssignments[0].subjects
                        })

                    }

                })

            })
            setTimeout(() => {

                res.json({
                    status: 200,
                    data: viewData
                })
            }, 8000)
        }
    })
})

router.get('/getTeachersAssignments/:id/:courseId/:subject', (req, res) => {
    var view_data = [];
    caseStudyAccessModel.aggregate([{
        $match: {
            teacherId: {
                $eq: req.params.id
            },

        },
    }, {
        $group: {
            _id: "$groupId",
            assignmentId: {
                $first: "$_id"
            },
            assignmentName: {
                $first: "$assignmentName"
            },
            assignmentDue: {
                $first: "$DueDate"
            },
            assignmentDescription: {
                $first: "$assignmentDescription"
            },
            createdAt: {
                $first: "$createdAt"
            },
            Point: {
                $first: "$Point"
            },
            groupId: {
                $first: "$groupId"
            },
            teacherName: {
                $first: "$teacherName"
            },
            subject: {
                $first: "$subjects"
            },
            doc_id: {
                $first: "$doc_id"
            },

        }
    }]).sort({
        createdAt: -1
    }).then(async function (assignOfAssignments) {
        if (assignOfAssignments) {
            await assignOfAssignments.map(x => {
                view_data.push(x)
            })
        }
        Assignments.aggregate([{
            $match: {
                teacherId: {
                    $eq: req.params.id
                },
            },
        }, {
            $group: {
                _id: "$groupId",
                assignmentId: {
                    $first: "$_id"
                },
                assignmentName: {
                    $first: "$assignmentName"
                },
                assignmentDue: {
                    $first: "$DueDate"
                },
                assignmentDescription: {
                    $first: "$assignmentDescription"
                },
                createdAt: {
                    $first: "$createdAt"
                },
                Point: {
                    $first: "$Point"
                },
                groupId: {
                    $first: "$groupId"
                },
                teacherName: {
                    $first: "$teacherName"
                },
                subject: {
                    $first: "$subjects"
                },
                doc_id: {
                    $first: "$doc_id"
                },

            }
        }]).sort({
            createdAt: -1
        }).then(async function (assignOfAssignments) {
            console.log("assignOfAssignments---", assignOfAssignments)

            if (assignOfAssignments) {
                await assignOfAssignments.map(x => {
                    view_data.push(x)
                })
            }
            setTimeout(() => {
                res.json({
                    status: 200,
                    data: view_data
                })
            }, 2000);
        })
    })
})


router.get('/getEvaluatorAssignments/:id', (req, res) => {
    var viewData = {
        studentData: []
    }
    caseStudyAccessModel.find({
        teacherId: req.params.id
    }).then(function (user) {
        if (user != '') {
            caseStudyAccessModel.distinct('groupId', (err, groups) => {
                if (err) {
                    console.error(err)
                } else {
                    groups.forEach(data => {
                        caseStudyAccessModel.find({
                            groupId: data,
                            teacherId: req.params.id,
                        }, (err, assignOfAssignments) => {
                            if (assignOfAssignments.length) {
                                var arrayOfStudent = [];
                                assignOfAssignments.forEach(assignOfAssignment => {
                                    arrayOfStudent.push(assignOfAssignment.fullName);
                                })
                                viewData.studentData.push({
                                    fullName: arrayOfStudent,
                                    assignmentName: assignOfAssignments[0].assignmentName,
                                    assignmentDue: assignOfAssignments[0].DueDate,
                                    assignmentDescription: assignOfAssignments[0].assignmentDescription,
                                    createdAt: assignOfAssignments[0].createdAt,
                                    Point: assignOfAssignments[0].Point,
                                    groupId: assignOfAssignments[0].groupId,
                                    teacherName: assignOfAssignments[0].teacherName,
                                    subject: assignOfAssignments[0].subjects
                                })

                            };

                        })

                    })
                    setTimeout(function () {
                        res.json({
                            status: 200,
                            data: viewData
                        })
                    }, 3000)
                }
            })

        } else {
            res.json({
                status: 400,
                message: 'bad request'
            })
        }
    })
});

router.delete('/deleteAssignments/:groupId', async (req, res) => {
    Assignments.deleteMany({
        groupId: req.params.groupId
    }, (err, assignment) => {
        if (err) {
            console.error(err)
        } else {
            if (assignment) {
                res.json({
                    status: 200,
                    message: 'Removed successfully'
                })
            } else {
                res.json({
                    message: 'Error Occured'
                })
            }


        }
    })
})


router.get('/unselectedStudents/:batchId', (req, res) => {
    var view_data = [];
    courseEnrolledStudent.find({
        batch_id: req.params.batchId
    }, (err, students) => {
        if (err) {
            return new Error('Error Occured');
        } else {
            students.forEach(item => {
                userModel.find({
                    _id: item.user_id.toString()
                }, (err, studentNames) => {

                    if (err) {
                        console.error(err);
                    } else {

                        studentNames.forEach(data => {
                            Assignments.find({
                                $and: [{
                                    userId: data._id.toString()
                                }, {
                                    enrollmentId: item._id.toString()
                                }]
                            }, (err, student) => {
                                if (err) {
                                    return new Error('Error Occured');
                                } else {
                                    if (student.length == 0) {
                                        studentNames.forEach(element => {
                                            view_data.push({
                                                studentName: element.fullName,
                                                enrollmentId: item._id,
                                                studentId: data._id

                                            })
                                        })
                                    } else {
                                        studentNames.forEach(element => {
                                            view_data.push({
                                                studentName: element.fullName,
                                                enrollmentId: item._id,
                                                studentId: data._id
                                            })
                                        })
                                    }
                                }
                            })
                        })
                    }
                })
            })
            setTimeout(() => {
                res.json({
                    status: 200,
                    data: view_data
                })
            }, 3000)
        }

    })


})

router.get('/getCourses', (req, res) => {
    courseModel.find({}, (err, course) => {
        if (err) {
            return new Error('Error Occurred');
        } else {
            if (course) {
                res.status(200).json({
                    courses: course
                })
            }
        }
    })
})


router.get('/getBatches/:courseId', (req, res) => {
    batchMasterModel.find({
        courseId: req.params.courseId
    }, (error, division) => {
        if (error) {
            console.error(error);
        } else {
            res.json({
                status: 200,
                division: division

            })
        }
    })
})



router.get('/getDivisionOld', (req, res) => {
    query = {
        batchId: req.query.batchId
    };
    var aarayOfDiv = [];
    divisionModel.aggregate([{
        $match: {
            batchId: req.query.batchId
        }
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
            as: "Subjects"
        }
    },
    {
        $project: {
            "Subjects.courseSubject": 1,
            "Subjects._id": 1,
            "_id": 1,
            "divisionName": 1,
            "departmentId": 1

        }
    }
    ]).exec((err, Subjects) => {
        if (err) {
            console.error(err);
        } else {
            Subjects.forEach(division => {
                division.Subjects.forEach(subjects => {
                    aarayOfDiv.push({
                        divisionName: division.divisionName,
                        departmentId: division.departmentId,
                        courseId: subjects._id,
                        sub: subjects.courseSubject,
                        divisionId: division._id

                    })
                })
            })
            setTimeout(() => {
                res.json({
                    status: 200,
                    division: aarayOfDiv
                })

            }, 2000)
        }
    })
})

router.get('/getDivision', (req, res) => {
    newDivisionModel.find({}).then(function (division) {
        if (division != '') {
            res.json({
                status: 200,
                data: division
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })
});



router.get('/getStudent', (req, res) => {
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
                        Name: second.fullName,
                        studentId: second._id,
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



router.get('/getSemester', (req, res) => {
    semesterModel.find({
        batchId: req.query.batchId
    }, (error, Semester) => {
        if (error) {
            console.error(error)
        } else {
            res.json({
                status: 200,
                semester: Semester
            })
        }
    })
})



router.get('/getSubject', (req, res) => {
    subjectModel.find({
        semesterId: req.query.semesterId
    }, (error, subjects) => {
        if (error) {
            console.log(error);
        } else {
            res.json({
                status: 200,
                subjectData: subjects
            })
        }
    })
})


router.get('/disableSubmission', (req, res) => {
    console.log("req.query--------->>", req.query)
    var arrayOfAssignments = [];
    Assignments.aggregate([{
        $match: {
            $and: [{
                BatchId: req.query.batchId
            }, {
                userId: req.query.userId
            }, {
                subjects: req.query.subject
            }]
        }
    },
    {
        $addFields: {
            gId: {
                $toString: "$groupId"
            }
        }
    },
    {
        $lookup: {
            from: "uploadedassignments",
            let: {
                userid: req.query.userId,
                grId: "$gId"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [{
                            $eq: ["$userId", "$$userid"],
                        },
                        {
                            $eq: ["$groupid", "$$grId"],
                        }
                        ]
                    }
                }
            }],
            as: "result",
        }
    }, {
        $project: {
            "marksObtained": 1,
            "assignmentName": 1,
            "result": "$result",
            "Point": 1,
            "BatchId": 1,
            "courseId": 1,
            "userId": 1,
            "doc_id": 1,
            "assignmentDescription": 1,
            "groupId": 1,
            "DueDate": 1,
            "createdAt": 1,
            "feedback": 1,
            "type": 1,
            "name": 1,
            "subjects": 1,
            "typeOfAssignment": 1,




        }
    }
    ]).exec((err, result) => {
        if (err) {
            console.error(err);
        } else {
            if (result.length) {
                result.forEach(file => {
                    if (file.result && file.result.length > 0) {
                        arrayOfAssignments.push({
                            fileLink: `${filelink}/api/assignments/download?document_id=${file.doc_id}`,
                            fileName: file.name,
                            assignmentName: file.assignmentName,
                            assignmentCreated: file.createdAt,
                            assignmnentDue: file.DueDate,
                            assignmentDescription: file.assignmentDescription,
                            assignmentPoint: file.Point,
                            assignmentFileType: file.type,
                            assignmentGroupId: file.groupId,
                            userId: file.userId,
                            subject: file.subjects,
                            uploadAssignments: file.result.length ? "true" : "false",
                            typeOfAssignment: file.typeOfAssignment,
                            courseId: file.courseId,
                            batchId: file.BatchId,
                            doc_id: file.doc_id,
                            feedback: file.result[0].feedback,
                            marks: file.result[0].marksObtained,
                            uploads: file.result

                        })
                    } else {
                        arrayOfAssignments.push({
                            fileLink: `${filelink}/api/assignments/download?document_id=${file.doc_id}`,
                            fileName: file.name,
                            assignmentName: file.assignmentName,
                            assignmentCreated: file.createdAt,
                            assignmnentDue: file.DueDate,
                            assignmentDescription: file.assignmentDescription,
                            assignmentPoint: file.Point,
                            assignmentFileType: file.type,
                            assignmentGroupId: file.groupId,
                            userId: file.userId,
                            subject: file.subjects,
                            uploadAssignments: file.result.length ? "true" : "false",
                            typeOfAssignment: file.typeOfAssignment,
                            courseId: file.courseId,
                            batchId: file.BatchId,
                            doc_id: file.doc_id,
                            feedback: "",
                            marks: "",
                            uploads: []


                        })
                    }

                })

                setTimeout(() => {
                    res.json({
                        status: 200,
                        data: arrayOfAssignments
                    })
                }, 2000);
            }

        }
    })
})


router.get('/viewStudentAssign', (req, res) => {
    var view_data = [];
    var view_data1 = [];
    var course_subjects = [];
    var date = moment(new Date()).format('YYYY-MM-DD');
    studentBatchModel.find({
        studentId: req.query.user_id
    }).then((data) => {
        if ((data != null || data != undefined) && data.length != 0) {
            studentBatchModel.find({
                studentId: req.query.user_id
            }).populate('batchId', ['batchName']).populate('studentId', ['fullName', 'email'])
                .populate('courseId', ['courseName']).sort({
                    'createdOn': -1
                }).then(function (student) {
                    if (student != null || student != '' || student != undefined) {
                        var course = student[0].courseId;
                        var courseID = course._id;
                        var batch = student[0].batchId;
                        var batchID = batch._id;
                        batchMasterModel.find({
                            _id: batchID,
                            courseId: courseID
                        }).then(function (batches) {
                            if (batches != '') {
                                if (batches[0].batchName == 'TY') {
                                    semesterNewModel.find({
                                        $or: [{
                                            semesterName: "Semester 1"
                                        },
                                        {
                                            semesterName: "Semester 2"
                                        },
                                        {
                                            semesterName: "Semester 3"
                                        },
                                        {
                                            semesterName: "Semester 4"
                                        },
                                        {
                                            semesterName: "Semester 5"
                                        },
                                        {
                                            semesterName: "Semester 6"
                                        }
                                        ]
                                    }).sort({
                                        'createdOn': -1
                                    }).exec(function (err, semesters) {
                                        if (err) {
                                            console.log(err);
                                        } else if (semesters != '') {
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
                                                    courseId: batches[0].courseId,
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
                                                            courseId: batches[0].courseId,
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
                                                            } else if (subject == '' && subject1 == '') {
                                                                subjectModel.find({
                                                                    courseId: batches[0].courseId,
                                                                    semesterId: semesters[2]._id
                                                                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject2) {
                                                                    if (subject2 != '') {
                                                                        subject2.forEach(subjectData => {
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
                                                                    } else if (subject == '' && subject1 == '' && subject2 == '') {
                                                                        subjectModel.find({
                                                                            courseId: batches[0].courseId,
                                                                            semesterId: semesters[3]._id
                                                                        }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject3) {
                                                                            if (subject3 != '') {
                                                                                subject3.forEach(subjectData => {
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
                                                                            } else if (subject == '' && subject1 == '' && subject2 == '' && subject3 == '') {
                                                                                subjectModel.find({
                                                                                    courseId: batches[0].courseId,
                                                                                    semesterId: semesters[4]._id
                                                                                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject4) {
                                                                                    if (subject4 != '') {
                                                                                        subject4.forEach(subjectData => {
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
                                                                                    } else if (subject == '' && subject1 == '' && subject2 == '' && subject3 == '' && subject4 == '') {
                                                                                        subjectModel.find({
                                                                                            courseId: batches[0].courseId,
                                                                                            semesterId: semesters[5]._id
                                                                                        }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject5) {
                                                                                            subject5.forEach(subjectData => {
                                                                                                if (subject5 != '') {
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
                                                                                                }

                                                                                            })
                                                                                        });

                                                                                    }
                                                                                });

                                                                            }
                                                                        });

                                                                    }
                                                                });

                                                            }
                                                        });
                                                    }
                                                })
                                            });

                                            setTimeout(function () {
                                                res.json({
                                                    status: 200,
                                                    data: view_data,
                                                    subjectData: course_subjects,
                                                    data1: view_data1,
                                                })
                                            }, 1500)
                                        }

                                    });
                                } else if (batches[0].batchName == 'SY') {
                                    semesterNewModel.find({
                                        $or: [{
                                            semesterName: "Semester 1"
                                        },
                                        {
                                            semesterName: "Semester 2"
                                        },
                                        {
                                            semesterName: "Semester 3"
                                        },
                                        {
                                            semesterName: "Semester 4"
                                        }
                                        ]
                                    }).sort({
                                        'createdOn': -1
                                    }).exec(function (err, semesters) {
                                        if (err) {
                                            console.log(err);
                                        } else if (semesters != '') {
                                            semesters.forEach(function (semesterData) {
                                                view_data1.push({
                                                    semesterData
                                                });

                                            });
                                            semesterNewModel.find({
                                                _id: semesters[0]._id
                                            }).then(function (semData) {
                                                subjectModel.find({
                                                    courseId: batches[0].courseId,
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
                                                            courseId: batches[0].courseId,
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
                                                            } else if (subject == '' && subject1 == '') {
                                                                subjectModel.find({
                                                                    courseId: batches[0].courseId,
                                                                    semesterId: semesters[2]._id
                                                                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject2) {
                                                                    if (subject2 != '') {
                                                                        subject2.forEach(subjectData => {
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
                                                                    } else if (subject == '' && subject1 == '' && subject2 == '') {
                                                                        subjectModel.find({
                                                                            courseId: batches[0].courseId,
                                                                            semesterId: semesters[3]._id
                                                                        }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject3) {
                                                                            if (subject3 != '') {
                                                                                subject3.forEach(subjectData => {
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
                                                                });
                                                            }
                                                        });

                                                    }
                                                })
                                            });

                                            setTimeout(function () {

                                                res.json({
                                                    status: 200,
                                                    data: view_data,
                                                    subjectData: course_subjects,
                                                    data1: view_data1,
                                                })
                                            }, 1500)
                                        }

                                    });
                                } else if (batches[0].batchName == 'FY') {

                                    semesterNewModel.find({
                                        $or: [{
                                            semesterName: "Semester 1"
                                        },
                                        {
                                            semesterName: "Semester 2"
                                        }
                                        ]
                                    }).sort({
                                        'createdOn': -1
                                    }).exec(function (err, semesters) {
                                        if (err) {
                                            console.log(err);
                                        } else if (semesters != '') {
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
                                                    courseId: batches[0].courseId,
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
                                                                overview: ''
                                                            });


                                                        })
                                                    } else if (subject == '') {
                                                        subjectModel.find({
                                                            courseId: batches[0].courseId,
                                                            semesterId: semesters[1]._id
                                                        }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(function (subject) {
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
                                                        });
                                                    }
                                                })
                                            });

                                            setTimeout(function () {
                                                res.json({
                                                    status: 200,
                                                    data: view_data,
                                                    subjectData: course_subjects,
                                                    data1: view_data1,
                                                })
                                            }, 1500)
                                        }
                                    });
                                }
                            }
                        });
                       
                    } else {
                        res.json({
                            status: 400,
                            message: 'Bad Request'
                        });
                    }

                });
        } else {
            res.json({
                status: 400,
            })
        }
    });

})

router.get('/getProjectSubmission', (req, res) => {
    var viewData = {
        studentData: []
    }
    projectSubmissionModel.distinct('groupId', (err, groups) => {
        if (err) {
            console.error(err)
        } else {
            groups.forEach(data => {
                projectSubmissionModel.find({
                    groupId: data
                }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).exec(function (err, assignOfAssignments) {
                    var arrayOfStudent = [];
                    assignOfAssignments.forEach(assignOfAssignment => {
                        arrayOfStudent.push(assignOfAssignment.evaluatorName);
                    })
                    viewData.studentData.push({
                        fullName: arrayOfStudent,
                        submissionName: assignOfAssignments[0].submissionName,
                        createdAt: assignOfAssignments[0].createdAt,
                        Point: assignOfAssignments[0].Point,
                        groupId: assignOfAssignments[0].groupId,
                        courseName: assignOfAssignments[0].courseId.courseName,
                        courseId: assignOfAssignments[0].courseId._id,
                        batchName: assignOfAssignments[0].batchId.batchName,
                        batchYear: assignOfAssignments[0].batchId.year,
                        batchId: assignOfAssignments[0].batchId._id,
                        file_name: assignOfAssignments[0].name,
                        doc_id: assignOfAssignments[0].doc_id,
                        type: assignOfAssignments[0].type
                    })

                })

            })
            setTimeout(() => {
                res.json({
                    status: 200,
                    data: viewData
                })
            }, 3000)
        }
    })
})

router.delete('/deleteProject', function (req, res) {
    var query = {
        groupId: req.query.projectId
    }
    projectSubmissionModel.deleteMany({
        groupId: req.query.projectId
    }).exec(function (err, deleteProject) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else if (deleteProject != '' || deleteProject != null || deleteProject != 'undefined' || deleteProject != undefined) {
            projectSubmissionModel.findOneAndRemove(query).exec(function (err, project) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: project,
                        message: ' Deleted Successfully!!!....'
                    });
                }

            });

        }
    });


});

router.get('/getStudentProjectSubmission', function (req, res) {
    var view_data = [];
    studentBatchModel.find({
        studentId: req.query.user_id
    }).populate('courseId', ['courseName']).populate('batchId', ['batchName', 'year']).exec(function (err, student) {
        if (err) {
            console.error(err)
        } else {
            if (student != '') {
                var stu = student.length - 1;
                var stu1 = student[stu];
                projectSubmissionModel.distinct('groupId', (err, groups) => {
                    if (err) {
                        console.error(err)
                    } else {
                        if (groups != '') {
                            groups.forEach(data => {
                                projectSubmissionModel.find({
                                    groupId: data,
                                    courseId: stu1.courseId._id,
                                    batchId: stu1.batchId._id
                                }, (err, assignOfAssignments) => {
                                    if (assignOfAssignments.length) {
                                        view_data.push({
                                            submissionName: assignOfAssignments[0].submissionName,
                                            courseId: stu1.courseId._id,
                                            batchId: stu1.batchId._id,
                                            file_name: assignOfAssignments[0].name,
                                            doc_id: assignOfAssignments[0].doc_id,
                                            type: assignOfAssignments[0].type,
                                            Point: assignOfAssignments[0].Point,
                                            groupId: assignOfAssignments[0].groupId,
                                            file_link: `${filelink}/api/uploadedAssignment/download?document_id=${assignOfAssignments[0].doc_id}`,

                                        })
                                    }
                                })
                            })
                        }
                    }

                })

                setTimeout(function () {
                    res.json({
                        status: 200,
                        data: view_data
                    })

                }, 1000)

            } else {
                res.json({
                    status: 400,
                    message: 'bad request'
                })
            }
        }
    })

});


router.get('/getTeacherAllocateAccessForCaseStudy', function (req, res) {
    teacherModel.find({
        course_id: req.query.courseId,
        batch_id: req.query.batchId,
        divisionId: req.query.divisionId,
        semesterId: req.query.semesterId,
        subject: req.query.subject
    }).populate('teacher_id', ['fullName', 'email']).then(function (teacher) {
        if (teacher != '') {
            res.json({
                status: 200,
                data: teacher
            })
        } else {
            res.json({
                status: 400,
                message: 'bad request!!..'
            })
        }
    })
});

router.get('/getEvaluatorProjects/:id', (req, res) => {
    var viewData = {
        studentData: []
    }
    projectSubmissionModel.find({
        evaluatorId: req.params.id
    }).then(function (user) {
        if (user != '') {
            projectSubmissionModel.distinct('groupId', (err, groups) => {
                if (err) {
                    console.error(err)
                } else {
                    groups.forEach(data => {
                        projectSubmissionModel.find({
                            groupId: data,
                            evaluatorId: req.params.id,
                        }, (err, assignOfAssignments) => {
                            if (assignOfAssignments.length) {
                                var arrayOfStudent = [];
                                studentBatchModel.find({
                                    courseId: assignOfAssignments[0].courseId,
                                    batchId: assignOfAssignments[0].batchId
                                }).populate('studentId', ['fullName', 'email']).then(function (userData) {
                                    userData.forEach(function (user) {
                                        arrayOfStudent.push(user.studentId.fullName);
                                    })
                                })
                                viewData.studentData.push({
                                    fullName: arrayOfStudent,
                                    projectName: assignOfAssignments[0].submissionName,
                                    Point: assignOfAssignments[0].Point,
                                    groupId: assignOfAssignments[0].groupId,
                                    courseId: assignOfAssignments[0].courseId,
                                    batchId: assignOfAssignments[0].batchId,
                                    doc_id: assignOfAssignments[0].doc_id,
                                    type: assignOfAssignments[0].type
                                })

                            };

                        })

                    })
                    setTimeout(function () {
                        res.json({
                            status: 200,
                            data: viewData
                        })
                    }, 3500)
                }
            })

        } else {
            res.json({
                status: 400,
                message: 'bad request!!..'
            })
        }
    })
});


router.get('/getPreviousAssignment', function (req, res) {
    var view_data = [];
    var currentDate = new Date(new Date().getFullYear(), 11, 31);
    var lastThreeYear = new Date(new Date().getFullYear() - 2, 0, 1);
    collegeCourseModel.find({
        courseName: req.query.courseName
    }).exec(function (err, courses) {
        if (courses != '' || courses != undefined) {
            courses.forEach(function (course) {
                Assignments.find({
                    courseId: course._id,
                    createdAt: {
                        $gte: moment(lastThreeYear).format(),
                        $lte: moment(currentDate).format()
                    }
                }).populate('courseId', ['courseName']).populate('BatchId', ['batchName']).sort({
                    'createdAt': -1
                }).exec(function (err, assignmentData) {
                    if (assignmentData != '') {
                        assignmentData.forEach(function (assignment) {
                            view_data.push({
                                _id: assignment._id,
                                courseId: assignment.courseId._id,
                                courseName: assignment.courseId.courseName,
                                batchId: assignment.BatchId._id,
                                batchName: assignment.BatchId.batchName,
                                divisionId: assignment.divisionName,
                                subject: assignment.subjects,
                                assignmentName: assignment.assignmentName,
                                point: assignment.point,
                                dueDate: assignment.DueDate,
                                doc_id: assignment.doc_id,
                                name: assignment.name,
                                type: assignment.type,
                                createdAt: assignment.createdAt,
                                userid: assignment.userId,
                                groupId: assignment.groupId

                            })

                        });
                        res.json({
                            status: 200,
                            data: view_data
                        })
                    } else if (assignmentData == '') {
                        res.json({
                            message: 'There is no assignment data...'
                        })
                    } else {
                        res.json({
                            status: 400,
                            message: 'bad request!!!'
                        })
                    }

                });
            })
        }
    })


});


router.get("/getPreviousAssignment1", function (req, res) {
    console.log("req.qurey", req.query)
    var view_data = []
    semesterNewModel.find({
        semesterName: req.query.semesterid
    }).then(function (data) {
        data.forEach(semester => {
            batchSemesterMaster.find({
                semesterId: semester._id
            }).then(batchs => {
                batchs.forEach(batch => {
                    Assignments.find({
                        BatchId: batch.batchId
                    }).populate('courseId', ['courseName']).populate('BatchId', ['batchName']).then(assignment => {
                        assignment.forEach(assign => {
                            view_data.push({
                                _id: assign._id,
                                courseId: assign.courseId._id,
                                courseName: assign.courseId.courseName,
                                batchId: assign.BatchId._id,
                                batchName: assign.BatchId.batchName,
                                divisionId: assign.divisionName,
                                subject: assign.subjects,
                                groupId: assign.groupId,
                                assignmentName: assign.assignmentName,
                                dueDate: assign.DueDate,
                                doc_id: assign.doc_id,
                                name: assign.name,
                                type: assign.type,
                                createdAt: assign.createdAt,
                                userid: assign.userId

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
        }, 6000)



    })
})

router.get('/AdminPreviousAssignment', (req, res) => {
    var view_data = []
    collegeCourseModel.aggregate([{
        $addFields: {
            id: {
                $toString: "$_id"
            }
        }
    },
    {
        "$lookup": {
            "from": "batchmasters",
            "localField": "id",
            "foreignField": "courseId",
            "as": "batches"
        }
    },
    {
        $unwind: {
            path: "$batches",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: "assignments",
            let: {
                batchID: {
                    $toString: "$batches._id"
                },
                courseId: "$id"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [{
                            $eq: ["$BatchId", "$$batchID"],
                        },
                        {
                            $eq: ["$courseId", "$$courseId"],
                        }
                        ]
                    }
                }
            }],
            as: "assignment",
        }
    },
    {
        $unwind: {
            path: '$assignment',
            preserveNullAndEmptyArrays: false
        }
    },
    {
        $addFields: {
            assignments: {
                $mergeObjects: ['$batches', '$assignment']
            }
        }
    },

    {
        $group: {
            _id: '$_id',
            assignments: {
                $push: '$assignments'
            },
            courseName: {
                $first: '$courseName'
            },
        }
    },

    ]).then(function (data) {
        if (data) {
            console.log(data.length)
            res.json({
                status: 200,
                data: data
            })
        } else {
            res.json({
                status: 400,
                data: ""
            })
        }
    })
})

router.put('/updateSubmissionDate', (req, res) => {
    updateSubmissionDate(req.body)
    var query = {
        groupId: req.body.groupId
    },
        update = {
            $set: {
                DueDate: req.body.date
            }
        };
    Assignments.updateMany(query, update, function (err, result) {
        if (result) {
            res.json({
                status: 200,
                data: result
            })
        }
    })
})

async function updateSubmissionDate(body) {
    Assignments.find({
        groupId: body.groupId
    }).then(async assigment => {
        var batch = await getId.getBatchId(body.batchId, '')
        var course = await getId.getCourseId(body.courseId, '')
        var subject = await getId.getSubjectId(body.subject)//remaining
        var division = await getId.getDivisionId(body.divisionName, '')
      await  models.assignments.find({
            where: {
                courseId: course.id,
                batchId: batch.id,
                subjectId: subject.id,
                divisionId: division.id,
                dueDate: assigment[0].DueDate,
                assignmentName: assigment[0].assignmentName
            }
        }).then(data => {
            if(data){
                data.update({
                    dueDate: body.date
                }).then(updateDate => {
                    console.log("updateDate", updateDate)
                })
            }
           
        })
    })
}
module.exports = router;