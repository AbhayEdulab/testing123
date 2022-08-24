const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../../app/models/user');
const userModel = mongoose.model('User');
require('../../app/models/collegeCourse');
require('../../app/models/newtimetable');
var timeTableModel = mongoose.model('NewTimeTable');
var moment = require('moment');
var courseModel = mongoose.model('Course');
const config = require('config');
const {
    filelink
} = config.get('api');
// const { phoneNo, accountSid ,authToken } = config.get('twilio');
facultyPayment = require('../../app/models/facultyPayment');
var facultyPayment = mongoose.model('facultyPayment');
var self_PDF = require('../lms/pdfMake');
// var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
// var EnrollmentDetailsSchema = require('../../../app/models/enrollmentdetails');
var enrollmentDetailModel = mongoose.model('EnrollmentDetail');
var notification_function = require('./../../utils/function');
var NewTimeTableModel = mongoose.model('NewTimeTable');
require('../../app/models/pdfTracking');
var PdfTrackingModel = mongoose.model('PdfTracking');
var CollegeDepartmentSchema = require('../../app/models/collegeDepartment');
var collegeDepartmentModel = mongoose.model('CollegeDepartment');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var NewCourseSchema = require('../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
require('../../app/models/blogs');
var blogsModel = mongoose.model('Blogs');
require('../../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
require('../../app/models/topicOfTheDay');
var topicOfTheDayModel = mongoose.model('TopicOfTheDay');
require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
require('../../app/models/newDivision');
var divisionModel = mongoose.model('newDivision');
require('../../app/models/semesterNew');
var semesterModel = mongoose.model('semesterNew');
require('../../app/models/subject');
var subjectModel = mongoose.model('Subject');
require('../../app/models/studentDivision');
var studentDivisionModel = mongoose.model('StudentDivision');
require('../../app/models/multitimetable')
var multiTimeTableModel = mongoose.model('MultiTimeTable')
require('../../app/models/blogUploads');
var blogUploadsModel = mongoose.model('BlogUploads');
const xlsx = require('xlsx');
require('../../app/models/studentBatch');
var studentBatches = mongoose.model('StudentBatch');
var emailService = require('../../utils/emailService');
var sha1 = require('sha1');
const request = require('request');
var parseString = require('xml2js').parseString;
require('../../app/models/onlineLectureAttendence');
var OnlineLectureAttendenceModel = mongoose.model('OnlineLectureAttendence');
require('../../app/models/lectureJoinLinks');
var LectureJoinLinksModel = mongoose.model('LectureJoinLinks');
var json2xls = require('json2xls');
var base64 = require('file-base64');
var fs = require('fs');
var AttendanceSchema = require('../../app/models/attendance');
const deliverables = require('../../app/models/deliverables');
var attendanceModel = mongoose.model('Attendance');
require('../../app/models/deliverables')
var DeliverablesModel = mongoose.model('Deliverables');
require('../../app/models/deliverablesUpload')
var deliverablesUploadModel = mongoose.model('DeliverablesUpload');
require('../../app/models/batchSemesterMaster');
var batchSemesterMasterModel = mongoose.model('BatchSemesterMaster');
require('../../app/models/cohorttimetable')
var cohortTimeTableModel = mongoose.model('CohortTimeTable')
require('../../app/models/cohortTeacher')
var cohortTeacherModel = mongoose.model('CohortTeacher')
//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();
// sheduleExportExcel route function call
let getMonthlydata = async (start, end, res) => {
    var view_data = [];
    //find in database
    await NewTimeTableModel.find({
        date: {
            $gte: start,
            $lte: end
        }
    }).sort({
        'date': -1
    }).then(async data => {

        for (let element of data) {

            view_data.push({
                Date: element.date ? element.date : '-',
                BatchName: element.batchName ? element.batchName : '-',
                SemesterName: element.semesterName ? element.semesterName : '-',
                Subject: element.subject ? element.subject : '-',
                Faculty: element.teacherName ? element.teacherName : '-',
                fromTime: element.fromTime ? element.fromTime : '-',
                toTime: element.toTime ? element.toTime : '-',
                PlaybackLink: element.playbackLink ? element.playbackLink : '-',
                courseName: element.courseName ? element.courseName : '-',
                location: element.location ? element.location : '-',
                approval: element.approval ? element.approval : '-',
                // TopicCovered : element.topic.topicNames ? element.topic.topicNames : '-',
                // PresentStudents : element.present.length ? element.present.length : '-',
                // AbsentStudents : element.absent.length ? element.absent.length : '-',  
                // TotalStudents : element.total.length ? element.total.length : '-',
            })

        }
    })

    //if data available then create excel
    if (view_data) {
        var xls = await json2xls(view_data);
        var currentPath = await process.cwd();
        fs.writeFileSync(currentPath + '/src/public/excel_sheets/shedule.xlsx', xls, 'binary');
        var filepath = currentPath + '/src/public/excel_sheets/shedule.xlsx';

        //res only available when route is called thus handled res here
        if (res) {
            res.json({
                status: 200,
                data: filepath,
            });
        } else {
            return filepath
        }

    }
    //if data not avaiale then handle error 
    else {
        if (res) {
            res.json({
                status: 400,
                message: 'Excel is Not generated!!!!!!........'
            });
        } else {
            return null;
        }
    }

}

router.get('/getTeacherOfSubject', (req, res) => {
    var locationss = [];
    teacherModel.find({
        semesterId: req.query.id,
        subject: req.query.subject,
        course_id: req.query.course_id
    }).populate('teacher_id', ['fullName']).then(function (teachers) {
        if (teachers != "" || teachers != null) {
            NewTimeTableModel.find({

            }).then(function (locations) {
                locations.forEach(location => {
                    locationss.push(
                        location.location,
                    )
                })
            })
            // teachers.forEach(element =>{
            //     courses.push({
            //         _id : element._id,
            //         teacher_id :element.teacher_id,
            //         teacherName : element.teacher_id.fullName,
            //     })
            // })

        }
        setTimeout(() => {
            res.send({
                status: 200,
                data: teachers,
                data2: locationss
            })
        }, 1500);

    })
})

router.get('/getcourses', (req, res) => {

    collegeCourseModel.find({

    }).then(function (courseData) {
        if (courseData) {
            res.send({
                status: 200,
                data: courseData
            })
        }
    })
})

router.get('/getBatches/:id/', (req, res) => {
    batchMasterModel.find({
        courseId: req.params.id
    }).then(function (batches) {
        if (batches) {
            res.send({
                status: 200,
                data: batches
            })
        }
    })
})

router.get('/getSemester', (req, res) => {
    semesterModel.find({

    }).then(function (semesters) {
        if (semesters) {
            res.send({
                status: 200,
                data: semesters
            })
        }
    })
})

router.get('/getDivisions', (req, res) => {
    divisionModel.find({
        courseId: req.query.courseId,
        batchId: req.query.batchId
    }).then(function (divisions) {
        if (divisions) {
            res.send({
                status: 200,
                data: divisions
            })
        }
    })
})

router.get('/getTeacherList', (req, res) => {
    var teacherArray = [];
    teacherModel.find({
        course_id: req.query.course_id,
        semesterId: req.query.semesterId
    }).populate('teacher_id', ['fullName']).then((teachers) => {
        teachers.forEach(el => {
            teacherArray.push(el.teacher_id)
        })
        res.json({
            status: 200,
            data: teacherArray
        })
    })
})

router.get('/getSubjects', (req, res) => {
    var subjects = [];
    subjectModel.find({
        semesterId: req.query.id,
        courseId: req.query.course_id
    }).exec(function (err, course) {
        if (course != '') {
            course.forEach(function (courses) {
                var sub1 = courses.subject;
                var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                var sub = sub2.replace(/^"(.*)"$/, '$1');
                var strs = sub.split('","');
                strs.forEach(function (subject) {
                    subjects.push({
                        subject: subject
                    });
                });
            });
            res.json({
                status: 200,
                data: subjects,
            });
        } else {
            res.json({
                status: 400
            });
        }

    });
})

router.get('/getcourseNameData', (req, res) => {
    collegeCourseModel.find({}, {
        _id: 1,
        courseName: 1
    })
        .then(function (courseData) {
            if (courseData) {
                res.send({
                    status: 200,
                    data: courseData
                })
            }
        })
})

router.post('/saveTimeTable', (req, res) => {
    saveTimeTable(req.body)
    var newTimeTable = new timeTableModel({});
    timeTableModel.create({
        courseName: req.body.courseName,
        semesterName: req.body.semesterName,
        subject: req.body.subject,
        batchName: req.body.batchName,
        divisionName: req.body.divisionName,
        teacherName: req.body.teacherName,
        teacher_id: req.body.teacher_id,
        date: req.body.date,
        fromTime: req.body.fromTime,
        toTime: req.body.toTime,
        location: req.body.location,
        course_id: req.body.course_id,
        batch_id: req.body.batch_id,
        division_id: req.body.division_id,
        semester_id: req.body.semester_id,
        approval: "Approved"

    }, (err, dataInserted) => {
        if (err) {
            console.error(err)
        } else {
            studentBatches.find({
                batchId: req.body.batch_id,
            }).then(function (students) {
                students.forEach(function (user) {
                    var url = 'pages/calendar';
                    var action = "Student Timetable.";
                    var activity_data = req.body.teacherName + " Added timetable for course " + req.body.courseName + " ,batch " + req.body.batchName + " and subject " + req.body.subject;
                    notification_function.notification(action, activity_data, user.studentId, url, '');
                })
                res.json({

                    status: 200,
                    data: dataInserted
                })
                var url = "pages/calendar";
                teacherModel.find({
                    divisionId: req.body.division_id,
                    subject: req.body.subject,
                }).then(function (teachers) {
                    teachers.forEach(function (teacher) {
                        var action = "Admin Added TimeTable";
                        var notification_data = "New class for " + req.body.subject + " on " + req.body.date + " from " + req.body.fromTime + " till " + req.body.toTime;
                        notification_function.notification(action, notification_data, teacher.teacher_id, url, '');
                    })
                });
            })
        }
    })

})
async function saveTimeTable(body) {
    var batch = await getId.getBatchId(body.batch_id, '')
    var course = await getId.getCourseId(body.course_id, '')
    var semester = await getId.getSemesterId(body.semester_id, '');
    var subject = await getId.getSubjectId(body.subject, course.id, semester.id)
    var division = await getId.getDivisionId(body.division_id, '')
    var user = await getId.getUserId(body.teacher_id, '')
  await  models.newtimetables.create({
        subjectId: subject.id,
        teacherId: user.id,
        date: body.date,
        fromTime: body.fromTime,
        toTime: body.toTime,
        location: body.location,
        courseId: course.id,
        batchId: batch.id,
        divisionId: division.id,
        semesterId: semester.id,
        approval: "Approved",
        cancelByRole: null,
        cancelByUser: null
    }).then(timetables => {
        console.log("timetables")
        console.log('New time table saved');
        // if (timetables) {
        //     models.studentbatches.getStudent(batch.id).then(student => {
        //         models.subject.find({
        //             where: {
        //                 id: subject.id,
        //             }
        //         }).then(subject => {
        //             student.forEach(elm => {
        //                 var url = 'pages/calendar';
        //                 var action = "Student Timetable.";
        //                 var activity_data = elm.fullName + " Added timetable for course " + elm.courseName + " ,batch " + elm.batchName + " and subject " + subject.subject;
        //                 notification_function.notification(action, activity_data, elm.studentId, url, '');
        //             })
        //             var url = "pages/calendar";
        //             models.teachers.find({
        //                 where: {
        //                     divisionId: division.id,
        //                     subjectId: subject.id,
        //                 }
        //             }).then(teacher => {
        //                 teacher.forEach(elm => {
        //                     var action = "Admin Added TimeTable";
        //                     var notification_data = "New class for " + subject.subject + " on " + body.date + " from " + body.fromTime + " till " + body.toTime;
        //                     notification_function.notification(action, notification_data, elm.teacherId, url, '');
        //                 })
        //             })
        //         })

        //     })
        // }
    })
}
// router.get('/weekWiseTimeTable', (req, res) => {
//     var counter = 0;
//     timeTableModel.find({
//         week: moment().week()
//     }, (err, nameOfTheTeacher) => {
//         if (err) {
//             console.error(err)
//         } else {
//             res.json({
//                 status: 200,
//                 data: nameOfTheTeacher
//             })
//         }
//     })
// })

router.post('/pagecount', function (req, res) {
    pagecount(req)
    PdfTrackingModel.find({
        user_id: req.body.user_id,
        doc_id: req.body.doc_id,
        chapterId: req.body.lessonId,
    }).then(function (user) {

        if (user == null || user == '' || user == 'undefined' || user == undefined) {

            var pdfTracking = new PdfTrackingModel({
                doc_id: req.body.doc_id,
                user_id: req.body.user_id,
                totalPages: req.body.totalPages,
                percentage: req.body.percentage,
                page_count: req.body.pageCount,
                chapterId: req.body.lessonId,
                // course_id: req.body.course_id,


            });
            pdfTracking.save(function (err, result) {
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
                doc_id: req.body.doc_id,
                chapterId: req.body.lessonId,
            },
                update = {
                    $set: {
                        page_count: req.body.pageCount,
                        percentage: req.body.percentage,
                    }
                };
            PdfTrackingModel.updateMany(query, update, function (err, lessons) {
                if (err) {
                    res.send({
                        status: 500
                    })
                }
            })
        }

    });
});
async function pagecount(req) {
    var user = await getId.getUserId(req.body.user_id, '')
    var chapter = await getId.getChapterId(req.body.lessonId, '')
    models.pdftrackings.find({
        where: {
            userId: user.id,
            chpaterId: chapter.id,
            filename: req.body.name
        }
    }).then(user => {
        if (user == null || user == '' || user == 'undefined' || user == undefined) {
            models.pdftrackings.create({
                filename: req.body.name,
                userId: user.id,
                totalPages: req.body.totalPages,
                percentage: req.body.percentage,
                pageCount: req.body.pageCount,
                chapterId: chapter.id,
            }).then(pdf => {
                console.log("pdf")
            })
        }
        else {
            user.update({
                pageCount: req.body.pageCount,
                percentage: req.body.percentage,
            }).then(update => {
                console.log("update")
            })
        }
    })
}
router.get('/getPdfTrackingData/:id/:chapterId', function (req, res) {
    PdfTrackingModel.find({
        user_id: req.params.id,
        chapterId: req.params.chapterId
    }).then(function (data) {
        setTimeout(() => {
            res.json({
                status: 200,
                data: data
            })
        }, 100);
    });
})

// router.post('/saveBlogs', (req, res) => {
//     if (req.body.id) {
//         if (req.body.category == 'News') {
//             if (req.body.id) {
//                 var query = {
//                     _id: req.body.id
//                 },
//                     update = {
//                         $set: {
//                             title: req.body.title,
//                             date: req.body.date,

//                             description: req.body.description,

//                         }
//                     };
//                 blogsModel.findOneAndUpdate(query, update, function (req, updateBlog) {
//                     res.json({
//                         status: 200,
//                         data: updateBlog
//                     });

//                 });
//             }
//         } else if (req.body.category == 'Updates') {
//             if (req.body.id) {
//                 var query = {
//                     _id: req.body.id
//                 },
//                     update = {
//                         $set: {
//                             title: req.body.title,
//                             date: req.body.date,
//                             description: req.body.description,
//                             // courseId:req.body.courseId,
//                             //batchId:req.body.batchId

//                         }
//                     };
//                 blogsModel.findOneAndUpdate(query, update, function (req, updateBlog) {
//                     res.json({
//                         status: 200,
//                         data: updateBlog
//                     });

//                 });
//             }

//         }
//     } else {
//         if (req.body.category == 'News') {
//             var newBlogs = new blogsModel({});
//             blogsModel.create({
//                 title: req.body.title,
//                 date: req.body.date,
//                 category: req.body.category,
//                 description: req.body.description,

//             }, (err, dataInserted) => {
//                 if (err) {
//                     console.error(err)
//                 } else {
//                     var action = "Admin Added Industry Connect";
//                     var notification_data = "New Industry Connect Article added :" + req.body.title;
//                     // userModel.find ({
//                     //     role : 'student' 
//                     //   }).then(function(users){
//                     //     users.forEach(function(user){
//                     //         notification_function.notification(action, notification_data, user._id,'','');
//                     //       })
//                     //   });
//                     res.json({
//                         status: 200,
//                         data: dataInserted
//                     })
//                 }
//             })
//         } else if (req.body.category == 'Updates') {
//             var newBlogs = new blogsModel({});
//             blogsModel.create({
//                 title: req.body.title,
//                 date: req.body.date,
//                 category: req.body.category,
//                 description: req.body.description,
//                 courseId: req.body.courseId,
//                 batchId: req.body.batchId

//             }, (err, dataInserted) => {
//                 if (err) {
//                     console.error(err)
//                 } else {
//                     var action = "Admin Added  Updates";
//                     var notification_data = "New Updates Article added :" + req.body.title;
//                     // studentDivisionModel.find ({
//                     //     batchId : req.body.batchId
//                     //   }).then(function(users){
//                     //     users.forEach(function(user){
//                     //         notification_function.notification(action, notification_data, user.studentId,'','');
//                     //       })
//                     //   });
//                     res.json({
//                         status: 200,
//                         data: dataInserted
//                     })
//                 }
//             })

//         }
//     }


// })

// router.post('/deleteBlogs', function (req, res) {
//     blogsModel.findByIdAndRemove(req.body.id, function (err, deleteBlog) {
//         if (err) {
//             res.json({
//                 status: 400
//             })
//         } else {
//             blogUploadsModel.deleteMany({
//                 blogId: req.body.id
//             }, function (err, deleteBlog) {
//                 if (err) {
//                     res.json({
//                         status: 400
//                     })
//                 }
//             })
//             res.json({
//                 status: 200
//             })
//         }
//     })
// });

// router.get('/getBlogs/:category', (req, res) => {
//     var view_data = [];
//     if (req.params.category == "News") {
//         blogsModel.aggregate([{
//             $addFields: {
//                 id: {
//                     $toString: "$_id"
//                 }
//             }
//         },
//         {
//             $match: {
//                 category: {
//                     $eq: req.params.category
//                 }
//             }
//         },
//         {
//             "$lookup": {
//                 "from": "bloguploads",
//                 "localField": "id",
//                 "foreignField": "blogId",
//                 "as": "blogUploads"
//             }
//         },
//         ]).then(function (blogs) {
//             if (blogs) {
//                 res.send({
//                     status: 200,
//                     data: blogs,
//                 })
//             }
//         })
//     } else if (req.params.category == "Updates") {
//         blogsModel.aggregate([{
//             $addFields: {
//                 id: {
//                     $toString: "$_id"
//                 }
//             }
//         },
//         {
//             $addFields: {
//                 courseId: {
//                     $toObjectId: "$courseId"
//                 }
//             }
//         },
//         {
//             $addFields: {
//                 batchId: {
//                     $toObjectId: "$batchId"
//                 }
//             }
//         },
//         {
//             $match: {
//                 category: {
//                     $eq: req.params.category
//                 }
//             }
//         },
//         {
//             "$lookup": {
//                 "from": "bloguploads",
//                 "localField": "id",
//                 "foreignField": "blogId",
//                 "as": "blogUploads"
//             }
//         },
//         {
//             "$lookup": {
//                 "from": "collegecourses",
//                 "localField": "courseId",
//                 "foreignField": "_id",
//                 "as": "courses"
//             }
//         },
//         {
//             "$lookup": {
//                 "from": "batchmasters",
//                 "localField": "batchId",
//                 "foreignField": "_id",
//                 "as": "batches"
//             }
//         },
//         ]).then(function (blogs) {
//             if (blogs) {
//                 res.send({
//                     status: 200,
//                     data: blogs,
//                 })
//             }
//         })
//     }
// });

// router.get('/getBlogsData/:id', (req, res) => {

//     blogsModel.aggregate([{
//         $addFields: {
//             id: {
//                 $toString: "$_id"
//             }
//         }
//     },
//     {
//         $match: {
//             id: {
//                 $eq: req.params.id
//             }
//         }
//     },
//     {
//         "$lookup": {
//             "from": "bloguploads",
//             "localField": "id",
//             "foreignField": "blogId",
//             "as": "blogUploads"
//         }
//     },
//     ]).then(function (blogs) {
//         if (blogs) {
//             res.send({
//                 status: 200,
//                 data: blogs,
//             })
//         }
//     })
// });

router.post('/updateTimeTable', function (req, res) {
    upadteTimeTable(req.body)
    var sendData = {}
    var query = {
        _id: req.body.id
    }
    timeTableModel.findOneAndUpdate(query, {
        $set: {
            approval: req.body.approval,
            reason: req.body.reason,
            cancelByRole: req.body.role,
            cancelByUser: req.body.user_id,
            updatedOn: moment(new Date())
        }
    }, (err, data) => {
        if (err) {
            console.err(err);
        } else {
            studentBatches.find({
                batchId: data.batch_id
            }).then(student => {
                var url = "pages/calendar";
                student.forEach(elm => {
                    userModel.find({
                        _id: elm.studentId
                    }).then(function (userdetails) {
                        if (userdetails) {
                            var activity_action = req.body.approval + " Timetable.";
                            var activity_data = userdetails[0].fullName + ' ' + req.body.approval + " timetable of subject " + req.body.subject + " and division " + req.body.divisionName;
                            notification_function.activity(activity_action, activity_data, '', '');
                            sendData = {
                                email: userdetails[0].email,
                                fullName: userdetails[0].fullName,
                                teacherName: data.teacherName,
                                date: data.date,
                                subject: data.subject,
                                fromTime: data.fromTime,
                                toTime: data.toTime,
                                reason: req.body.reason,
                                batchName: data.batchName,
                                courseName: data.courseName

                            }
                            emailService.StudentcancelLecture(sendData, req.body.reason);

                        }
                    })
                })
                emailService.AdmincancelLecture(data, req.body.reason)

            })

            // if (req.body.approval == 'Approved') {
            //     studentDivisionModel.find({
            //         divisionId: req.body.division_id,
            //     }).then(function (users) {
            //         users.forEach(function (user) {
            //             var action = "Admin Added TimeTable";
            //             var notification_data = "New class for " + req.body.subject + " on " + req.body.date + " from " + req.body.fromTime + " till " + req.body.toTime;
            //             notification_function.notification(action, notification_data, user.studentId, url, '');
            //         })
            //     });
            // }
            // userModel.find({
            //     role: 'admin'
            // }).then(function (users) {
            //     users.forEach(function (user) {
            //         if (req.body.approval == 'Approved') {
            //             var action = "Teacher Approved TimeTable";
            //             var notification_data = req.body.fullName + " Approved time table of class " + req.body.subject + " on " + req.body.date;
            //             notification_function.notification(action, notification_data, user._id, url, '');
            //         } else {
            //             var action = "Teacher Unapproved TimeTable";
            //             var notification_data = req.body.fullName + " Unapproved time table of class " + req.body.subject + " on " + req.body.date;
            //             notification_function.notification(action, notification_data, user._id, url, '');
            //         }

            //     })
            // });
            res.json({
                status: 200,
                message: data
            })
        }
    });
});
async function upadteTimeTable(body) {
    timeTableModel.find({
        _id: body.id
    }).then(async time => {
        var batch = await getId.getBatchId(time.batchId, '')
        var course = await getId.getCourseId(time.course_id, '')
        var semester = await getId.getSemesterId(time.semester_id, '');
        var user = await getId.getUserId(time.teacher_id, '')
        var division = await getId.getDivisionId(time.division_id, '')
        var subject = await getId.getSubjectId(time.subject, course.id, semester.id)
     await   models.newtimetables.find({
            where: {
                teacherId: user.id,
                courseId: course.id,
                batchId: batch.id,
                divisionId: division.id,
                semesterId: semester.id,
                subjectId: subject.id
            }
        }).then(async timetable => {
            if(timetable){
            var User = await getId.getUserId(body.user_id, '')

                timetable.update({
                    approval: body.approval,
                    cancelByRole: body.role,
                    cancelByUser: User.id,
                    reason: body.reason,
                }).then(data => {
                    console.log("data=>>>>>", data)
                })
            }
          
        })
    })
}
router.get('/getcourse/:id/', (req, res) => {
    collegeCourseModel.find({
        departmentId: req.params.id
    }).then(function (batches) {
        if (batches) {
            res.send({
                status: 200,
                data: batches
            })
        }
    })
});

router.post('/saveMultiTimeTable', (req, res) => {
    saveMultiTimeTable(req)
    var newTimeTable = new multiTimeTableModel({});
    multiTimeTableModel.create({
        courseName: req.body.courseName,
        semesterName: req.body.semesterName,
        subject: req.body.subject,
        batchName: req.body.batchName,
        divisionName: req.body.divisionName,
        teacherName: req.body.teacherName,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        course_id: req.body.course_id,
        batch_id: req.body.batch_id,
        division_id: req.body.division_id,
        semester_id: req.body.semester_id,
        timeTableId: req.body.timeTableId
    }, (err, dataInserted) => {
        if (err) {
            console.error(err)
        } else {
            var activity_action = "Added Timetable.";
            var activity_data = req.body.teacherName + " Added timetable for course " + req.body.courseName + " ,batch " + req.body.batchName + " and subject " + req.body.subject;
            notification_function.activity(activity_action, activity_data, req.body.course_id, req.body.batch_id);
            res.json({
                status: 200
            })
        }
    })
});
async function saveMultiTimeTable(req) {
    timeTableModel.find({
        _id: req.body.timeTableId
    }).then(async time => {
        var batch = await getId.getBatchId(time[0].batch_id, '')
        var course = await getId.getCourseId(time[0].course_id, '')
        var semester = await getId.getSemesterId(time[0].semester_id, '');
        var subject = await getId.getSubjectId(time[0].subject, course.id, semester.id)
        var division = await getId.getDivisionId(time[0].division_id, '')
        var user = await getId.getUserId(time[0].teacher_id, '')
      await  models.newtimetables.find({
            where: {
                teacherId: user.id,
                courseId: course.id,
                semesterId: semester.id,
                batchId: batch.id,
                subjectId: subject.id,
                divisionId: division.id,
                date: time[0].date,
                fromTime: time[0].fromTime,
                toTime: time[0].toTime
            }
        }).then(async timetable => {
            var Batch = await getId.getBatchId(req.body.batch_id, '')
            var Course = await getId.getCourseId(req.body.course_id, '')
            var Semester = await getId.getSemesterId(req.body.semester_id, '');
            var Division = await getId.getDivisionId(req.body.division_id, '')
            models.multitimetables.create({
                date: req.body.date,
                time: req.body.time,
                location: req.body.location,
                courseId: Course.id,
                batchId: Batch.id,
                divisionId: Division.id,
                semesterId: Semester.id,
                timeTableId: timetable.id
            }).then(multitimetables => {
                console.log("multitimetables")
            })

        })
    })


}
router.get('/getAllTimeTables/:subject/:semesterId', (req, res) => {
    multiTimeTableModel.aggregate([{
        $match: {
            "subject": {
                $eq: req.params.subject,
            },
            "semester_id": {
                $eq: req.params.semesterId
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
        if (data) {
            res.send({
                status: 200,
                data: data
            })
        }
    })
});

router.get('/getBBBAttendence/:subject/:date', (req, res) => {
    OnlineLectureAttendenceModel.find({
        subject: req.params.subject,
        createdOn: req.params.date,
    }).then(function (data) {
        if (data) {
            res.send({
                status: 200,
                data: data
            })
        }
    })
});

router.get('/getSemesterByCourse', (req, res) => {
    semesterModel.find({
        courseId: req.query.id
    }).then(function (semesters) {
        if (semesters) {
            res.send({
                status: 200,
                data: semesters
            })
        }
    })
})

router.get('/getDepartmentWiseData', (req, res) => {
    collegeDepartmentModel.find({}, (err, departments) => {
        if (err) {
            console.error(err);
        } else {
            res.json({
                status: 200,
                data: departments
            });
        }
    })
})

// Author SP :: 28-02-2020
function splitDate(date) {
    date = date.split(' ');
    return date[0];
}

function splitTime(time) {
    time = time.split(' ');
    return time[1];
}
// Author SP :: 28-02-2020
function createTimeSlots(startHour, endHour, interval) {
    startHour = startHour.split(':');
    endHour = endHour.split(':');

    var timeSlots = [],
        dateTime = new Date(),
        endTime = new Date(),
        timeStr = '';
    dateTime.setHours(startHour[0], startHour[1], 0, 0);
    endTime.setHours(endHour[0], endHour[1], 0, 0)
    while (new Date(dateTime.getTime() + interval * 60000).getTime() <= endTime.getTime()) {
        if (dateTime.getMinutes() < 10) {
            timeStr = dateTime.getHours() + ':0' + dateTime.getMinutes();
        } else {
            timeStr = dateTime.getHours() + ':' + dateTime.getMinutes();
        }
        timeStr += '-';
        dateTime = new Date(dateTime.getTime() + interval * 60000);
        if (dateTime.getMinutes() < 10) {
            timeStr += dateTime.getHours() + ':0' + dateTime.getMinutes();
        } else {
            timeStr += dateTime.getHours() + ':' + dateTime.getMinutes();
        }
        timeSlots.push(timeStr);
    }
    return timeSlots;
}

// Author SP :: 28-02-2020
router.post('/saveExcelTimeTable', (req, res) => {
    saveExcelTimeTable(req)
    var data = new Uint8Array(req.files.file.data);
    var workbook = xlsx.read(data, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
    });
    var sheet_name_list = workbook.SheetNames;
    var columns = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        raw: false,
        dateNF: "YYYY-MM-DD hh:mm"
    });
    var counter = 0;
    columns.map(data => {

        timeTableModel.insertMany({
            courseName: data.courseName,
            semesterName: data.semesterName,
            subject: data.subject,
            batchName: data.batchName,
            divisionName: data.divisionName,
            teacherName: data.teacherName,
            teacher_id: data.teacher_id,
            date: splitDate(data.date),
            fromTime: splitTime(data.fromTime),
            toTime: splitTime(data.toTime),
            location: data.location,
            course_id: data.course_id,
            batch_id: data.batch_id,
            division_id: data.division_id,
            semester_id: data.semester_id,
            approval: "Approved"

        }, (err, timeTable) => {
            timeslots = createTimeSlots(timeTable[0].fromTime, timeTable[0].toTime, 50);
            timeslots.forEach(element => {
                multiTimeTableModel.create({
                    courseName: timeTable[0].courseName,
                    semesterName: timeTable[0].semesterName,
                    subject: timeTable[0].subject,
                    batchName: timeTable[0].batchName,
                    divisionName: timeTable[0].divisionName,
                    teacherName: timeTable[0].teacherName,
                    teacher_id: timeTable[0].teacher_id,
                    date: timeTable[0].date,
                    time: element,
                    location: timeTable[0].location,
                    course_id: timeTable[0].course_id,
                    batch_id: timeTable[0].batch_id,
                    division_id: timeTable[0].division_id,
                    semester_id: timeTable[0].semester_id,
                    approval: "Approved",
                    timeTableId: timeTable[0]._id
                }, (err, multiTimeTable) => {
                    if (err) {
                        console.error(err)
                    }
                })
            })
            counter++;
            if (err) {
                console.error(err);
            } else {
                if (counter == columns.length) {
                    res.json({
                        status: 200
                    })
                }
            }
        })
    })
})
async function saveExcelTimeTable(req) {
    var data = new Uint8Array(req.files.file.data);
    var workbook = xlsx.read(data, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
    });
    var sheet_name_list = workbook.SheetNames;
    var columns = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        raw: false,
        dateNF: "YYYY-MM-DD hh:mm"
    });
    var counter = 0;
    columns.forEach(async data => {
        var batch = await getId.getBatchId(data.batch_id, '')
        var course = await getId.getCourseId(data.course_id, '')
        var semester = await getId.getSemesterId(data.semester_id, '');
        var subject = await getId.getSubjectId(data.subject, course.id, semester.id)
        var division = await getId.getDivisionId(data.division_id, '')
        var user = await getId.getUserId(data.teacher_id, '')
     await   models.newtimetables.create({
            subjectId: subject.id,
            teacherId: user.id,
            date: splitDate(data.date),
            fromTime: splitTime(data.fromTime),
            toTime: splitTime(data.toTime),
            location: data.location,
            courseId: course.id,
            batchId: batch.id,
            divisionId: division.id,
            semesterId: semester.id,
            approval: "Approved",
            cancelByRole: null,
            cancelByUser: null
        }).then(timeTable => {
            timeslots = createTimeSlots(timeTable[0].fromTime, timeTable[0].toTime, 50);
            timeslots.forEach(element => {
                models.multitimetables.create({
                    date: timeTable[0].date,
                    time: element,
                    location: timeTable[0].location,
                    courseId: timeTable[0].courseId,
                    batchId: timeTbale[0].batchId,
                    divisionId: timeTbale[0].divisionId,
                    semesterId: timeTbale[0].semesterId,
                    timeTableId: timeTbale[0].id
                }).then(multitimetables => {
                    console.log("multitimetables")
                })
            })

        })
    })
}
router.get('/sendTimeTableMsg', (req, res) => {
    var today = moment(new Date()).format('YYYY-MM-DD');
    timeTableModel.find({
        date: {
            $gte: today
        }
    }).then(function (timeTable) {
        var students = [];
        timeTable.forEach(time => {
            studentBatches.find({
                batchId: time.batch_id,
                divisionId: time.division_id
            }).then(function (studentBatches) {
                if (studentBatches.length > 0) {
                    var flag = false;
                    studentBatches.forEach(studentBatch => {
                        if (students.length == 0) {
                            students.push(studentBatch.studentId);

                        } else {
                            students.forEach(student => {
                                if (student == studentBatch.studentId) {
                                    flag = true;

                                }
                            })
                            if (flag == false) {
                                students.push(studentBatch.studentId);
                            }
                        }
                    })

                }
            })
        })
        setTimeout(() => {
            students.forEach(eachStudent => {
                userModel.findById(eachStudent).then(function (student) {
                    emailService.weeklyScheduleMsg(student.email, student.mobile);
                })
            })
            res.json({
                status: 200
            })
        }, 2000);
    })
})

