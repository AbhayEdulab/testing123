var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');

var fs = require('fs');

var AttendanceSchema = require('../../app/models/attendance');
var attendanceModel = mongoose.model('Attendance');

var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');

require("../../app/models/chat.js");
const chatModel = mongoose.model("Chat");

require("../../app/models/notification.js");
const notificationModel = mongoose.model("Notification");
//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

router.post('/getnotification',function(req,res){
	var view_data = [];
    var notification_no = 0;
    var lastDate = moment(new Date()).subtract(3, 'days').format("YYYY-MM-DD");
    notificationModel.aggregate([
        { "$match": 
            { 
                "UserID": req.body.userId,
                "delete_notification":"false",
                "createdOn" : {
                    $gte :  new Date(lastDate +"T00:00:00.000Z")
                }
            } 
        },
        { "$sort": { "createdOn": -1 } },
    ]).exec(function (err, data) {
        if(err){
            res.send({
                status: 400,
                err: err
            })
        }else{
            data.forEach(function (application) {
                // 
                if(application.read_notification == 'false'){
                    notification_no += 1;
                }
                view_data.push({
                    id : application._id,
                    notification_data : application.notification_data,
                    read : application.read_notification,
                    created_at : moment(application.createdOn).fromNow(),
                    url_data : application.url_data,
                    query_param : application.query_params,
                    action : application.action,
                })
            })
            setTimeout(function(){
                res.send({
                    status: 200,
                    data: view_data,
                    notification_no:notification_no
                })
            },1000)
        }
    });
    
});

router.post('/deleteNotification',function(req,res){
    var notification_id = req.body.noti_id;
    if(notification_id == null || notification_id =='' ||notification_id == undefined){
        var query = {
            UserID : req.body.id, 
        },
        update = {
            $set: {
                delete_notification: "true",
            }
        };
        notificationModel.updateMany(query, update, function(err, notificationUpdate) {
            if(notificationUpdate){
                res.send({
                    status: 200,
                })
            }else{
                res.send({
                    status: 400,
                })
            }
        })
    }else{
        var query = {
            _id : notification_id,
        },
        update = {
            $set: {
                delete_notification: "true",
            }
        };
        notificationModel.findOneAndUpdate(query, update, function(err, notificationUpdate) {
            if(notificationUpdate){
                res.send({
                    status: 200,
                })
            }else{
                res.send({
                    status: 400,
                })
            }
        })
    }
})

router.post('/makeReadNotification',function(req,res){
    makeReadNotification(req)
    var query = {
        UserID : req.body.id, 
    },
    update = {
        $set: {
            read_notification: "true",
        }
    };
    notificationModel.updateMany(query, update, function(err, notificationUpdate) {
        if(notificationUpdate){
            res.send({
                status: 200,
            })
        }else{
            res.send({
                status: 400,
            })
        }
    })
})
async function makeReadNotification(req){
    var user = await getId.getUserId(req.body.id,'')
    models.notifications.find({
        where:{
            userId:user.id
        }
    }).then(notic=>{
        if(notic){
            notic.update({
                readNotification: "true", 
            }).then(update=>{
                console.log("update")
            })
        }
       
    })
}
module.exports = router;