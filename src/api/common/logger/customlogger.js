const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var ErrorLoggerSchema = require('../../../app/models/errorlogger');
var ErrorLoggerModel = mongoose.model('ErrorLogger');
router.post('/', function (req, res) {
    
    var ErrorLoggerData = new ErrorLoggerModel({
        name: req.body['name'],
        appid: req.body['appid'],
        user: req.body['user'],
        time: req.body['time'],
        id: req.body['id'],
        url: req.body['url'],
        status: req.body['status'],
        message: req.body['message'],
        stack: req.body['stack']
      });

      ErrorLoggerData.save(function(err,result){
          if(err){
              res.json({
                  status:400
              })
          }else{
            res.json({
                data:result,
                status:200
            })
          }
      })
});

module.exports = router;