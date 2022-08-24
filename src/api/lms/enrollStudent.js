var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
require('../../app/models/enrollmentdetails');
var enrollmentDetailModel = mongoose.model('EnrollmentDetail');
require('../../app/models/course');
var courseModel = mongoose.model('Course');
require('../../app/models/batch');
var batchModel = mongoose.model('Batch');
var moment = require('moment');
var notification_function = require('./../../utils/function');
var dateService = require('../../utils/date.service');
var announcement_BatchSchema = require('../../app/models/announcement_Batch');
var announcement_batchModel = mongoose.model('Announcement_Batch');
var DivisionSchema = require('../../app/models/division');
var divisionModel = mongoose.model('Division');
var NewCourseSchema = require('../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
var TeacherSchema = require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
var studentDivisionSchema = require('../../app/models/studentDivision');
var studentDivisionModel = mongoose.model('StudentDivision');
require('../../app/models/blogs');
var blogsModel = mongoose.model('Blogs');
var SemesterSchema = require('../../app/models/semester');
var semesterModel = mongoose.model('Semester');
var studentBatchModel = mongoose.model('StudentBatch');
var StudentBatchSchema = require('../../app/models/studentBatch');
var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');
var SemesterNewSchema = require('../../app/models/semesterNew');
var semesterNewModel = mongoose.model('semesterNew');
var NoticeSchema = require('../../app/models/notice');
var noticeModel = mongoose.model('Notice');
var roomSchema = require('../../app/models/room');
var roomModel = mongoose.model('Room');
require('../../app/models/chat');
var chatModel = mongoose.model('Chat');
var newDivisionSchema = require('../../app/models/newDivision');
var newDivisionModel = mongoose.model('newDivision');
var ObjectID = require('mongodb').ObjectID;
require('../../app/models/webinarUser');
var webinarUserModel = mongoose.model('WebinarUser');
require('../../app/models/webinars');
var webinarsModel = mongoose.model('Webinars');
var json2xls = require('json2xls');
var fs = require('fs');
var emailService = require('../../utils/emailService');
require('../../app/models/teacherEducationalDetails');
var teacherEducationalDetailsModel = mongoose.model('TeacherEducationalDetails');
require('../../app/models/teacherDetailsUpload');
var teacherUploadDetailsModel = mongoose.model('TeacherDetailsUpload');
require('../../app/models/cohorttimetable')
var cohortTimeTableModel = mongoose.model('CohortTimeTable')
var CohortAttendanceSchema = require("../../app/models/cohortAttendance");
var cohortAttendanceModel = mongoose.model("CohortAttendance");
var cohortTopicOfTheDaySchema = require("../../app/models/cohortTopicOfTheDay");
var cohortTopicOfTheDayModel = mongoose.model("CohortTopicOfTheDay");
require('../../app/models/cohortTeacher')
var cohortTeacherModel = mongoose.model('CohortTeacher')
require("../../app/models/cohort");
var cohortModel = mongoose.model("Cohort");
var batchSemesterMasterSchema = require('../../app/models/batchSemesterMaster');
var batchSemesterMasterModel = mongoose.model('BatchSemesterMaster')
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models  = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();


/**
 * this route is used to enroll new student in batch
 */
router.post("/enrollStudent", function (req, res) {
    enrollStudent(req)
    var today = Date.now();
    enrollmentDetailModel.aggregate([{
        $match: {
            user_id: req.body.user_id,
            course_id: req.body.course_id,
        }
    }])
        .exec(function (err, enrolldetail) {
            if (err) {
                res.json({
                    status: 500,
                    message: 'Bad Request'
                });
            } else if (enrolldetail.length == 1 || enrolldetail.length > 1) {
                res.json({
                    status: 400,
                    message: 'This student is already enrolled for this course.'
                });
            } else {
                // batchModel.find({
                //     _id : req.body.batch_id
                // }).then((batchdata)=>{

                var enrollmentDetailEvent = new enrollmentDetailModel({

                    user_id: req.body.user_id,
                    course_id: req.body.course_id,
                    status: req.body.status,
                    batch_id: req.body.batch_id,
                    createdOn: today,
                    updatedOn: today
                })
                enrollmentDetailEvent.save(function (err, result) {
                    if (err) {
                        res.json({
                            status: 400,
                            message: 'Unable to save data!!!!!!!!!'
                        });
                    } else if (result) {
                        res.json({
                            status: 200,
                            message: 'Student successfully enrolled.'
                        })
                    }
                });
                // })
            }

        })

});
async function enrollStudent(req){
    var today = Date.now();
  var user = await getId.getUserId(req.body.user_id,'') 
  var course = await getId.getCourseId(req.body.course_id,'')
  var batch = await getId.getBatchId(req.body.batch_id,'') 
  models.enrollmentdetails.find({
    where:{
        userId:user.id,
        courseId:course.id,
        batchId :batch.id
    }
  }).then(enrolldetail=>{
    if(enrolldetail.length == 1 || enrolldetail.length > 1){
        // res.json({
        //     status: 400,
        //     message: 'This student is already enrolled for this course.'
        // });
    }else{
        models.enrollmentdetails.create({
            userId: user.id,
            courseId: course.id,
            status: req.body.status,
            batchId: batch.id,
        }).then(enroll=>{
            if (enroll) {
                // res.json({
                //     status: 200,
                //     message: 'Student successfully enrolled.'
                // })
            }
        })
    }
  })
}

/**
* This routes is used for to check how many students have to enroll in batch
* who are not enrollerd in other batches of that course.
*/
router.get("/listOfCourseUsers", function (req, res) {

    var view_data = []
    userModel.find({
        "role": 'student',
        degreeName: req.query.degreeName
    }).then(function (users) {
        users.forEach(function (user) {
            enrollmentDetailModel.find({
                user_id: user._id,
                course_id: req.query.course_id
            }).then(function (enrolldetail) {
                if (enrolldetail.length == 1 || enrolldetail.length > 1) {
                } else if (enrolldetail.length == 0) {
                    view_data.push(user)
                }
            })
        })
        setTimeout(function () {

            res.send({
                status: 200,
                data: view_data
            })
        }, 3000)

    })

});

/**
 * this route is used for student datshboard
 */

// Author SP :: 16-06-2021
router.get('/studentEnrolledCourse', function (req, res) {
    var view_data = [];
    var semestersData = [];
    var course_subjects = [];
    var semesterId = req.query.semesterId
    if (semesterId != ''  && semesterId != 'undefined') {
        studentBatchModel.aggregate([
            {
                $match: {
                    studentId: {
                        $eq: req.query.user_id
                    },

                }
            },
            {
                "$lookup": {
                    "from": "batchsemestermasters",
                    "localField": "batchId",
                    "foreignField": "batchId",
                    "as": "batchSemesters"
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
                "$lookup": {
                    "from": "batchmasters",
                    "localField": "batchId",
                    "foreignField": "_id",
                    "as": "batches"
                }
            },

        ]).then(async function (data) {
            if (data) {
                subjectModel.find({
                    courseId: data[0].courseId,
                    semesterId: semesterId
                }).populate('courseId', ['courseName']).populate('semesterId', ['semesterName']).then(async function (subject) {
                    if (subject != '' || subject != null || subject != undefined) {
                        await subject.forEach(subjectData => {
                            var sub1 = subjectData.subject;
                            var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                            var sub = sub2.replace(/^"(.*)"$/, '$1');
                            var strs = sub.split('","');
                            strs.forEach(function (courseSubject) {
                                course_subjects.push(courseSubject)
                            });
                            course_subjects.forEach(elments=>{
                                view_data.push({
                                    subject: elments,
                                    subjects : course_subjects,
                                    courseName: subjectData.courseId.courseName,
                                    courseId: subjectData.courseId._id,
                                    semesterName: subjectData.semesterId.semesterName,
                                    semesterId: subjectData.semesterId._id,
                                    batchName: data[0].batches[0].batchName,
                                    batchId: data[0].batches[0]._id,
                                    overview: '',
                                });
                            })

                        })
                        setTimeout(() => {
                            res.json({
                                status: 200,
                                data: view_data,
                            })
                        }, 1000);
                    }
                })
            }

        })

    } else {
        studentBatchModel.aggregate([
            {
                $match: {
                    studentId: {
                        $eq: req.query.user_id
                    },

                }
            },
            {
                "$lookup": {
                    "from": "batchsemestermasters",
                    "localField": "batchId",
                    "foreignField": "batchId",
                    "as": "batchSemesters"
                }
            },
            {
                $unwind: {
                    path: "$batchSemesters",
                    preserveNullAndEmptyArrays: true
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
                "$lookup": {
                    "from": "batchmasters",
                    "localField": "batchId",
                    "foreignField": "_id",
                    "as": "batches"
                }
            },
            {
                $addFields: {
                    semId: {
                        $toObjectId: "$batchSemesters.semesterId"
                    }
                }
            },
            {
                "$lookup": {
                    "from": "semesterNew",
                    "localField": "semId",
                    "foreignField": "_id",
                    "as": "semesters"
                }
            },
            {
                $lookup: {
                    from: "subjects",
                    let: {
                        courseID: "$courseId",
                        semId: "$batchSemesters.semesterId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$courseId", "$$courseID"],
                                },
                                {
                                    $eq: ["$semesterId", "$$semId"],
                                }
                                ]
                            }
                        }
                    }],
                    as: "subjects"
                }
            },
            {
                $addFields: {
                    course: {
                        $toObjectId: "$courseId"
                    }
                }
            },
            {
                "$lookup": {
                    "from": "collegecourses",
                    "localField": "course",
                    "foreignField": "_id",
                    "as": "courses"
                }
            },
        ]).then(async data => {
            var view_data = [];
            var semesters = [];
            await data.forEach(elm => {
                // console.log("elm--->>",elm)
                if (elm.batches[0].batchStatus == 'true' && elm.semesters[0].semesterStatus == 'true') {
                    var sub1 = elm.subjects[0].subject;
                    var sub2 = sub1.replace(/^\[([^]*)]$/, '$1');
                    var sub = sub2.replace(/^"(.*)"$/, '$1');
                    var strs = sub.split('","');
                    strs.forEach(function (courseSubject) {
                            course_subjects.push(courseSubject)
                        });
                        course_subjects.forEach(elments=>{
                            view_data.push({
                                subject: elments,
                                subjects : course_subjects,
                            courseName: elm.courses[0].courseName,
                            courseId: elm.courses[0]._id,
                            semesterName: elm.semesters[0].semesterName,
                            semesterId: elm.semesters[0]._id,
                            batchName: elm.batches[0].batchName,
                            batchId: elm.batches[0]._id,
                            overview: '',
                            divisionId: elm.divisionId
                        });
                    });
                    course_subjects = [];

                }
                semesters.push(elm.semesters[0])
            })
            res.json({
                status: 200,
                data: view_data,
                semesters: semesters
            })
        })
    }
})