router.post('/editTimeTable', (req, res) => {
    editTimeTable(req.body)
    timeTableModel.findByIdAndUpdate({
        _id: req.body.data._id
    }, {
        date: req.body.data.date,
        location: req.body.data.location,
        fromTime: req.body.data.fromTime,
        toTime: req.body.data.toTime
    }).then(function (updatedTimeTable) {
        timeTableModel.findById(req.body.data._id).then(function (timeTable) {
            if (timeTable.approval == 'Approved') {
                if (req.body.data.notify == true) {
                    studentBatches.find({
                        batchId: timeTable.batch_id,
                        divisionId: timeTable.division_id
                    }).then(function (studentBatches) {
                        studentBatches.forEach(studentBatch => {
                            userModel.findById(studentBatch.studentId).then(function (student) {
                                emailService.updateScheduleMsg(student.email, student.mobile, updatedTimeTable.date, updatedTimeTable.fromTime);
                            })
                        })
                    })
                }
                res.json({
                    status: 200
                })
            } else {
                res.json({
                    status: 200
                })
            }
        })
    })
})
async function editTimeTable(body) {
    console.log("body",body)
    timeTableModel.find({
        _id: body.data._id
    }).then(async data => {
        var batch = await getId.getBatchId(data[0].batch_id, '')
        var course = await getId.getCourseId(data[0].course_id, '')
        var semester = await getId.getSemesterId(data[0].semester_id, '');
        // var subject = await getId.getSubjectId(data[0].subject, course.id, semester.id)
        var division = await getId.getDivisionId(data[0].division_id, '')
        var user = await getId.getUserId(data[0].teacher_id, '')
        if (data) {
       await     models.newtimetables.find({
                where: {
                    teacherId: user.id,
                    courseId: course.id,
                    semesterId: semester.id,
                    batchId: batch.id,
                    divisionId: division.id,
                    date: data[0].date,
                    fromTime: data[0].fromTime,
                    toTime: data[0].toTime
                }

            }).then(timetable => {
                if(timetable){
                    timetable.update({
                        date: body.data.date,
                        location: body.data.location,
                        fromTime: body.data.fromTime,
                        toTime: body.data.toTime
                    }).then(update => {
                        console.log("update")
                    })
                }
               
            })
        }

    })
}
// router.get('/online_class_notification', (req, res) => {

