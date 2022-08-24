
const express = require('express');
const router = express.Router();
const UserService = require('./userService');
var mongoose = require('mongoose');
const xlsx = require('xlsx');
var request = require('request');
const cipher = require('../../common/auth/cipherHelper');
const userService = new UserService();
const config = require('config');
const { response } = require('express');
const { userApi,port } = config.get('api');
var UserSchema = require('../../../app/models/user');
var UserModel = mongoose.model('User');
var StudentBatchSchema = require('../../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var roomSchema = require('../../../app/models/room');
var roomModel = mongoose.model('Room');
var newDivisionSchema = require('../../../app/models/newDivision');
var newDivisionModel = mongoose.model('newDivision');
var BatchMasterSchema = require('../../../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
const tcExamUser = require('./tcexamUser');
const tcexamUser = new tcExamUser();
var models  = require('../../../models');




router.post('/create',(req,res) =>{
  try{
  var pass=req.body;
  }catch(e){
    console.log("not a valid json");
  }
  var key =JSON.parse(pass["user"]);
  const hash = cipher.saltHashPassword(key["Password"]);
  var newUser=JSON.parse(req.body.user);
  newUser.salt=hash.salt; 
  newUser.passwordHash=hash.passwordHash;
  newUser.status='active';
  userService.addUser(newUser) .then(user => res.send(user));
  models.users.create(newUser) .then(user=> res.send(user))

  })

  router.post('/uploadexcel', async (req,res)=>{
    tcexamUser.connectDb();

    console.log("request----->>",req.files)
    var data = new Uint8Array(req.files.file.data);
    var workbook= xlsx.read(data, {type:'buffer',cellDates:true, cellNF: false, cellText:false});
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
      var worksheet = workbook.Sheets[y];
      var headers = {};
      var data = [];
      for(z in worksheet) {
          if(z[0] === '!') continue;
          var col = z.substring(0,1);
          var row = parseInt(z.substring(1));
          var value = worksheet[z].v;
          if(row == 1) {
              headers[col] = value;
              continue;
          }
           if(!data[row]) data[row]={};
          
          data[row][headers[col]] = value;
          
      }
      data.shift();
      data.shift();
      data.forEach(async element => {
        console.log("user",element)
        var user = JSON.stringify(element);      
        var val=JSON.parse(user);
        if(typeof userApi === 'undefined'){
          var options = {
            'method': 'POST',
            'url': 'http://localhost:3232/api/usersapi/create',
            'headers': {
             },
            formData: { user }
          };
       await tcexamUser.addUser(user);
    } else{     
        
        var options = {
        'method': 'POST',
        'url': userApi,
        'headers': {
         },
        formData: { user }
      };
     await tcexamUser.addUser(user);
    }
     request(options, function (error, response) {
         if (error) throw new Error(error);
         });
      });
      res.json({
        status: 200
    })
     });
     setTimeout(() => {
    tcexamUser.endDb();
       
     }, 20000);
   });

router.post('/uploadexcelBatchwise', (req,res)=>{
  var data = new Uint8Array(req.files.file.data);
  var workbook= xlsx.read(data, {type:'buffer',cellDates:true, cellNF: false, cellText:false});
  var chattitle;
  var roomName = req.body.batchId + "-" + req.body.divisionId
  var sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        
        var col = z.substring(0,1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;
        
        if(row == 1) {
            headers[col] = value;
            continue;
        }
          if(!data[row]) data[row]={};
        
        data[row][headers[col]] = value;
        
    }
    data.shift();
    data.shift();
    
    data.forEach(element => {
      var user = JSON.stringify(element);
      var email = element['email']
      
        var val=JSON.parse(user);
        if(typeof userApi === 'undefined'){
          var options = {
            'method': 'POST',
            'url': 'http://localhost:3232/api/usersapi/create',
            'headers': {
              },
            formData: { user }
          };
          
        }else{     
            var options = {
              'method': 'POST',
              'url': userApi,
              'headers': {
                },
              formData: { user }
            };
        }

        request(options, function (error, response) {
            if (error) throw new Error(error);
            if(response){
              setTimeout(()=>{
                  UserModel.find({
                    email : email
                  }).exec(function(err,user){
                  if(err){
                    console.log("err==>"+JSON.stringify(err));
                  }
                  if(user.length != 0){
                    setTimeout(()=>{
                      var studentBatchData = new studentBatchModel({

                        batchId:req.body.batchId,
                        departmentId: req.body.departmentId,
                        courseId:req.body.courseId,
                        divisionId:req.body.divisionId,
                        studentId:user[0]._id,
                        batch_start_date:req.body.startDate,
                        batch_end_date:req.body.endDate
                      });
                      studentBatchData.save(function (err, result) {
                          if(result){
                            roomModel.find({
                              name1 : roomName
                              }).then(roomData => {
                                
                                if(roomData != null && roomData != '' && roomData != undefined){
                                console.log("data if")
                              }else{
                                console.log("else #######")
                                newDivisionModel.find({
                                  _id : req.body.divisionId
                                  }).then(function(divisionInfo){
                                      divisionName = divisionInfo[0]['name']
                                      console.log("divisionInfo== "+JSON.stringify(divisionInfo))
                                })
                                batchMasterModel.find({_id  : req.body.batchId}).populate('courseId',['courseName']).populate('departmentId',['departmentName']).sort({"createdOn":1}).exec(function(err,batchData){
                                                    
                                  batchData.forEach(function(batches){
                                  chattitle = batches['courseId']['courseName'] +' - '+batches['batchName']+'('+batches['year']+') - '+divisionName
                                  })
                                  var today = Date.now();
                                  newRoom = new roomModel({
                                    name1: roomName,
                                    name2: roomName,
                                    roomName: chattitle,
                                    lastActive: today,
                                    createdOn: today
                                  });
                                  newRoom.save(function(err, newResult) {
                                    if (err) {
                                      console.log("Error : " + err);
                                    }
                                  })
                              })
                    
                              }
                              })
                          }
                      });
                    },2000)
                    
                  }
                })
              },1000);
            }
        });
    });
    res.json({
      status: 200
    })
  });
});

  module.exports = router;