//    router.get('/studentEnrolledCourse',function(req,res){
//     var user_id = req.query.user_id;
//     var backSemesterId=req.query.backSemId;
//     var view_data=[];
//     var view_data1=[];
//     var view_data2=[];
//     var course_subjects = [];
//     var noticeArray = [];
//     var fromDate;
//     var toDate;
//     toDate = new Date()
//     toDate.setDate(toDate.getDate() + 1)
//     console.log(toDate)
//     fromDate = new Date(new Date().setDate(new Date().getDate() - 30));
//     if(req.query.user_id!=undefined ){
//   if((req.query.backSemId=='undefined' || req.query.backSemId=='null') &&  (req.query.semesterId=='undefined' || req.query.semesterId==undefined || req.query.semesterId=='' || req.query.semesterId==null)){
//   // console.log("here in first condn")
//     studentBatchModel.find({
//             studentId:user_id
//         }).populate('batchId',['batchName']).populate('departmentId',['departmentName']).populate('studentId',['fullName','email'])
//         .populate('courseId',['courseName']).sort({'createdOn':-1}).then(function(student){
//             console.log("student==>"+JSON.stringify(student.length))
//             if(student!=null || student!='' || student!=undefined ){
//                 var course=student[0].courseId;
//                 var courseID=course._id;
//                 var datacourseName = course.courseName;
//                 var batch=student[0].batchId;
//                 var batchID=batch._id;
//                 var  courseName;
//                 if(datacourseName == 'B.Sc'){
//                     courseName = 'BSc'
//                 }else if(datacourseName == 'M.Sc'){
//                     courseName = 'MSc'
//                 }else if(datacourseName == 'PG Diploma'){
//                     courseName = 'Diploma'
//                 }else if(datacourseName == 'Workshop on Data Analytics and Database Management'){
//                     courseName = 'Diploma'
//                 }
//                 console.log("courseName=>"+courseName)
//                     batchMasterModel.find({
//                     _id:batchID ,
//                     courseId:courseID
//                     }).then(function(batches){
//                         var semJSonOrCond = [];
//                         if(batches!=''){
//                             if(batches[0].batchName=='TY'){
//                                     semJSonOrCond =  [{
//                                         semesterName:"Semester 5"
//                                     },
//                                     {
//                                         semesterName:"Semester 6"
//                                     },
//                                     {
//                                         semesterName:courseName+" Semester 5"
//                                     },
//                                     {
//                                         semesterName:courseName+" Semester 6"
//                                     },
//                                     ]
//                             }else if(batches[0].batchName=='SY'){
//                                  semJSonOrCond =[{
//                                             semesterName:"Semester 4"
//                                         },
//                                         {
//                                             semesterName:"Semester 3"
//                                         },
//                                         {
//                                             semesterName:  courseName+" Semester 4"
//                                         },
//                                         {
//                                             semesterName: courseName+" Semester 3"
//                                         }]

//                             }else if(batches[0].batchName=='FY'){
//                                 semJSonOrCond =[{
//                                     semesterName:"Semester 1"
//                                 },
//                                 {
//                                     semesterName:"Semester 2"
//                                 } ,
//                                 {
//                                     semesterName:courseName+" Semester 1"
//                                 },
//                                 {
//                                     semesterName:courseName+" Semester 2"
//                                 },]
//                             }
//                             else if(batches[0].batchName == 'Batch 1 - June 2021'){
//                                 semJSonOrCond =[{
//                                     semesterName:"Semester 1"
//                                 },
//                                 {
//                                     semesterName:"Semester 2"
//                                 } ,
//                                 {
//                                     semesterName:courseName+" Semester 1"
//                                 },
//                                 {
//                                     semesterName:courseName+" Semester 2"
//                                 },]
//                             }
//                             console.log("semJSonOrCond===>"+JSON.stringify(semJSonOrCond));
//                             semesterNewModel.find({
//                                 $or : semJSonOrCond
//                             }).sort({'createdOn':-1}).exec(function(err,semesters){
//                                 console.log("semesters===>"+JSON.stringify(semesters));
//                                 if(err){
//                                     console.log(err);
//                                 }else if(semesters!=''){
//                                     if(semesters.length == 1 && semesters[0].semesterStatus=='true'){
//                                         semesterNewModel.find({
//                                             _id:semesters[0]._id
//                                         }).then(function(semestersFirstSem){
//                                             if(semestersFirstSem!=''){
//                                                 semestersFirstSem.forEach(function(semesterData){
//                                                     view_data1.push({semesterData});
//                                                 });

//                                                 subjectModel.find({
//                                                     courseId:batches[0].courseId,
//                                                     semesterId:semestersFirstSem[0]._id
//                                                 }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                     if(subject!='' || subject!=null || subject!=undefined){
//                                                         subject.forEach(subjectData=>{
//                                                                 var sub1 = subjectData.subject;
//                                                                 var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                                 var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                                 var strs = sub.split('","');
//                                                                 strs.forEach(function(courseSubject) {
//                                                                 course_subjects.push(courseSubject);

//                                                             });
//                                                                 view_data.push({
//                                                                     subjects:course_subjects ,
//                                                                     courseName:subjectData.courseId.courseName,
//                                                                     courseId:subjectData.courseId._id,
//                                                                     semesterName:subjectData.semesterId.semesterName,
//                                                                     semesterId:subjectData.semesterId._id,
//                                                                     batchName:batches[0].batchName,
//                                                                     batchId:batches[0]._id,
//                                                                     overview:'',
//                                                                     divisionId:student[0].divisionId
//                                                                 });


//                                                             })
//                                                     }
//                                                 });
//                                             }

//                                         })
//                                     }else if(semesters.length > 1){
//                                         if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='true'){
//                                             console.log("1 if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='true')++++++"+ semesters[0].semesterStatus+' &'+semesters[1].semesterStatus);
//                                             semesters.forEach(function(semesterData){
//                                                 view_data1.push({semesterData});
//                                             });
//                                                 semesterNewModel.find({
//                                                     _id:semesters[0]._id
//                                                 }).then(function(semData){

//                                             // })
//                                                 subjectModel.find({
//                                                     courseId:batches[0].courseId,
//                                                     semesterId:semData[0]._id
//                                                 }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                     if(subject!=''){
//                                                         subject.forEach(subjectData=>{
//                                                         // var course_subject_data=[];
//                                                             var sub1 = subjectData.subject;
//                                                             var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                             var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                             var strs = sub.split('","');
//                                                             strs.forEach(function(courseSubject) {
//                                                             course_subjects.push(courseSubject);

//                                                         });
//                                                             view_data.push({
//                                                                 subjects:course_subjects ,
//                                                                 courseName:subjectData.courseId.courseName,
//                                                                 courseId:subjectData.courseId._id,
//                                                                 semesterName:subjectData.semesterId.semesterName,
//                                                                 semesterId:subjectData.semesterId._id,
//                                                                 batchName:batches[0].batchName,
//                                                                 batchId:batches[0]._id,
//                                                                 divisionId:student[0].divisionId
//                                                             });


//                                                         })
//                                                     }else if(subject==''){
//                                                         subjectModel.find({
//                                                             courseId:batches[0].courseId,
//                                                             semesterId:semesters[1]._id
//                                                         }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject1){
//                                                             if(subject1!='' ){
//                                                             subject1.forEach(subjectData=>{
//                                                                 var sub1 = subjectData.subject;
//                                                                 var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                                 var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                                 var strs = sub.split('","');
//                                                                 strs.forEach(function(courseSubject) {
//                                                                 course_subjects.push(courseSubject);

//                                                             });
//                                                                 view_data.push({
//                                                                     subjects:course_subjects ,
//                                                                     courseName:subjectData.courseId.courseName,
//                                                                     courseId:subjectData.courseId._id,
//                                                                     semesterName:subjectData.semesterId.semesterName,
//                                                                     semesterId:subjectData.semesterId._id,
//                                                                     batchName:batches[0].batchName,
//                                                                     batchId:batches[0]._id,
//                                                                     divisionId:student[0].divisionId
//                                                                     });


//                                                             })
//                                                             }

//                                                         });
//                                                         }
//                                                 })
//                                                 });
//                                          }else if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='false'){
//                                             console.log("2 if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='true')++++++"+ semesters[0].semesterStatus+' &'+semesters[1].semesterStatus);

//                                             semesterNewModel.find({
//                                                     _id:semesters[0]._id
//                                                 }).then(function(semData){
//                                                     semData.forEach(function(semesterData){
//                                                         view_data1.push({semesterData});
//                                                     });
//                                             // })
//                                                 subjectModel.find({
//                                                     courseId:batches[0].courseId,
//                                                     semesterId:semData[0]._id
//                                                 }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                     if(subject!=''){
//                                                         subject.forEach(subjectData=>{
//                                                         // var course_subject_data=[];
//                                                             var sub1 = subjectData.subject;
//                                                             var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                             var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                             var strs = sub.split('","');
//                                                             strs.forEach(function(courseSubject) {
//                                                             course_subjects.push(courseSubject);

//                                                         });
//                                                             view_data.push({
//                                                                 subjects:course_subjects ,
//                                                                 courseName:subjectData.courseId.courseName,
//                                                                 courseId:subjectData.courseId._id,
//                                                                 semesterName:subjectData.semesterId.semesterName,
//                                                                 semesterId:subjectData.semesterId._id,
//                                                                 batchName:batches[0].batchName,
//                                                                 batchId:batches[0]._id,
//                                                                 divisionId:student[0].divisionId
//                                                             });


//                                                         })
//                                                     }
//                                                 })
//                                                 });
//                                          }else if(semesters[1].semesterStatus=='true'){
//                                             console.log("3 if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='true')++++++"+ semesters[0].semesterStatus+' &'+semesters[1].semesterStatus);

//                                             semesterNewModel.find({
//                                                 _id:semesters[1]._id
//                                             }).then(function(semestersFirstSem){
//                                                 if(semestersFirstSem!=''){
//                                                     semestersFirstSem.forEach(function(semesterData){
//                                                         view_data1.push({semesterData});
//                                                     });

//                                                     subjectModel.find({
//                                                         courseId:batches[0].courseId,
//                                                         semesterId:semestersFirstSem[0]._id
//                                                     }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                         if(subject!=''){
//                                                             subject.forEach(subjectData=>{
//                                                                     var sub1 = subjectData.subject;
//                                                                     var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                                     var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                                     var strs = sub.split('","');
//                                                                     strs.forEach(function(courseSubject) {
//                                                                     course_subjects.push(courseSubject);

//                                                                 });
//                                                                     view_data.push({
//                                                                         subjects:course_subjects ,
//                                                                         courseName:subjectData.courseId.courseName,
//                                                                         courseId:subjectData.courseId._id,
//                                                                         semesterName:subjectData.semesterId.semesterName,
//                                                                         semesterId:subjectData.semesterId._id,
//                                                                         batchName:batches[0].batchName,
//                                                                         batchId:batches[0]._id,
//                                                                         overview:'',
//                                                                         divisionId:student[0].divisionId
//                                                                     });


//                                                                 })
//                                                         }
//                                                     });
//                                                 }

//                                             })
//                                          }
//                                     }


//                              noticeModel.find({
//                                 courseId:student[0].courseId._id,
//                                 batchId:student[0].batchId._id,
//                                 category:'',
//                                 createdOn: {
//                                     $gte: moment(fromDate).format("YYYY-MM-DD"),
//                                     $lte: moment(toDate).format("YYYY-MM-DD")
//                                 }
//                             }).populate('courseId','[courseName]').populate('batchId','[batchName]').exec(function(err,notice){
//                                 if(err){
//                                     res.json({
//                                         status:400,
//                                         message:'bad request'
//                                     })
//                                 }else if(notice!=''){
//                                     notice.forEach(function(noticeData){
//                                         noticeArray.push({
//                                             _id:noticeData._id,
//                                             noticeName:noticeData.noticeName,
//                                             batchName:noticeData.batchId.batchName,
//                                             courseName:noticeData.courseId.courseName,
//                                             batchId:noticeData.batchId._id,
//                                             courseId:noticeData.courseId._id,
//                                             type:noticeData.type,
//                                             textNotice : noticeData.textNotice
//                                         });


//                                     });
//                                 }
//                                 noticeModel.find({
//                                 category:'All' ,
//                                 createdOn: {
//                                     $gte: moment(fromDate).format("YYYY-MM-DD"),
//                                     $lte: moment(toDate).format("YYYY-MM-DD")
//                                 }
//                                 // $or:[
//                                 //     {
//                                 //         "courseId" : {
//                                 //             $eq : student[0].courseId._id,
//                                 //           },
//                                 //     },
//                                 //     {
//                                 //         "courseId" : {
//                                 //             $eq : 'All'
//                                 //           },
//                                 //     },],
//                                 }).then(function(notice){
//                                     if(notice!=''){
//                                         notice.forEach(function(notices){
//                                             noticeArray.push({
//                                                 _id:notices._id,
//                                                 noticeName:notices.noticeName,
//                                                 batchName:'All',
//                                                 courseName:'All',
//                                                 type:notices.type,
//                                                 textNotice : notices.textNotice
//                                             });