//     var today = moment(new Date()).format('YYYY-MM-DD');
//     // console.log("today---->"+today);
//     var current_time = moment().format("HH:mm");
//     // console.log("current_time---->"+current_time);
//     var add_current_time = moment().add(10, 'minutes').format("HH:mm");
//     // console.log("add_current_time---->"+add_current_time);
//     NewTimeTableModel.find({
//         date : today,//'2020-08-13'
//         // fromTime : add_current_time,
//     }).then(function (timetables) {
//         if(timetables.length > 0){

//             timetables.forEach(timetable =>{
//                 var BBB_SECRET = "W0yy80KBD7oxxCeum0iLlKEClJYIsOtU2cIHgiO2s";
//                 console.log("create colled"+JSON.stringify(req.body));
//                 var meet_name = timetable.subject.split(' ').join('_')
//                 var checksum = sha1("createname="+meet_name+"&meetingID="+timetable._id+"&autoStartRecording=true&voiceBridge=70750&record=true&attendeePW=123&moderatorPW=123456"+BBB_SECRET);
//                 console.log("checksum created"+checksum+"name---->>"+meet_name);
//                 request("https://learning.sdbi.in/bigbluebutton/api/create?name="+meet_name+"&meetingID="+timetable._id+"&autoStartRecording=true&voiceBridge=70750&record=true&attendeePW=123&moderatorPW=123456&checksum="+checksum, function (error, response, body) {
//                     console.error('error:', error); // Print the error if one occurred
//                     console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
//                     console.log('body:', body); // Print the HTML for the Google homepage.
//                     if(response.statusCode == 200){
//                         studentBatches.find({
//                             batchId : timetable.batch_id
//                         }).then(function(students){
//                             console.log("students--->>",students.length)
//                             var url = "pages/calendar";
//                             students.forEach(student =>{
//                                 //console.log("student--->"+student_data[0].fullName+" email "+student_data[0].email+" subject "+timetable.subject);
//                                 var action = "Online Lecture";
//                                 var notification_data = "Your class for "+timetable.subject+" will start in 10 mins.";
//                                 //notification_function.notification(action, notification_data, student.studentId, url, '');
//                             })
//                             var action = "Online Lecture";
//                             var notification_data = "Your class for "+timetable.subject+" will start in 10 mins.";
//                            // notification_function.notification(action, notification_data, timetable.teacher_id, url, '');
//                         });
//                     }else{
//                         var action = "Online Lecture";
//                         var notification_data = "Your class link for "+timetable.subject+" is not created. Please create it manaully.";
//                         //notification_function.notification(action, notification_data, timetable.teacher_id, url, '');
//                     }
//                 });
//             });
//         }
//     })
// })


