const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var moment =require('moment');
require('../../../app/models/uploadedAssignments');
const {
    ObjectID
} = require('mongodb');
var EnrollmentDetailsSchema = require('../../../app/models/enrollmentdetails');
const uploadedAssignment = mongoose.model('UploadedAssignments');
var enrollmentdetailsModel = mongoose.model('EnrollmentDetail');
const Grid = require('gridfs-stream');
const logger = require('../../../utils/logger');
const fileType = require('file-type');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs;
require('../../../app/models/assignments');
const Assignments = mongoose.model('Assignments');
var userSchema = require('../../../app/models/user');
var userModel = mongoose.model('User');
const notification = require('../../../utils/function')
var notification_function = require('../../../utils/function');
const config = require('config');
const { filelink } = config.get('api');
require('../../../app/models/uploadedProject');
const uploadedProject = mongoose.model('UploadedProject');
require('../../../app/models/projectSubmission');
var projectSubmissionModel = mongoose.model('ProjectSubmission');
var StudentBatchSchema = require('../../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
const caseStudy = require('../../../app/models/caseStudyAccess');
const caseStudyAccessModel = mongoose.model('CaseStudyAccess');
//Sql
const path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../../models');
const getSqlId = require('./../../../utils/getSqlId');
var getId = new getSqlId();
var multer = require('multer')

router.post('/uploadedAssignment', async(req, res) => {
    gfs = Grid(connect.db);
    let {
        file
    } = req.files;
    if (file == null || file == undefined || file == '') {
        res.json({
            status: 404,
            message: 'File not found'
        })
    } else {
        flag = "true";
        let writeStream = gfs.createWriteStream({
            filename: `${file.name}`,
            mode: 'w',
            content_type: file.mimetype
        });
        writeStream.on('close', function (uploadedFile) {

            uploadedAssignment.create({
                    doc_id: uploadedFile._id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType,
                    courseId: req.body.courseId,
                    userId: req.body.id,
                    BatchId: req.body.batchID,
                    firstName: req.body.firstName,
                    LastName: req.body.lastName,
                    Email: req.body.email,
                    assignmentName: req.body.assignmentName,
                    Point: req.body.Point,
                    uploaded: flag,
                    Submitted: req.body.assignmentFlag,
                    groupid: req.body.assignmentId,
                    subject:req.body.subjects,
                    uploadTypeOfAssignment:req.body.typeOfAssignment
                   
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
    if (file) {
        Assignments.find({
            _id: req.body.assignment
        }).then(async assign => {
            var course = await getId.getCourseId(assign[0].courseId, '')
            var batch = await getId.getBatchId(assign[0].BatchId, '')
            var user = await getId.getUserId(assign[0].teacherId, '')
            models.assignments.find({
                where: {
                    assignmentName: assign[0].assignmentName,
                    courseId: course.id,
                    batchId: batch.id,
                    teacherId: user.id
                }
            }).then(assignment => {
                var currentPath = process.cwd();
                var dir = currentPath + '/src/public/uploadedAssignment/' + assignment.id;
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
                    fs.writeFile(dir + file.name, file.data, async function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                        var userId = await getId.getUserId(req.body.id, '')

                        models.uploadedassignments.create({
                            assignmentId: assignment.id,
                            userId: userId.id,
                            length: file.size,
                            fileName: file.name,
                            type: file.mimetype,
                            assignmentName: req.body.assignmentName,
                            uploaded: true,
                            viewStatus: false,
                            submitted: true,
                        }).then(Data => {
                            console.log("Data", Data)
                        })
                    });
                })
            })
        })
    }
})


router.get('/getStudentsWithAssignment', (req, res) => {
    var query = {
        userId: req.query.userId,
        groupId:req.query.groupId
    };
    var data = [];
    uploadedAssignment.find({$and:[{userId:query.userId},{groupid:req.query.groupId}]}, (err, students) => {
        if (err) {
            console.error(err)
        } else {
            for (var i = 0; i < students.length; i++) {
                data.push({
                    file_link: `${filelink}/api/uploadedAssignment/download?document_id=${students[i].doc_id}`,
                    type: students[i].type,
                    Point: students[i].Point,
                    fileName:students[i].name,
                    uploadTypeOfAssignment:students[i].uploadTypeOfAssignment,
                    assignmentName:students[i].assignmentName,
                    userId:students[i].userId,
                    groupId:students[i].groupid,
                    fullName:students[i].firstName+ ' '+students[i].LastName,
                    createdAt: students[i].createdOn
                });
            }

            res.json({
                status: 200,
                datum: data,

            })
        }
    })
})


router.post('/updateAssignmentsMarks', (req, res) => {
    updateAssignmentsMarks(req)
    var count = 0;
    uploadedAssignment.findOneAndUpdate(
        {   
             $and:[{userId:req.body.userId},{groupid:req.body.groupId}]
         }
        , {
            $set: {
                marksObtained: req.body.marks,
                feedback : req.body.feedback
            }
        },
        (err, Marks) => {
            if (err) {
                console.error(err);
            } else {
                if(Marks){
                    var query = {
                        groupid : req.body.groupId
                    }
                    uploadedAssignment.find(query,(err,students)=>{
                        if(err){
                            console.error(err);
                        }else{
                            students.forEach(function(student){
                                if(student.marksObtained != null){
                                    count++;
                                    if(count == students.length){
                                        var action = "Marks Updated.";
                                        var notification_data = " All marks updated for assignment "+Marks.assignmentName+" , subject "+Marks.subject;
                                        notification_function.notification(action, notification_data, '5ff2f26313e8ff112bf670fc');
                                        notification_function.notification(action, notification_data, '6006d6e64a3d296fec9c8744');
                                    }
                                }
                            })
                        }
                    })
                    res.json({
                      status: 200
                  })
                }
            }
        })
})
async function updateAssignmentsMarks(req) {
    var userId = await getId.getUserId(req.body.userId, '')
    Assignments.find({
        _id: req.body.assignmentId
    }).then(async assign => {
        var course = await getId.getCourseId(assign[0].courseId, '')
        var batch = await getId.getBatchId(assign[0].BatchId, '')
        var user = await getId.getUserId(assign[0].teacherId, '')
        models.assignments.find({
            where: {
                assignmentName: assign[0].assignmentName,
                courseId: course.id,
                batchId: batch.id,
                teacherId: user.id
            }
        }).then(assignment => {
            if (assignment) {
                models.uploadedassignments.find({
                    where: {
                        userId: userId.id,
                        assignmentId: assignment.id
                    }
                }).then(data => {
                    if(data){
                        data.update({
                            feedback: req.body.feedback,
                            marksObtained: req.body.marks
                        }).then(updated => {
                            console.log("updated", updated)
                        })
                    }
                    
                })
            }
        })
    })
}

router.get('/getAssigmentMarks', (req, res) => {
    uploadedAssignment.find({
            marksObtained: {
                $ne: null
            }
        },
        (err, Marks) => {
            if (err) {
                console.error(err);
            } else {
                res.json({
                    status: 200,
                    data: Marks
                })
            }

        })
})

router.get('/setAssignmentFlag', (req, res) => {
    var viewData = [];
    var query = {
        userId:req.query.userId,
        batchId:req.query.batchId
    }
    uploadedAssignment.find({
         $and:[{userId:query.userId},{BatchId:query.batchId}]
        },
        (err, Marks) => {
            if (err) {
                console.error(err);
            } else {
                res.json({
                    status: 200,
                    data: Marks
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
                'Content-Type': file.contentType,
                'Content-disposition': 'attachment; filename=' + file.filename ,
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



router.post('/viewedOrNot', async (req, res) => {
    viewedOrNot(req)
    var query = {
        userId: req.body.userId,
        groupId:req.body.groupid
    }
    var sentFlag = req.body.flag;
    var updateFlag = await uploadedAssignment.findOneAndUpdate({
       
        $and:[{userId:query.userId},{ groupid:req.body.groupid}]
       
    }, {
        $set: {
            viewStatus: sentFlag
        }
    }, (err, viewStatus) => {
        if (err) {
            console.error(err)
        } else {
            res.json({
                status: 200,
                message: 'Flag updated successfully!!!'
            })
        }


    })

})
async function viewedOrNot(req) {
    var userId = await getId.getUserId(req.body.userId, '')
    Assignments.find({
        _id: req.body.assignmentId
    }).then(async assign => {
        if (assign.length > 0) {
            var course = await getId.getCourseId(assign[0].courseId, '')
            var batch = await getId.getBatchId(assign[0].BatchId, '')
            var user = await getId.getUserId(assign[0].teacherId, '')
            models.assignments.find({
                where: {
                    assignmentName: assign[0].assignmentName,
                    courseId: course.id,
                    batchId: batch.id,
                    teacherId: user.id
                }
            }).then(assignment => {

                if (assignment) {
                    models.uploadedassignments.find({
                        where: {
                            userId: userId.id,
                            assignmentId: assignment.id
                        }
                    }).then(data => {
                        if(data){
                            data.update({
                                viewStatus: req.body.flag
                            }).then(updated => {
                                console.log("updated", updated)
                            })
                        }
                       
                    })
                }
            })
        }

    })
    caseStudyAccessModel.find({
        _id: req.body.assignmentId
    }).then(async elm => {
        var course = await getId.getCourseId(elm[0].courseId, '')
        var batch = await getId.getBatchId(elm[0].BatchId, '')
        var user = await getId.getUserId(elm[0].teacherId, '')
        models.casestudyaccesses.find({
            where: {
                assignmentName: elm[0].assignmentName,
                courseId: course.id,
                batchId: batch.id,
                teacherId: user.id
            }

        }).then(casestudyaccesses => {
            if (casestudyaccesses) {
                models.uploadedassignments.find({
                    where: {
                        userId: userId.id,
                        assignmentId: casestudyaccesses.id
                    }
                }).then(data => {
                    if(data){
                        data.update({
                            viewStatus: req.body.flag
                        }).then(updated => {
                            console.log("updated", updated)
                        })
                    }
                    
                })
            }
        })
    })
}

router.get('/getStudentMarks', async (req, res) => {
    var marks = [];
    var query = {
        userId: req.query.userId,
        batchId: req.query.batchId,
        assignmentId:req.query.assignmentId

    };
   uploadedAssignment.find({$and:[{userId:query.userId},{BatchId:query.batchId},{assignmentId:query.assignmentId}]},(err,marksOfStudent)=>{
       if(err){
           console.error(err);
       }
       else{
           marksOfStudent.forEach(element=>{
               if(element.length == 0 ){
                marks.push({
                  message :'Student has not uploaded assignment!'                  
                })
               }
               else{
                   if(element.marksObtained===null){
                    marks.push({
                        assignmentName:element.assignmentName,
                        assignmentMarks:'--',
                        Point:element.Point,
                        file:element.name
                     })
                   }
                   else{
                    marks.push({
                        assignmentName:element.assignmentName,
                        assignmentMarks:element.marksObtained,
                        Point:element.Point,
                        file:element.name,
                        Submitted:element.Submitted
                     })
                   }
              


               }
           })
           
           if(marks.length >0){
            res.json({
            status:200,
            data:marks
           })
        }
           else{
               res.json({
               status:404,
               data:marks
               })
           }
          
       }
   })

})


router.get("/getBatchStudent", function (req, res) {
    var query = {
        BatchId: req.query.batch_id
    };

    var viewData = [];
    Assignments.find(query,{groupId:1,_id:0}).distinct('groupId',(err,groupId)=> {
         if(err){
             console.error(err);
         }
         else{
            groupId.forEach(item=>{
                Assignments.find({groupId:item},{fullName:1},(err,students)=>{
                    viewData.push(students);
                })
            })
         
         }

         setTimeout(()=>{
            res.json({
                data:viewData
            })
         },3000)
         
    })
    

})


router.get('/assignmentsOfStudents',(req,res)=>{
    var groups=[];
    var counter = 0;
    var query = {
        groupId :req.query.groupId
    }
    Assignments.find(query,(err,students)=>{
        if(err){
            console.error(err);
        }

        else{
            students.forEach(item=>{
                var uploaded_id,marks,viewStatus,submitted,flag;
                uploadedAssignment.find(
                 { groupid:item.groupId,
                    userId : item.userId
                },
                (err,arrayStudents)=>{
                    counter++;
                    var date;
                    let dateFormate;
                    let timeFormate;
                    if(arrayStudents.length){
                        
                    const date2 = new Date(moment(item.DueDate).format('YYYY-MM-DD'));
                    const date1 = new Date(moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD'));
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                   
                    if(new Date(moment(item.DueDate).format('YYYY-MM-DD')) > new Date(moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD'))){
                        submitted = "Submitted";
                    }else{
                        submitted = "Late Submitted";
                    }
                        marks = arrayStudents[0].marksObtained,
                        viewStatus=arrayStudents[0].viewStatus,
                        date=arrayStudents[0].createdOn
                        dateFormate = moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD')
                        timeFormate = moment(arrayStudents[arrayStudents.length-1].createdOn).format('hh:mm')
                        flag = true;
                        uploaded_id = arrayStudents[0].doc_id;
                    }else{
                        uploaded_id = null,
                        marks =null
                        viewStatus = '0',
                        submitted = "Not Submitted",
                        flag = false;
                    }
                   groups.push({
                        uploaded_id : uploaded_id,
                        user_id : item.userId,
                        user_name : item.fullName,
                        groupId:item.groupId,
                        Point :item.Point,
                        marks:marks,
                        viewStatus:viewStatus,
                        submitted:submitted,
                        flag:flag,
                        DueDate:item.DueDate,
                        Date:dateFormate,
                        Time:timeFormate
                        
                    })
                    if(counter == students.length){
                        res.json({
                        status:200,
                        data:groups

                        })
                    }
                })
            })
        }
    })
});

router.get('/projectsOfStudents',(req,res)=>{
    var groups=[];
    var counter = 0;
    var query = {
        groupId :req.query.groupId
    }
    projectSubmissionModel.find(query,(err,students)=>{
        if(err){
            console.error(err);
        }

        else{
            if(students!=''){
            studentBatchModel.find({
                courseId:req.query.courseId,
                batchId:req.query.batchId
            }).populate('studentId',['fullName','email']).then(function(stu){
            stu.forEach(item=>{
                var uploaded_id,marks,viewStatus,submitted,flag;
                uploadedProject.find({$and:[{groupid:req.query.groupId},{userId:item.studentId._id}]},(err,arrayStudents)=>{
                    counter++;
                    if(arrayStudents.length){
                        marks = arrayStudents[0].marksObtained
                        submitted = "Submitted"
                    }else{
                        uploaded_id = null,
                        marks =null
                        submitted = "Not Submitted"
                    }
                   groups.push({
                        uploaded_id : uploaded_id,
                        user_id : item.studentId._id,
                        user_name : item.studentId.fullName,
                        groupId:req.query.groupId,
                        Point :students[0].Point,
                        marks:marks,
                        submitted:submitted,
                    })
                })
            })

        });
        setTimeout(function(){
                res.json({
                status:200,
                data:groups

                })
        },3000)

        }
    }
    })
});


router.get('/studentsMarks',(req,res)=>{
    var query = {userId:req.query.userId,groupid:req.query.groupId};
    var studentsArray =[]; 
    uploadedAssignment.find(query,(err,marks)=>{
       
        if(err){
            console.error(err);
        }
        else{
            if(marks){
                if(marks[0].marksObtained!=null){
                    studentsArray.push({
                        marks:marks[0].marksObtained,
                        fileName:  `${filelink}/api/uploadedAssignment/download?document_id=${marks[0].doc_id}`,
                        type:marks[0].type,
                        status:'Graded',
                        view:'Viewed',
                        totalMarks:marks[0].Point,
                        name:marks[0].name,
                        assignmentName:marks[0].assignmentName
                     })
                }
                else{
                    if(marks[0].viewStatus==0){
                        studentsArray.push({
                            marks:'--',
                            fileName:  `${filelink}/api/uploadedAssignment/download?document_id=${marks[0].doc_id}`,
                            status:'Not Graded',
                            type:marks[0].type,
                            totalMarks:marks[0].Point,
                            view:'Not viewed',
                            name:marks[0].name,
                            assignmentName:marks[0].assignmentName
                         })  
                    }
                    else{
                        studentsArray.push({
                            marks:'--',
                            fileName:  `${filelink}/api/uploadedAssignment/download?document_id=${marks[0].doc_id}`,
                            status:'Not Graded',
                            type:marks[0].type,
                            totalMarks:marks[0].Point,
                            view:'Viewed',
                            name:marks[0].name,
                            assignmentName:marks[0].assignmentName
                         })    
                    }
               
                }
           
            res.json({
                status:200,
                data:studentsArray
            })
            }
            else{
              res.json({
                  status:404,
                message:'Assignment not found'  
                        })
            }
           
        }
    })
})


router.post('/uploadedStudentProject',(req,res) =>{
    gfs = Grid(connect.db);
    let {
        file
    } = req.files;
    if (file == null || file == undefined || file == '') {
        res.json({
            status: 404,
            message: 'File not found'
        })
    } else {
        let writeStream = gfs.createWriteStream({
            filename: `${file.name}`,
            mode: 'w',
            content_type: file.mimetype
        });
        writeStream.on('close', function (uploadedFile) {

            uploadedProject.create({
                    doc_id: uploadedFile._id,
                    length: uploadedFile.length,
                    name: uploadedFile.filename,
                    type: uploadedFile.contentType,
                    courseId: req.body.courseId,
                    userId: req.body.id,
                    BatchId: req.body.batchID,
                    firstName: req.body.firstName,
                    LastName: req.body.lastName,
                    Email: req.body.email,
                    projectName: req.body.assignmentName,
                    Point: req.body.Point,
                    groupid: req.body.assignmentId,
                   
                })
                .then(file => 
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
        });
        writeStream.write(file.data);
        writeStream.end();
    }
});

 router.get('/getStudentsWithProject',function(req,res){
    var query = {
        userId: req.query.userId,
        groupId:req.query.groupId
    };
    var data = [];
    uploadedProject.find({$and:[{userId:query.userId},{groupid:req.query.groupId}]}, (err, students) => {

        if (err) {
            console.error(err)
        } else {
            for (var i = 0; i < students.length; i++) {
                data.push({
                    file_link: `${filelink}/api/uploadedAssignment/download?document_id=${students[i].doc_id}`,
                    type: students[i].type,
                    Point: students[i].Point,
                    fileName:students[i].name,
                    projectName:students[i].projectName,
                    userId:students[i].userId,
                    groupId:students[i].groupid,
                    fullName:students[i].firstName+ ' '+students[i].LastName,
                    uploaded_id:students[i]._id
                    
                });
            }

            res.json({
                status: 200,
                datum: data,

            })
        }
    })
 });

 router.post('/updateProjectsMarks', (req, res) => {
    uploadedProject.findOneAndUpdate(
        {$and:[{userId:req.body.userId},{groupid:req.body.groupId},{_id:req.body.uploadId}]}
        , {
            $set: {
                marksObtained: req.body.marks
            }
        },
        (err, Marks) => {
            if (err) {
                console.error(err);
            } else {
                if(Marks){
                    var action = "Marks Updated";
                    var notificationData = "You scored "+req.body.marks+" in " + Marks.assignmentName;
                    var userId = req.body.userId;
                    res.json({
                      status: 200
                  })
                }
            }
        })
});

router.get('/getExcelDataForStudentAssignmentMarks',function(req,res){

    var groups=[];
    var counter = 0;
    var query = {
        groupId :req.query.groupId
    }
    Assignments.find(query,(err,students)=>{
        if(err){
            console.error(err);
        }

        else{
            students.forEach(item=>{
                var uploaded_id,marks,viewStatus,submitted,flag;
                uploadedAssignment.find({$and:[{groupid:item.groupId.toString()},{userId:item.userId}]},(err,arrayStudents)=>{
                
                    let dateFormate;
                    let timeFormate;
                    let feedback;
                    counter++;
                    

                  if(arrayStudents.length){
                    const date2 = new Date(moment(item.DueDate).format('YYYY-MM-DD'));//new Date(item.DueDate);
                    const date1 = new Date(moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD'));//new Date(arrayStudents[arrayStudents.length-1].createdOn);
                  
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                   
                    if(new Date(moment(item.DueDate).format('YYYY-MM-DD')) > new Date(moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD'))){
                        submitted = "Submitted";
                    }else{
                        submitted = "Late Submitted";
                    }
                        marks = arrayStudents[arrayStudents.length-1].marksObtained,
                        viewStatus=arrayStudents[arrayStudents.length-1].viewStatus,
                        date=arrayStudents[0].createdOn
                        dateFormate = moment(arrayStudents[arrayStudents.length-1].createdOn).format('YYYY-MM-DD')
                        timeFormate = moment(arrayStudents[arrayStudents.length-1].createdOn).format('hh:mm')
                        flag = true;
                        uploaded_id = arrayStudents[arrayStudents.length-1].doc_id;
                        feedback = arrayStudents[arrayStudents.length-1].feedback;
                    }else{
                        uploaded_id = null,
                        marks =null
                        viewStatus = '0',
                        submitted = "Not Submitted",
                        flag = false;
                    }
                   groups.push({
                        Student_name : item.fullName,
                        Marks_obtained :marks ? marks:'0',
                        Total_Marks :item.Point,
                        submitted:submitted,
                        type_of_assignment:students[0].uploadTypeOfAssignment,
                        Date:dateFormate ? dateFormate : '-',
                        Time:timeFormate ? timeFormate : '-',
                        feedback : feedback
                        
                    })
                    
                    if(counter == students.length){
                        res.json({
                        status:200,
                        data:groups,
                        assignmentName : students[0].assignmentName,

                        })
                    }
                    
                })
            })
        }
    })

});


router.get('/getExcelDataForStudentProjectMarks',(req,res)=>{
    console.log("pp")
    var groups=[];
    var counter = 0;
    var query = {
        groupId :req.query.groupId
    }
    projectSubmissionModel.find(query,(err,students)=>{
        if(err){
            console.error(err);
        }

        else{
            if(students!=''){
            studentBatchModel.find({
                courseId:req.query.courseId,
                batchId:req.query.batchId
            }).populate('studentId',['fullName','email']).then(function(stu){
            stu.forEach(item=>{
                var uploaded_id,marks,viewStatus,submitted,flag;
                uploadedProject.find({$and:[{groupid:req.query.groupId},{userId:item.studentId._id}]},(err,arrayStudents)=>{
                    counter++;
                    if(arrayStudents.length){
                    if(arrayStudents.length){
                        marks = arrayStudents[0].marksObtained
                        submitted = "Submitted"
                    }else{
                        uploaded_id = null,
                        marks =null
                        submitted = "Not Submitted"
                    }
                   groups.push({
                        student_name : item.studentId.fullName,
                        groupId:req.query.groupId,
                        total_marks :students[0].Point,
                        marks_obtained:marks ? marks:'0',
                        submitted:submitted,
                        projectName:arrayStudents[0].projectName,
                    })
                }
                })
            })

        });
        setTimeout(function(){
         if(groups.length > 0){
             console.log("11")
                res.json({
                status:200,
                data:groups

                })
            }else{
             console.log("22")
                res.json({
                    status:400,
                    message:'bad request!!!..',
                    data:groups
                })
                }
        },3000)

        }
    }
    })
});




module.exports = router;