//                                         });
//                                     }

//                                 })

//                             });



//                                 setTimeout(function () {
//                                 res.json({
//                                     status:200,
//                                     data:view_data,
//                                     subjectData:course_subjects,
//                                     data1:view_data1,
//                                     data2:view_data2,
//                                     noticeData3:noticeArray
//                                 })
//                             },1500)
//                         }

//                             });
//                        }
//                    });
//            }
//      });
//     }else if((req.query.backSemId!='null')&&  (req.query.semesterId=='undefined' || req.query.semesterId==undefined || req.query.semesterId=='' || req.query.semesterId==null)){
//         studentBatchModel.find({
//             studentId:user_id
//         }).populate('batchId',['batchName']).populate('departmentId',['departmentName']).populate('studentId',['fullName','email'])
//         .populate('courseId',['courseName']).sort({'createdOn':-1}).then(function(student){
//             if(student!=null || student!='' || student!=undefined ){
//                 var course=student[0].courseId;
//                 var courseID=course._id;
//                 var datacourseName = course.courseName;
//                 var batch=student[0].batchId;
//                 var batchID=batch._id;
//                 var  courseName;
//                 if(datacourseName == 'B.Sc'){
//                     courseName = 'BSc'
//                 }else if(datacourseName == 'M.Sc'){
//                     courseName = 'MSc'
//                 }else if(datacourseName == 'PG Diploma'){
//                     courseName = 'Diploma'
//                 }else if(datacourseName == 'Workshop on Data Analytics and Database Management'){
//                     courseName = 'Diploma'
//                 }
//                              batchMasterModel.find({
//                               _id:batchID,
//                               courseId:courseID
//                              }).then(function(batches){
//                                 var semJSonOrCond = [];
//                               if(batches!=''){
//                                 if(batches[0].batchName=='TY'){
//                                     semJSonOrCond =  [{
//                                         semesterName:"Semester 5"
//                                     },
//                                     {
//                                         semesterName:"Semester 6"
//                                     },
//                                     {
//                                         semesterName:courseName+" Semester 5"
//                                     },
//                                     {
//                                         semesterName:courseName+" Semester 6"
//                                     },
//                                     ]
//                             }else if(batches[0].batchName=='SY'){
//                                  semJSonOrCond =[{
//                                             semesterName:"Semester 4"
//                                         },
//                                         {
//                                             semesterName:"Semester 3"
//                                         },
//                                         {
//                                             semesterName:  courseName+" Semester 4"
//                                         },
//                                         {
//                                             semesterName: courseName+" Semester 3"
//                                         }]

//                             }else if(batches[0].batchName=='FY'){
//                                 semJSonOrCond =[{
//                                     semesterName:"Semester 1"
//                                 },
//                                 {
//                                     semesterName:"Semester 2"
//                                 } ,
//                                 {
//                                     semesterName:courseName+" Semester 1"
//                                 },
//                                 {
//                                     semesterName:courseName+" Semester 2"
//                                 },]
//                             }
//                             else if(batches[0].batchName == 'Batch 1 - June 2021'){
//                                 semJSonOrCond =[{
//                                     semesterName:"Semester 1"
//                                 },
//                                 {
//                                     semesterName:"Semester 2"
//                                 } ,
//                                 {
//                                     semesterName:courseName+" Semester 1"
//                                 },
//                                 {
//                                     semesterName:courseName+" Semester 2"
//                                 },]
//                             }

//                             console.log("2 semJSonOrCond===>"+JSON.stringify(semJSonOrCond));
//                             semesterNewModel.find({
//                                 $or : semJSonOrCond
//                             }).exec(function(err,semesters){
//                                 if(err){
//                                     console.log(err);
//                                 }else if(semesters!=''){
//                                   if(semesters.length == 1 && semesters[0].semesterStatus=='true'){
//                                     semesterNewModel.find({
//                                         _id:backSemesterId
//                                     }).then(function(semestersFirstSem){
//                                         if(semestersFirstSem!=''){
//                                             semestersFirstSem.forEach(function(semesterData){
//                                                 view_data1.push({semesterData});
//                                             });

//                                             subjectModel.find({
//                                                 courseId:batches[0].courseId,
//                                                 semesterId:backSemesterId
//                                             }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                 if(subject!=''){
//                                                     subject.forEach(subjectData=>{
//                                                             var sub1 = subjectData.subject;
//                                                             var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                             var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                             var strs = sub.split('","');
//                                                             strs.forEach(function(courseSubject) {
//                                                             course_subjects.push(courseSubject);

//                                                         });
//                                                             view_data.push({
//                                                                 subjects:course_subjects ,
//                                                                 courseName:subjectData.courseId.courseName,
//                                                                 courseId:subjectData.courseId._id,
//                                                                 semesterName:subjectData.semesterId.semesterName,
//                                                                 semesterId:subjectData.semesterId._id,
//                                                                 batchName:batches[0].batchName,
//                                                                 batchId:batches[0]._id,
//                                                                 overview:'',
//                                                                 divisionId:student[0].divisionId
//                                                             });


//                                                         })
//                                                 }
//                                             });
//                                         }

//                                     })
//                                   }else if(semesters.length > 1){
//                                     if(semesters[0].semesterStatus=='true' && semesters[1].semesterStatus=='true'){
//                                         semesters.forEach(function(semesterData){
//                                             view_data1.push({semesterData});
//                                         });
//                                             semesterNewModel.find({
//                                                 _id:backSemesterId
//                                             }).then(function(semData){
//                                             subjectModel.find({
//                                                 courseId:batches[0].courseId,
//                                                 semesterId:semData[0]._id
//                                             }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                 if(subject!=''){
//                                                     subject.forEach(subjectData=>{
//                                                         var sub1 = subjectData.subject;
//                                                         var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                         var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                         var strs = sub.split('","');
//                                                         strs.forEach(function(courseSubject) {
//                                                         course_subjects.push(courseSubject);

//                                                     });
//                                                         view_data.push({
//                                                             subjects:course_subjects ,
//                                                             courseName:subjectData.courseId.courseName,
//                                                             courseId:subjectData.courseId._id,
//                                                             semesterName:subjectData.semesterId.semesterName,
//                                                             semesterId:subjectData.semesterId._id,
//                                                             batchName:batches[0].batchName,
//                                                             batchId:batches[0]._id,
//                                                             divisionId:student[0].divisionId
//                                                         });


//                                                     })
//                                                 }
//                                             })
//                                             });
//                                         }else if(semesters[0].semesterStatus=='true'){
//                                             semesterNewModel.find({
//                                                 _id:backSemesterId
//                                             }).then(function(semestersFirstSem){
//                                                 if(semestersFirstSem!=''){
//                                                     semestersFirstSem.forEach(function(semesterData){
//                                                         view_data1.push({semesterData});
//                                                     });

//                                                     subjectModel.find({
//                                                         courseId:batches[0].courseId,
//                                                         semesterId:backSemesterId
//                                                     }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                                         if(subject!=''){
//                                                             subject.forEach(subjectData=>{
//                                                                     var sub1 = subjectData.subject;
//                                                                     var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                                     var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                                     var strs = sub.split('","');
//                                                                     strs.forEach(function(courseSubject) {
//                                                                     course_subjects.push(courseSubject);

//                                                                 });
//                                                                     view_data.push({
//                                                                         subjects:course_subjects ,
//                                                                         courseName:subjectData.courseId.courseName,
//                                                                         courseId:subjectData.courseId._id,
//                                                                         semesterName:subjectData.semesterId.semesterName,
//                                                                         semesterId:subjectData.semesterId._id,
//                                                                         batchName:batches[0].batchName,
//                                                                         batchId:batches[0]._id,
//                                                                         overview:'',
//                                                                         divisionId:student[0].divisionId
//                                                                     });


//                                                                 })
//                                                         }
//                                                     });
//                                                 }

//                                             })
//                                         }
//                                   }


//                                 noticeModel.find({
//                                     courseId:student[0].courseId._id,
//                                     batchId:student[0].batchId._id,
//                                     category:'',
//                                     createdOn: {
//                                         $gte: moment(fromDate).format("YYYY-MM-DD"),
//                                         $lte: moment(toDate).format("YYYY-MM-DD")
//                                     }
//                                 }).populate('courseId','[courseName]').populate('batchId','[batchName]').exec(function(err,notice){
//                                     if(err){
//                                         res.json({
//                                             status:400,
//                                             message:'bad request'
//                                         })
//                                     }else if(notice!=''){
//                                         notice.forEach(function(noticeData){
//                                             noticeArray.push({
//                                                 _id:noticeData._id,
//                                                 noticeName:noticeData.noticeName,
//                                                 batchName:noticeData.batchId.batchName,
//                                                 courseName:noticeData.courseId.courseName,
//                                                 batchId:noticeData.batchId._id,
//                                                 courseId:noticeData.courseId._id,
//                                                 type:noticeData.type,
//                                                 textNotice : noticeData.textNotice
//                                             });


//                                         });
//                                     }
//                                     noticeModel.find({
//                                     category:'All',
//                                     createdOn: {
//                                         $gte: moment(fromDate).format("YYYY-MM-DD"),
//                                         $lte: moment(toDate).format("YYYY-MM-DD")
//                                     }
//                                     // $or:[
//                                     //  {
//                                     //      "courseId" : {
//                                     //          $eq : student[0].courseId._id,
//                                     //        },
//                                     //  },
//                                     //  {
//                                     //      "courseId" : {
//                                     //          $eq : 'All'
//                                     //        },
//                                     //  },],
//                                     }).then(function(notice){
//                                         if(notice!=''){
//                                             notice.forEach(function(notices){
//                                                 noticeArray.push({
//                                                     _id:notices._id,
//                                                     noticeName:notices.noticeName,
//                                                     batchName:'All',
//                                                     courseName:'All',
//                                                     courseId:student[0].courseId._id,
//                                                     batchId:student[0].batchId._id,
//                                                     type:notices.type,
//                                                     textNotice : notices.textNotice
//                                                 });

//                                             });
//                                         }

//                                     })

//                                 });

//                                 setTimeout(function () {

//                                     res.json({
//                                         status:200,
//                                         data:view_data,
//                                         subjectData:course_subjects,
//                                         data1:view_data1,
//                                         data2:view_data2,
//                                         noticeData3:noticeArray
//                                     })
//                                 },1500)
//                         }

//                             });
//                     }
//                     });

//             }

//         });

//     }else if(req.query.user_id!=undefined && req.query.semesterId!=undefined){
//         //console.log("one sem present===>"+req.query.semesterId)
//         studentBatchModel.find({
//             studentId:user_id
//         }).populate('batchId',['batchName']).populate('departmentId',['departmentName']).populate('studentId',['fullName','email'])
//         .populate('courseId',['courseName']).sort({'createdOn':-1}).then(function(student){
//             if(student!=null || student!='' || student!=undefined ){
//                 var course=student[0].courseId;
//                 var courseID=course._id;
//                 var datacourseName = course.courseName;
//                 var batch=student[0].batchId;
//                 var batchID=batch._id;
//                 var  courseName;
//                 if(datacourseName == 'B.Sc'){
//                     courseName = 'BSc'
//                 }else if(datacourseName == 'M.Sc'){
//                     courseName = 'MSc'
//                 }else if(datacourseName == 'PG Diploma'){
//                     courseName = 'Diploma'
//                 }else if(datacourseName == 'Workshop on Data Analytics and Database Management'){
//                     courseName = 'Diploma'
//                 }
//                     batchMasterModel.find({
//                     _id:batchID,
//                     courseId:courseID
//                     }).then(function(batches){