// router.get('/getLectureLink',function(req,res){
//     var name;
//     if(req.query.name == '@Admin'){
//         name = "admin"
//     }else{
//          name = req.query.name.split(' ').join('_')
//     }
//     if(req.query.role == 'student'){ 

//     var joinAtteendeChecksum = sha1("joinfullName="+name+"&meetingID="+req.query.id+"&password=123&redirect=true"+BBB_SECRET)
//     attendeeLink = "https://learning.sdbi.in/bigbluebutton/api/join?fullName="+name+"&meetingID="+req.query.id+"&password=123&redirect=true&checksum="+joinAtteendeChecksum

//                 res.json({
//                     status : 200,
//                     data : attendeeLink
//                 })
//             }else if(req.query.role == 'teacher' || req.query.role == 'admin'){

//                  var joinModeratorChecksum = sha1("joinfullName="+name+"&meetingID="+req.query.id+"&password=123456&redirect=true"+BBB_SECRET)
//                  moderatorLink =  "https://learning.sdbi.in/bigbluebutton/api/join?fullName="+name+"&meetingID="+req.query.id+"&password=123456&redirect=true&checksum="+joinModeratorChecksum
//              res.json({
//                 status : 200,
//                 data : moderatorLink
//             })
//             }
// });

router.get('/getLectureLink', function (req, res) {
    LectureJoinLinksModel.find({
        subject: req.query.subject
    }).then(function (links) {
        res.json({
            status: 200,
            data: links
        })

    })
});

router.get('/saveLectureLink', (req, res) => {
    saveLectureLink(req)
    LectureJoinLinksModel.create({
        subject: req.body.subject,
        onlineLectureLink: req.body.id,
    }).then(function (data) {
        res.json({
            status: 200,
            data: data
        })
    })
})
async function saveLectureLink(req) {
    var subject = await getId.getSubjectId(req.body.subject) //remaining
  await  models.lecturejoinlinks.create({
        subjectId: subject.id,
        onlineLectureLink: req.body.id
    }).then(lecturejoinlinks => {
        console.log("lecturejoinlinks")
    })
}


// router.get('/saveMonitoringData', (req, res) => {
//     var BBB_SECRET = "B78rQSWtbdzdXtuPgN3X8OStXuQklRi2T27tsCyzw";

//     var getMeetingsChecksum = sha1("getMeetings"+BBB_SECRET)

//     request(" https://online.sdbi.in/bigbluebutton/api/getMeetings?checksum="+getMeetingsChecksum, function (error, response, body) {
//          console.error('error:', error); // Print the error if one occurred
//         console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
//         console.log('body:', body); // Print the HTML for the Google homepage.
//         parseString(body, function (err, result) {
//             console.log("result===>>"+JSON.stringify(result))
//         if(result.response.returncode != 'FAILED' ){
//             if(result.response.meetings.length > '0'){
//                 result.response.meetings.forEach(element => {
//                     console.log("element===>>",element.meeting)
//                     element.attendees[0].attendee.forEach(attendee => {
//                                                         console.log("element===>>",attendee)

//                                                         // OnlineLectureAttendenceModel.create({
//                                                         //     fullName: element.fullName[0],
//                                                         //     isListeningOnly:element.isListeningOnly[0],
//                                                         //     isPresenter: element.isPresenter[0],
//                                                         //     hasJoinedVoice : element.hasJoinedVoice[0],
//                                                         //     hasVideo : element.hasVideo[0],
//                                                         //     role : element.role[0],
//                                                         //     timeTableId : timetables[0]._id,
//                                                         //     subject : meetingName[0],
//                                                         //     createdOn : today
//                                                         // })
//                                                     })
//                 })

//                 res.json({
//                     status : 200,
//                     data : result.response
//                 })
//             }

//         }else{
//             res.json({
//                 status : 400,
//                 data : ''
//             })
//         }

//         });
// })

// })


router.get('/saveMonitoringData', (req, res) => {
    saveMonitoringData(req)
    var BBB_SECRET = "YGiNohU9OwdkrU5lHO3iXCtJDO7OYCSCfAXpeF0Nbk";

    var today = moment(new Date()).format('YYYY-MM-DD');

    var Checksum = sha1("getMeetings" + BBB_SECRET)



    request("https://live.sdbi.in/bigbluebutton/api/getMeetings?checksum=" + Checksum, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

        parseString(body, function (err, result) {

            // console.log("result-----",result)
            if (result.response.returncode != 'FAILED' && result.response.messageKey != 'noMeetings') {
                if (result.response.meetings.length > '0') {
                    result.response.meetings.forEach(meet => {
                        meet.meeting.forEach(meets => {
                            // console.log("element.meetingName---"+meets.meetingName)
                            var meetingName = meets.meetingName[0].split(' (');
                            // console.log("meetingName.Split---"+meetingName[0])
                            var userdetails = [];
                            NewTimeTableModel.find({
                                date: today,
                                subject: meetingName[0]
                            }).then(function (timetables) {
                                // console.log("elementtimetablese---",timetables)

                                if (timetables.length > 0) {

                                    meets.attendees[0].attendee.forEach(element => {

                                        userdetails.push(
                                            element.fullName[0],
                                        )

                                        OnlineLectureAttendenceModel.create({
                                            fullName: element.fullName[0],
                                            isListeningOnly: element.isListeningOnly[0],
                                            isPresenter: element.isPresenter[0],
                                            hasJoinedVoice: element.hasJoinedVoice[0],
                                            hasVideo: element.hasVideo[0],
                                            role: element.role[0],
                                            timeTableId: timetables[0]._id,
                                            subject: meetingName[0],
                                            createdOn: today
                                        })
                                    })
                                } else {
                                    meets.attendees[0].attendee.forEach(element => {

                                        userdetails.push(
                                            element.fullName[0],
                                        )

                                        OnlineLectureAttendenceModel.create({
                                            fullName: element.fullName[0],
                                            isListeningOnly: element.isListeningOnly[0],
                                            isPresenter: element.isPresenter[0],
                                            hasJoinedVoice: element.hasJoinedVoice[0],
                                            hasVideo: element.hasVideo[0],
                                            role: element.role[0],
                                            subject: meetingName[0],
                                            createdOn: today
                                        })
                                    })
                                }

                                setTimeout(() => {
                                    // console.log("users=--->>",userdetails)
                                    var teacher = ({
                                        email: 'nishit@sdbi.in',
                                        cc: 'accounts@sdbi.in',
                                        meetingName: meetingName[0],
                                        data: JSON.stringify(userdetails)
                                    })
                                    emailService.bigblueAttendenceMarked(teacher);
                                })
                            }, 3000);
                        })



                    })


                }
            }

        });

    });


})
async function saveMonitoringData(req) {
    var BBB_SECRET = "YGiNohU9OwdkrU5lHO3iXCtJDO7OYCSCfAXpeF0Nbk";

    var today = moment(new Date()).format('YYYY-MM-DD');

    var Checksum = sha1("getMeetings" + BBB_SECRET)
    request("https://live.sdbi.in/bigbluebutton/api/getMeetings?checksum=" + Checksum, function (error, response, body) {
        parseString(body, function (err, result) {
            if (result.response.returncode != 'FAILED' && result.response.messageKey != 'noMeetings') {
                if (result.response.meetings.length > '0') {
                    result.response.meetings.forEach(async meet => {
                        var meetingName = meets.meetingName[0].split(' (');
                        var userdetails = [];
                        var subject = await getId.getSubjectId(meetingName[0])//remaining
                   await     models.newtimetables.find({
                            where: {
                                date: today,
                                subjectId: subject.id
                            }
                        }).then(timetables => {
                            if (timetables.length > 0) {
                                meets.attendees[0].attendee.forEach(element => {
                                    userdetails.push(
                                        element.fullName[0],
                                    )
                                    models.onlinelectureattendences.find({
                                        fullName: element.fullName[0],
                                        isListeningOnly: element.isListeningOnly[0],
                                        hasJoinedVoice: element.hasJoinedVoice[0],
                                        hasVideo: element.hasVideo[0],
                                        role: element.role[0],
                                        timeTableId: timetables[0].id,
                                        subjectId: subject.id,
                                    }).then(onlinelecture => {
                                        console.log("onlinelecture")
                                    })
                                })
                            } else {
                                meets.attendees[0].attendee.forEach(element => {
                                    userdetails.push(
                                        element.fullName[0],
                                    )
                                    models.onlinelectureattendences.find({
                                        fullName: element.fullName[0],
                                        isListeningOnly: element.isListeningOnly[0],
                                        hasJoinedVoice: element.hasJoinedVoice[0],
                                        hasVideo: element.hasVideo[0],
                                        role: element.role[0],
                                        subjectId: subject.id,
                                    }).then(onlinelecture => {
                                        console.log("onlinelecture")
                                    })

                                })
                            }
                        })
                    })
                }
            }
        })
    })
}



// router.get('/saveMonitoringData', (req, res) => {


//     var today = moment(new Date()).format('YYYY-MM-DD');
//     console.log("today---->"+today);
//     var current_time = moment().format("HH:mm");
//     // console.log("current_time---->"+current_time);
//     var add_current_time = moment().add(-10, 'minutes').format("HH:mm");
//     var minus_current_time = moment().add(10, 'minutes').format("HH:mm");

//     // console.log("add_current_time---->"+add_current_time);
//     NewTimeTableModel.find({
//         date : today,//'2020-08-13'
//         $or: [
//             {
//                 fromTime : add_current_time,
//             },
//             {
//                 toTime : minus_current_time,
//             }
//         ]
//     }).then(function (timetables) {
//         if(timetables.length > 0){

//             timetables.forEach(timetable =>{
//                 var BBB_SECRET = "YGiNohU9OwdkrU5lHO3iXCtJDO7OYCSCfAXpeF0Nbk";

//                 var Checksum = sha1("getMeetings"+BBB_SECRET)

//                 request("https://live.sdbi.in/bigbluebutton/api/getMeetings?checksum="+Checksum, function (error, response, body) {
//                     // console.error('error:', error); // Print the error if one occurred
//                     // console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
//                     console.log('body:', body); // Print the HTML for the Google homepage.

//                     parseString(body, function (err, result) {

//                         // console.log("result-----",result)
//                     if(result.response.returncode != 'FAILED' && result.response.messageKey !=  'noMeetings'){
//                         if(result.response.meetings.length > '0'){
//                         result.response.meetings.forEach(meet =>{
//                             meet.meeting.forEach(meets =>{
//                                 // console.log("element.meetingName---"+meets.meetingName)
//                                 var meetingName = meets.meetingName[0].split(' (');
//                                 // console.log("meetingName.Split---"+meetingName[0])
//                                 var userdetails = [];
//                                 // NewTimeTableModel.find({
//                                 //     date : today,
//                                 //     subject : meetingName[0]
//                                 // }).then(function (timetables) {
//                                     if(timetable.subject == meetingName[0] ){


//                                 // console.log("elementtimetablese---",timetables)

//                                     // if(timetables.length > 0){

//                                         meets.attendees[0].attendee.forEach(element => {

//                                                 userdetails.push(
//                                                      element.fullName[0],
//                                                   )

//                                             OnlineLectureAttendenceModel.create({
//                                                 fullName: element.fullName[0],
//                                                 isListeningOnly:element.isListeningOnly[0],
//                                                 isPresenter: element.isPresenter[0],
//                                                 hasJoinedVoice : element.hasJoinedVoice[0],
//                                                 hasVideo : element.hasVideo[0],
//                                                 role : element.role[0],
//                                                 timeTableId : timetables[0]._id,
//                                                 subject : meetingName[0],
//                                                 createdOn : today
//                                             })
//                                         })
//                                     // }else{
//                                     //     meets.attendees[0].attendee.forEach(element => {

//                                     //         userdetails.push(
//                                     //              element.fullName[0],
//                                     //           )

//                                     //         OnlineLectureAttendenceModel.create({
//                                     //             fullName: element.fullName[0],
//                                     //             isListeningOnly:element.isListeningOnly[0],
//                                     //             isPresenter: element.isPresenter[0],
//                                     //             hasJoinedVoice : element.hasJoinedVoice[0],
//                                     //             hasVideo : element.hasVideo[0],
//                                     //             role : element.role[0],
//                                     //             subject :meetingName[0],
//                                     //             createdOn : today
//                                     //         })
//                                     //     })
//                                     // }

