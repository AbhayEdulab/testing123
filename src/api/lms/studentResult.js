var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
const csv = require('csvtojson')
require('../../app/models/batchSemesterMaster');
var batchSemesterModel = mongoose.model('BatchSemesterMaster');
require('../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
require('../../app/models/studentResult');
var studentResultModel = mongoose.model('StudentResult');
var fs = require('fs');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();


router.get('/getSemestersByBacthes', async function (req, res) {
    batchSemesterModel.find({
        batchId: req.query.id
    }).populate('semesterId').then(function (semesters) {
        res.json({
            ststus: 200,
            data: semesters
        })

    })
});


router.get('/getStudentsResult', async function (req, res) {
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
        res.json({
            status: 200,
            data: student
        })
    })
})


router.get('/getSemestersByStudent', async function (req, res) {
    studentBatchModel.aggregate([
        {
            $match: {
                studentId: {
                    $eq: req.query.userId
                },
            }
        },
        {
            "$lookup": {
                "from": "batchsemestermasters",
                "localField": "batchId",
                "foreignField": "batchId",
                "as": "semesters"
            }
        },
        {
            $unwind: {
                path: "$semesters",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                semId: {
                    $toObjectId: "$semesters.semesterId"
                }
            }
        },

        {
            "$lookup": {
                "from": "semesterNew",
                "localField": "semId",
                "foreignField": "_id",
                "as": "semesterId"
            }
        }

    ]).then(data => {
        res.json({
            status: 200,
            data: data
        })
    })


})

router.post('/uploadMarksheet', async (req, res) => {
    let { file } = req.files;
    var currentPath = process.cwd();
    var dir = currentPath + '/src/public/marksheets/' + req.body.userId;
    var resultDir = currentPath + '/src/public/results/' + req.body.userId;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    //created dir in results to save csv files.
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir);
    }
    fs.writeFileSync(dir + "/" + file.name, file.data);
    const exec = require('child_process').exec;
    exec('python ' + currentPath + '/src/api/lms/aws.py ' + dir + "/" + file.name + ' ' + req.body.userId, { maxBuffer: 1024 * 1024 * 500 }, (err, stdout, stderr) => {
        // exec('python3 '+current+'/src/routes/aws.py '+current+'/uploads/'+req.query.fileName, {maxBuffer: 1024 * 1024 * 500},(err, stdout, stderr) => {  
        if (err) {
            console.error(err);
            return;
        }

        studentResultModel.create({
            userId: req.body.userId,
            courseId: req.body.courseId,
            batchId: req.body.batchId,
            semesterId: req.body.semesterId,
            fileName: file.name,
        }, (err, saved) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    status: 200,
                    message: "File was saved with success"
                })
            }
        })


    });
    if (file) {
        var user = await getId.getUserId(body.userId, '')
        var batch = await getId.getBatchId(body.batchId, '')
        var course = await getId.getCourseId(body.courseId, '')
        var semester = await getId.getSemesterId(body.semesterId, '');
        var currentPath = process.cwd();
        var dir = currentPath + '/src/public/marksheets/' + user.id
        var resultDir = currentPath + '/src/public/results/' + user.id

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        //created dir in results to save csv files.
        if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir);
        }
        fs.writeFileSync(dir + "/" + file.name, file.data);
        const exec = require('child_process').exec;
        exec('python ' + currentPath + '/src/api/lms/aws.py ' + dir + "/" + file.name + ' ' + user.id, { maxBuffer: 1024 * 1024 * 500 }, (err, stdout, stderr) => {
            // exec('python3 '+current+'/src/routes/aws.py '+current+'/uploads/'+req.query.fileName, {maxBuffer: 1024 * 1024 * 500},(err, stdout, stderr) => {  
            if (err) {
                console.error(err);
                return;
            }
            models.studentresult.create({
                userId: user.id,
                courseId: course.id,
                batchId: batch.id,
                semesterId: semester.id,
                fileName: file.name,
            }).then(result => {
                if (result) {
                    res.json({
                        status: 200,
                        message: "File was saved with success"
                    })
                }
            })
        })
    }

})



router.get('/getUploadedMarkSheets', async function (req, res) {
    studentResultModel.find({
        userId: req.query.userId
    }).populate('courseId').populate('semesterId').populate('batchId').then(data => {
        res.json({
            status: 200,
            data: data
        })
    })
});


