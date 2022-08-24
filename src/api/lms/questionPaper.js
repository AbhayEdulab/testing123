var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var paperSetterSchema = require('../../app/models/paperSetter');
var paperSetterModel = mongoose.model('paperSetter');
var userSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var topicOfTheDaySchema = require('../../app/models/topicOfTheDay');
var TopicOfTheDayModel = mongoose.model('TopicOfTheDay');
var ChapterSchema = require('../../app/models/chapter');
var chapterModel = mongoose.model('Chapter');
var uploads = require('../../app/models/uploads');
require('../../app/models/onlineLectureLink');
var onlineLectureLinkModel = mongoose.model('OnlineLectureLink');
require('../../app/models/chapteryoutubelinks');
var youTubeLinkModel = mongoose.model('YouTubeLink');
const Grid = require('gridfs-stream');
const connect = mongoose.connection;
var gfs;
var router = express.Router();
require('../../app/models/paperSetUpload');
var PaperSetUpload = mongoose.model('PaperSetUpload');
var moment = require('moment');
const config = require('config');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var SemesterNewSchema = require('../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
const {  filelink } = config.get('api');
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();
const fs = require('fs');
router.get('/paperSetterDetails', function (req, res) {
    var userData;

    paperSetterModel.find({
        userId: req.query.userId
    }).then(function (userDetails) {
        if (userDetails != null || userDetails != undefined || userDetails != '') {
            setTimeout(() => {
                res.json({
                    status: 200,
                    data: userDetails,
                    paperSetterFlag: true,
                })
            }, 500)
        }

    })

})

router.get('/findChapters', function (req, res) {
    var upload = [];
    var onlineLectures = [];
    var youTubeLink = [];

    TopicOfTheDayModel.find(
        {
            subject: req.query.subject,
            date: { $gte: req.query.startDate, $lt: req.query.endDate }
        }).then(function (chaptersCoverd) {
            chaptersCoverd.forEach((topic) => {
                chapterModel.find({
                    subject: req.query.subject,
                    chapterName: topic.topicNames
                }).then(function (chapter) {
                    if (chapter != '') {
                        chapter.forEach((chapterUpload) => {
                            uploads.find({
                                lessonId: chapterUpload._id,
                            }).then(function (uploads) {
                                uploads.forEach((file) => {
                                    upload.push(file)
                                })
                            })
                            onlineLectureLinkModel.find({
                                chapterId: chapterUpload._id
                            }).then(function (onlineLecture) {
                                onlineLecture.forEach((onlineLectureLink) => {
                                    onlineLectures.push(onlineLectureLink)
                                })
                            })
                            youTubeLinkModel.find({
                                chapterId: chapterUpload._id
                            }).then(function (youTubeLinks) {
                                youTubeLinks.forEach((youTubeLinkData) => {
                                    youTubeLink.push(youTubeLinkData)
                                })
                            })
                        })

                    }
                })

            })
            setTimeout(() => {
                res.json({
                    status: 200,
                    uploadFile: upload,
                    onlineLectureLinks: onlineLectures,
                    youTubeLink: youTubeLink
                })
            }, 8000)
        })
})

router.post('/excelFileConvert',async  function (req, res) {
    gfs = Grid(connect.db)
    let {
        file
    } = req.files;

    let writeStream = gfs.createWriteStream({
        filename: `${file.name}`,
        mode: 'w',
        content_type: file.mimetype
    })

    writeStream.on('close', function (paperSet) {
        let paperSetUpload = new PaperSetUpload({
            batchId: req.body.batchId,
            userId: req.body.userId,
            courseId: req.body.courseId,
            semesterId: req.body.semesterId,
            subject: req.body.subject,
            name: paperSet.filename,
            doc_id: paperSet._id,
            fileLength: paperSet.length,
            type: paperSet.contentType

        })
        paperSetUpload.save((err, data) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    status: 200
                })
            }
        })
    });
    writeStream.write(file.data);
    writeStream.end();
    //SQL upload
    var user = await getId.getUserId(req.body.userId, '')
    var batch = await getId.getBatchId(req.body.batchId, '')
    var course = await getId.getCourseId(req.body.courseId, '')
    var semester = await getId.getSemesterId(req.body.semesterId, '');
    var subject = await getId.getSubjectId(req.body.subject,course.id,semester.id)
    if (file) {
        var fileName = file.name;
        var type = file.mimetype;
        var length = file.size;
     await   models.papersetUpload.create({
            userId: user.id,
            batchId: batch.id,
            courseId: course.id,
            subjectId: subject.id,
            semesterId: semester.id,
            filename: file.name,
            fileLength: file.size,
            type: file.mimetype
        }).then(paperSet => {
            if (paperSet) {
                var currentPath = process.cwd();
                var dir = currentPath + "/src/public/paperSets/" + paperSet.id;
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
                        callback(null, currentPath + '/src/public/paperSets/' + paperSet.id);
                    },

                });
                var upload = multer({
                    storage: storage,
                }).single('file');
                upload(req, res, function (err, data) {
                    fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                        if (err) throw err;
                        //  console.log('Saved!');

                        // res.send({
                        //     status: 200,
                        //     data: paperSet
                        // })



                    });
                })
            }
        })
    }
})