//                                     setTimeout(() => {
//                                         // console.log("users=--->>",userdetails)
//                                        var teacher =({
//                                            email : 'francis@edulab.in',
//                                         cc : 'pratik@edulab.in',
//                                            meetingName : meetingName[0],
//                                            data : JSON.stringify(userdetails)
//                                        })
//                                        emailService.bigblueAttendenceMarked(teacher);
//                                     //    })
//                                     }, 3000);
//                                 }
//                                 })



//                         })


//                         }
//                     }

//                     });

//                 });
//             })
//         }
//     })
// })   





router.get('/getMonitoringData', function (req, res) {
    var BBB_SECRET = "W0yy80KBD7oxxCeum0iLlKEClJYIsOtU2cIHgiO2s";
    var joinModeratorChecksum = sha1("getMeetings" + BBB_SECRET)
    request("https://learning.sdbi.in/bigbluebutton/api/getMeetings?checksum=" + joinModeratorChecksum, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        parseString(body, function (err, result) {
            // console.log("result-----",result)
            if (result.response.returncode != 'FAILED') {
                if (result.response.meetings.length > 0) {
                    // console.log("result-cfhfgfty----",JSON.stringify(result.response.meetings));

                    res.json({
                        status: 200,
                        data: result.response.meetings
                    })
                }

            } else {
                // console.log("req.query.id--->>"+req.query.id)
                OnlineLectureAttendenceModel.find({
                    timeTableId: req.query.id
                }).then(function (timetables) {
                    // console.log("attendes",timetables)
                    res.json({
                        status: 200,
                        data: timetables
                    })
                })
            }
        });
    });
});


// router.get('/getRecordingLink',function(req,res){
//     var BBB_SECRET = "W0yy80KBD7oxxCeum0iLlKEClJYIsOtU2cIHgiO2s";

//     var recordingChecksum = sha1("getRecordingsmeetingID="+req.query.id+""+BBB_SECRET)
//     // meetingID="+req.query.id+"&recordID="+req.query.id+"&
//     // meetingID="+req.query.id+"&recordID="+req.query.id+"
//     request("https://learning.sdbi.in/bigbluebutton/api/getRecordings?meetingID="+req.query.id+"&checksum="+recordingChecksum, function (error, response, body) {
//         // console.error('error:', error); // Print the error if one occurred
//         // console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
//         // console.log('body:', body); // Print the HTML for the Google homepage.

//         parseString(body, function (err, result) {
//             if(result.response.messageKey != 'noRecordings'){
//                 res.json({
//                     status : 200,
//                     data : result.response.recordings[0].recording[0].playback[0].format[0].url
//                 })
//             }else{
//                 res.json({
//                     status : 400,
//                     data : ''
//                 })
//             }
//         });


//     });
// });

router.post('/savePLaybackLink', (req, res) => {
    savePLaybackLink(req)
    if (req.body.id) {
        var query = {
            _id: req.body.id
        },
            update = {
                $set: {
                    playbackLink: req.body.link
                }
            };
        timeTableModel.findOneAndUpdate(query, update, function (req, timetable) {
            res.json({
                status: 200,
                data: timetable
            });
        });
    }
})
async function savePLaybackLink(req) {
    timeTableModel.find({
        _id: req.body.id
    }).then(async time => {
        var batch = await getId.getBatchId(time[0].batch_id, '')
        var course = await getId.getCourseId(time[0].course_id, '')
        var semester = await getId.getSemesterId(time[0].semester_id, '');
        var user = await getId.getUserId(time[0].teacher_id, '')
        var division = await getId.getDivisionId(time[0].division_id, '')
        var subject = await getId.getSubjectId(time[0].subject, course.id, semester.id)
    await    models.newtimetables.find({
            where: {
                teacherId: user.id,
                courseId: course.id,
                batchId: batch.id,
                divisionId: division.id,
                semesterId: semester.id,
                subjectId: subject.id
            }
        }).then(timetable => {
            if(timetable){
                timetable.update({
                    playBackLink: req.body.link
                }).then(data => {
                    console.log("data=>>>>>")
                })
            }
            
        })
    })
}