router.get('/readCsvFile', async function (req, res) {
    var current = process.cwd();
    var resultDir = current + '/src/public/results/' + req.query.userId + '/';
    filenames = fs.readdirSync(resultDir);

    var profile = {};
    var total = {};
    var semesters = [];
    var subjects = [];
    filenames.forEach(async file => {
        if (file.startsWith(req.query.fileName.split('.')[0] + '_Table_')) {
            const jsonArray = await csv().fromFile(resultDir + '/' + file);
            if (jsonArray[0]['P.R.N.'] != undefined && jsonArray[0]['P.R.N.'] != 'undefined') {
                profile = {
                    prn: jsonArray[0]['P.R.N.'] ? jsonArray[0]['PROGRAMME :'] : jsonArray[0]['P.R.N.'],
                    seatNo: jsonArray[0]['Seat No.'] ? jsonArray[0]['POST GRADUATE DIPLOMA IN DATA'] : jsonArray[0]['Seat No.'],
                    name: jsonArray[0]["Candidate's Name"],
                    month: jsonArray[0]['Month & Year of Examination'] ? jsonArray[0]['& Year of'] : jsonArray[0]['Month & Year of Examination'],
                    year: jsonArray[0]['field5']
                }
            } else if (jsonArray[0].field1 == "Course Code") {
                var academicTotal = 0;
                var cgTotal = 0;
                var creditPointTotal = 0;
                await jsonArray.forEach(async elm => {
                    if (elm['field1'] == "Course Code") {

                    } else {
                        subjects.push({
                            courseCode: elm['field1'],
                            courseTitle: elm['field2'],
                            internalMarks: elm['INTERNAL'],
                            internal: elm['(I)'],
                            externalMarks: elm['EXTERNAL'],
                            external: elm['(E)'],
                            total: elm['TOTAL'],
                            marksTotal: elm['(I+E)'],
                            grades: elm['field9'],
                            gradePoint: elm['Grade'],
                            creditPoint: elm['Credit'],
                            cg: elm['field12'] ? elm['field12'] : elm['CG =']

                        })
                        academicTotal += parseInt(elm['(I+E)']);
                        cgTotal += elm['field12'] ? parseInt(elm['field12']) : parseInt(elm['CG =']);
                        creditPointTotal += parseInt(elm['Credit']);
                        total = { academicTotal: academicTotal, cgTotal: cgTotal, creditPointTotal: creditPointTotal }
                    }
                })

            } else if (jsonArray.length == 2) {
                await jsonArray.forEach(sem => {
                    for (let i = 1; i <= 15; i++) {
                        semesters.push({
                            semesterName: i != 6 ? sem['field' + i] : sem['field' + i] ? sem['field' + i] : sem['RESULT ='],
                            credits: sem['field' + (i + 2)] ? sem['field' + (i + 2)] : '20',
                            sgpi: sem['field' + (i + 4)],
                        })
                        i += 4;
                    }
                })
            }
        }
    });

    var query = {
        userId: req.query.userId,
        fileName: req.query.fileName,
    }
    setTimeout(() => {
        studentResultModel.findOneAndUpdate(query, {
            $set: {
                profile: Object.assign({}, profile, total),
                subjects: subjects,
                semesters: semesters,
            }
        }, (err, data) => {
            if (err) {
                // console.err(err);
            } else {
                res.json({
                    status: 200,
                    data: {
                        profile: Object.assign({}, profile, total),
                        subjects: subjects,
                        semesters: semesters
                    }
                })
            }
        })


    }, 2000);


});


router.get('/download', (req, res) => {
    let fileName = req.query.fileName;
    var currentPath = process.cwd();
    var dir = currentPath + '/src/public/marksheets/' + req.query.userId + '/' + req.query.fileName
    let data = [];
    let readstream = fs.createReadStream(dir);
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


router.delete('/deleteMarklist', function (req, res) {
    var current = process.cwd();
    var dir = current + '/src/public/marksheets/' + req.query.userId + '/';
    var resultDir = current + '/src/public/results/' + req.query.userId + '/';
    var query = {
        userId: req.query.userId,
        fileName: req.query.fileName
    }
    studentResultModel.findOneAndRemove(query).exec(function (err, data) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error!!!....'
            });
        } else {
            fs.unlinkSync(dir + req.query.fileName);
            filenames = fs.readdirSync(resultDir);
            filenames.map(file => {
                if (file.startsWith(req.query.fileName.split('.')[0] + '_Table_')) {
                    fs.unlinkSync(resultDir + file);
                }
            })
            res.json({
                status: 200,
                message: 'Deleted Successfully!!!....'
            });
        }

    })
});
router.get('/showImageFile', async function (req, res) {
    studentResultModel.find({
        userId: req.query.userId
    }).populate('courseId').populate('semesterId').populate('batchId').then(data => {
        res.json({
            status: 200,
            data: data
        })
    })
});
router.get('/getTeacherSemestersByBacthes', async function (req, res) {
    batchSemesterModel.find({
        batchId: req.query.id,

    }).populate('semesterId').then(function (semesters) {
        res.json({
            ststus: 200,
            data: semesters
        })

    })
});

router.get('/getstudentList', function (req, res) {
    var students = [];
    studentBatchModel.find({
        batchId: req.query.batchId,
        courseId: req.query.courseid

    }).populate('studentId', ['fullName']).then(function (studentId) {
        if (studentId != null || studentId == true) {
            studentId.forEach(element => {
                students.push({
                    studentId: element.studentId._id,
                    studentName: element.studentId.fullName,
                })
            })
            res.json({
                status: 200,
                data: students
            })
        } else {
            res.json({
                status: 400,
                message: "No Sems found..."
            })
        }
    })
});

module.exports = router;