router.get('/getPaperSetsData', function (req, res) {
    var view_data = [];
    collegeCourseModel.find({
        courseName: req.query.courseName
    }).exec(function (err, courses) {
        if (courses != '' || courses != undefined) {
            courses.forEach(function (course) {
                PaperSetUpload.find({
                    courseId: course._id,
                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).populate('batchId', ['batchName','year']).sort({
                    'createdAt': -1
                }).exec(function (err, paperSets) {
                    if (paperSets != '') {
                        paperSets.forEach(function (paper) {
                            view_data.push({
                                _id: paper._id,
                                courseId: paper.courseId._id,
                                courseName: paper.courseId.courseName,
                                semesterId: paper.semesterId._id,
                                semesterName: paper.semesterId.semesterName,
                                subject: paper.subject,
                                doc_id: paper.doc_id,
                                fileName: paper.name,
                                type: paper.type,
                                createdAt: paper.createdAt,
                                batchId :paper.batchId._id,
                                batchName :paper.batchId.batchName,
                                batchYear :paper.batchId.year
                            })
                        });
                        res.json({
                            status: 200,
                            data: view_data
                        });
                    } else if (paperSets == '') {
                        res.json({
                            message: 'There is no paperSets for this course...!'
                        })
                    }

                });
            })
        }


    })


});


router.get('/getPaperSetsWithSubject', function (req, res) {
    var view_data = [];
    PaperSetUpload.find({
        courseId: req.query.courseId,
        semesterId:req.query.semesterId,
        subject: req.query.subject,
        }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).populate('batchId', ['batchName','year']).sort({
        'createdAt': -1
    }).exec(function (err, paperSets) {
        if (paperSets != '') {
            paperSets.forEach(function (paper) {
                view_data.push({
                    _id: paper._id,
                    courseId: paper.courseId._id,
                    courseName: paper.courseId.courseName,
                    semesterId: paper.semesterId._id,
                    semesterName: paper.semesterId.semesterName,
                    subject: paper.subject,
                    doc_id: paper.doc_id,
                    fileName: paper.name,
                    type: paper.type,
                    createdAt: paper.createdAt,
                    batchId :paper.batchId._id,
                    batchName :paper.batchId.batchName,
                    batchYear :paper.batchId.year,
                    file_link: `${filelink}/api/viewCourse/download?document_id=${paper.doc_id}`,
                })
            });
            res.json({
                status: 200,
                data: view_data
            });
        } else if (paperSets == '') {
            res.json({
                message: 'There is no paperSets for this course...!'
            })
        }

    });

})


router.get('/getPaperSetsData1', function (req, res) {
    var subjects = []
    var view_data = []
    var semesterName;
    var courseName;
    if (req.query.courseName == 'B.Sc') {
        courseName = 'BSc'
    } else if (req.query.courseName == 'M.Sc') {
        courseName = 'MSc'
    } else if (req.query.courseName == 'PG Diploma') {
        courseName = 'Diploma'
    }
            PaperSetUpload.find({
                semesterId: req.query.semName
            }).populate('batchId', ['batchName','year']).populate('semesterId', ['semesterName']).then(paperset => {
                paperset.forEach(element => {
                    view_data.push({
                        courseId: element.courseId,
                        courseName: req.query.courseName,
                        semesterId: element.semesterId._id,
                        semesterName: element.semesterId.semesterName,
                        _id: element._id,
                        userId: element.userId,
                        subject: element.subject,
                        fileName: element.name,
                        doc_id: element.doc_id,
                        createdAt: element.createdAt,
                        batchId : element.batchId._id,
                        batchName :element.batchId.batchName,
                        batchYear :element.batchId.year
                    })
                })

        setTimeout(function () {
            res.json({
                status: 200,
                data: view_data
            })
        }, 3000)
    })
})


module.exports = router;