//                         var semJSonOrCond = [];
//                         if(batches!=''){
//                             if(batches[0].batchName=='TY'){
//                                 semJSonOrCond =  [{
//                                     semesterName:"Semester 5"
//                                 },
//                                 {
//                                     semesterName:"Semester 6"
//                                 },
//                                 {
//                                     semesterName:courseName+"Semester 5"
//                                 },
//                                 {
//                                     semesterName:courseName+"Semester 6"
//                                 },
//                                 ]
//                         }else if(batches[0].batchName=='SY'){
//                              semJSonOrCond =[{
//                                         semesterName:"Semester 4"
//                                     },
//                                     {
//                                         semesterName:"Semester 3"
//                                     },
//                                     {
//                                         semesterName:  courseName+" Semester 4"
//                                     },
//                                     {
//                                         semesterName: courseName+" Semester 3"
//                                     }]

//                         }else if(batches[0].batchName=='FY'){
//                             semJSonOrCond =[{
//                                 semesterName:"Semester 1"
//                             },
//                             {
//                                 semesterName:"Semester 2"
//                             } ,
//                             {
//                                 semesterName:courseName+" Semester 1"
//                             },
//                             {
//                                 semesterName:courseName+" Semester 2"
//                             },]
//                         }else if(batches[0].batchName == 'Batch 1 - June 2021'){
//                             semJSonOrCond =[{
//                                 semesterName:"Semester 1"
//                             },
//                             {
//                                 semesterName:"Semester 2"
//                             } ,
//                             {
//                                 semesterName:courseName+" Semester 1"
//                             },
//                             {
//                                 semesterName:courseName+" Semester 2"
//                             },]
//                         }

//                             semesterNewModel.find({
//                                 $or:semJSonOrCond
//                             }).exec(function(err,semesters){
//                                 if(err){
//                                     console.log(err);
//                                 }else if(semesters!=''){
//                                 semesters.forEach(function(semesterData){
//                                     view_data1.push({semesterData});
//                                 });
//                                     semesterNewModel.find({
//                                         _id:req.query.semesterId
//                                     }).then(function(semData){

//                                 // })
//                                     subjectModel.find({
//                                         courseId:batches[0].courseId,
//                                         semesterId:semData[0]._id
//                                     }).populate('courseId',['courseName']).populate('semesterId',['semesterName']).then(function(subject){
//                                         if(subject!=''){
//                                             subject.forEach(subjectData=>{
//                                             // var course_subject_data=[];
//                                                 var sub1 = subjectData.subject;
//                                                 var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                                                 var sub = sub2.replace(/^"(.*)"$/, '$1');
//                                                 var strs = sub.split('","');
//                                                 strs.forEach(function(courseSubject) {
//                                                 course_subjects.push(courseSubject);

//                                             });
//                                                 view_data.push({
//                                                     subjects:course_subjects ,
//                                                     courseName:subjectData.courseId.courseName,
//                                                     courseId:subjectData.courseId._id,
//                                                     semesterName:subjectData.semesterId.semesterName,
//                                                     semesterId:subjectData.semesterId._id,
//                                                     batchName:batches[0].batchName,
//                                                     batchId:batches[0]._id,
//                                                     divisionId:student[0].divisionId
//                                                 });


//                                             })
//                                         }
//                                     })
//                                     });


//                                 // blogsModel.find({
//                                 //     courseId:student[0].courseId._id,
//                                 //     batchId:student[0].batchId._id,
//                                 //     category:'Updates'
//                                 // }).populate('courseId','[courseName]').populate('batchId','[batchName]').exec(function(err,blog){
//                                 //     if(err){
//                                 //         res.json({
//                                 //             status:400,
//                                 //             message:'bad request'
//                                 //         })
//                                 //     }else if(blog!=''){
//                                 //         blog.forEach(function(blogData){
//                                 //             view_data2.push({
//                                 //                 _id:blogData._id,
//                                 //                 title:blogData.title,
//                                 //                 date:blogData.date,
//                                 //                 courseName:blogData.courseId.courseName,
//                                 //                 batchName:blogData.batchId.batchName,
//                                 //                 description:blogData.description,
//                                 //                 category:blogData.category
//                                 //             });


//                                 //         });
//                                 //     }

//                                 // });


//                                 setTimeout(function () {

//                                     res.json({
//                                         status:200,
//                                         data:view_data,
//                                         subjectData:course_subjects,
//                                         data1:view_data1,
//                                         data2:view_data2
//                                     })
//                                 },1500)
//                             }

//                             });
//                         }
//                     });

//             }

//         });
//     }
//     }
// });

router.get("/batchWiseUsers", function (req, res) {
    studentBatchModel.find({
        divisionId: req.query.divisionId,
        courseId: req.query.course_id,
        batchId: req.query.batch_id
    }).populate('studentId', ['fullName', 'email']).exec(function (err, enrolldetail) {
        if (err) {
            console.error(err);
            res.json({
                status: 400,
            })
        }
        if (enrolldetail) {
            res.json({
                status: 200,
                data: enrolldetail
            })
        }
    })
})

router.post("/updateEnrollStatus", function (req, res) {
    updateEnrollStatus(req)
    enrollmentDetailModel.findByIdAndUpdate(req.body._id,
        { status: req.body.updated_status },
        function (err, enrollment) {
            if (err) {
                res.json({
                    status: 400
                })
            }
            if (enrollment) {
                res.json({
                    status: 200
                })
            }
        });

})
async function updateEnrollStatus(req){
    enrollmentDetailModel.find({
        _id :req.body._id
    }).then(async enroll=>{
        var user = await getId.getUserId(enroll[0].user_id,'') 
        var course = await getId.getCourseId(enroll[0].course_id,'')
        var batch = await getId.getBatchId(enroll[0].batch_id,'') 
        models.enrollmentdetails.find({
            where:{
                userId : user.id,
                batchId : batch.id,
                courseId : course.id
            }
        }).then(enrollmentdetails=>{
            if(enrollmentdetails){
                enrollmentdetails.update({
                    status: req.body.updated_status
                }).then(updateEnroll=> {
                    console.log("updateEnroll")
                })
            }
          
        })
    })
}
// router.get("/listOfTeachers", function (req, res) {

//     userModel.find({
//         "role": 'teacher'
//     }).then(function (users) {

//         setTimeout(function () {

//             res.send({
//                 status: 200,
//                 data: users
//             })
//         }, 3000)

//     })

// });

// router.post("/newBatch", function (req, res) {
//     var studentIDs = req.body.studentArray
//     var newBatchArray = [];


//     courseModel.find({
//         _id: req.body.course_id
//     }).then(function (course) {
//         if (course) {
//             // var courseName= course[0].courseName
//             var lastbatch_id
//             batchModel.find().then((data) => {
//                 if (data.length == 0) {

//                     lastbatch_id = 1;

//                     var batch_id = course[0].degreeName + "-" + course[0].courseName + "-" + course[0].subjects + "-" + (lastbatch_id)


//                     var batchData = new batchModel({
//                         batch_id: batch_id,
//                         teacher_id: req.body.teacher_id,
//                         course_id: req.body.course_id,
//                         // batchTimeStart : req.body.start_time,
//                         // batchTimeEnd :req.body.end_time,
//                         batchfromdate: req.body.start_date,
//                         batchtodate: req.body.end_date,
//                         createdOn: Date.now(),
//                         updatedOn: Date.now()
//                     })
//                     batchData.save(function (err, result) {

//                         if (err) {
//                             res.json({
//                                 status: 501,
//                             });
//                         } else if (result != null || result != undefined) {
//                             var count = 0
//                             if (studentIDs.length == 0) {
//                                 newBatchArray.push({
//                                     batchId: result._id,
//                                     DefauleBatchname: result.batch_id,
//                                     NumOfStudent: 0
//                                 })
//                                 res.json({
//                                     status: 200,
//                                     message: 'Sucess, batch name is ' + result.batch_id,
//                                     data: newBatchArray
//                                 })
//                             } else if (studentIDs.length > 0) {
//                                 promise1 = new Promise((resolve, reject) => {
//                                     setTimeout(() => {
//                                         studentIDs.forEach((student_id) => {
//                                             userModel.find({
//                                                 _id: student_id
//                                             }).then(function (student) {
//                                                 if (student) {
//                                                     var enrollmentDetailEvent = new enrollmentDetailModel({
//                                                         user_id: student_id,
//                                                         course_id: req.body.course_id,
//                                                         user_email: student[0].email,
//                                                         user_name: student[0].fullName,
//                                                         status: 'active',
//                                                         batch_id: result._id,
//                                                         subbatchId: result.batch_id,
//                                                         course_start_date: result.batchfromdate,
//                                                         course_end_date: result.batchtodate,
//                                                         course_name: course[0].courseName,
//                                                         course_spec: course[0].subjects,
//                                                         createdOn: Date.now(),
//                                                         updatedOn: Date.now(),
//                                                     })
//                                                     enrollmentDetailEvent.save(function (err, enrolledStudent) {
//                                                         if (err) {
//                                                             res.json({
//                                                                 status: 400,
//                                                                 message: 'Unable to save data!!!!!!!!!'
//                                                             });
//                                                             resolve(err);
//                                                         } else if (enrolledStudent) {
//                                                             count++
//                                                             resolve(count);
//                                                         }
//                                                     });
//                                                 }
//                                             })


//                                         })
//                                     }, 2000)

//                                 })
//                                 Promise.all([promise1]).then(count1 => {
//                                     setTimeout(() => {
//                                         if (count == studentIDs.length) {
//                                             newBatchArray.push({
//                                                 batchId: result._id,
//                                                 DefauleBatchname: result.batch_id,
//                                                 NumOfStudent: count
//                                             })
//                                             res.json({
//                                                 status: 200,
//                                                 message: 'batch successfully created....!!!! batch name is ' + result.batch_id,
//                                                 data: newBatchArray
//                                             })

//                                         } else {
//                                             res.json({
//                                                 status: 400,
//                                             })
//                                         }
//                                     }, 2000);
//                                 })
//                             }


//                         }

//                     });
//                     // })
//                 } else {
//                     batchModel.find({ 'course_id': req.body.course_id }, function (err, post) {


//                         if (post.length == 0) {
//                             lastbatch_id = 1
//                         } else if (post.length > 0) {
//                             var lastbatch_id_name = post[post.length - 1].batch_id
//                             var pieces = lastbatch_id_name.split(/[\s-]+/);
//                             lastbatch_id = Number(pieces[pieces.length - 1]) + 1
//                         }

//                         var batch_id = course[0].degreeName + "-" + course[0].courseName + "-" + course[0].subjects + "-" + (lastbatch_id)


//                         var batchData = new batchModel({
//                             batch_id: batch_id,
//                             teacher_id: req.body.teacher_id,
//                             course_id: req.body.course_id,
//                             // batchTimeStart : req.body.start_time,
//                             // batchTimeEnd :req.body.end_time,
//                             batchfromdate: req.body.start_date,
//                             batchtodate: req.body.end_date,
//                             createdOn: Date.now(),
//                             updatedOn: Date.now()
//                         })
//                         batchData.save(function (err, result) {
//                             if (err) {
//                                 res.json({
//                                     status: 501,
//                                 });
//                             } else if (result != null || result != undefined) {
//                                 var count = 0
//                                 if (studentIDs.length == 0) {
//                                     newBatchArray.push({
//                                         batchId: result._id,
//                                         DefauleBatchname: result.batch_id,
//                                         NumOfStudent: 0
//                                     })
//                                     res.json({
//                                         status: 200,
//                                         message: 'Sucess, batch name is ' + result.batch_id,
//                                         data: newBatchArray
//                                     })
//                                 } else if (studentIDs.length > 0) {
//                                     promise1 = new Promise((resolve, reject) => {
//                                         setTimeout(() => {
//                                             studentIDs.forEach((student_id) => {
//                                                 userModel.find({
//                                                     _id: student_id
//                                                 }).then(function (student) {
//                                                     if (student) {
//                                                         var action = "Student Added To Batch";
//                                                         var notification_data = "Admin added you in batch name " + batch_id;
//                                                         //notification_function.notification(action,notification_data,student_id,'','');
//                                                         var enrollmentDetailEvent = new enrollmentDetailModel({

