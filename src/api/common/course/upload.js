const Upload = require('../../../app/models/uploads');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');
const Grid = require('gridfs-stream');
const logger = require('../../../utils/logger');
const fileType = require('file-type');
require('../../../app/models/pdfTracking');
var PdfTrackingModel = mongoose.model('PdfTracking');
var notification_function = require('./../../../utils/function');
require('../../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
const path = require('path');
require('../../../app/models/referenceFiles')
var referenceFilesModel = mongoose.model('ReferenceFiles');
require('../../../app/models/announcementUpload');
var announcementUploadModel = mongoose.model('AnnouncementUpload');
require('../../../app/models/syllabusFiles');
var syllabusFilesModel = mongoose.model('SyllabusFiles');
require('../../../app/models/chapterSyllabusFile');
var chapterSyllabusFilesModel = mongoose.model('ChapterSyllabusFiles')
facultyPayment = require('../../../app/models/facultyPayment')
var facultyPayment = mongoose.model('facultyPayment')
require('../../../app/models/blogUploads')
var blogUploadsModel = mongoose.model('BlogUploads');
require('../../../app/models/teacherDetailsUpload')
var teacherDetailsUploadModel = mongoose.model('TeacherDetailsUpload');
require('../../../app/models/noticeUpload')
var noticeUploadModel = mongoose.model('NoticeUpload');
const config = require('config');
const { filelink } = config.get('api');
require('../../../app/models/projectSubmission');
var projectSubmissionModel = mongoose.model('ProjectSubmission');
require('../../../app/models/webinarUploads')
var webinarUploadsModel = mongoose.model('WebinarUploads');
require('../../../app/models/chapter')
var chapterModel = mongoose.model('Chapter');
require('../../../app/models/libraryUploads');
var libraryUploadsModel = mongoose.model('LibraryUploads')
require('../../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
require('../../../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
require('../../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var moment = require('moment');
require('../../../app/models/user');
var userModel = mongoose.model('User');
require('../../../app/models/deliverablesUpload')
var deliverablesUploadModel = mongoose.model('DeliverablesUpload');
var topicLibrarySchema = require('../../../app/models/topiclibrary');
var topicLibraryModel = mongoose.model('topicLibrary');
require('../../../app/models/placementUpload')
var placementUploadModel = mongoose.model('PlacementUpload')
require('../../../app/models/placement')
var PlacementModel = mongoose.model('Placement')
require('../../../app/models/leaveUpload')
var LeaveUploadModel = mongoose.model('LeaveUpload');
require('../../../app/models/newspaper');
var newsModel= mongoose.model("NewspaperLink")
require('../../../app/models/examUpload')
var examUploadModel = mongoose.model('ExamUpload');
var NoticeSchema = require('../../../app/models/notice');
var noticeModel = mongoose.model('Notice');
require("../../../app/models/leaves");
var leavesModel = mongoose.model("Leaves");
var AnnouncementSchema = require('../../../app/models/announcement');
var announcementModel = mongoose.model('Announcement');
var examUpdate = require('../../../app/models/examUpdate')
var examUpdateModel = mongoose.model('ExamUpdate')
require('../../../app/models/webinars');
var webinarsModel = mongoose.model('Webinars');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
var util = require('util');
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs;
//Sql
var root_path = path.dirname(require.main.filename);
var models = require('../../../models');
const getSqlId = require('./../../../utils/getSqlId');
var getId = new getSqlId();
var multer = require('multer');
const announcements = require('../../../models/announcements');

router.post('/upload',async  (req, res) => {
    gfs = Grid(connect.db);
    var chapter_id = req.body.id
    var type = req.body.type ;
    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    Upload.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);
        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                Upload.create({
                    doc_id: uploadedFile._id,
                    lessonId: chapter_id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType,
                    type_of_upload: type
                })
                    .then(file => {
                        chapterModel.find({
                            _id: req.body.id,
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
                                                var activity_action = " Added " + req.body.type;
                                                var activity_data = userdetails[0].fullName + " Added " + req.body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                                                notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0]._id);
                                            }
                                        })
                                        studentBatchModel.find({
                                            courseId: chapter[0].courseId,
                                            batchId: batch[0]._id
                                        }).then(function (studentData) {
                                            var action = "Admin Added " + req.body.type;
                                            var notification_data = " Added " + req.body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
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
                            message: "File was saved with success"
                        })
                    }
                    )
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    var chapter = await getId.getChapterId(req.body.id, '')
    var chapterId = chapter.id
    var type = req.body.type
    if (file) {
        var currentPath = process.cwd();
        var dir = currentPath + "/src/public/CaptersOfContain/" + chapterId;
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
            fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                if (err) throw err;
                //  console.log('Saved!');
            });

            models.uploads.create({
                lessonId: chapterId,
                filePath: currentPath + "/src/public/CaptersOfContain/" + chapterId + "/" + file.name,
                length: file.size,
                name: file.name,
                type: file.mimetype,
                typefOfUpload: type
            }).then(function (upload_data) {

                models.chapters.getSubject(chapterId).then(chapter => {
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

                                var action = "Admin Added " + req.body.type;
                                var notification_data = " Added " + req.body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                                studentData.forEach(function (student) {
                                    notification_function.notification(action, notification_data, student.studentId);
                                });
                                var user = await getId.getUserId(req.body.user_id, '')
                                models.users.findAll({
                                    where: {
                                        id: user.id
                                    }
                                }).then(userdetails => {
                                    if (userdetails) {
                                        var activity_action = " Added " + req.body.type;
                                        var activity_data = userdetails[0].fullName + " Added " + req.body.type + " for Chapter " + chapter[0].chapterName + " and Subject " + chapter[0].subject;
                                        notification_function.activity(activity_action, activity_data, chapter[0].courseId, batch[0].id);
                                    }
                                })


                            })
                        })
                    }
                })

            })

        })
    }

});

