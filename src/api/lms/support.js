var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Upload = require('../../app/models/uploads');
const sgMail = require('@sendgrid/mail');
const constant = require('../../../config/default');
const Support = require('../../app/models/support');
var SupportModel = mongoose.model('Support');
var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
const Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);

const connect = mongoose.connection;
Grid.mongo=mongoose.mongo;
var gfs;
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

router.post('/support', function(req,res){
    support(req)
    SupportModel.find({}, { limit: 1 }).then((data)=>{
     
        if(data.length == 0){
            SupportModel.create({
                adminEmail : req.body.data.admin_email,
                technicalEmail : req.body.data.technical_email,
                otherEmail : req.body.data.other_email,
                contentEmail: req.body.data.content_email
            }).then(data => {
                if(data){
                    res.send({
                        status : 200
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    message: `[*] Error : ${err}`
                })
            })
        }else{
            SupportModel.update({_id : data[0]['_id']},{
                adminEmail : req.body.data.admin_email,
                technicalEmail : req.body.data.technical_email,
                otherEmail : req.body.data.other_email,
                contentEmail: req.body.data.content_email
            }, function(err, data) {
                if (err) {
                    res.send({
                        status: 500
                    })
                } 
                if(data){
                    res.send({
                        status : 200
                    })
                }
            })
        }  
    })
})
async function support(req){
    models.supports.findAll({}).then(data=>{
        if(data.length == 0 ){
            models.supports.create({
                adminEmail : req.body.data.admin_email,
                technicalEmail : req.body.data.technical_email,
                otherEmail : req.body.data.other_email,
                contentEmail: req.body.data.content_email
            }).then(supports=>{
                console.log('supports') 
            })
        }else{
            data[0].update({
                adminEmail : req.body.data.admin_email,
                technicalEmail : req.body.data.technical_email,
                otherEmail : req.body.data.other_email,
                contentEmail: req.body.data.content_email
            }).then(update=>{
                console.log("update")
            })
        }
    })
}
router.get('/getsupportMails', function(req,res){
  
    SupportModel.find({}).then((data)=>{
       
        if(data.length > 0){
            res.send({
                status : 200,
                data : data
            })
        }else{
            res.send({
                status : 400
            })
        }
        
    }).catch(err => {
        res.status(500).json({
            message: `[*] Error : ${err}`
        })
    })
})

router.post('/sendMail', function(req,res){

     var str1 = req.body.to.replace(/\["|"]|\r/g,'');
     var from = req.body.from.replace(/\"|\r/g,'');
     var subject = req.body.subject.replace(/\\"|"|\r/g,'');
     var mailbody = req.body.mailbody.replace(/"|\r/g, '');
     var mailbody1 = mailbody.replace(/\\n|\r/g, '<br>');
    
     var count = req.body.count;
   
     var ar=str1.split('","');
     var fileCount = 0;
 
   
     if(from == "admin@admin.com"){
         from = "info@sdbi.in";
     }
     
     if(count > 0){
         for(var i=1;i<=count;i++){
             var f="file"+i;
             gfs = Grid(connect.db);
             var instancefile= {file : req.files[f]}
             let {file}=instancefile
             var attachmentArray=[];
         
         let  writeStream = gfs.createWriteStream({
             filename: `${file.name}`,
             mode: 'w',
             content_type: file.mimetype
         })
 
         writeStream.on('close', function (uploadedFile) {
             Upload.create({
                     doc_id: uploadedFile._id,
                     lessonId: null,
                     length: uploadedFile.length,
                     name: uploadedFile.filename,
                     type: uploadedFile.contentType
                 }).then(file => {
                      fileCount ++ ;
                         gfs = Grid(connect.db);
                         let data = [];
                         gfs.findOne({
                             _id: uploadedFile._id
                         }, (err, file) => {
                             if (!file) {
                                 return res.status(404).send({
                                     message: 'File was not found'
                                 });
                             }
                         
                             let readstream = gfs.createReadStream({
                                 filename: file.filename
                             });
                             readstream.on('data', (chunk) => {
                                 data.push(chunk);
                             });
                             readstream.on('end', () => {
                                 data = Buffer.concat(data);
                                
                             attachment = data.toString("base64");
                             
                               attachmentArray.push({
                                 content: attachment,
                                 filename: file.filename,
                                 type: file.contentType,
                                 disposition: "attachment"
                               })
                            
                                
                                  
                                     if(attachmentArray.length === fileCount){
                                         sgMail.setApiKey(constant.sendGrid.key);
                                         sgMail.send({
                                                         to: ar,
                                                         from: from,
                                                         subject: subject,
                                                         text: 'and easy to do anywhere, even with Node.js happy', 
                                                         html: mailbody1,
                                                         attachments: attachmentArray
                                                 }, function (err, json) {

                                                     if (err) {
                                                     console.error("Error in sending Signed Document to email"+err);
                                                     res.send({
                                                         status : 400
                                                     })
                                                         
                                                     }else if (json[0]['statusCode'] == 200){
                                                         console.error("Error in sending Signed Document to email"+200);
                                                                 res.send({
                                                                     status : 200
                                                                 })
                                                     }else if (json[0]['statusCode'] == 202){
                                                         console.error("Error in sending Signed Document to email"+202);
                                                         res.send({
                                                             status : 202
                                                         })
                                                     }else if (json[0]['statusCode'] == 400){
                                                         console.error("Error in sending Signed Document to email"+400);
                                                         res.send({
                                                             status : 200
                                                         })
                                                     }	
                                 
                                                 });
                                     }    
                                
                             });
                             readstream.on('error', (err) => {
                                 logger.error(`[*] Error, while downloading a file, with error:  ${err}`);
                                 res.status(400).send({
                                     message: `Error, while downloading a file, with error:  ${err}`
                                 });
                             });
                         });
                    
                 }).catch(err => {
                     res.status(500).json({
                         message: `[*] Error while uploading new files, with error: ${err}`
                     })
                 })
         });
         writeStream.write(file.data);
         writeStream.end();   
         
         }
     }else{
        
             sgMail.setApiKey(constant.sendGrid.key);
             sgMail.send({
                             to: ar,
                             from: from,
                             subject: subject,
                             text: 'and easy to do anywhere, even with Node.js happy', 
                             html: mailbody1,
                       }, function (err, json) {
                         
                     
                          if (err) {
                        
                            res.send({
                             status : 400
                         })
                               
                          }else if (json[0]['statusCode'] == 200){
                         
                                     res.send({
                                         status : 200
                                     })
                         }else if (json[0]['statusCode'] == 202){
                             
                             res.send({
                                 status : 202
                             })
                         }else if (json[0]['statusCode'] == 400){
                             console.error("Error in sending Signed Document to email"+400);
                             res.send({
                                 status : 200
                             })
                         }	
 
                      });
                      
     }
       
 })

 router.post('/saveTheme',function(req,res){
    saveTheme(req)
    var query = {
        _id: req.body.user_id
      },
      update = {
        $set: {
          theme:req.body.theme
         
        }
      };
   userModel.updateMany(query, update, function (err, theme) {
       if(err){
        console.error("err"+err)
        return res.status(400).json({
          message: 'Bad Request'
        });
       }else{
        res.json({
            status: 200,
            data: theme
          })
       }
    });

});
async function saveTheme(req){
    var user = await getId.getUserId(req.body.user_id,'')
    models.users.find({where:{id:user.id}}).then(data=>{
        if(data){
            data.update({
                theme:req.body.theme
            }).then(update=>{
                console.log("update")
            })
        }
       
    })
}
router.get('/getTheme',function(req,res){
    console.log(req.query)
   userModel.find({
           _id : req.query.user_id
   }).then(function(user){
       res.json({
           status:200,
           data : user
       })
   })
});

module.exports = router;