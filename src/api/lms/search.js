var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var randomstring = require('randomstring');
var userSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var batchSchema = require('../../app/models/batch');
var batchModel = mongoose.model('Batch');
var NewCourseSchema = require('../../app/models/newCourse');
var newCourseModel = mongoose.model('NewCourse');
var TeacherSchema = require('../../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
var CollegeCourseSchema = require('../../app/models/collegeCourse');
var collegeCourseModel = mongoose.model('CollegeCourse');
var root_path = path.dirname(require.main.filename);
var models= path.normalize(__dirname+'/app/models/');

router.get('/searchData/:searchData/:userRole/:searchFor/:userId', function (req, res) {
   var userData = req.params.userId
    if(req.params.userRole == 'admin' && req.params.searchFor == 'User'){
    


        userModel.find({fullName : new RegExp('.*'+req.params.searchData+'.*', 'i')}, function(err, docs){
            res.json({
                status : 200,
                data:docs,
                route : 'User'
            })
        })
    }else if( req.params.searchFor == 'Course'){
        newCourseModel.find({subjects : new RegExp('.*'+req.params.searchData + '.*', 'i')}, function(err, coursedata){
            res.json({
                status : 200,
                coursedata : coursedata,
            })
        })
    }else if(req.params.userRole == 'teacher' && req.params.searchFor == 'Attendance'){
        teacherModel.find({subject : new RegExp('.*'+req.params.searchData + '.*', 'i'),teacher_id : req.params.userId}, function(err, attendanceData){
            res.json({
                status : 200,
                attendanceData : attendanceData,
            })
        })
    }else if(req.params.searchFor == 'studentCourse'){
        collegeCourseModel.find({
            courseName : req.query.userCourse
          }).then(function (course) {
            course.forEach((data)=> {
                newCourseModel.find({
                    courseId : data._id,
                    subjects : new RegExp('.*'+req.params.searchData + '.*', 'i')
    
                }).then((subjects) => {
                    res.json({
                        status : 200,
                        studentCourse : subjects,
                    })
                }) 
            })
            

        })
    }
})


router.get('/searchEmails/:role',function(req,res){
    
    AlldataArray = [];
    userModel.find({ role: { $nin: [ 'admin' ]}},
    function(err, docs){
      
        docs.forEach((entry)=>{
            AlldataArray.push({id:entry._id ,name:entry.fullName ,email:entry.email});
        })
        if(AlldataArray.length == docs.length){
            res.json({
                status : 200,
                data:AlldataArray,
            })
        }else{
            res.json({
                status : 400,
            })
        }
    })
})

module.exports = router;