router.get('/home', (req, res) => {
    Upload.find()
        .exec()
        .then(files => {
            let uploadedFiles = files.map(file => ({
                file_name: file.name,
                file_type: file.type,
                file_link: `${filelink}/api/upload/download?document_id=${file.doc_id}`
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

router.get('/getFile', (req, res) => {
    var data = {};
    Upload.findOne({
        doc_id: req.query.id
    }, (err, file) => {
        if (file) {
            data.file_link = `${filelink}/api/upload/download?document_id=${file.doc_id}`,
                data.file_name = file.name,

                res.json({
                    status: 200,
                    data: data
                })

        }

    })
})


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

router.get('/getUploadedFile/:id', function (req, res) {
    var query = { lessonId: req.params.id };
    Upload.find(query, (err, uploadedFiles) => {
        if (uploadedFiles) {
            res.json({
                status: 200,
                data: uploadedFiles
            });

        }
        else {
            console.err(err);
        }
    })

})

router.get('/removeUploadedFile/:id/:doc_id/:subject/:chapterName', function (req, res) {
    var query = {
        lessId: req.params.id,
        doc: req.params.doc_id
    }

    Upload.deleteOne({ doc_id: query.doc }, (err, uploadedFiles) => {
        if (uploadedFiles) {
            PdfTrackingModel.find({
                doc_id: query.doc,
                chapterId: query.lessId
            }).then(function (data) {
                data.forEach(function (user) {
                    var action = "Admin Deleted file";
                    var notification_data = "Admin Deleted file of " + req.params.subject + " of chapter " + req.params.chapterName;
                })
                teacherModel.find({
                    subject: req.params.subject,
                }).then(function (teachers) {
                    teachers.forEach(function (teacher) {
                        var action = "Admin Deleted file";
                        var notification_data = "Admin Deleted file of " + req.params.subject + " of chapter " + req.params.chapterName;
                    })
                });
            })
            PdfTrackingModel.deleteMany({ doc_id: query.doc, chapterId: query.lessId }, (err, pdftracking) => {
                if (pdftracking) {
                    res.json({
                        status: 200,
                        message: 'removed successfully'
                    })
                }
            })
        }
        else {
            console.err(err);
        }
    })
});

router.post('/uploadReferencesFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    referenceFilesModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                referenceFilesModel.create({
                    doc_id: uploadedFile._id,
                    subjectId: req.body.id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
});

router.post('/uploadSyllabusFiles',async (req, res) => {
    console.log("req.body",req.body)
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    syllabusFilesModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                syllabusFilesModel.create({
                    doc_id: uploadedFile._id,
                    courseId: req.body.courseId,
                    subject: req.body.subject,
                    semesterId: req.body.semesterId,
                    description: req.body.description,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => {
                        userModel.find({
                            _id: req.body.user_id
                        }).then(function (userdetails) {
                            if (userdetails) {
                                var activity_action = " Added Syllabus.";
                                var activity_data = userdetails.fullName + " Added Syllabus files for Subject " + req.body.subject;
                                notification_function.activity(activity_action, activity_data, req.body.courseId, '');
                            }
                        })
                        res.json({
                            status: 200,
                            message: "File was saved with success"
                        })
                    }
                    ).catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        var course = await getId.getCourseId(req.body.courseId, '')
        var semester = await getId.getSemesterId(req.body.semesterId, '');
        var subject = await getId.getSubjectId(req.body.subject,course.id,semester.id)
     await   models.syllabusfiles.create({
            courseId: course.id,
            subjectId: subject.id,
            semesterId: semester.id,
            description: req.body.description,
            length: file.size,
            name: file.name,
            type: file.mimetype
        }).then(syllabusfiles => {
            var currentPath = process.cwd();
            var dir = currentPath + "/src/public/SyllabusFiles/" + syllabusfiles.id;
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
                fs.writeFile(dir + "/" + file.name, file.data, async function (err) {
                    if (err) throw err;
                    //  console.log('Saved!');
                    var user = await getId.getUserId(req.body.user_id, '')
                    models.users.find({
                        where: {
                            id: user.id
                        }
                    }).then(userdetails => {
                        var activity_action = " Added Syllabus.";
                        var activity_data = userdetails.fullName + " Added Syllabus files for Subject " + req.body.subject;
                        notification_function.activity(activity_action, activity_data, course.id, '');
                    })
                });
            })
        })
    }
});


router.post('/uploadChapterSyllabusFiles', (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    chapterSyllabusFilesModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                chapterSyllabusFilesModel.create({
                    userId: req.body.user_id,
                    unitName: req.body.unitName,
                    chapterName: req.body.chapterName,
                    doc_id: uploadedFile._id,
                    courseId: req.body.courseId,
                    subject: req.body.subject,
                    semesterId: req.body.semesterId,
                    description: req.body.description,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => {
                        userModel.find({
                            _id: req.body.user_id
                        }).then(function (userdetails) {
                            if (userdetails) {
                                console.log("userdetails " + JSON.stringify(userdetails));
                                var activity_action = " Added Syllabus.";
                                var activity_data = userdetails[0].fullName + " Added Syllabus files for Subject " + req.body.subject;
                                notification_function.activity(activity_action, activity_data, req.body.courseId, '');
                            }
                        })
                        res.json({
                            status: 200,
                            message: "File was saved with success"
                        })
                    }
                    ).catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
});

router.post('/uploadProjectSubmission',async (req, res) => {
    var evaluatorDetails = JSON.parse(req.body.evaluator)
    var counter = 0;
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    projectSubmissionModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            if (evaluatorDetails.length > 0) {
                var cloneId = mongoose.Types.ObjectId();
                if (JSON.stringify(cloneId) != null && JSON.stringify(cloneId) != undefined && JSON.stringify(cloneId) != "") {
                    evaluatorDetails.forEach(element => {
                        let writeStream = gfs.createWriteStream({
                            filename: `${filename}`,
                            mode: 'w',
                            content_type: file.mimetype
                        })

                        writeStream.on('close', function (uploadedFile) {
                            let project = new projectSubmissionModel({
                                doc_id: uploadedFile._id,
                                submissionName: req.body.submissionName,
                                courseId: req.body.courseId,
                                batchId: req.body.batchId,
                                length: uploadedFile.length,
                                name: uploadedFile.filename,
                                type: uploadedFile.contentType,
                                groupId: cloneId,
                                evaluatorId: element.evaluatorid,
                                evaluatorName: element.evaluatorname,
                                role: element.evaluatorrole,
                                Point: req.body.point
                            })
                            project.save((err, data) => {
                                if (err) {
                                    console.error(err)
                                } else {
                                    if (data) {
                                        counter++;
                                        if (counter == evaluatorDetails.length) {
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
                    });
                }
            }
        }
    })
    if (file) {
        var batch = await getId.getBatchId(req.body.batchId, '')
        var course = await getId.getCourseId(req.body.courseId, '')
        evaluatorDetails.forEach(async element => {
            var evaluator = await getId.getUserId(element.evaluatorid, '')
            models.projectsubmissions.create({
                submissionName: req.body.submissionName,
                courseId: course.id,
                batchId: batch.id,
                evaluatorId: evaluator.id,
                length: uploadedFile.length,
                name: uploadedFile.filename,
                type: uploadedFile.contentType,
                role: element.evaluatorrole,
                point: req.body.point
            }).then(projectsubmissions => {
                var currentPath = process.cwd();
                var dir = currentPath + "/src/public/ProjectSubmission/" + projectsubmissions.id;
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
                    fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                        if (err) throw err;
                        //  console.log('Saved!');
                    });
                })
            })
        })

    }
});

router.post('/uploadDeliverablesByTeacher',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    deliverablesUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                deliverablesUploadModel.create({
                    doc_id: uploadedFile._id,
                    deliverables_id: req.body.id,
                    teacher_id: req.body.teacher_id,
                    length: uploadedFile.length,
                    filename: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
});

router.post('/uploadDeliverables',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    deliverablesUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                deliverablesUploadModel.create({
                    doc_id: uploadedFile._id,
                    deliverables_id: req.body.id,
                    length: uploadedFile.length,
                    teacher_id: 'admin',
                    filename: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
});


// Author SP : 07-02-2020
router.get('/deleteBlogsFile/:doc_id', function (req, res) {
    var query = {
        doc_id: req.params.doc_id
    }

    blogUploadsModel.deleteOne(query, (err, uploadedFiles) => {
        if (uploadedFiles) {
            res.json({
                status: 200,
                message: 'removed successfully'
            })
        }
        else {
            console.err(err);
        }
    })
});

// Author SP : 07-02-2020
router.post('/uploadblogFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    blogUploadsModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                blogUploadsModel.create({
                    doc_id: uploadedFile._id,
                    blogId: req.body.id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
});


router.post('/uploadWebinarImages',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    webinarUploadsModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                webinarUploadsModel.create({
                    doc_id: uploadedFile._id,
                    webinarId: req.body.id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        webinarsModel.find({
            _id: req.body.id
        }).then(webinar => {
            if (webinar) {
                models.webinars.find({
                    where: {
                        webinarTopic: webinar[0].webinarTopic,
                        description: webinar[0].description,
                        link: webinar[0].link,
                        speaker: webinar[0].speaker,
                        date: webinar[0].date,
                        time: webinar[0].time
                    }
                }).then(web => {
                    if (web) {
                        models.webinaruploads.create({
                            webinarId: web.id,
                            length: file.size,
                            name: file.name,
                            type: file.mimetype
                        }).then(webinaruploads => {
                            var currentPath = process.cwd();
                            var dir = currentPath + "/src/public/Webinars/" + webinaruploads.id;
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
                                fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                                    if (err) throw err;
                                    //  console.log('Saved!');
                                });
                            })

                        })

                    }
                })
            }
        })
    }
});


router.post('/uploadTeacherFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    teacherDetailsUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                teacherDetailsUploadModel.find({
                    userId: req.body.userId,
                    docType: req.body.docType,
                    name: uploadedFile.filename,
                }).then(function (details) {
                    if (details == null || details == '' || details == 'undefined') {
                        teacherDetailsUploadModel.create({
                            doc_id: uploadedFile._id,
                            userId: req.body.userId,
                            docType: req.body.docType,
                            additionalInfo: req.body.additionalInfo,
                            length: uploadedFile.length,
                            name: uploadedFile.filename,
                            type: uploadedFile.contentType
                        })
                            .then(file => res.json({
                                status: 200,
                                message: "File was saved with success"
                            }))
                            .catch(err => {
                                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                                res.status(500).json({
                                    message: `[*] Error while uploading new files, with error: ${err}`
                                })
                            })
                    } else {
                        var query = {
                            userId: req.body.userId,
                            docType: req.body.docType,
                            name: uploadedFile.filename,
                        },
                            update = {
                                $set: {
                                    doc_id: uploadedFile._id,
                                    length: uploadedFile.length,
                                    name: uploadedFile.filename,
                                    type: uploadedFile.contentType

                                }
                            };
                        teacherDetailsUploadModel.findOneAndUpdate(query, update, function (req, teacherDetails) {
                            res.json({
                                status: 200,
                                data: teacherDetails
                            });

                        })

                    }
                })


            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        var user = await getId.getUserId(req.body.userId, '')
        models.teacherdetailsuploads.find({
            where: {
                userId: user.id,
                doctype: req.body.docType,
                name: file.name,
            }

        }).then(teacherdetails => {
            if (teacherdetails == null || teacherdetails == '' || teacherdetails == 'undefined') {
                models.teacherdetailsuploads.create({
                    userId: user.id,
                    docType: req.body.docType,
                    additionalInfo: req.body.additionalInfo,
                    length: file.size,
                    name: file.name,
                    type: file.mimetype
                }).then(teacherdetailsuploads => {
                    var currentPath = process.cwd();
                    var dir = currentPath + "/src/public/TeacherDetails/" + teacherdetailsuploads.id;
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
                        fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                            if (err) throw err;
                            //  console.log('Saved!');
                        });
                    })
                })
            } else {
                teacherdetails.update({
                    length: file.size,
                    name: file.name,
                    type: file.mimetype
                }).then(teacher => {
                    var currentPath = process.cwd();
                    var dir = currentPath + "/src/public/TeacherDetails/" + teacher.id;
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
                        fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                            if (err) throw err;
                            //  console.log('Saved!');
                        });
                    })
                })

            }
        })
    }
});
router.post('/uploadNoticeFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    noticeUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                noticeUploadModel.create({
                    doc_id: uploadedFile._id,
                    noticeId: req.body.noticeId,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    noticeModel.find({
        _id: req.body.noticeId
    }).then(async notices => {
        var batch = await getId.getBatchId(notices.batchId, '')
        var course = await getId.getCourseId(notices.courseId, '')
        models.notices.find({
            where: {
                batchId: batch.id,
                courseId: course.id,
                noticeName: notices[0].noticeName
            }
        }).then(notice => {
            var noticeId = notice.id
            if (file) {
                var currentPath = process.cwd();
                var dir = currentPath + "/src/public/noticeUploads/" + noticeId;
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
                    fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                        if (err) throw err;
                        //  console.log('Saved!');
                    });

                    models.noticeuploads.create({
                        filePath: dir + "/" + file.name,
                        noticeId: noticeId,
                        length: file.size,
                        name: file.name,
                        type: file.mimetype,
                    }).then((upload) => {

                        if (upload) {
                            console.log("Data Uploaded");
                        }
                    })
                })
            }
        })

    })
});

