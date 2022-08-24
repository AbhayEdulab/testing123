var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const bbb = require('bigbluebutton-js');
var bbbModel = require('../../app/models/bbbInfo');
var bbbInfoModel = mongoose.model('bbbInfo');
var UserModel = mongoose.model('User');




router.post('/', function (req, res) {
    var meetingName = req.body.data;
    var BBB_URL = "https://bbb.admissiondesk.org/bigbluebutton/";
    var BBB_SECRET = "2sKxV00LHE1KXoYEk6ummcSoHbdSgC6YcAVAkHbc0";
    let api = bbb.api(
        BBB_URL,
        BBB_SECRET
    )

    let http = bbb.http

    let meetingCreateUrl = api.administration.create('My Meeting', meetingName, {
        duration: 2,
        attendeePW: 'secret',
        moderatorPW: 'supersecret',
    })
    http(meetingCreateUrl).then((result) => {
        let moderatorUrl = api.administration.join('moderator', meetingName, 'supersecret')
        let attendeeUrl = api.administration.join('attendee', meetingName, 'secret')
        console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`)

        let meetingEndUrl = api.administration.end(meetingName, 'supersecret')
        if (moderatorUrl != null && attendeeUrl != null) {
            bbbInfoModel.create({
                moderatorUrl: moderatorUrl,
                attendeeUrl: attendeeUrl,
                meetingEndUrl: meetingEndUrl,
                meetingName: meetingName,

            }, (err, dataInserted) => {
                if (dataInserted) {
                    res.json({
                        status: 200,
                        moderatorUrl: moderatorUrl,
                        attendeeUrl: attendeeUrl,
                        meetingEndUrl: meetingEndUrl,
                        meetingId: dataInserted['_id']

                    })
                }
            })



        }

    })
})

router.get('/getTeacher', function (req, res) {
    UserModel.find({
        role: 'teacher'
    }, function (err, info) {
        if (info) {
            res.json({
                status: 200,
                data: info
            })
        }
    })

})

router.post('/saveTeacherInfo', function (req, res) {
    var bodyData = req.body.data;
    var query = {
            _id: req.body.saveId

        },
        update = {
            $set: {
                TeacherName: bodyData['fullName'],
                TeacherUserID: bodyData['_id']
            }
        };
    bbbInfoModel.findOneAndUpdate(query, update, function (req, updateuser) {

        if (updateuser) {
            res.json({
                status: 200,
                data: updateuser
            });
        } else {
            res.json({
                status: 400
            });
        }


    });
})

router.get('/getTeacherLecLink', function (req, res) {
    bbbInfoModel.find({
        TeacherUserID: req.query.userId
    }, function (err, info) {
        if (info) {
            res.json({
                status: 200,
                data: info
            })
        }
    })
})

module.exports = router;