//                                                             user_id: student_id,
//                                                             course_id: req.body.course_id,
//                                                             user_email: student[0].email,
//                                                             user_name: student[0].fullName,
//                                                             status: 'active',
//                                                             batch_id: result._id,
//                                                             subbatchId: result.batch_id,
//                                                             course_start_date: result.batchfromdate,
//                                                             course_end_date: result.batchtodate,
//                                                             course_name: course[0].courseName,
//                                                             course_spec: course[0].subjects,
//                                                             createdOn: Date.now(),
//                                                             updatedOn: Date.now(),
//                                                         })
//                                                         enrollmentDetailEvent.save(function (err, enrolledStudent) {
//                                                             if (err) {
//                                                                 res.json({
//                                                                     status: 400,
//                                                                     message: 'Unable to save data!!!!!!!!!'
//                                                                 });
//                                                                 resolve(err);
//                                                             } else if (enrolledStudent) {
//                                                                 count++
//                                                                 resolve(count);
//                                                             }
//                                                         });
//                                                     }
//                                                 })


//                                             })
//                                         }, 2000)

//                                     })
//                                     Promise.all([promise1]).then(count1 => {
//                                         setTimeout(() => {
//                                             if (count == studentIDs.length) {
//                                                 newBatchArray.push({
//                                                     batchId: result._id,
//                                                     DefauleBatchname: result.batch_id,
//                                                     NumOfStudent: count
//                                                 })
//                                                 res.json({
//                                                     status: 200,
//                                                     message: 'batch successfully created....!!!! batch name is ' + result.batch_id,
//                                                     data: newBatchArray
//                                                 })

//                                             } else {
//                                                 res.json({
//                                                     status: 400,
//                                                 })
//                                             }
//                                         }, 2000);
//                                     })
//                                 }


//                             }

//                         });
//                     })
//                 }
//             })

//         }
//     });
//     // });

// });
/**
 * it gives batch under one course */
router.get("/listofbatches", function (req, res) {
    batchModel.find({
        course_id: req.query.course_id
    }).populate('teacher_id').exec((err, batch) => {
        if (batch) {
            res.send({
                status: 200,
                data: batch
            })
        } else {
            res.send({
                status: 404,
            })
        }
    })
});


/**
 * this route gives student list under course
 */
router.get("/subBatchStudent", function (req, res) {
    var course_id = req.query.course_id
    var viewData = [];
    enrollmentDetailModel.find(
        {
            course_id: course_id,
        }
    ).populate('user_id', 'fullName').exec(function (err, students) {

        if (err) {
            res.json({
                status: 400,
            })
        }
        if (students) {
            students.forEach((student) => {
                viewData.push(student)
            })
            res.json({
                status: 200,
                data: viewData
            })
        }
    });
})

router.delete("/deleteBatchStudent/:enrollement_id", function (req, res) {
    var query = { _id: req.params.enrollement_id };

    enrollmentDetailModel.findOneAndRemove(query, function (err, student) {
        if (err) {
            return res.json({
                status: 400,
                message: 'Bad Request'
            });
        }
        res.json({
            status: 200,
            message: 'Entry deleted....!!!'
        });
    });
});

/** 
 * getEnrolledDetailsByTeacher route - priyanka bandagale 
 * this route is used for techer dashboard to know teacher that which batches under him
*/
router.get("/getEnrolledDetailsByTeacher", function (req, res) {
    var view_data = [];
    var batch_duration;
    var newCourse_id;
    let semesters = [];
    dataCount = 0
    teacherModel.find({
        teacher_id: req.query.teacher_id
    }).populate('course_id', ['courseName']).populate('divisionId', ['name']).populate('batch_id', ['batchName', 'batchStatus', 'year']).populate('semesterId', ['semesterName', 'semesterStatus']).sort({ "createdOn": -1 }).exec(function (err, batches) {
        // batches.sort(function (x, y) {
        //     //console.log("x---- "+JSON.stringify(x))
        //     return x.batch_id.year + y.batch_id.year;
        // });
        if (batches) {
            batches.forEach(function (batch) {
                // newCourseModel.find({
                //     teacher_id : req.query.teacher_id,
                //     subjects : batch.subject   
                // }).then(function(newCourse){
                // console.log("newCourse=====",JSON.stringify(newCourse))
                // newCourse.forEach(course=>{
                //     newCourse_id = course._id;
                // })

                //if(batch['semesterId']['semesterStatus'] == 'true'){
                // dataCount++
                // var toDate = new Date(batch.batchfromdate);
                // var fromDate = new Date(batch.batchtodate);
                // var duration = dateService.duration(fromDate,toDate);
                // batch_duration = dateService.getDurationInString(duration);
                // batchDuration = batch_duration.replace(/-/g, ' ');

                // if(batch.batch_id.batchStatus == 'true'){
                semesters.push({
                    semesterId: batch.semesterId._id,
                    semesterName: batch.semesterId.semesterName,
                    courseName: batch.course_id.courseName
                })
                if (batch.semesterId.semesterStatus == 'true') {
                    view_data.push({
                        // newCourse_id : newCourse_id,
                        course_name: batch.course_id.courseName,
                        course_spec: batch.subject,
                        // batch_duration : batchDuration,
                        batch_id: batch.batch_id,
                        course_id: batch.course_id._id,
                        batchID: batch.batch_id._id,
                        batchName: batch.batch_id.batchName,
                        divisionName: batch.divisionId.name,
                        divisionId: batch.divisionId._id,
                        semesterId: batch.semesterId._id,
                        year: batch.batch_id.year
                    });
                }
                if (semesters.length == batches.length) {
                    res.json({
                        status: 200,
                        data: view_data,
                        data1: semesters
                    });
                }
                //}
                // else if(batch.batch_id.batchStatus == 'false'){
                //     res.json({
                //         status : 200,
                //         message : 'No active batch...'
                //     });
                // }

                // }else{
                //     dataCount++
                //     if(dataCount == batches.length){
                //         res.json({
                //             status : 200,
                //             data : view_data
                //         });
                //     }
                // }
                // });
            })
        } else if (err) {
            res.json({
                status: 400,
            });
        }

    });
});


router.get("/getEnrolledDetailsByTeacherWithSem", function (req, res) {
    var view_data = [];
    dataCount = 0
    teacherModel.find({
        teacher_id: req.query.teacher_id,
        semesterId: req.query.semId
    }).populate('course_id', ['courseName']).populate('divisionId', ['name']).populate('batch_id', ['batchName', 'batchStatus', 'year']).populate('semesterId', ['semesterName', 'semesterStatus']).sort({ "createdOn": -1 }).exec(function (err, batches) {
        if (batches) {
            batches.forEach(function (batch) {
                view_data.push({
                    // newCourse_id : newCourse_id,
                    course_name: batch.course_id.courseName,
                    course_spec: batch.subject,
                    // batch_duration : batchDuration,
                    batch_id: batch.batch_id,
                    course_id: batch.course_id._id,
                    batchID: batch.batch_id._id,
                    batchName: batch.batch_id.batchName,
                    divisionName: batch.divisionId.name,
                    divisionId: batch.divisionId._id,
                    semesterId: batch.semesterId._id,
                    year: batch.batch_id.year
                });
                if (view_data.length == batches.length) {
                    res.json({
                        status: 200,
                        data: view_data,
                    });
                }
            })
        } else if (err) {
            res.json({
                status: 400,
            });
        }
    });
});

router.get("/getUserInfo", function (req, res) {
    var chattitle
    var date = new Date();
    var currentYear = date.getFullYear()
    var n = currentYear.toString();

    var divisionName
    studentBatchModel.find({
        studentId: req.query.userId
    }).exec(function (err, userInfo) {
        if (userInfo) {
            userInfo.forEach(infoo => {
                batchMasterModel.find({
                    _id: infoo['batchId'],
                    year: new RegExp(n + '.*', 'i')

                }).exec(function (err, batchInfo) {
                    //console.log("batchInfo== "+JSON.stringify(batchInfo))
                    if (batchInfo.length > 0) {
                        var batchYear = batchInfo[0]['year']
                        var batchYr = batchYear.split('-')

                        var b = batchYr[0].split(' ')

                        if (n == b[0]) {
                            //console.log("batchInfo== "+JSON.stringify(batchInfo[0]))



                            setTimeout(() => {
                                res.json({
                                    status: 200,
                                    //data : userInfo,
                                    batchId: batchInfo[0]['_id'],
                                    divisionId: infoo['divisionId'],

                                })
                            }, 3000)

                        }
                    } 

                })
            })
        }


        // if(userInfo){
        //     var batch_ID = userInfo[0];
        //     batchMasterModel.find({
        //         _id  : batch_ID.batchId
        //         }).then(function(batches){
        //             var name = batches[0]['batchName'];
        //             var year = batches[0]['year'];
        //             chattitle  =  year;
        //             res.json({
        //                 status : 200,
        //                 data : userInfo,
        //                 chattitle : chattitle
        //             })
        //         })




        //     // userInfo.forEach(element => {
        //     //     studentBatchModel.find({
        //     //         batchId : element.batchId
        //     //     }).exec(function(err,batchInfo){
        //     //         batchInfo.forEach(element => {
        //     //             userModel.find({
        //     //                 _id : element.batchId
        //     //             }).exec(function(err,userDetails){

        //     //             })
        //     //         })




        //     //     })
        //     // })

        // }

    })
})

router.get("/getAdminUserInfo", function (req, res) {

    let student_name = [];
    let teacher_name = [];
    var a = req.query.currentRoom;
    var batchId = a.split('-')

    var divId = batchId[1]
    batchId = batchId[0]

    studentBatchModel.find({
        batchId: batchId,
        divisionId: divId
    }).populate('studentId', ['fullName', 'email']).exec(function (err, user) {

        if (user) {

            user.forEach(element => {
                student_name.push({
                    fullName: element['studentId']['fullName'],
                    userId: element['studentId']['_id']
                });
            });
        }

        teacherModel.find({
            batch_id: batchId,
            divisionId: divId
        }).populate('teacher_id', ['fullName', 'email']).exec(function (err, teacher) {
            // console.log("teacher%%%%%%%%%%% "+JSON.stringify(teacher.length))
            if (teacher) {
                teacher.forEach(element => {
                    teacher_name.push({
                        fullName: element['teacher_id']['fullName'],
                        userId: element['teacher_id']['_id']
                    });
                });
            }
            let userlist = [];
            userlist = teacher_name.concat(student_name);
            if (userlist) {

                res.json({
                    status: 200,
                    data: userlist
                })
            }
        })
    })

})