router.post('/uploadLibraryFiles',async (req, res) => {
    console.log("req.body.topiclibID===>" + req.body.topiclibID)
    gfs = Grid(connect.db);

    let { file } = req.files;
    const filename = file.name;
    console.log("filename==>" + filename)
    if (filename) {
        let writeStream = gfs.createWriteStream({
            filename: `${filename}`,
            mode: 'w',
            content_type: file.mimetype
        })

        writeStream.on('close', function (uploadedFile) {
            if (uploadedFile) {
                var query = {
                    _id: req.body.topiclibID,
                }
                update = {
                    $push: {
                        files: {
                            doc_id: uploadedFile._id,
                            length: uploadedFile.length,
                            filename: uploadedFile.filename,
                            type: uploadedFile.contentType,
                        }
                    }
                }

                topicLibraryModel.findOneAndUpdate(query, update, (err, details) => {
                    if (err) {
                        res.json({
                            status: 400
                        })
                    } else if (details) {
                        res.json({
                            status: 200,
                            data: details,
                            message: "File was saved with success"
                        })
                    }
                })

            } else {
                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                res.status(500).json({
                    message: `[*] Error while uploading new files, with error: ${err}`
                })
            }

        });
        writeStream.write(file.data);
        writeStream.end();
    }
    var liberyId = req.body.topiclibID;
    topicLibraryModel.find({
        _id: liberyId
    }).then(libery => {
        models.topiclibraries.find({
            where: {
                topicName: libery[0].topicname,
                description: libery[0].editortext,
            }
        }).then(topiclibraries => {
            if (file) {
                var fileName = file.name;
                var type = file.mimetype;
                var length = file.size;
                var currentPath = process.cwd();
                var dir = currentPath + "/src/public/libery/" + topiclibraries.id;
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
                        callback(null, currentPath + "/src/public/libery/" + topiclibraries.id);
                    },
                });
                console.log('Saved!');

                var upload = multer({
                    storage: storage,
                }).single('file');
                upload(req, res, function (err, data) {
                    fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                        if (err) {
                            console.log('Saved!', err);
                        }
                    });
                    models.topiclibraries.find({
                        where: {
                            id: topiclibraries.id
                        }
                    }).then(data => {
                        if(data){
                            data.update({
                                files: {
                                    length: length,
                                    filename: fileName,
                                    type: type,
                                }
                            }).then(data => {
    
                                console.log("data>>>>>", data)
                            })
                        }
                        
                    })
                })
            }

        })
    })

});

