var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');
var EnrollmentSchema = require('../../app/models/enrollment');
var EnrollmentDetailsSchema = require('../../app/models/enrollmentdetails');
var BatchSchema = require('../../app/models/batch');
var UserSchema = require('../../app/models/user');
var CourseSchema = require('../../app/models/course');
var enrollmentdetailsModel = mongoose.model('EnrollmentDetail');
var batchModel = mongoose.model('Batch');
var userModel = mongoose.model('User');
var courseModel = mongoose.model('Course');
var eventSchema = require('../../app/models/event');
var eventSchema = require('../../app/models/timetable');
var eventModel = mongoose.model('Event');
var timetableModel = mongoose.model('TimeTable');
var moment = require('moment');
var async = require('async');
var json2xls = require('json2xls');
var fs = require('fs');
var h2p = require('html2plaintext');
var notification_function = require('./../../utils/function');

router.post('/addTimetable', function (req, res) {
    if (req.body.timetableId == undefined) {
        var timetableData = new timetableModel({
            batch_id: req.body.batchId,
            title: req.body.title,
            date: req.body.date,
            time_from: req.body.Time_from,
            time_to: req.body.Time_to,
            reason: ''
        });

        timetableData.save(function (err, result) {
            if (err) {
                res.json({
                    status: 400
                })
            } else {
                res.json({
                    data: result,
                    status: 200
                })
            }
        })
    } else {
        timetableModel.findByIdAndUpdate(req.body.timetableId, {
                batch_id: req.body.batchId,
                title: req.body.title,
                date: req.body.date,
                time_from: req.body.Time_from,
                time_to: req.body.Time_to
            },
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
    }
});

router.get('/getTimetable/:id', function (req, res) {
    var view_data = [];
    timetableModel.find({
        batch_id: req.params.id
    }).then(function (data) {
        if (data == '' || data == null) {
            res.json({
                status: 400,
                data: view_data
            })
        } else {
            data.forEach(function (event) {

                view_data.push({
                    id: event.id,
                    date: new Date(event.date),
                    title: event.time_from + "-" + event.time_to,
                    from: event.time_from,
                    to: event.time_to,
                    color: '#336699',
                    name: event.name
                });

            })
            setTimeout(function () {
                res.json({
                    status: 200,
                    data: view_data
                })
            }, 500)
        }
    });
});

module.exports = router;