router.post('/sheduleExportExcel1', function (req, res) {
    var view_data = [];
    multiTimeTableModel.aggregate([{
        $match: {
            "date": {
                $gte: req.body.start,
                $lte: req.body.end
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
        $addFields: {
            timetable_id: {
                $toObjectId: "$timeTableId"
            }
        }
    },
    {
        "$lookup": {
            "from": "newtimetables",
            "localField": "timetable_id",
            "foreignField": "_id",
            "as": "data"
        }
    },
    {
        "$lookup": {
            "from": "studentbatches",
            "localField": "batch_id",
            "foreignField": "batchId",
            "as": "data1"
        }
    },

    {
        "$lookup": {
            "from": "topicofthedays",
            "localField": "timeTableId",
            "foreignField": "timeTableId",
            "as": "topics"
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
            //    absent: {
            //        $filter: {
            //            input: "$timeTableData",
            //            as: "timetable",
            //            cond: {
            //                $eq: ["$$timetable.present", "Absent"]
            //            }
            //        }
            //    },
            "_id": 1,
            "semesterName": 1,
            "courseName": 1,
            "batchName": 1,
            "divisionName": 1,
            "teacherName": 1,
            "subject": 1,
            "date": 1,
            "time": 1,
            "location": 1,
            "course_id": 1,
            "batch_id": 1,
            "division_id": 1,
            "semester_id": 1,
            "timeTableId": 1,
            "playbackLink": "$data.playbackLink",
            "topicName": "$topics.topicNames",
            "data1": 1
        }
    },


    ]).then(function (data) {

        if (data != '') {
            data.forEach(function (element) {

                view_data.push({
                    Date: element.date ? element.date : '-',
                    BatchName: element.batchName ? element.batchName : '-',
                    SemesterName: element.semesterName ? element.semesterName : '-',
                    Subject: element.subject ? element.subject : '-',
                    Faculty: element.teacherName ? element.teacherName : '-',
                    StartTime: element.time ? element.time : '-',
                    PlaybackLink: element.playbackLink ? element.playbackLink : '-',
                    TopicCovered: element.topicName ? element.topicName : '-',
                    PresentStudents: element.present.length ? element.present.length : '-',
                    TotalStudents: element.data1.length ? element.data1.length : '-',

                })

            });


            setTimeout(() => {
                var xls = json2xls(view_data);
                var currentPath = process.cwd();
                fs.writeFileSync(currentPath + "/src/public/excel_sheets/shedule.xlsx", xls, 'binary');
                //    console.log("current path "+currentPath)
                var filepath = currentPath + "/src/public/excel_sheets/shedule.xlsx";
                res.json({
                    status: 200,
                    data: filepath
                });
            }, 1000);

        } else {
            res.json({
                status: 400,
                message: 'Excel is Not generated!!!!!!........'
            });
        }
    });

});

router.get('/markAttedanceMsg', (req, res) => {

    var today = moment(new Date()).format('YYYY-MM-DD');
    //var current_time = moment().format('HH:mm');
    var subtract_time = moment().subtract(5, 'minutes').format("HH:mm");
    var teacherData = [];
    NewTimeTableModel.find({
        date: today,
        toTime: subtract_time
    }).then(function (timeTables) {
        if (timeTables.length > 0) {

            timeTables.forEach(timeTable => {
                attendanceModel.find({
                    timeTableId: timeTable._id
                }).then(function (attendance) {
                    if (attendance.length == 0) {
                        userModel.findById(timeTable.teacher_id, (err, teacher) => {
                            // console.log(teacher);
                            var flag = false;
                            if (teacherData.length > 0) {
                                teacherData.forEach(teacherLocal => {
                                    if (teacherLocal.email == teacher.email) {
                                        flag = true;
                                    }
                                })
                                if (flag == false) {
                                    teacherData.push({
                                        fullName: teacher.fullName,
                                        email: teacher.email,
                                        mobile_no: teacher.mobile,
                                        subject: timeTable.subject,
                                        date: timeTable.date,
                                        fromTime: timeTable.fromTime,
                                        toTime: timeTable.toTime
                                    })
                                }
                            } else {
                                teacherData.push({
                                    fullName: teacher.fullName,
                                    email: teacher.email,
                                    mobile_no: teacher.mobile,
                                    subject: timeTable.subject,
                                    date: timeTable.date,
                                    fromTime: timeTable.fromTime,
                                    toTime: timeTable.toTime
                                })
                            }
                        })
                    }
                })

            })

            setTimeout(() => {
                teacherData.forEach(teacher => {
                    emailService.attendanceReminder(teacher);


                })
            }, 1000)
        }
    })
})

router.get('/markAttedanceReminderOneDay', (req, res) => {

    var today = moment().format('YYYY-MM-DD');
    var teacherData = [];
    NewTimeTableModel.find({
        date: today
    }).then(function (timeTables) {
        //console.log(JSON.stringify(timeTables))
        if (timeTables.length > 0) {

            timeTables.forEach(timeTable => {
                attendanceModel.find({
                    timeTableId: timeTable._id
                }).then(function (attendance) {
                    if (attendance.length == 0) {
                        userModel.findById(timeTable.teacher_id, (err, teacher) => {
                            // console.log(teacher);
                            var flag = false;
                            if (teacherData.length > 0) {
                                teacherData.forEach(teacherLocal => {
                                    if (teacherLocal.email == teacher.email) {
                                        flag = true;
                                    }
                                })
                                if (flag == false) {
                                    teacherData.push({
                                        fullName: teacher.fullName,
                                        email: teacher.email,
                                        mobile_no: teacher.mobile,
                                        subject: timeTable.subject,
                                        date: timeTable.date,
                                        fromTime: timeTable.fromTime,
                                        toTime: timeTable.toTime
                                    })
                                }
                            } else {
                                teacherData.push({
                                    fullName: teacher.fullName,
                                    email: teacher.email,
                                    mobile_no: teacher.mobile,
                                    subject: timeTable.subject,
                                    date: timeTable.date,
                                    fromTime: timeTable.fromTime,
                                    toTime: timeTable.toTime
                                })
                            }
                        })
                    }
                })

            })
            setTimeout(() => {
                teacherData.forEach(teacher => {
                    emailService.attendanceReminderOneDay(teacher);
                })
            }, 1000)
        }
    })
})


router.get('/markAttedanceReportToAdmin', (req, res) => {

    var today = moment().format('YYYY-MM-DD');
    var data;
    var attendanceData = [];
    NewTimeTableModel.find({
        date: today
    }).then(function (timeTables) {
        if (timeTables.length > 0) {
            timeTables.forEach(timeTable => {
                var data = {
                    course: timeTable.courseName,
                    batch: timeTable.batchName,
                    semester: timeTable.semesterName,
                    division: timeTable.divisionName,
                    subject: timeTable.subject,
                    teacher: timeTable.teacherName,
                    time: timeTable.fromTime + "-" + timeTable.toTime,
                    location: timeTable.location
                }
                attendanceModel.find({
                    timeTableId: timeTable._id
                }).then(function (attendance) {
                    if (attendance.length > 0) {
                        data.attendanceMarked = "YES"
                    } else {
                        data.attendanceMarked = "NO"
                    }

                    attendanceData.push(data);
                    if (attendanceData.length == timeTables.length) {
                        var xls = json2xls(attendanceData);
                        var currentPath = process.cwd();
                        var file_location = currentPath + "/src/public/excel_sheets/MarkAttendanceReport_" + today + ".xlsx";
                        fs.writeFileSync(file_location, xls, 'binary');
                        var file_name = "MarkAttendanceReport_" + today + ".xlsx";
                        base64.encode(currentPath + "/src/public/excel_sheets/MarkAttendanceReport_" + today + ".xlsx", function (err, base64String) {
                            attachments = {
                                content: base64String,
                                filename: file_name,
                                type: 'application/xlsx',
                                disposition: 'attachment',
                                contentId: 'mytext'
                            }
                            data.email = "nishit@sdbi.in";
                            data.attachments = attachments;
                            emailService.markAttedanceTodaysReport(data);
                        })
                    }
                })
            })
        }
    })
})


router.post('/sheduleExportExcel', async function (req, res) {
    //called the function and exported it to avoid redundancy/repeti of code
    getMonthlydata(req.body.start, req.body.end, res);
})

// router.post('/sheduleExportExcel',function(req,res){
//     console.log("req.nbodyth--->>",req.body)
//     var view_data =[];
//        multiTimeTableModel.aggregate([
//         {
//        $match: {
//     //    "date" : {
//     //         $gt :  req.body.start,
//     //         $lt : req.body.end
//     //         }
//     $expr: {
//         $and: [{
//                 $gt: ["$date", req.body.start],
//             },
//             {
//                 $lt: ["$date", req.body.end],
//             }
//         ]
//     }
//        }
//    },
//        {
//          $addFields: {
//               timetable_id: {
//                   $toObjectId: "$timeTableId"
//               }
//           }
//        },
//    {
//        "$lookup": {
//            "from": "attendances",
//            "localField": "timeTableId",
//            "foreignField": "timeTableId",
//            "as": "timeTableData"
//        }
//    },

//     {
//    "$lookup": {
//        "from": "newtimetables",
//        "localField": "timetable_id",
//        "foreignField": "_id",
//        "as": "newtimeTableData"
//    }
// },
// {
//    "$lookup": {
//        "from": "topicofthedays",
//        "localField": "timeTableId",
//        "foreignField": "timeTableId",
//        "as": "topics"
//    }
// },

//          {
//            $project: {
//                present: {
//                $filter: {
//                  input: "$timeTableData",
//                  as: "data",
//                  cond: {
//                    $eq: ["$$data.present",  "Present"]
//                  }
//                }
//              },
//              absent: {
//                $filter: {
//                    input: "$timeTableData",
//                  as: "data",
//                  cond: {
//                    $eq: ["$$data.present",  "Absent"]
//                  }
//                }
//            },
//             total: {
//                $filter: {
//                  input: "$timeTableData",
//                  as: "data",
//                  cond: {
//                  }
//                }
//              },
//              topic:{
//                                $filter: {
//                  input: "$topics",
//                  as: "data",
//                  cond: {
//                  }
//                }
//                            },
//                links :{
//                                $filter: {
//                  input: "$newtimeTableData",
//                  as: "data",
//                  cond: {
//                  }
//                }
//                            },


//                  "_id": 1,
//                   "semesterName": 1,
//                   "courseName": 1,
//                   "batchName": 1,
//                   "divisionName": 1,
//                   "teacherName":1,
//                   "subject": 1,
//                   "date": 1,
//                   "time": 1,
//                   "location": 1,
//                   "course_id": 1,
//                   "batch_id": 1,
//                   "division_id": 1,
//                   "semester_id": 1,
//                   "timeTableId": 1,
//            }
//          },
//        ]).then(data =>{
//         //    console.log("data---->",data)
//                 data.forEach(element=>{
//                     console.log("date---->",element.links[0].date)

//                     if(element.topic.length > 0 && element.links.length > 0){
//                         view_data.push({
//                             Date : element.links[0].date ? element.links[0].date : '-',
//                             BatchName : element.batchName ? element.batchName : '-',
//                             SemesterName : element.semesterName ? element.semesterName : '-',
//                             Subject : element.subject ? element.subject : '-',
//                             Faculty : element.teacherName ? element.teacherName : '-',
//                             Time : element.time ? element.time : '-',
//                             PlaybackLink : element.links[0].playbackLink ? element.links[0].playbackLink : '-',
//                             TopicCovered : element.topic[0].topicNames ? element.topic[0].topicNames : '-',
//                             PresentStudents : element.present.length ? element.present.length : '-',
//                             AbsentStudents : element.absent.length ? element.absent.length : '-',  
//                             TotalStudents : element.total.length ? element.total.length : '-',
//                             })
//                     }else if(element.topic.length > 0 && element.links.length < 1){
//                         view_data.push({
//                             Date : element.date ? element.date : '-',
//                             BatchName : element.batchName ? element.batchName : '-',
//                             SemesterName : element.semesterName ? element.semesterName : '-',
//                             Subject : element.subject ? element.subject : '-',
//                             Faculty : element.teacherName ? element.teacherName : '-',
//                             Time : element.time ? element.time : '-',
//                             PlaybackLink : element.links.playbackLink ? element.links.playbackLink : '-',
//                             TopicCovered : element.topic[0].topicNames ? element.topic[0].topicNames : '-',
//                             PresentStudents : element.present.length ? element.present.length : '-',
//                             AbsentStudents : element.absent.length ? element.absent.length : '-',  
//                             TotalStudents : element.total.length ? element.total.length : '-',
//                             })
//                     }else if(element.topic.length < 1 && element.links.length > 0){
//                         view_data.push({
//                             Date : element.links[0].date ? element.links[0].date : '-',
//                             BatchName : element.batchName ? element.batchName : '-',
//                             SemesterName : element.semesterName ? element.semesterName : '-',
//                             Subject : element.subject ? element.subject : '-',
//                             Faculty : element.teacherName ? element.teacherName : '-',
//                             Time : element.time ? element.time : '-',
//                             PlaybackLink : element.links[0].playbackLink ? element.links[0].playbackLink : '-',
//                             TopicCovered : element.topic.topicNames ? element.topic.topicNames : '-',
//                             PresentStudents : element.present.length ? element.present.length : '-',
//                             AbsentStudents : element.absent.length ? element.absent.length : '-',  
//                             TotalStudents : element.total.length ? element.total.length : '-',
//                             })
//                         }else {
//                             view_data.push({
//                                 Date : element.links.date ? element.links.date : '-',
//                                 BatchName : element.batchName ? element.batchName : '-',
//                                 SemesterName : element.semesterName ? element.semesterName : '-',
//                                 Subject : element.subject ? element.subject : '-',
//                                 Faculty : element.teacherName ? element.teacherName : '-',
//                                 Time : element.time ? element.time : '-',
//                                 PlaybackLink : element.links.playbackLink ? element.links.playbackLink : '-',
//                                 TopicCovered : element.topic.topicNames ? element.topic.topicNames : '-',
//                                 PresentStudents : element.present.length ? element.present.length : '-',
//                                 AbsentStudents : element.absent.length ? element.absent.length : '-',  
//                                 TotalStudents : element.total.length ? element.total.length : '-',
//                                 })
//                         }

//                 })

//               setTimeout(() => {
//                     if(view_data){
//                                                          setTimeout(() => {
//                                                             var xls = json2xls(view_data);
//                                                             var currentPath = process.cwd();
//                                                             //fs.writeFileSync("C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src/src/public/excel_sheets/shedule.xlsx", xls, 'binary');
//                                                             fs.writeFileSync(currentPath + "/src/public/excel_sheets/shedule.xlsx", xls, 'binary');
//                                                                 console.log("current path "+currentPath)
//                                                                 //var filepath =  'C:/Users/swati/Desktop/v/lms/git to update/lmsserver/src' + "/src/public/excel_sheets/shedule.xlsx";
//                                                             var filepath =  currentPath + "/src/public/excel_sheets/shedule.xlsx";
//                                                             res.json({
//                                                                 status: 200,
//                                                                 data: filepath
//                                                             });
//                                                             }, 1000);
//                 }else{
//                     res.json({
//                          status:400,
//                          message:'Excel is Not generated!!!!!!........'
//                     });
//                 }
//               }, 3000);
//        })
// })


router.post('/saveDeliverables', (req, res) => {

    DeliverablesModel.create({
        name: req.body.name,
        deadline: req.body.deadline,

    }, (err, dataInserted) => {
        if (err) {
            console.error(err)
        } else {
            res.json({
                status: 200,
                data: dataInserted
            })
        }
    })
})
router.post('/deleteDeliverables', function (req, res) {
    DeliverablesModel.findByIdAndRemove(req.body.id, function (err, deleteBlog) {
        if (err) {
            res.json({
                status: 400
            })
        } else {
            deliverablesUploadModel.deleteMany({
                deliverables_id: req.body.id
            }, function (err, deleteData) {
                if (err) {
                    res.json({
                        status: 400
                    })
                }
            })
            res.json({
                status: 200
            })
        }
    })
});

router.get('/getDeliverables', (req, res) => {
    deliverables.aggregate([{
        $addFields: {
            id: {
                $toString: "$_id"
            }
        }
    },
    {
        $addFields: {
            courseId: {
                $toObjectId: "$course"
            }
        }
    },
    {
        $addFields: {
            semesterId: {
                $toObjectId: "$semester"
            }
        }
    },

    {
        "$lookup": {
            "from": "deliverablesuploads",
            "localField": "id",
            "foreignField": "deliverables_id",
            "as": "deliverables"
        }
    },

    {
        "$lookup": {
            "from": "collegecourses",
            "localField": "courseId",
            "foreignField": "_id",
            "as": "courses"
        }
    },

    {
        "$lookup": {
            "from": "semesterNew",
            "localField": "semesterId",
            "foreignField": "_id",
            "as": "semesters"
        }
    },

    {
        $project: {
            deliverables: {
                $filter: {
                    input: "$deliverables",
                    as: "data",
                    cond: {
                        $eq: ["$$data.teacher_id", "admin"]
                    }
                }
            },
            deliverablesTeacher: {
                $filter: {
                    input: "$deliverables",
                    as: "data",
                    cond: {
                        $ne: ["$$data.teacher_id", "admin"]
                    }
                }
            },
            "name": 1,
            "deadline": 1,
            "subject": 1,
            "courses": {
                $filter: {
                    input: "$courses",
                    as: "data",
                    cond: {}
                }
            },
            "semesters": {
                $filter: {
                    input: "$semesters",
                    as: "data",
                    cond: {}
                }
            },
        }
    },
    ]).then(function (deliverables) {
        console.log("degjjyfuy====>", deliverables)
        if (deliverables) {
            res.send({
                status: 200,
                data: deliverables,
            })
        }
    })
});

router.get('/getPlaybackLinks/:courseId/:batchId/:subject/:semId', (req, res) => {
    var batch_ID = [];
    batchSemesterMasterModel.find({
        semesterId: req.params.semId
    }).then(function (data) {
        data.forEach(element => {
            batch_ID.push({
                batch_id: element.batchId
            })
        });
        if (batch_ID.length > 0) {
            NewTimeTableModel.aggregate([{
                $addFields: {
                    id: {
                        $toString: "$_id"
                    }
                }
            },
            {
                $match: {
                    course_id: {
                        $eq: req.params.courseId
                    },
                    subject: {
                        $eq: req.params.subject
                    },
                    $or: batch_ID,
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
            ]).then(function (links) {
                var linkData = [];
                links.forEach(element => {
                    if (element.playbackLink.length > 0) {
                        linkData.push({
                            topicNames: element.topicNames,
                            playbackLink: element.playbackLink,
                            date: element.date
                        })
                    }
                });
                if (linkData) {
                    res.send({
                        status: 200,
                        data: linkData,
                    })
                }
            })
        } else {
            NewTimeTableModel.aggregate([{
                $addFields: {
                    id: {
                        $toString: "$_id"
                    }
                }
            },
            {
                $match: {
                    course_id: {
                        $eq: req.params.courseId
                    },
                    subject: {
                        $eq: req.params.subject
                    },
                    batch_id: {
                        $eq: req.params.batchId
                    },
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
            ]).then(function (links) {
                var linkData = [];
                links.forEach(element => {
                    if (element.playbackLink.length > 0) {
                        linkData.push({
                            topicNames: element.topicNames,
                            playbackLink: element.playbackLink
                        })
                    }
                });
                if (linkData) {
                    res.send({
                        status: 200,
                        data: linkData,
                    })
                }
            })
        }
    })

});



router.get('/getDeliverablesOfTeacher/:user_id', (req, res) => {
    var data = [];
    teacherModel.find({
        teacher_id: req.params.user_id
    }).populate('course_id', ['courseName']).populate('semesterId', ['semesterName', 'semesterStatus']).sort({
        "created_at": 1
    }).exec(function (err, teachers) {
        teachers.forEach(function (element) {
            if (element.semesterId.semesterStatus == 'true') {
                deliverables.aggregate([{
                    $addFields: {
                        id: {
                            $toString: "$_id"
                        }
                    }
                },
                {
                    $addFields: {
                        courseId: {
                            $toObjectId: "$course"
                        }
                    }
                },
                {
                    $addFields: {
                        semesterId: {
                            $toObjectId: "$semester"
                        }
                    }
                },
                {
                    $match: {
                        subject: {
                            $eq: element.subject
                        },

                    }
                },
                {
                    "$lookup": {
                        "from": "deliverablesuploads",
                        "localField": "id",
                        "foreignField": "deliverables_id",
                        "as": "deliverables"
                    }
                },

                {
                    "$lookup": {
                        "from": "collegecourses",
                        "localField": "courseId",
                        "foreignField": "_id",
                        "as": "courses"
                    }
                },

                {
                    "$lookup": {
                        "from": "semesterNew",
                        "localField": "semesterId",
                        "foreignField": "_id",
                        "as": "semesters"
                    }
                },

                {
                    $project: {
                        deliverables: {
                            $filter: {
                                input: "$deliverables",
                                as: "data",
                                cond: {
                                    $eq: ["$$data.teacher_id", "admin"]
                                }
                            }
                        },
                        deliverablesTeacher: {
                            $filter: {
                                input: "$deliverables",
                                as: "data",
                                cond: {
                                    $ne: ["$$data.teacher_id", "admin"]
                                }
                            }
                        },
                        "name": 1,
                        "deadline": 1,
                        "subject": 1,
                        "courses": {
                            $filter: {
                                input: "$courses",
                                as: "data",
                                cond: {}
                            }
                        },
                        "semesters": {
                            $filter: {
                                input: "$semesters",
                                as: "data",
                                cond: {}
                            }
                        },
                    }
                },
                ]).then(function (deliverables) {
                    deliverables.forEach(function (element1) {
                        data.push(element1)
                    })
                })
            }
        })
    })



    setTimeout(() => {

        if (data) {
            res.send({
                status: 200,
                data: data,
            })
        }
    }, 1500);

});

router.get('/getDeliverablesForTeacher/:id/:user_id', (req, res) => {
    deliverablesUploadModel.find({
        deliverables_id: req.params.id,
        teacher_id: req.params.user_id
    })
        .then(function (deliverables) {
            if (deliverables) {
                res.send({
                    status: 200,
                    data: deliverables,
                })
            }
        })
});


router.get('/getDeliverablesAllTeacher/:id', (req, res) => {
    deliverablesUploadModel.find({
        deliverables_id: req.params.id,
        teacher_id: {
            $ne: "admin"
        }
    }).populate('teacher_id', ['fullName']).then(function (deliverables) {
        if (deliverables) {
            console.log("deliverab;enjnh", deliverables)
            res.send({
                status: 200,
                data: deliverables,
            })
        }
    })
});

router.get('/sheduleReminderToTeacher', (req, res) => {

    var today = moment(new Date()).format('YYYY-MM-DD');
    var addTime = moment().add(1, 'days').format('YYYY-MM-DD');
    var teacherData = [];
    NewTimeTableModel.find({
        date: addTime
    }).then(function (timeTables) {
        console.log(JSON.stringify(timeTables))
        if (timeTables.length > 0) {

            timeTables.forEach(timeTable => {
                userModel.findById(timeTable.teacher_id, (err, teacher) => {
                    // console.log(teacher);
                    var flag = false;
                    if (teacherData.length > 0) {
                        teacherData.forEach(teacherLocal => {
                            if (teacherLocal.email == teacher.email) {
                                flag = true;
                            }
                        })
                        if (flag == false) {
                            teacherData.push({
                                fullName: teacher.fullName,
                                email: teacher.email,
                                mobile_no: teacher.mobile,
                                subject: timeTable.subject,
                                date: timeTable.date,
                                fromTime: timeTable.fromTime,
                                toTime: timeTable.toTime
                            })
                        }
                    } else {
                        teacherData.push({
                            fullName: teacher.fullName,
                            email: teacher.email,
                            mobile_no: teacher.mobile,
                            subject: timeTable.subject,
                            date: timeTable.date,
                            fromTime: timeTable.fromTime,
                            toTime: timeTable.toTime
                        })
                    }
                })

            })

            setTimeout(() => {
                // console.log("teacher data == " + JSON.stringify(teacherData));
                teacherData.forEach(teacher => {
                    // console.log("single teacher data == " , teacher)
                    emailService.sheduleReminderToTeacher(teacher);
                })
            }, 1000)
        }
    })
})

router.post('/getFacultyLectureDetails', (req, res) => {
    console.log("req------", req.body)
    var totalMinutes;
    var data = [];
    NewTimeTableModel.find({
        batch_id: req.body.batch_id._id,
        course_id: req.body.course_id,
        // division_id:req.body.divisionId,
        semester_id: req.body.semesterId,
        subject: req.body.subject,
        teacherName: req.body.teacherName,
        approval: 'Approved',
        date: {
            $gt: req.body.fromDate,
            $lt: req.body.toDate
        }
    }).sort({
        'date': -1
    }).then((lectureDetails) => {
        lectureDetails.forEach((element) => {
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

            data.push({
                date: element.date,
                fromTime: element.fromTime,
                toTime: element.toTime,
                playbackLink: element.playbackLink,
                totalTime: totalMinutes,
                _id: element._id
            })

        })

        if (lectureDetails == 0) {
            res.json({
                status: 400,
                message: 'No lectures conducted...!!'
            })
        } else {
            setTimeout(() => {
                res.json({
                    status: 200,
                    data: data,
                })
            }, 3000)
        }
    })
})

router.get('/getFacultyData', (req, res) => {
    var view_data = [];
    teacherModel.find({
        batch_id: req.query.batchId
    }).populate('batch_id', ['batchName', 'year'])
        .populate('course_id', ['courseName']).populate('semesterId', ['semesterName']).populate('teacher_id', ['fullName'])
        .then((data) => {
            data.forEach((element, index) => {
                var year = element.batch_id.year.split(' - ')
                var innvoiceNumber = element.batch_id.batchName + "" + element.course_id.courseName[0] + "" + year[1] + "" + req.query.monthName + "" + req.query.year + "" + (index + 1)
                view_data.push({
                    _id: element._id,
                    divisionId: element.divisionId,
                    teacher_id: element.teacher_id,
                    batch_id: element.batch_id,
                    department_id: element.department_id,
                    course_id: element.course_id,
                    subject: element.subject,
                    semesterId: element.semesterId,
                    innvoiceNumber: innvoiceNumber,
                    ratePerHour: element.ratePerHour
                })
            })


            if (data.length == 0) {
                res.json({
                    status: 400,
                    message: 'No data found...!!'
                })
            } else {
                res.json({
                    status: 200,
                    data: view_data
                })
            }
        })
})

router.post('/getFacultySignedPdfs', (req, res) => {
    var view_data = [];
    facultyPayment.find({
        invoiceNumber: req.body.invoiceNumber,
        specialization: req.body.specialization,
        subjects: req.body.subject,
        teacherId: req.body.teacher_id,
        type: 'signed',
        month: req.body.month,
        year: req.body.year
    }).then(files => {
        files.forEach(file => {
            view_data.push({
                filename: file.fileName,
                doc_id: file.doc_id,
                filelink: `${filelink}/api/viewCourse/download?document_id=${file.doc_id}`
            })
        })
        res.json({
            status: 200,
            data: view_data
        })
    })
})

router.post('/lectureListPdf', function (req, res) {
    lectureListPdf(req)
    var monthName = req.body.monthName;
    var year = req.body.year
    var user_id = req.body.teacher_id;
    var teacherName = req.body.teacherName;
    var dateRange = req.body.dateRange;
    var createdDate = new Date()
    var invoiceNumber = req.body.invoiceNumber;
    var specialization = req.body.specialization;
    var subject = req.body.subject;
    var data = req.body.data;
    var filePath = '/src/payment_PDF/' + user_id + '/' + invoiceNumber + 'L.pdf'
    data.forEach(datas => {
        NewTimeTableModel.findByIdAndUpdate(datas._id, {
            $set: {
                'totalMinutes': datas.totalTime
            }
        }, function (err, lesson) {
            if (err) {
                console.log(err)
            }
        })
    })
    self_PDF.lectureListPdf(user_id, teacherName, dateRange, monthName, year, createdDate, invoiceNumber, specialization, subject, data, function (err) {
        if (err) {

            res.send({
                status: 400,
                data: err
            })
        } else {
            setTimeout(function () {
                console.log("file generated sucessfully....!!")
                res.json({
                    filePath: filePath,
                    status: 200
                });

            }, 3000);
        }
    });
})
async function lectureListPdf(req) {
    var user = await getId.getUserId(req.body.teacher_id, '')
    var monthName = req.body.monthName;
    var year = req.body.year
    var user_id = user.id;
    var teacherName = req.body.teacherName;
    var dateRange = req.body.dateRange;
    var createdDate = new Date()
    var invoiceNumber = req.body.invoiceNumber;
    var specialization = req.body.specialization;
    var subject = req.body.subject;
    var data = req.body.data;
    var filePath = '/src/payment_PDF/' + user_id + '/' + invoiceNumber + 'L.pdf'
    data.forEach(datas => {
        NewTimeTableModel.find({
            _id: datas._id
        }).then(timetable => {
            timetable.forEach(async elm => {
                var batch = await getId.getBatchId(elm.batch_id, '')
                var course = await getId.getCourseId(elm.course_id, '')
                var semester = await getId.getSemesterId(elm.semester_id, '');
                var subject = await getId.getSubjectId(elm.subject, course.id, semester.id)
                var division = await getId.getDivisionId(elm.division_id, '')
                var User = await getId.getUserId(elm.teacher_id, '')
              await  models.newtimetables.find({
                    where: {
                        teacherId: User.id,
                        courseId: course.id,
                        batchId: batch.id,
                        divisionId: division.id,
                        semesterId: semester.id,
                        subjectId: subject.id
                    }
                }).then(time => {
                    if(time){
                        time.update({
                            totalMinutes: datas.totalTime
                        })
                    }
                   
                })

            })

        })
    })

}
router.post('/paymentPDF', function (req, res) {

    var user_id = req.body.data[0].teacher_id;
    var teacherName = req.body.data[0].teacherName;
    var monthName = req.body.data[0].monthName;
    var year = req.body.data[0].year;
    var dateRange = req.body.data[0].paymentOf;
    var createdDate = new Date()
    var invoiceNumber = req.body.data[0].invoiceNumber;
    var specialization = req.body.data[0].specialization;
    var subject = req.body.data[0].subject;
    var data = req.body.data;
    var totalMinutes = req.body.data[0].totalMinutes;
    var totalHours = req.body.data[0].totalHours;
    var ratePerHour = req.body.data[0].ratePerHour;
    var grossPay = req.body.data[0].grossPay;
    var TDS = req.body.data[0].TDSCutting;
    var PT = req.body.data[0].provitionalTax;
    var netPay = req.body.data[0].netPay;
    var filePath = '/src/payment_PDF/' + user_id + '/' + invoiceNumber + 'pay.pdf'

    self_PDF.facultyPaymentPdf(user_id, teacherName, dateRange, monthName, year, invoiceNumber, specialization, subject, totalMinutes, totalHours, ratePerHour, grossPay, TDS, PT, netPay, function (err) {
        if (err) {

            res.send({
                status: 400,
                data: err
            })
        } else {
            setTimeout(function () {
                console.log("file generated sucessfully....!!")
                res.json({
                    filePath: filePath,
                    status: 200
                });

            }, 3000);
        }
    });
})

router.get('/downloadpdf', function (req, res) {
    var currentPath = process.cwd();
    var location = currentPath + req.query.pdf;
    const downloadData = location;
    res.download(downloadData);
});

router.post('/getFacultyPaymentFiles', function (req, res) {
    const testFolder = 'lms/lmsserver/src/payment_PDF/' + req.body.userId;
    facultyPayment.find({
        teacherId: req.body.userId,
        // teacherId:'5f4c84162294ef39cb0d7741',
        month: req.body.month,
        year: req.body.year
    }).then(function (element) {
        // console.log("faculty==================",element)
        if (element != '' || element != undefined) {
            res.json({
                status: 200,
                data: element
            })
        } else {
            res.json({
                status: 400,
                message: 'data not found'
            })
        }
    })
    // const fs = require('fs');
    // var fileFound
    // var lectureListpdf;
    // var paymentpdf;
    // var signedpdf;
    // var str1 = req.body.date;
    // var str2;
    // var str3;
    // var fileFlag;
    // fs.readdirSync(testFolder).forEach(file => {
    // //   console.log(file);
    // str2 = file;

    //   fileFound = str2.includes(str1);
    // //   if(str2.includes(str1)==true){
    // //       str3=str2
    // //       console.log("str3=======",str3)
    // //   }
    // //   if(fileFound==true){
    // //       fileFlag=true;
    // //     //   console.log("final file==========",str2)

    // //     //  promise1=new Promise((resolve,reject)=>{
    // //         if(str3.includes('L')==true){
    // //         //   setTimeout(() => {
    // //         //   resolve(
    // //               lectureListpdf= testFolder+'/'+str3
    // //         //       )
    // //         //   }, 1000);  
    // //           console.log("lecture file=======",str2)
    // //         }else{
    // //             // reject()
    // //             lectureListpdf=''
    // //         }
    // //     //  }) 
    // //     // promise2 = new Promise((resolve,reject)=>{if(str3.includes('pay')==true){
    // //         //   if(str2==)/
    // //         // setTimeout(() => {
    // //           console.log("pay pdf================",str2)
    // //         //   resolve(
    // //               paymentpdf= testFolder+'/'+str3
    // //             //   )
    // //         // }, 1000);
    // //       }else{
    // //           paymentpdf='';
    // //         //   reject()
    // //       }
    //     // })

    //     //   promise3 = new Promise((resolve,reject)=>{
    //     //       if(str3.includes('sign')==true){
    //     //         // setTimeout(() => {
    //     //             console.log("sign==========",str2)
    //     //     // resolve(
    //     //         signedpdf= testFolder+'/'+str3
    //     //         // )
    //     // // }, 1000);
    //     // }else{
    //     //     signedpdf='';
    //     //     // reject()
    //     // }
    // // })
    //   },

    //   console.log("n====================================",fileFound,"====file=========s")
    // );
    // console.log("n====================================",fileFound,"====file========str2====")

    // if(fileFlag===true){
    // //   Promise.all([promise1,promise2,promise3]).then(result=>{
    //     setTimeout(() => {
    //         console.log("lect=====",lectureListpdf,"======pay=====",paymentpdf,"==sign========",signedpdf)
    //         res.json({
    //             status:'200',
    //             lectureList:lectureListpdf,
    //             payment:paymentpdf,
    //             signedpdf:signedpdf
    //         })
    //     }, 3000);
    // //   }) 
    // }
    // else{
    //     setTimeout(()=>
    //     res.json({
    //               status:400,
    //               message:'file not found...!!'
    //           }),3000)

    // }
})

// using cohortId get semester (Megha Patil ----Date:18-11-2021)
router.get('/getSemesterOfCohort', (req, res) => {
    var view_data = [];
    cohortTeacherModel.find({
        cohortId: req.query.id,
    }).populate('semesterId', ['semesterName']).exec(function (err, teacher) {
        // console.log("teacher2---"+JSON.stringify(teacher))
        if (err) {
            return res.status(400).json({
                message: 'Bad Request',
            })
        } else if (teacher != '' || teacher != null || teacher != 'undefined' || teacher != undefined) {
            teacher.forEach(function (teachers) {
                view_data.push({
                    teacher_id: teachers.teacher_id,
                    cohortName: teachers.cohortId.cohortName,
                    subject: teachers.subject,
                    semesterName: teachers.semesterId.semesterName,
                    semesterId: teachers.semesterId._id
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

    })
})

//get allocated subject using cohortId (Megha Patil ----Date:18-11-2021)
router.get('/getCohortsAllSubject', (req, res) => {
    var view_data = [];
    cohortTeacherModel.find({
        cohortId: req.query.id,
    }).exec(function (err, cohort) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request',
            })
        } else if (cohort != '' || cohort != null || cohort != 'undefined' || cohort != undefined) {
            cohort.forEach(function (cohorts) {
                view_data.push({
                    teacher_id: cohorts.teacher_id,
                    subject: cohorts.subject,
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
})

// get cohort allocated teacher and location of lecture(Megha Patil ----Date:18-11-2021)
router.get('/getCohortSubject', (req, res) => {
    var locationss = [];
    cohortTeacherModel.find({
        subject: req.query.subject,
        cohortId: req.query.cohort_id,
    }).populate('teacher_id', ['fullName']).then(function (teachers) {
        // console.log("teacher----"+JSON.stringify(teachers))
        if (teachers != "" || teachers != null) {
            cohortTimeTableModel.find({

            }).then(function (locations) {
                locations.forEach(location => {
                    locationss.push(
                        location.location,
                    )
                })
            })
        }
        setTimeout(() => {
            res.send({
                status: 200,
                data: teachers,
                data2: locationss
            })
        }, 1500);

    })
})

router.post('/saveCohortExcelTimeTable', (req, res) => {
    var data = new Uint8Array(req.files.file.data);
    var workbook = xlsx.read(data, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
    });
    var sheet_name_list = workbook.SheetNames;
    var columns = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        raw: false,
        dateNF: "YYYY-MM-DD hh:mm"
    });
    var counter = 0;
    columns.map(data => {

        cohortTimeTableModel.insertMany({
            cohort_id: data.cohort_id,
            semesterName: data.semesterName,
            subject: data.subject,
            cohortTeacherId: data.cohortTeacherId,
            cohortName: data.cohortName,
            teacherName: data.teacherName,
            teacher_id: data.teacher_id,
            date: splitDate(data.date),
            fromTime: data.fromTime, //splitTime(data.fromTime),
            toTime: data.toTime, //splitTime(data.toTime),
            location: data.location,
            semester_id: data.semester_id,
            approval: "Approved"

        }, (err, timeTable) => {
            counter++;
            if (err) {
                console.error(err);
            } else {
                if (counter == columns.length) {
                    res.json({
                        status: 200
                    })
                }
            }
        })
    })
})


//save cohort time table (Megha Patil ----Date:18-11-2021)
router.post('/saveCohortTimeTable', (req, res) => {
    var cohortTimeTable = new cohortTimeTableModel({});
    cohortTimeTableModel.create({
        cohortName: req.body.cohortName,
        semesterName: req.body.semesterName,
        subject: req.body.subject,
        teacherName: req.body.teacherName,
        cohort_id: req.body.cohort_id,
        teacher_id: req.body.teacher_id,
        date: req.body.date,
        fromTime: req.body.fromTime,
        toTime: req.body.toTime,
        location: req.body.location,
        semester_id: req.body.semester_id,
        approval: "Approved",
        cohortTeacherId: req.body.cohortTeacherId

    }, (err, dataInserted) => {
        if (err) {
            console.error(err)
        } else {
            var activity_action = "Added CohortTimetable.";
            var activity_data = req.body.teacherName + " Added CohortTimetable for cohort " + req.body.cohortName + " and subject " + req.body.subject;
            notification_function.activity(activity_action, activity_data, req.body.cohortName, req.body.subject);
            res.json({
                status: 200,
                data: dataInserted
            })
        }
    })

})

//edit cohort time table (Megha Patil ----Date:18-11-2021)
router.post('/editCohortTimeTable', (req, res) => {
    // console.log('/editCohortTimeTable' + JSON.stringify(req.body.data));
    cohortTimeTableModel.findByIdAndUpdate({
        _id: req.body.data._id
    }, {
        date: req.body.data.date,
        location: req.body.data.location,
        fromTime: req.body.data.fromTime,
        toTime: req.body.data.toTime
    }).then(function (updatedTimeTable) {
        cohortTimeTableModel.findById(req.body.data._id).then(function (timeTable) {
            // console.log("id-----"+JSON.stringify(req.body.data._id))
            // if(timeTable.approval == 'Approved'){
            // if(req.body.data.notify == true){
            //     studentBatches.find({
            //         batchId : timeTable.batch_id,
            //         // divisionId : timeTable.division_id
            //     }).then(function(studentBatches){
            //         studentBatches.forEach(studentBatch =>{
            //             userModel.findById(studentBatch.studentId).then(function(student){
            //                 emailService.updateScheduleMsg(student.email,student.mobile,updatedTimeTable.date,updatedTimeTable.fromTime);
            //             })
            //         })
            //     })
            // }
            // res.json({
            //     status : 200
            // })
            // }else{
            res.json({
                status: 200
            })
            // }
        })
    })
})

// save playbacklink of cohort in cohort time table model (Megha Patil ----Date:19-11-2021)
router.post('/savePLaybackLinkOfCohort', (req, res) => {
    if (req.body.id) {
        var query = {
            _id: req.body.id
        },
            update = {
                $set: {
                    playbackLink: req.body.link
                }
            };
        cohortTimeTableModel.findOneAndUpdate(query, update, function (req, timetable) {
            res.json({
                status: 200,
                data: timetable
            });
        });
    }
})

//update the cohort time table (Megha Patil ----Date:19-11-2021)
router.post('/updateCohortTimeTable', function (req, res) {
    var query = {
        _id: req.body.id
    }
    cohortTimeTableModel.findOneAndUpdate(query, {
        $set: {
            approval: req.body.approval,
        }
    }, (err, data) => {
        if (err) {
            console.err(err);
        } else {
            var url = "pages/calendar";
            userModel.find({
                _id: req.body.user_id
            }).then(function (userdetails) {
                if (userdetails) {
                    var activity_action = req.body.approval + " Cohorttimetable.";
                    var activity_data = userdetails[0].fullName + ' ' + req.body.approval + " cohorttimetable of subject " + req.body.subject;
                    notification_function.activity(activity_action, activity_data, '', '');
                }
            })
            // if (req.body.approval == 'Approved') {
            //     studentDivisionModel.find({
            //         divisionId: req.body.division_id,
            //     }).then(function (users) {
            //         users.forEach(function (user) {
            //             var action = "Admin Added TimeTable";
            //             var notification_data = "New class for " + req.body.subject + " on " + req.body.date + " from " + req.body.fromTime + " till " + req.body.toTime;
            //             notification_function.notification(action, notification_data, user.studentId, url, '');
            //         })
            //     });
            // }
            // userModel.find({
            //     role: 'admin'
            // }).then(function (users) {
            //     users.forEach(function (user) {
            //         if (req.body.approval == 'Approved') {
            //             var action = "Teacher Approved TimeTable";
            //             var notification_data = req.body.fullName + " Approved time table of class " + req.body.subject + " on " + req.body.date;
            //             notification_function.notification(action, notification_data, user._id, url, '');
            //         } else {
            //             var action = "Teacher Unapproved TimeTable";
            //             var notification_data = req.body.fullName + " Unapproved time table of class " + req.body.subject + " on " + req.body.date;
            //             notification_function.notification(action, notification_data, user._id, url, '');
            //         }

            //     })
            // });
            res.json({
                status: 200,
                message: data
            })
        }
    });
});

// AbhayEdulab 15-12-2021 add shedule check time range
router.get('/getLectureTime', function (req, res) {
    var view_data = []
    NewTimeTableModel.find({
        teacher_id: req.query.teacherid,
        date: req.query.date
    }).then(function (Time) {

        Time.forEach(function (data) {
            view_data.push(data)
        })
        if (view_data) {
            res.json({
                status: 200,
                data: view_data
            })
        }
    })
})

// AbhayEdulab 15-12-2021 add shedule check time range
router.get('/getcohortLectureTime', function (req, res) {
    var view_data = []
    cohortTimeTableModel.find({
        teacher_id: req.query.teacherid,
        date: req.query.date
    }).then(function (Time) {
        Time.forEach(function (data) {
            view_data.push(data)
        })
        if (view_data) {
            res.json({
                status: 200,
                data: view_data,
            })
        }
    })
});

router.post('/schedulePVR', function (req, res) {
    console.log("req ---->>")
    var fullName = 'Francis Pinto',
        user_id = '602ced716155b5073b333b95',
        course_id = '5de8b1e112ae4f1b3cd60456',
        weekStart = '2021-12-19',
        weekEnd = '2021-12-25';
    NewTimeTableModel.find({
        "teacher_id": {
            $eq: user_id
        },
        "course_id": {
            $eq: course_id
        },
        "date": {
            $gte: weekStart,
            $lte: weekEnd
        },
        approval: 'Unapproved'
    }).sort('date').then(function (shedules) {
        if (shedules) {
            var options = {
                'method': 'POST',
                'url': 'https://studio.twilio.com/v2/Flows/FWf0ac3c9ce64fd800ade6c9c5da1d1728/Executions',
                'headers': {
                    'Authorization': 'Basic QUNjOGY3NmQ1M2Y2Y2E5MzllNjc3ODRlNTExZTJjNDFjNTphNWVkNDNmYjg0YWVjZTE4NjhiZTJkMzc1ZTEwNTgzMg=='
                },
                formData: {
                    'To': '+919665188436',
                    'From': '+17793452506',
                    'Parameters': '{"teacherName":"' + shedules[0].teacherName + '","date": "' + shedules[0].date + '","subject" : "' + shedules[0].subject + '","id" : "' + shedules[0]._id + '"}'
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
        }
    })
});

router.post('/saveSchedulePVR', function (req, res) {
    console.log("req----saveShedulePVR--->>", req.body)
    var query = {
        _id: req.body.id
    }
    if (req.body.status == '1') {
        update = {
            $set: {
                approval: "Approved"
            }
        }
    } else if (req.body.status == '2') {
        update = {
            $set: {
                approval: "Unapproved"
            }
        }
    }

    NewTimeTableModel.findOneAndUpdate(query, update, function (err, data) {
        if (err) {
            console.err(err);
        } else {
            console.log("data updated--->>", data)
            res.json({
                status: 200,
                message: data
            })
        }
    });
    //    console.log("req----saveShedulePVR--->>",req.params)
    //    console.log("req----saveShedulePVR--->>",req.query)
    // //    console.log("res----saveShedulePVR--->>",res)
});
router.get('/getSchedulePVR', function (req, res) {
    // console.log("req--getShedluePVR",req.body)
    var fullName = 'Francis Pinto',
        user_id = '602ced716155b5073b333b95',
        course_id = '5de8b1e112ae4f1b3cd60456',
        weekStart = '2021-12-19',
        weekEnd = '2021-12-25';
    NewTimeTableModel.find({
        "teacher_id": {
            $eq: user_id
        },
        "course_id": {
            $eq: course_id
        },
        "date": {
            $gte: weekStart,
            $lte: weekEnd
        },
        approval: 'Unapproved'
    }).sort('date').then(function (shedules) {
        if (shedules) {
            console.log("schedule--->>", shedules[0])
            res.json({
                id: shedules[0]._id,
                "teacher_id": shedules[0].teacher_id,
                courseName: shedules[0].courseName,
                subject: shedules[0].subject,
                teacherName: shedules[0].teacherName,
                date: shedules[0].date,
                fromTime: shedules[0].fromTime,
                toTime: shedules[0].toTime,
                location: shedules[0].location,
            })
        }
    })
});

router.get('/getCourseOfUser/:id', function (req, res) {
    let view_data = [];
    studentBatches.find({
        studentId: req.params.id,
    }).populate('courseId', ['courseName']).then(function (data) {
        data.forEach(element => {
            view_data.push(element.courseId.courseName)
        });
        setTimeout(() => {
            res.json({
                status: 200,
                data: view_data
            })
        }, 100);
    });
})
//added exports to send the new function
module.exports.getMonthlydata = getMonthlydata;
module.exports.router = router;