router.post('/uploadThumbnail',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;
    const filename = file.name;
    console.log("filename==>" + filename);
    console.log("videoname==>" + req.body.videoname);
    if (filename) {
        let writeStream = gfs.createWriteStream({
            filename: `${filename}`,
            mode: 'w',
            content_type: file.mimetype
        })

        writeStream.on('close', function (uploadedFile) {
            if (uploadedFile) {

                res.json({
                    status: 200,
                    videoname: req.body.videoname,
                    doc_id: uploadedFile._id,
                    length: uploadedFile.length,
                    filename: uploadedFile.filename,
                    type: uploadedFile.contentType,
                    message: "File was saved with success"
                })

                console.log("here req.body==>" + JSON.stringify(uploadedFile));

            } else {
                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                res.status(500).json({
                    message: `[*] Error while uploading new files, with error: ${err}`
                })
            }

        });
        writeStream.write(file.data);
        writeStream.end();
    }
    if (file) {
        var dir = currentPath + "/src/public/Thumbnail/"
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
            fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                if (err) {
                    console.log('Saved!', err);

                } else {
                    res.json({
                        status: 200,
                        videoname: req.body.videoname,
                        length: file.size,
                        filename: file.name,
                        type: file.mimetype,
                        message: "File was saved with success"
                    })
                }
            });
        })
    }
})