router.get("/getcourseUserList", function (req, res) {
    // console.log("work")
    let student_name = [];
    let teacher_name = [];
    let admin_name = [];
    var batch_ID;
    var chattitle
    var date = new Date();
    var currentYear = date.getFullYear()
    // var currentStrin = currentYear.toString()
    var n = currentYear.toString();
    var divisionName
    // console.log("currentYear== "+currentYear.toString())
    //var likeYear = "'"+year+".*"
    // var yearReg = year;            ///< Allows a number between 2014 and 2029  '(201[4-9]|202[0-9])'
    // var monthReg = '(0[1-9]|1[0-2])';               ///< Allows a number between 00 and 12
    // var dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';   ///< Allows a number between 00 and 31
    // var hourReg = '([0-1][0-9]|2[0-3])';            ///< Allows a number between 00 and 24
    // var minReg = '([0-5][0-9])'; 
    //console.log("batch_id=="+req.query.user_id)

    // enrollmentDetailModel.find({
    //         batch_id : req.query.batch_id
    //     }).populate('user_id',['fullName','email']).exec(function(err,user){
    studentBatchModel.find({
        studentId: req.query.user_id
    }).exec(function (err, userInfo) {
        // console.log("userInfo= "+JSON.stringify(userInfo))
        batch_ID = userInfo[0];
        userInfo.forEach(infoo => {
            var abc = infoo['createdOn'].toString();
            //console.log("getCreatedOn- "+JSON.stringify(abc))
            var year = abc.split(' ');
            //year = year[0]
            //  console.log("infp- "+typeof year[3])
            //  console.log("infp- "+typeof n)
            batchMasterModel.find({
                _id: infoo['batchId'],
                year: new RegExp(n + '.*', 'i')

            }).exec(function (err, batchInfo) {
                //console.log("batchInfo== "+JSON.stringify(batchInfo))
                var batchYear;
                var batchYr;

                var b;
                if (batchInfo.length > 0) {
                    batchYear = batchInfo[0]['year']
                    batchYr = batchYear.split('-')
                    var b1;

                    b = batchYr[0].split(' ')
                    b1 =batchYr[1].split(' ')



                    if (n == b[0] || n !== b[0]) {
                        newDivisionModel.find({
                            '_id': mongoose.Types.ObjectId(infoo['divisionId'])
                        }).then(function (divisionInfo) {
                            divisionName = divisionInfo[0]['name']
                            // console.log("divisionInfo== "+JSON.stringify(divisionInfo))
                        })
                        batchMasterModel.find({
                            _id: batchInfo[0]['_id']
                        }).then(function (batches) {
                            var divId = infoo['divisionId']
                            batchMasterModel.find({ _id: batchInfo[0]['_id'] }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({ "createdOn": 1 }).exec(function (err, batchData) {

                                batchData.forEach(function (batches) {

                                    chattitle = batches['courseId']['courseName'] + ' - ' + batches['batchName'] + '(' + batches['year'] + ') - ' + divisionName
                                    //console.log("chattitle == "+chattitle)
                                })
                            })

                            var name = batches[0]['batchName'];
                            var year = batches[0]['year'];
                            //chattitle  =  year;

                            //  console.log("chattitle====>>> "+JSON.stringify(chattitle))
                        })
                        //console.log("if@@@@@@@@@"+JSON.stringify(batchInfo))
                        studentBatchModel.find({
                            batchId: batchInfo[0]['_id'],
                            studentId: req.query.user_id
                        }).exec(function (err, studentInfoo) {

                            if (studentInfoo) {
                                studentBatchModel.find({
                                    batchId: studentInfoo[0]['batchId'],
                                    divisionId: studentInfoo[0]['divisionId']
                                }).populate('studentId', ['fullName', 'email']).exec(function (err, user) {
                                    if (user) {

                                        user.forEach(element => {
                                            student_name.push({
                                                fullName: element['studentId']['fullName'],
                                                userId: element['studentId']['_id']
                                            });
                                        });
                                    }

                                    teacherModel.find({
                                        batch_id: studentInfoo[0]['batchId'],
                                        divisionId: studentInfoo[0]['divisionId']
                                    }).populate('teacher_id', ['fullName', 'email']).exec(function (err, teacher) {
                                        // console.log("teacher####==="+JSON.stringify(teacher))
                                        //console.log("teacher####=ll=="+JSON.stringify(teacher.length))
                                        if (teacher) {
                                            teacher.forEach(element => {
                                                teacher_name.push({
                                                    fullName: element['teacher_id']['fullName'],
                                                    userId: element['teacher_id']['_id']
                                                });
                                            });
                                        }

                                        userModel.find({
                                            role: "admin"
                                        }).exec(function (err, admin) {
                                            if (admin) {
                                                admin.forEach(element => {
                                                    admin_name.push({
                                                        fullName: element['fullName'],
                                                        userId: element['_id']
                                                    });
                                                });
                                            }

                                            let userlist = [];
                                            userlist = teacher_name.concat(student_name);
                                            let userlistFinal = [];
                                            userlistFinal = admin_name.concat(userlist);
                                            if (userlistFinal) {

                                                res.json({
                                                    status: 200,
                                                    data: userlist,
                                                    chattitle: chattitle,
                                                })
                                            }
                                        })
                                    })

                                })
                            }
                        })

                    } else {
                        console.log("else" + n == batchYr[0])
                    }
                }
            })
            //  if(n == year[3]){
            //      console.log("current")
            //  }else{
            //      console.log("last year")
            //  }
            // batchMasterModel.aggregate(
            //     [{
            //         $match: { 
            //             _id  : infoo.batchId,
            //             createdOn:
            //             new RegExp(likeYear, 'i')


            //         },

            //     }]).exec(function (err, data) {
            //         console.log("err=="+err)
            //         console.log("date ###$$$$$$== "+JSON.stringify(data))
            //     })



            // batchMasterModel.find({
            //     _id  : batch_ID.batchId,
            //     createdOn :{
            //         $regex: '"'+ yearReg + '-' + monthReg + '-' + dayReg + '.*'  
            //     }
            //     // new RegExp(likeYear+'.*', 'i')


            //     //createdOn :  new RegExp('"' + yearReg + '-' + monthReg + '-' + dayReg + ' ' + hourReg + ':' + minReg + '"' )
            //         //'2019-07-.*'

            //     }).then(function(batches){
            //         console.log("batches#########$$$$$$$== "+JSON.stringify(batches))
            //     })
        })
        // batchMasterModel.find({
        //     _id  : batch_ID.batchId
        //     }).then(function(batches){
        //         var name = batches[0]['batchName'];
        //         var year = batches[0]['year'];
        //         chattitle  =  year;

        //      console.log("chattitle====>>> "+JSON.stringify(chattitle))
        //     })
        //userInfo.forEach(element => {
        // studentBatchModel.find({
        //     batchId : batch_ID.batchId
        // }).populate('studentId',['fullName','email']).exec(function(err,user){
        //    // console.log("user===>> "+JSON.stringify(user))
        //     if(user){

        //         user.forEach(element => {
        //             student_name.push({
        //                 fullName : element['studentId']['fullName'],
        //                 userId : element['studentId']['_id']
        //             });      
        //         });
        //     }

        //         // batchModel.find({
        //         //     _id : req.query.batch_id
        //         // }).populate('teacher_id',['fullName','email']).exec(function(err,teacher){
        //         teacherModel.find({
        //             batch_id : batch_ID.batchId
        //         }).populate('teacher_id',['fullName','email']).exec(function(err,teacher){
        //             if(teacher){
        //                 teacher.forEach(element => {
        //                     teacher_name.push({
        //                         fullName : element['teacher_id']['fullName'],
        //                         userId : element['teacher_id']['_id']
        //                     }) ; 
        //                 });
        //             }
        //             userModel.find({
        //                 role : "admin"
        //             }).exec(function(err,admin){
        //                 if(admin){
        //                     admin.forEach(element => {
        //                         //admin_name.push(element['fullName']);
        //                         admin_name.push({
        //                             fullName : element['fullName'],
        //                             userId : element['_id']
        //                         });
        //                 });
        //                 }




        //         })
        //     })
        // })
        //})


    })

})


// router.get("/getcourseUserList",function(req,res){
//     let student_name = [];
//     let teacher_name = [];
//     let admin_name = [];
//     var batch_ID;
//     var chattitle
//     //console.log("batch_id=="+req.query.user_id)

//     // enrollmentDetailModel.find({
//     //         batch_id : req.query.batch_id
//     //     }).populate('user_id',['fullName','email']).exec(function(err,user){
//         studentBatchModel.find({
//             studentId : req.query.user_id
//         }).exec(function(err,userInfo){
//              batch_ID = userInfo[0];
//             batchMasterModel.find({
//                 _id  : batch_ID.batchId
//                 }).then(function(batches){
//                     var name = batches[0]['batchName'];
//                     var year = batches[0]['year'];
//                     chattitle  =  year;

//                  console.log("chattitle====>>> "+JSON.stringify(chattitle))
//                 })
//             //userInfo.forEach(element => {
//                 studentBatchModel.find({
//                     batchId : batch_ID.batchId
//                 }).populate('studentId',['fullName','email']).exec(function(err,user){
//                    // console.log("user===>> "+JSON.stringify(user))
//                     if(user){

//                             user.forEach(element => {
//                                 student_name.push({
//                                     fullName : element['studentId']['fullName'],
//                                     userId : element['studentId']['_id']
//                                 });      
//                             });
//                         }

//                         // batchModel.find({
//                         //     _id : req.query.batch_id
//                         // }).populate('teacher_id',['fullName','email']).exec(function(err,teacher){
//                         teacherModel.find({
//                             batch_id : batch_ID.batchId
//                         }).populate('teacher_id',['fullName','email']).exec(function(err,teacher){
//                             if(teacher){
//                                 teacher.forEach(element => {
//                                     teacher_name.push({
//                                         fullName : element['teacher_id']['fullName'],
//                                         userId : element['teacher_id']['_id']
//                                     }) ; 
//                                 });
//                             }
//                             userModel.find({
//                                 role : "admin"
//                             }).exec(function(err,admin){
//                                 if(admin){
//                                     admin.forEach(element => {
//                                         //admin_name.push(element['fullName']);
//                                         admin_name.push({
//                                             fullName : element['fullName'],
//                                             userId : element['_id']
//                                         });
//                                 });
//                                 }



//                             let userlist = [];
//                             userlist =  teacher_name.concat(student_name);
//                             let userlistFinal = [];
//                             userlistFinal =  admin_name.concat(userlist);
//                             if(userlistFinal){

//                                 res.json({
//                                     status : 200,
//                                     data : userlistFinal,
//                                     chattitle: chattitle
//                                 })
//                             }
//                         })
//                     })
//                 })
//             //})


//         })

// })


router.get("/getChatRoom", function (req, res) {
    roomModel.find({

    }).exec(function (err, roomInfo) {
        // console.log("roomInfo--"+roomInfo)
        res.json({
            data: roomInfo
        })
    })

})


router.get("/getTeacherChatRoom", function (req, res) {
    // console.log("getTeacherChatRoom== "+req.query.teacherId)
    var roomInfo = [];
    var count = 0
    var teacherId = req.query.teacherId;
    var divisionName;
    var chattitle;

    teacherModel.find({
        teacher_id: teacherId
    }).exec(function (err, batchInfo) {
        //console.log("batchInfo---- "+JSON.stringify(batchInfo))
        batchInfo.forEach(element => {
            var roomName = element['batch_id'] + '-' + element['divisionId']
            newDivisionModel.find({
                '_id': mongoose.Types.ObjectId(element['divisionId'])
            }).then(function (divisionInfo) {
                divisionName = divisionInfo[0]['name']
                // console.log("divisionInfo== "+JSON.stringify(divisionInfo))
            })

            batchMasterModel.find({ _id: element['batch_id'] }).populate('courseId', ['courseName']).populate('departmentId', ['departmentName']).sort({ "createdOn": 1 }).exec(function (err, batchData) {

                batchData.forEach(function (batches) {

                    chattitle = batches['courseId']['courseName'] + ' - ' + batches['batchName'] + '(' + batches['year'] + ') - ' + divisionName
                    //console.log("chattitle == "+chattitle)
                })

                roomInfo.push({
                    chatTitle: chattitle,
                    batchId: element['batch_id'],
                    divisionId: element['divisionId']
                })
                count++
                if (batchInfo.length == count) {
                    //console.log("batchInfo.length == count"+batchInfo.length+"----" + count)
                    //console.log("roomInfo----"+JSON.stringify(roomInfo)) 
                    res.json({
                        status: 200,
                        data: roomInfo
                    })
                }
            })


            //})
        })

    })
})



router.delete("/deleteBatch/:batch_obj_id", function (req, res) {

    var query = { _id: req.params.batch_obj_id };
    batchModel.findOneAndRemove(query, function (err, result) {
        if (err) {
            return res.json({
                status: 400,
                message: 'Bad Request'
            });
        } else if (result) {
            enrollmentDetailModel.remove({ batch_id: req.params.batch_obj_id }, function (err, removeEnrollment) {
                if (err)
                    throw err;

                if (removeEnrollment) {
                    announcement_batchModel.remove({ batch_id: req.params.batch_obj_id }, function (err, removeAnnouncementBatch) {
                        if (err)
                            throw err;

                        if (removeAnnouncementBatch) {

                        }
                        res.json({
                            status: 200,
                            message: 'Entry deleted....!!!'
                        });

                    })


                }
            });

        }
    });
})


router.get('/joinUsersAndEnrollment/:batchId', (req, res) => {
    var view_data = [];
    enrollmentDetailModel.find({ batch_id: req.params.batchId }).populate('user_id', ['firstName', 'lastName']).exec(function (err, batches) {
        if (err) {
            throw new Error('error occurred');
        } else {
            if (batches != '') {
                batches.forEach(function (batch) {
                    view_data.push(
                        batch);
                });
                res.json({
                    status: 200,
                    data: view_data
                });
            } else {
                res.json({
                    status: 400,
                    message: 'No students found!!!'
                });
            }
        }


    })

})

// Get all batches to view attendance by admin (SP)
router.get("/getAllBatches", function (req, res) {
    var view_data = [];
    var batch_duration;
    teacherModel.find({

    }).populate('semesterId', ['semesterName']).populate('divisionId', ['name']).populate('course_id', ['courseName']).populate('batch_id', ['batchName']).exec(function (err, batches) {
        if (batches) {
            batches.forEach(function (batch) {
                var toDate = new Date(batch.batchfromdate);
                var fromDate = new Date(batch.batchtodate);
                var duration = dateService.duration(fromDate, toDate);
                batch_duration = dateService.getDurationInString(duration);
                batchDuration = batch_duration.replace(/-/g, ' ');
                view_data.push({
                    semesterName: batch.semesterId.semesterName,
                    // course_name : batch.course_id.courseName,
                    course_spec: batch.subject,
                    batch_duration: batchDuration,
                    batch_id: batch.batch_id,
                    course_id: batch.course_id._id,
                    batchID: batch.batch_id._id,
                    batchName: batch.batch_id.batchName,
                    divisionName: batch.divisionId.name,
                    divisionId: batch.divisionId._id
                });
                if (view_data.length == batches.length) {
                    res.json({
                        status: 200,
                        data: view_data
                    });
                }
            });
        } else if (err) {
            res.json({
                status: 400,
            });
        }

    });
});
router.get("/getFilterBatches", function (req, res) {
    var view_data = [];
    var batch_duration;
    teacherModel.find({
        semesterId: req.query.semester
    }).populate('semesterId', ['semesterName']).populate('divisionId', ['divisionName']).populate('course_id', ['courseName']).populate('batch_id', ['batchName']).exec(function (err, batches) {
        if (batches) {
            batches.forEach(function (batch) {
                var toDate = new Date(batch.batchfromdate);
                var fromDate = new Date(batch.batchtodate);
                var duration = dateService.duration(fromDate, toDate);
                batch_duration = dateService.getDurationInString(duration);
                batchDuration = batch_duration.replace(/-/g, ' ');
                view_data.push({
                    semesterName: batch.semesterId.semesterName,
                    course_name: batch.course_id.courseName,
                    course_spec: batch.subject,
                    batch_duration: batchDuration,
                    batch_id: batch.batch_id,
                    course_id: batch.course_id._id,
                    batchID: batch.batch_id._id,
                    batchName: batch.batch_id.batchName,
                    divisionName: batch.divisionId.divisionName,
                    divisionId: batch.divisionId._id
                });
                if (view_data.length == batches.length) {
                    res.json({
                        status: 200,
                        data: view_data
                    });
                }
            });
        } else if (err) {
            res.json({
                status: 400,
            });
        }

    });
});

router.get('/semesterWiseData', (req, res) => {
    const query = {
        studentId: req.query.studentId,
        courseId: req.query.courseId
    }

    const queryParams = {
        Calendar: {
            title: "Calendar",
            link: "calendar",
            icon: "calendar-outline",
            home: true
        },
        Dashboard: {
            title: "Dashboard",
            link: "dashboard",
            icon: "person-done-outline"
        }


    }

    let newArray = [];

    newCourseModel.aggregate([
        {
            $match: {
                courseId: query.courseId
            }

        },
        {
            $group: {
                _id: "$semesterId",
                subjects: {
                    $push: {
                        title: "$subjects",
                        courseId: "$courseId",
                        semesterId: "$semesterId",

                    }
                }
            }

        },
        {
            $lookup: {
                from: 'studentdivisions',
                let: {
                    userId: query.studentId,
                    courseId: query.courseId,
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$studentId", "$$userId"],
                            },
                            {
                                $eq: ["$courseId", "$$courseId"],
                            }
                            ]
                        }
                    }
                }],
                as: 'result'
            }
        },
        {
            $addFields: {
                semestersId: {
                    $toObjectId: "$_id"
                }
            }
        },

        {
            $lookup: {
                from: 'semesters',
                localField: 'semestersId',
                foreignField: '_id',
                as: 'resultTwo'

            }
        },

        {
            $project: {
                links: {
                    $map: {

                        input: "$subjects",
                        as: "subLinks",
                        in: {
                            title: "$$subLinks.title",
                            link: "/pages/semester",
                            queryParams: {
                                user_id: req.query.studentId,
                                courseId: req.query.courseId,
                                subject: "$$subLinks.title",
                                role: 'student'
                            }

                        }
                    }
                },
                "resultTwo.semesterName": 1,
            },


        }


    ]).exec((err, semester) => {
        if (err) {
            console.error(err)
        } else {
            semester.forEach(data => {
                data.resultTwo.forEach(items => {
                    newArray.push({
                        title: Object.values(items).join(),
                        icon: 'file-text-outline',
                        children: data.links
                    })
                })

            })
        }
        newArray.push(queryParams.Calendar, queryParams.Dashboard);
        res.send(newArray);
    })
})



