const express = require('express');

const router = express.Router();

const UserService = require('./userService');
const adminGuard = require('../auth/aclService').adminGuard;
var mongoose = require('mongoose');
var async = require('async');
var StudentBatchSchema = require('../../../app/models/studentBatch');
var studentBatchModel = mongoose.model('StudentBatch');
var DivisionSchema = require('../../../app/models/division');
var divisionModel = mongoose.model('Division');

const userService = new UserService();

const tcExamUser = require('./tcexamUser');
    const tcexamUser = new tcExamUser();
    var models  = require('../../../models');




async function addUserInTC(params){
  let user = await getPasswordHash(params);
      return user
}
router.get('/',adminGuard, (req, res) => {
  userService
    .list(req.query)
    .then(users => res.send(users));
});

router.get('/current', (req, res) => {
  userService
    .findById(req.user.id)
    .then(user => res.send(user));
});

router.put('/current', (req, res) => {
  userService
    .editUser(req.body)
    .then(user => res.send(user));
});

router.get('/:id', (req, res) => {
  userService
    .findById(req.params.id)
    .then(user => res.send(user));
});

router.delete('/:id', (req, res) => {
  var query =  userService.deleteUser(req.params.id)
  .then(() =>
  message="deleted successfully"
  );
  var query1={
    studentId: req.params.id 
  }
    studentBatchModel.find({
    studentId:req.params.id 
    }).exec(function(err,deleteStudent){
      if(err){
      return res.status(400).json({
        message:'Bad Request'
        });
      }else if(deleteStudent!='' || deleteStudent!=null || deleteStudent!='undefined'){
      studentBatchModel.findOneAndRemove(query1).exec(function(err,student){
        if(err){
          throw err;
        }else if(student!=''){
          divisionModel.find({
            studentId:req.params.id,
               }).exec(err,function(student) {
            if(err){
              throw err;	
            }else if(student!=''){
              divisionModel.findOneAndRemove({studentId:req.params.id}).exec(function(err,division){
                if(err){
                  throw err;
                }else if(division!=''){
  
                }
                res.json({
                  status : 200,
                  message : 'Entry deleted....!!!'
                });

              });


            }
            
          })
        }
    
        });

      }
  });  
});

router.post('/', (req, res) => {
  userService
    .addUser(req.body)
    .then(user => res.send(user));
    addUserInTC(req.body)

    models.users.create(req.body).then(user=>{})
});   


router.put('/:id', (req, res) => {
  userService
    .editUser(req.body)
    .then(user => res.send(user));
});

router.get('/:userId/photo', (req, res) => {
  userService
    .getPhoto(req.params.userId)
    .then(photo => {
      res.set('Content-Type', 'image/png');
      res.send(photo);
    });
});

module.exports = router;