router.post('/uploadSignedPaymentSlip',async (req, res) => {
    gfs = Grid(connect.db);
    console.log(JSON.stringify(req.body))
    let { file } = req.files;
    var number = 1;
    facultyPayment.countDocuments({}, function (error, numOfDocs) {

        const extension = path.extname(file.name);
        extendFileName = file.name.split('.')
        const justFileName = path.basename(extendFileName[0] + 'sign', extension);
        const filename = justFileName + '' + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                facultyPayment.find({
                    invoiceNumber: req.body.invoiceNumber,
                    specialization: req.body.specialization,
                    subjects: req.body.subject,
                    teacherId: req.body.user_id,
                    type: 'signed',
                    fileName: uploadedFile.filename,
                    month: req.body.monthName,
                    year: req.body.year
                }).then(file => {
                    if (file == '' || file == undefined || file == null) {

                        facultyPayment.create({
                            invoiceNumber: req.body.invoiceNumber,
                            specialization: req.body.specialization,
                            subjects: req.body.subject,
                            teacherId: req.body.user_id,
                            type: 'signed',
                            fileName: uploadedFile.filename,
                            month: req.body.monthName,
                            year: req.body.year,
                            doc_id: uploadedFile._id
                        })
                            .then(file =>
                                console.log("file sucess"),
                                res.json({
                                    status: 200,
                                    message: "File was saved with success"
                                }))
                            .catch(err => {
                                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                                res.status(500).json({
                                    message: `[*] Error while uploading new files, with error: ${err}`
                                })
                            })

                    } else {
                        var query = {
                            invoiceNumber: req.body.invoiceNumber,
                            subjects: req.body.subject,
                            teacherId: req.body.user_id,
                            month: req.body.monthName,
                            year: req.body.year,
                            type: 'signed',
                        }
                        update1 = {
                            $set: {
                                fileName: uploadedFile.filename,
                                doc_id: uploadedFile._id
                            }
                        }
                        facultyPayment.updateOne(query, update1, function (err, signed) {
                            if (err) {
                                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                                res.status(500).json({
                                    message: `[*] Error while uploading new files, with error: ${err}`
                                })
                            } else {
                                res.json({
                                    status: 200,
                                    message: "File was saved with success"
                                })
                            }
                        })
                    }
                })


            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    
    if (file) {
        var subject = await getId.getSubjectId(req.body.subject)//remaining
        var teacher = await getId.getUserId(req.body.user_id, '')
      await  models.facultypayments.find({
            where: {
                invoiceNumber: req.body.invoiceNumber,
                specialization: req.body.specialization,
                subjectId: subject.id,
                teacherId: teacher.id,
                type: 'signed',
                fileName: file.name,
                month: req.body.monthName,
                year: req.body.year
            }
        }).then(details => {
            if (details == '' || details == undefined || details == null) {
                models.facultypayments.create({
                    invoiceNumber: req.body.invoiceNumber,
                    specialization: req.body.specialization,
                    subjectId: subject.id,
                    teacherId: teacher.id,
                    type: 'signed',
                    fileName: file.name,
                    month: req.body.monthName,
                    year: req.body.year
                }).then(FacultyPayment => {
                    var dir = currentPath + "/src/public/FacultyPayment/" + FacultyPayment.id
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
                        fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                            if (err) {
                                console.log('Saved!', err);

                            }
                        });
                    })
                })
            } else {
                details.update({
                    fileName: file.name,
                }).then(facultypayments => {
                    var dir = currentPath + "/src/public/FacultyPayment/" + facultypayments.id
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
                        fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                            if (err) {//throw err;
                                console.log('Saved!', err);

                            }
                        });
                    })
                })
            }
        })
    }
});