router.post("/registration", function (req, res) {
    registration(req)
    webinarUserModel.create({
        name: req.body.name,
        mobile: req.body.mobileNo,
        emailId: req.body.emailId,
        webinarId: req.body.id,
        engagement: req.body.engagement,
        profession: req.body.profession,
        academic: req.body.academic,
        qualification: req.body.qualification,
        question: req.body.question
    }, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            webinarsModel.find({
                _id: req.body.id,
            }).then(function (webinar) {

                emailService.webinarReply(data.emailId, data.mobile, webinar[0].webinarTopic, webinar[0].speaker, webinar[0].date, webinar[0].time, webinar[0].link, webinar[0].description);
            })
            res.json({
                data: data,
                status: 200
            })
        }
    })

});
async function registration(req){
    webinarsModel.find({
        _id: req.body.id,
    }).then(webinar=>{
        models.webinars.find({
            where:{
                webinarTopic:webinar[0].webinarTopic,
                description:webinar[0].description,
                link:webinar[0].link,
                speaker:webinar[0].speaker,
                date:webinar[0].date,
                time:webinar[0].time
            }
        }).then(webinars=>{
            if(webinars){
                models.webinarusers.create({
                    name: req.body.name,
                    mobile: req.body.mobileNo,
                    emailId: req.body.emailId,
                    webinarId: webinars.id,
                    engagement: req.body.engagement,
                    profession: req.body.profession,
                    academic: req.body.academic,
                    qualification: req.body.qualification,
                    question: req.body.question
                }).then(User=>{
                    console.log("User",User)
                    models.webinars.find({
                        id:webinars.id
                    }).then(data=>{
                    // emailService.webinarReply(User.emailId, User.mobile, data.webinarTopic, data.speaker, data.date, data.time, data.link, data.description);

                    })
                })
            }
            
        })
    })
}

router.get("/getWebinarUsers", function (req, res) {

    webinarUserModel.aggregate([
        {
            $addFields: {
                id: {
                    $toObjectId: "$webinarId"
                }
            }
        },
        {
            "$lookup": {
                "from": "webinars",
                "localField": "id",
                "foreignField": "_id",
                "as": "data"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        $arrayElemAt: ["$data", 0]
                    }, "$$ROOT"]
                }
            }
        },
        {
            $project: {
                data: 0
            }
        }
    ]).sort({ "createdOn": -1 }).then(function (users) {

        res.send({
            status: 200,
            data: users
        })

    })

});

router.get("/getWebinarfiltered", function (req, res) {
    // console.log("webinarTopic,date===>"+req.query.webinarTopicId);
    webinarUserModel.aggregate([
        {
            $match: {
                webinarId: req.query.webinarTopicId
            }
        },
        {
            $addFields: {
                id: {
                    $toObjectId: "$webinarId"
                }
            }
        },
        {
            "$lookup": {
                "from": "webinars",
                "localField": "id",
                "foreignField": "_id",
                "as": "data"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        $arrayElemAt: ["$data", 0]
                    }, "$$ROOT"]
                }
            }
        },
        {
            $project: {
                data: 0
            }
        }
    ]).sort({ "createdOn": -1 }).then(function (users) {

        res.send({
            status: 200,
            data: users
        })

    })

});

