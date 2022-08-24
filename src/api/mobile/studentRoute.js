var express = require('express')
var path = require('path')
var router = express.Router()
var mongoose = require('mongoose')
var userSchema = require('../../app/models/user')
var userModel = mongoose.model('User')
var studentBatchModel = mongoose.model('StudentBatch')
var StudentBatchSchema = require('../../app/models/studentBatch')
var NewCourseSchema = require('../../app/models/newCourse')
var newCourseModel = mongoose.model('NewCourse')

var chapterModel = mongoose.model('Chapter')
var chapterSchema = require('../../app/models/chapter')

/*
* @GET: api/android/getSemId
* @Description: Get semesterId from the user_id
* @Access: Restricted, Authenticated user only
*/
router.get('/getSemId', async (req, res) => {
  // TODO:  Find all student data from the given user_id
  /*
  1. Find courseID from studentbatches collection
  2. Find semesterID from chapters collection
  2. Find semesterID from courses collection
  */
  try {
    const {user_id} = req.query

    // Finding courseId
    const studentData = await studentBatchModel.find({
      studentId: user_id
    })

    const courseId = studentData[0]["courseId"]

    //Finding semesterId
    const courseData =  await newCourseModel.find({
      courseId
    })

    const semesterId = courseData[0]["semesterId"]

    //Finding in chapters
    const chaptersData = await chapterModel.find({
      courseId 
    })

    res.json({
      message: 'Student android route working',
      courseId : courseId,
      semesterId: semesterId,
      countCourseData: courseData.length,
      countChaptersData: chaptersData.length,
    })
  } catch (error) {
    res.json({
      message: 'Some error occurred',
    })
  }
})

router.get('/getLoginDetails', async (req, res) => {
  try {
  let userId = req.query.userId
  let loginDetails = await userModel.find({ _id: userId })
  if (!loginDetails) return res.status(404).json({ msg: 'User not found' })

  res.json({
    status: 'working',
    data: loginDetails[0]
  })
      
  } catch (error) {
    res.status(500).json({
        message: 'Server error',
        info: error.message
    })
      
  }
})

module.exports = router