router.post('/uploadpocastLibraryFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;
    const filename = file.name;
    if (filename) {
        let writeStream = gfs.createWriteStream({
            filename: `${filename}`,
            mode: 'w',
            content_type: file.mimetype
        })

        writeStream.on('close', function (uploadedFile) {
            if (uploadedFile) {

                res.json({
                    status: 200,
                    videoname: req.body.videoname,
                    doc_id: uploadedFile._id,
                    length: uploadedFile.length,
                    filename: uploadedFile.filename,
                    type: uploadedFile.contentType,
                    message: "File was saved with success"
                })

                console.log("here req.body==>" + JSON.stringify(uploadedFile));

            } else {
                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                res.status(500).json({
                    message: `[*] Error while uploading new files, with error: ${err}`
                })
            }

        });
        writeStream.write(file.data);
        writeStream.end();
    }
    if (file) {
        var currentPath = process.cwd();
        var dir = currentPath + '/src/public/forum/pocastLibrary/';
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
    }
})

router.post('/uploadPlacementFile',async (req, res) => {

    gfs = Grid(connect.db);
 var currentPath = process.cwd();
    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    placementUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                placementUploadModel.create({
                    docId: uploadedFile._id,
                    placementId: req.body.placementId,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType,
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
                console.log("file", file)
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        PlacementModel.find({
            _id: req.body.placementId
        }).then(placement => {
            models.placements.find({
                where: {
                    placementName: placement[0].placementName,
                    date: placement[0].date,
                }
            }).then(place => {
                models.placementuploads.create({
                    placementId: place.id,
                    length: file.size,
                    name: file.name,
                    type: file.mimetype,
                }).then(placementuploads => {
                    if (placementuploads) {
                        var dir = currentPath + "/src/public/Placement/" + placementuploads.id
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
                            fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                                if (err) {
                                    console.log('Saved!', err);

                                }
                            });
                        })
                    }
                })
            })
        })
    }
});