router.get('/webinarUserExport', function (req, res) {
    var view_data = [];
    var search = req.query.search
    // console.log("search==>"+req.query.search);
    if (req.query.search != 'all') {
        webinarUserModel.find({
            webinarId: search
        }).sort({ "createdOn": -1 }).then(function (users) {
            if (users != '') {
                users.forEach(function (element) {

                    view_data.push({
                        Name: element.name ? element.name : '-',
                        Email: element.emailId ? element.emailId : '-',
                        ContactNo: element.mobile ? element.mobile : '-',
                        Stream: element.stream ? element.stream : '-',
                        Qualification: element.qualification ? element.qualification : '-',
                        Question: element.question ? element.question : '-'

                    })

                });


                setTimeout(() => {
                    var xls = json2xls(view_data);
                    var currentPath = process.cwd();
                    fs.writeFileSync(currentPath + "/src/public/webinarUser.xlsx", xls, 'binary');
                    //  console.log("current path "+currentPath)
                    var filepath = currentPath + "/src/public/webinarUser.xlsx";
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
    } else {
        webinarUserModel.find({

        }).sort({ "createdOn": -1 }).then(function (users) {
            if (users != '') {
                users.forEach(function (element) {

                    view_data.push({
                        Name: element.name ? element.name : '-',
                        Email: element.emailId ? element.emailId : '-',
                        ContactNo: element.mobile ? element.mobile : '-',
                        Stream: element.stream ? element.stream : '-',
                        Qualification: element.qualification ? element.qualification : '-',
                        Question: element.question ? element.question : '-'

                    })

                });


                setTimeout(() => {
                    var xls = json2xls(view_data);
                    var currentPath = process.cwd();
                    fs.writeFileSync(currentPath + "/src/public/webinarUser.xlsx", xls, 'binary');
                    //  console.log("current path "+currentPath)
                    var filepath = currentPath + "/src/public/webinarUser.xlsx";
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
    }

});



router.get("/getWebinars", function (req, res) {


    webinarsModel.aggregate([{
        $addFields: {
            id: {
                $toString: "$_id"
            }
        }
    },

    {
        "$lookup": {
            "from": "webinaruploads",
            "localField": "id",
            "foreignField": "webinarId",
            "as": "uploads"
        }
    },
    ]).sort({ "createdOn": -1 }).then(function (webinars) {

        res.send({
            status: 200,
            data: webinars
        })

    })

});

router.post("/saveWebinar", function (req, res) {
    saveWebinar(req.body)
    if (req.body.id) {
        var query = {
            _id: req.body.id
        },
            update = {
                $set: {
                    webinarTopic: req.body.name,
                    link: req.body.link,
                    date: req.body.date,
                    time: req.body.time,
                    speaker: req.body.speaker,
                    description: req.body.description,
                }
            };
        webinarsModel.findOneAndUpdate(query, update, function (err, webinar) {
            if (webinar) {
                res.send({
                    data: webinar,
                    status: 200,
                })
            } else {
                res.send({
                    status: 400,
                })
            }
        })
    } else {
        webinarsModel.create({

            webinarTopic: req.body.name,
            link: req.body.link,
            date: req.body.date,
            time: req.body.time,
            speaker: req.body.speaker,
            description: req.body.description,

        }, (err, data) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    data: data,
                    status: 200
                })
            }
        })
    }
});
function saveWebinar(body){
    if(body.id){
        webinarsModel.find({
            _id: body.id
        }).then(web=>{
            models.webinars.find({
                where:{
                    webinarTopic :web.webinarTopic,
                    speaker : web.speaker,
                    link : web.link
                }
            }).then(webinar=>{
                if(webinar){
                    webinar.update({
                        webinarTopic : body.name,
                        link : body.link,
                        speaker : body.speaker,
                        description:body.description,
                        date : body.date,
                        time : body.time
                     }).then(updateWebinar=>{
                         console.log("updateWebinar",updateWebinar)
                     })
                }
              
            })
        })
    }else{
        models.webinars.create({
                   webinarTopic : body.name,
                   link : body.link,
                   speaker : body.speaker,
                   description:body.description,
                   date : body.date,
                   time : body.time 
        }).then(webinar=>{
        })
    }
}

router.delete("/deleteWebinar/:id", function (req, res) {
    webinarUserModel.find({
        webinarId: req.params.id
    }).then(function (webinarusers) {
        if (webinarusers.length > 0) {
            res.json({
                status: 300,
                message: 'data exist'
            });
        } else {
            var query = { _id: req.params.id };

            webinarsModel.findOneAndRemove(query, function (err, webinar) {
                if (err) {
                    return res.json({
                        status: 400,
                        message: 'Bad Request'
                    });
                }
                res.json({
                    status: 200,
                    message: 'Entry deleted....!!!'
                });
            });
        }
    })


});



router.delete("/deleteWebinarForcefully/:id", function (req, res) {

    var query = { _id: req.params.id };

    webinarsModel.findOneAndRemove(query, function (err, webinar) {
        if (err) {
            return res.json({
                status: 400,
                message: 'Bad Request'
            });
        }

        webinarUserModel.deleteMany({
            webinarId: req.params.id
        }, function (err, deleteWebinar) {
            if (err) {
                res.json({
                    status: 400
                })
            }
            res.json({
                status: 200,
                message: 'Entry deleted....!!!'
            });
        })

    });

});

router.post("/teacherthirdForm", function (req, res) {
    teacherthirdForm(req)
    var query = {
        userId: req.body.id
    },
        // var bankDetails= 
        //     {
        //         bankName : req.body.bankName,
        //         accountNumber : req.body.accountNumber,
        //         IFSC : req.body.IFSC,
        //         acType : req.body.acType, 
        //     },


        update = {
            $set: {
                panId: req.body.panId,
                aadhar: req.body.aadhar,
                // bankDetails : bankDetails
            }
        };
    userModel.findOneAndUpdate(query, update, function (err, details) {
        if (details) {
            // console.log("done-------->>>",details)

            res.send({
                data: details,
                status: 200,
            })
        } else {
            res.send({
                status: 400,
            })
        }
    })
});
async function  teacherthirdForm(req){
    var user = await getId.getUserId(req.body.id,'')
    models.users.find({
        where:{
            id:user.id
        }
    }).then(Users=>{
        if(Users){
            Users.update({
                panId: req.body.panId,
                aadhar: req.body.aadhar,
            }).then(updatedUser=>{
                console.log("updatedUser")
            })
        }
      
    })
}

router.post("/teacherSecondForm", function (req, res) {
    teacherSecondForm(req)
    teacherEducationalDetailsModel.find({
        userId: req.body.id
    }).then(function (users) {
        if (users.length > 0) {
            var query = {
                userId: req.body.id
            },
                update = {
                    $set: {
                        qualification: req.body.qualification,
                        graduation: req.body.graduation,
                        masters: req.body.masters,
                        otherDegree: req.body.otherDegree,
                        phd: req.body.phd,
                    }
                };
            teacherEducationalDetailsModel.findOneAndUpdate(query, update, function (err, details) {
                // console.log("data-1-->>",details);

                if (details) {
                    res.send({
                        data: details,
                        status: 200,
                    })
                } else {
                    res.send({
                        status: 400,
                    })
                }
            })
        } else {
            teacherEducationalDetailsModel.create({

                qualification: req.body.qualification,
                graduation: req.body.graduation,
                masters: req.body.masters,
                otherDegree: req.body.otherDegree,
                phd: req.body.phd,
                userId: req.body.id

            }, (err, data) => {
                // console.log("data--->>",data);
                if (err) {
                    console.error(err)
                } else {
                    res.json({
                        data: data,
                        status: 200
                    })
                }
            })
        }
    })
});
async function teacherSecondForm(req){
    var user = await getId.getUserId(req.body.id,'')
    models.teachereducationaldetails.find({
        where:{
          userId : user.id  
        }
    }).then(details =>{
        if(details.length > 0){
            details.update({
                qualification: req.body.qualification,
                graduation: req.body.graduation,
                masters: req.body.masters,
                otherDegree: req.body.otherDegree,
                phd: req.body.phd,
            }).then(update=>{
                console.log("update")
            })
        }else{
            models.teachereducationaldetails.create({
                qualification: req.body.qualification,
                graduation: req.body.graduation,
                masters: req.body.masters,
                otherDegree: req.body.otherDegree,
                phd: req.body.phd,
                userId: user.id
            }).then(teachereducationaldetails=>{
                console.log("teachereducationaldetails")
            })
        }
    })
}
router.get("/getTeacherSecondForm", function (req, res) {
    // console.log("Body--->>",req.query)
    teacherEducationalDetailsModel.find({
        userId: req.query.user_id
    }).then(function (users) {
        // console.log("usrs--->>>",users)

        res.send({
            status: 200,
            data: users
        })

    })

});


router.get("/getAllAttachments", function (req, res) {
    // console.log("Body--->>",req.query)
    teacherUploadDetailsModel.find({
        userId: req.query.user_id
    }).then(function (docs) {

        res.send({
            status: 200,
            data: docs
        })

    })

});

router.get('/deleteFile/:id', function (req, res) {
    // console.log("params---",req.params)
    var query = {
        _id: req.params.id
    }

    teacherUploadDetailsModel.deleteOne(query, (err, uploadedFiles) => {
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

// get cohort subject to allocated teachers
router.get("/getCohortAttendance", function (req, res) {
    var view_data = [];
    var batch_duration;
    cohortTeacherModel.find({

    }).populate('semesterId', ['semesterName']).populate('cohortId', ['cohortName']).populate('course_id', ['courseName']).exec(function (err, batches) {
        if (batches) {
            batches.forEach(function (batch) {
                view_data.push({
                    semesterName: batch.semesterId.semesterName,
                    _id: batch._id,
                    cohortName: batch.cohortId.cohortName,
                    course_spec: batch.subject,
                    cohort_id: batch.cohortId._id,  // divisionId it's cohortId
                });
            });
            if (view_data.length == batches.length) {
                res.json({
                    status: 200,
                    data: view_data
                });
            }
        } else if (err) {
            res.json({
                status: 400,
            });
        }

    });
});

// using batchesId in cohort get students data (Megha Patil----date:19-11-2021)
router.get("/cohortBatchWiseUsers", function (req, res) {
    var enrolldetail = [];
    var view_data = [];
    cohortModel.find({
        _id: req.query.cohort_id,
    }).exec(function (err, cohort) {
        // console.log("req.query.cohort_id----"+JSON.stringify(req.query.cohort_id))
        if (cohort != '') {
            cohort.forEach(function (cohorts) {
                if (cohorts != '') {
                    var batches = cohorts.batchesArr;
                    for (var i = 0; i < batches.length; i++) {
                        // console.log("batches---"+JSON.stringify(batches))
                        // console.log("batches[i]---"+JSON.stringify(batches[i]))
                        var courseid = batches[i].split(" ")[1];
                        var batchid = batches[i].split(" ")[0];
                        // console.log("batchid----"+batchid);
                        // console.log("courseid----"+courseid);
                        studentBatchModel.find({
                            batchId: batchid,
                            // courseId: courseid,    
                        }).populate('studentId', ['fullName', 'email']).exec(function (err, enrolldetail) {
                            if (enrolldetail != "") {
                                // console.log("enrolldetail----"+JSON.stringify(enrolldetail)) 
                                enrolldetail.forEach(function (data) {
                                    view_data.push({
                                        _id: data._id,
                                        batchId: data.batchId,
                                        departmentId: data.departmentId,
                                        courseId: data.courseId,
                                        studentId: data.studentId,
                                        batch_start_date: data.batch_start_date,
                                        batch_end_date: data.batch_end_date
                                    });
                                })
                            }
                        })
                    }
                }
            })
            setTimeout(function () {
                // console.log("viewdata-----",view_data)
                res.send({
                    status: 200,
                    data: view_data,
                });
            }, 1000);
        } else {
            setTimeout(function () {
                res.send({
                    status: 400,
                });
            }, 1000);
        }
    })
});


// get cohort subject using cohortId and semesterId
router.get("/getFilterCohortAttendance", function (req, res) {
    var view_data = [];
    // console.log("req.query----",req.query)
    cohortTeacherModel.find({
        cohortId: req.query.cohort_id,
        semesterId: req.query.semester
    }).populate('semesterId', ['semesterName']).populate('cohortId', ['cohortName']).exec(function (err, batches) {
        if (batches) {
            batches.forEach(function (batch) {
                view_data.push({
                    semesterName: batch.semesterId.semesterName,
                    _id: batch._id,
                    cohortName: batch.cohortId.cohortName,
                    course_spec: batch.subject,
                    cohort_id: batch.cohortId._id,
                    // fromTime : batch.fromTime,
                    // toTime : batch.toTime,
                });
            });
            if (view_data.length == batches.length) {
                res.json({
                    status: 200,
                    data: view_data
                });
            }
        } else if (err) {
            res.json({
                status: 400,
            });
        }

    });
});

// router.get("/getstudentSemester",function(req,res){
//     var view_data = []
//     studentBatchModel.find({
//         studentId :req.query.user_id
//     }).then(function(data){
//      data.forEach(info=>{
//         batchSemesterMasterModel.find({
//             batchId:info.batchId 
//         }).then(function(data1){
//             data1.forEach(infoo=>{
//                 semesterNewModel.find({
//                     _id:infoo.semesterId
//                 }).then(function(data2){
//                     data2.forEach(sem=>{
//                         view_data.push({
//                             semesterId :sem._id,
//                             semesterName :sem.semesterName ,
//                             courseId: sem.courseId
//                         })
//                     })
                    
                   
//                 })
//             })
           
//         })
//      })
        
//     }) 
//     setTimeout(function(){
//         res.json({
//             status:200,
//             data:view_data
//         })
//     },2000) 
// })


// router.get("/getstudentSuject",function(req,res){
//     var view_data = []
//     var student_subjects =[]
//     subjectModel.find({
//         semesterId :req.query.semesterId
//     }).then(function(subject){
//             subject.forEach(subjectData=>{
//                 var sub1 = subjectData.subject;
//                 var sub2 = sub1.replace(/^\[([^]*)]$/,'$1');
//                 var sub = sub2.replace(/^"(.*)"$/, '$1');
//                 var strs = sub.split('","');
//                 strs.forEach(function(Subject) {
//                 student_subjects.push(Subject);
//                 });
//                 view_data.push({
//                     subject:student_subjects,
//                     semesterId :subjectData.semesterId,
//                     courseId :subjectData.courseId,
//                     subjectId :subjectData._id
//                 })
//     })
//     if(view_data){
//         res.json({
//             status : 200,
//             data : view_data,
//         });   
// }else if(err){
//     res.json({
//         status : 400,
//     });
// }
// })
 
// })

module.exports = router;