router.post('/uploadLeaveFiles', async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    LeaveUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                LeaveUploadModel.create({
                    doc_id: uploadedFile._id,
                    leaveId: req.body.leaveId,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        data: file.data,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        leavesModel.find({
            _id: req.body.leaveId
        }).then(async leave => {

            var user = await getId.getUserId(leave[0].userId, '')
            var batch = await getId.getBatchId(leave[0].batchId, '')
            var course = await getId.getCourseId(leave[0].courseId, '')
            models.leaves.find({
                where: {
                    userId: user.id,
                    courseId: course.id,
                    batchId: batch.id,
                    reasonForLeave: leave[0].reasonForLeave
                }
            }).then(leaveData => {
                var fileName = file.name;
                var type = file.mimetype;
                var length = file.size;
                var currentPath = process.cwd();
                var dir = currentPath + '/src/public/Leaves/' + leaveData.id + '/';
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
                        models.leaveuploads.create({
                            leaveId: leaveData.id,
                            length: length,
                            name: fileName,
                            type: type
                        }).then(leave => {
                            console.log("leave", leave)
                        })
                    });

                })
            })
        })
    }
});

router.post('/uploadExamFiles',async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    examUploadModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                examUploadModel.create({
                    doc_id: uploadedFile._id,
                    examId: req.body.examId,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType
                })
                    .then(file => res.json({
                        status: 200,
                        message: "File was saved with success"
                    }))
                    .catch(err => {
                        logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                        res.status(500).json({
                            message: `[*] Error while uploading new files, with error: ${err}`
                        })
                    })
            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    if (file) {
        examUpdateModel.find({
            _id: req.body.examId,
        }).then(async exam => {
            var batch = await getId.getBatchId(exam[0].batchId, '')
            var course = await getId.getCourseId(exam[0].courseId, '')
            var department = await getId.getDepartmentId(exam[0].departmentId, '');
            var semester = await getId.getSemesterId(exam[0].semesterId, '');
            models.examupdates.find({
                where: {
                    departmentId: department.id,
                    courseId: course.id,
                    batchId: batch.id,
                    semesterId: semester.id,
                    description: exam[0].description,
                    title: exam[0].title
                }
            }).then(exams => {
                models.examupload.create({
                    examId: exams.id,
                    name: file.name,
                    type: file.mimetype,
                    length: file.size
                }).then(examupload => {
                var currentPath = process.cwd();
                    var dir = currentPath + "/src/public/ExamUpdates/" + examupload.id
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
                        fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                            if (err) {
                                console.log('Saved!', err);
                            }
                        });
                    })
                })
            })
        })
    }
});


module.exports = router;