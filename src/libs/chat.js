const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const _ = require("lodash");
const eventEmitter = new events.EventEmitter();
var notification_function = require('../../src/utils/function');
const fs = require('fs');
const Grid = require('gridfs-stream');
var prod =  require('../../config/production');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const connect = mongoose.connection;
Grid.mongo=mongoose.mongo;
var gfs;
const express = require('express');
const router = express.Router();
var BatchMasterSchema = require('../app/models/batchMaster');
var batchMasterModel = mongoose.model('BatchMaster');
var DivisionSchema = require('../app/models/division');
var divisionModel = mongoose.model('Division');
//SQL
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models  = require(root_path+'/models');
const getSqlId = require('../utils/getSqlId');
var getId = new getSqlId();
//adding db models
require("../app/models/user.js");
require("../app/models/chat.js");
require("../app/models/room.js");

//using mongoose Schema models
const userModel = mongoose.model("User");
const chatModel = mongoose.model("Chat");
const roomModel = mongoose.model("Room");

//reatime magic begins here
module.exports.sockets = function(http) {
  io = socketio.listen(http);
 // console.log("io == ",io)

  //setting chat route
  const ioChat = io.of("/chat");
 // console.log("ioChat == ",ioChat)
  const userStack = [{}];
  const newuserStack = [];
  let oldChats, sendUserStack, setRoom;
  const userSocket = {};

  //socket.io magic starts here
  ioChat.on("connection", function(socket) {
   // console.log("socket connection established with id :  " + socket.id);

    //function to get user name
    socket.on("set-user-data", function(username) {
      //console.log(username + "  logged In");

      //storing variable.
      socket.username = username;
      userSocket[socket.username] = socket.id;

      socket.broadcast.emit("broadcast", {
        description: username + " Logged In"
      });

      //getting all users list
      eventEmitter.emit("get-all-users");

      //sending all users list. and setting if online or offline.
      sendUserStack = function() {
        userModel
        .find({})
        .lean()
        .select("fullName")
        .exec(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {

            for (var i = 0; i < result.length; i++) {
          userStack[result[i].fullName]= "Offline";
            }
            
            for (i in userSocket) {
              for (j in userStack) {
                if (j == i) {
                  userStack[j]= "Online";
                }
              }
            }
            //for popping connection message.
           
            // console.log("online : "+ findElement(userStack, "teacherfn", "Online"));
            // console.log("offline : "+ findElement(userStack, "teacherfn", "Offline"));
              delete userStack["undefined"];
              delete userStack["0"];
          const entries = Object.entries(userStack)
            for (const [user, status] of entries) {
              newuserStack.push({"fullName":user,"status":status});
            }


           //console.log("get all users newuserStack "+newuserStack);
              
                // if(newuserStack.length == 0){
                //   newuserStack.push({[username]:'Online'});
                // }
                ioChat.emit("onlineStack",newuserStack);   
             
            newuserStack.length = 0;
          }
        });


       
      }; //end of sendUserStack function.
    }); //end of set-user-data event.

    socket.on("getstack",function(){
      sendUserStack();
    })
    

    //setting room.
    socket.on("set-room", function(room) {
      //leaving room.
      socket.leave(socket.room);
      //getting room data.
      eventEmitter.emit("get-room-data", room);
      //setting room and join.
      setRoom = function(roomId) {
        socket.room = roomId;
        socket.join(socket.room);
        ioChat.to(userSocket[socket.username]).emit("set-room", socket.room);
      };
    }); //end of set-room event.

    //emits event to read old-chats-init from database.
    socket.on("old-chats-init", function(data) {
      eventEmitter.emit("read-chat", data);
    });

    //emits event to read old chats from database.
    socket.on("old-chats", function(data) {
      eventEmitter.emit("read-chat", data);
    });

    //sending old chats to client.
    oldChats = function(result, username, room) {
      ioChat.to(userSocket[username]).emit("old-chats", {
        result: result,
        room: room
      });
    };

    //showing msg on typing.
    socket.on("typing", function() {
      socket
        .to(socket.room)
        .broadcast.emit("typing", socket.username + " : is typing...");
    });

    //for showing chats.
    socket.on("chat-msg", function(data) {
      //emits event to save chat to database.
      eventEmitter.emit("save-chat", {
        msgFrom: data.msgFrom,
        msgTo: data.msgTo,
        msg: data.msg,
        room: socket.room,
        //room: "123",
        date: data.date,
      });
      //emits event to send chat msg to all clients.
      ioChat.to(socket.room).emit("chat-msg", {
        msgFrom: socket.username,
        msg: data.msg,
        date: data.date
      });
    });

     //for single chat in course batchwise
     socket.on("chat-msg-batch", function(data) {
      console.log("chat-msg-batch---"+JSON.stringify(data))
      var randomName = Math.floor(Math.random() * 1000)
      var imgName = randomName+data.batch_id
      if(data['type'] == 'message'){

      //emits event to save chat to database.
      eventEmitter.emit("save-batchchat", {
        //msgFrom: socket.username,
        msgFrom: data.msgFrom,
        msgTo: data.msgTo,
        msg: data.msg,
        room: socket.room,
        date: data.date,
        batchUserDetails : data.batchUserDetails,
        batch_id: data.batch_id
      });
      //emits event to send chat msg to all clients.
      ioChat.to(socket.room).emit("chat-msg-batch", {
        msgFrom: socket.username,
        msg: data.msg,
        date: data.date
      });
    }else if(data['type'] == 'file'){
      // var image = data['msg'];
       var imageBuffer = new Buffer(data['msg'], 'base64');
       gfs = Grid(connect.db);
       let  writeStream = gfs.createWriteStream({
         filename: imgName,
         mode: 'w',
         content_type: data['fileType']
       })
       writeStream.on('close', function (uploadedFile) {
         eventEmitter.emit("save-batchchat", {
           msgFrom: data.msgFrom,
             msgTo: data.msgTo,
             msg: ' ',
             room: socket.room,
             date: data.date,
             batchUserDetails : data.batchUserDetails,
             batch_id: data.batch_id,
             msdFromId : data.msgFromId,
             doc_id: uploadedFile._id,
             length: uploadedFile.length,
             //name: uploadedFile.filename,
             type: uploadedFile.contentType
             
         });
         //emits event to send chat msg to all clients.
         ioChat.to(socket.room).emit("chat-msg-batch", {
         
           msgFrom: socket.username,
           msdFromId : data.msgFromId,
           date: data.date,
           fileType : uploadedFile.contentType,
           length : uploadedFile.length ? 'file' : 'text',
           file : prod.apiUrl+`/upload/download?document_id=${uploadedFile._id}`
           
         });
       })
       
       writeStream.write(imageBuffer);
       
       writeStream.end();
     }
    });


    //for showing single user chats.
    socket.on("chat-singleUserMsg", function(data) {
      var randomName = Math.floor(Math.random() * 1000)
      var imgName = randomName+data.msgFromId

      if(data['type'] == 'message'){
       // emits event to save chat to database.
          eventEmitter.emit("save-singleUserchat", {
          msgFrom: data.msgFrom,
            msgTo: data.msgTo,
            msg: data.msg,
            room: socket.room,
            date: data.date,
            toUserId: data.toUserId,
            msdFromId : data.msgFromId
            
          });

          //emits event to send chat msg to all clients.
          ioChat.to(socket.room).emit("chat-singleUserMsg", {
            msgFrom: socket.username,
            msg: data.msg,
            date: data.date
          });

      }else if(data['type'] == 'file'){
       // var image = data['msg'];
        var imageBuffer = new Buffer(data['msg'], 'base64');
        gfs = Grid(connect.db);
        let  writeStream = gfs.createWriteStream({
          filename: imgName,
          mode: 'w',
          content_type: data['fileType']
        })
        writeStream.on('close', function (uploadedFile) {
          eventEmitter.emit("save-singleUserchat", {
            msgFrom: data.msgFrom,
              msgTo: data.msgTo,
              msg: ' ',
              room: socket.room,
              date: data.date,
              toUserId: data.toUserId,
              msdFromId : data.msgFromId,
              doc_id: uploadedFile._id,
              length: uploadedFile.length,
              //name: uploadedFile.filename,
              type: uploadedFile.contentType
              
          });
          //emits event to send chat msg to all clients.
          ioChat.to(socket.room).emit("chat-singleUserMsg", {
          
            msgFrom: socket.username,
            msdFromId : data.msgFromId,
            date: data.date,
            fileType : uploadedFile.contentType,
            length : uploadedFile.length ? 'file' : 'text',
            file : uploadedFile._id ? prod.apiUrl+`/upload/download?document_id=${uploadedFile._id}` : ''
            
          });
        })
        
        writeStream.write(imageBuffer);
        
        writeStream.end();
      }
      
      //  var fileName = "E:/search_lms/lmsserver/src/public/out.png";
      
      // fs.writeFile(fileName, image, {encoding: 'base64'}, function(err,data){
      //   //Finished
      //   console.log("result-->>"+JSON.stringify(data))
      // });
      

      // fs = Grid(connect.db);

      // put_image = fs.put(image)

    //   let writeStream = fs.createWriteStream('secret.txt');
    //   writeStream.write(image, 'base64');
    //   writeStream.on('close', (dataa) => {
        //console.log('wrote all data to file'+JSON.stringify(put_image));
    // });
    
    // //close the stream
    // writeStream.end();
      //var imageBuffer = new Buffer(data['msg'], 'base64');
      //var bitmap =  Base64.decodeBase64(data['msg']);
      //console.log("bitmap-->>"+imageBuffer)
    
      
    });

    socket.on('forceDisconnect', function(){
      socket.disconnect();
  });
    //for popping disconnection message.
    socket.on("disconnect", function() {
      socket.broadcast.emit("broadcast", {
        description: socket.username + " Logged out"
      });
      //console.log("chat disconnected.");
      _.unset(userSocket, socket.username);
      userStack[socket.username] = "Offline";
      const entries = Object.entries(userStack)
      for (const [user, status] of entries) {
        newuserStack.push({"fullName":user,"status":status});
      }
      ioChat.emit("onlineStack", newuserStack);
      newuserStack.length=0;
    }); //end of disconnect event.
  }); //end of io.on(connection).
  //end of socket.io code for chat feature.

  //database operations are kept outside of socket.io code.
  //saving chats to database.
  eventEmitter.on("save-chat", function(data) {
    // var today = Date.now();

    var newChat = new chatModel({
      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msg: data.msg,
      room: data.room,
      createdOn: data.date
    });

    newChat.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
        //console.log(result);
      }
    });
  }); //end of saving chat.


  //saving batch chats to database.
  eventEmitter.on("save-batchchat",async  function(data) {
    var newChat = new chatModel({
      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msg: data.msg,
      room: data.room,
      createdOn: data.date,
      doc_id : data.doc_id ? data.doc_id : '' ,
      type : data.type ? data.type : '',
      length : data.length ? data.length : ''

    });

    newChat.save(function(err, result) {
      if (err) {
        console.error("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.error("Chat Is Not Saved.");
      } else {
        if(result){
          var action = "Batch Chat";
          var notification_data = "You received new message in "+result.msgTo +" batch"
          var query_params= "name1:"+data.batch_id+",title:"+result.msgTo;
          // data['batchUserDetails'].forEach(function(user){
          //   notification_function.notification(action,notification_data,user.userId,'pages/batchChat',query_params)
          // })
        }
      }
    });
    if(data.batch_id){
      var data1 = data.batch_id.split('-'); 
      var batch = await getId.getBatchId(data1[0],'')
         var division = await getId.getDivisionId(data1[1],'')
        models.chats.create({
          msgFrom: data.msgFrom,
          msgTo: data.msgTo,
          msg: data.msg,
          roomId: batch.id +"-"+ division.id,
          // fileName : data.fileName ? data.fileName : '' ,
          // type : data.type ? data.type : '',
          // length : data.length ? data.length : ''  
        }).then(function(result) {
          if (result == undefined || result == null || result == "") {
            console.error("Chat Is Not Saved.");
          } else {
            console.log("")
            if(result){
              var action = "Batch Chat";
              var notification_data = "You received new message in "+result.msgTo +" batch"
              var query_params= "name1:"+data.batch_id+",title:"+result.msgTo;
              // data['batchUserDetails'].forEach(function(user){
              //   notification_function.notification(action,notification_data,user.userId,'pages/batchChat',query_params)
              // })
            }
          }
        });
    }
         
  }); //end of saving Batch chat.


  //saving single user chats to database.
  eventEmitter.on("save-singleUserchat", function(data) {
    var newChat = new chatModel({
      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msg: data.msg,
      room: data.room,
      createdOn: data.date,
      doc_id : data.doc_id ? data.doc_id : '' ,
      type : data.type ? data.type : '',
      length : data.length ? data.length : ''

    });

    newChat.save(function(err, result) {
      if (err) {
        console.error("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.error("Chat Is Not Saved."+JSON.stringify(result));
      } else {
        console.error("Chat Saved.");
        if(result){
          var action = "Batch Chat";
          var notification_data = "You received new message from "+result.msgFrom
         
          var query_params= "toggle: revealcard"+",msgfrom:"+result.msgFrom+",msdFromId:"+data.msdFromId;
           // notification_function.notification(action,notification_data,data.toUserId,'pages/batchChat',query_params)
          
        }
      }
    });

    models.chats.create({
      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msg: data.msg,
      roomId: data.room,
      // fileName : data.fileName ? data.fileName : '' ,
      // type : data.type ? data.type : '',
      // length : data.length ? data.length : ''

    }).then(function(result) {
      if (result == undefined || result == null || result == "") {
        console.error("Chat Is Not Saved."+JSON.stringify(result));
      } else {
        console.error("Chat Saved.");
        if(result){
          var action = "Batch Chat";
          var notification_data = "You received new message from "+result.msgFrom
         
          var query_params= "toggle: revealcard"+",msgfrom:"+result.msgFrom+",msdFromId:"+data.msdFromId;
           // notification_function.notification(action,notification_data,data.toUserId,'pages/batchChat',query_params)
          
        }
      }
    });
  }); //end of saving single user chat.

  //reading chat from database.
  eventEmitter.on("read-chat", function(data) {
    chatModel
      .find({})
      .where("room")
      .equals(data.room)
      .sort("-createdOn")
      .skip(data.msgCount)
      .lean()
      .limit(5)
      .exec(function(err, result) {
        var chatData = [];
        //console.log(request.headers.host)
        if (err) {
          console.log("Error : " + err);
        } else {
          console.log("result--->>"+JSON.stringify(result))
          result.forEach(data => {
            console.log("472==== "+JSON.stringify(data))
            chatData.push({
              msg : data.msg,
              msgFrom : data.msgFrom,
              msgTo : data.msgTo,
              room : data.room,
              fileType : data.type,
              length : data.length ? 'file' : 'text',
              //file : uploadedFile._id ? prod.apiUrl+`/upload/download?document_id=${uploadedFile._id}` : ''
              
              //file : prod.apiUrl+`/upload/download?document_id=${uploadedFile._id}`
            })
            

          })
          console.log("chatData==>"+JSON.stringify(chatData))
          // for(var i in result){
          //   do{
          //     console.log("!!!!!!!!!!11111")
          //   }
          //   while(result[i]['doc_id'] != null)

            
          // }
          //calling function which emits event to client to show chats.
          oldChats(chatData, data.username, data.room);
        }
      });
  }); //end of reading chat from database.

  //listening for get-all-users event. creating list of all users.
  eventEmitter.on("get-all-users", function() {
    userModel
      .find({})
      .lean()
      .select("fullName")
      .exec(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
        //  console.log(result);
          //console.log("result[0].fullName "+ result[0].fullName);
          //userStack=[{}];
         // console.log("stack before "+Object.keys(userStack));
          for (var i = 0; i < result.length; i++) {
            //console.log("result["+i+"].fullName "+ result[i].fullName);
            userStack[result[i].fullName] = "Offline";
           // console.log("userStack["+i+"]"+ Object.keys(userStack));
          }
         // console.log("userStack "+JSON.stringify(userStack));
         // console.log("stack after "+Object.keys(userStack));
          sendUserStack();
        }
      });
  }); //end of get-all-users event.

  //listening get-room-data event.
  eventEmitter.on("get-room-data", function(room) {
    roomModel.find(
      {
        $or: [
          {
            name1: room.name1
          },
          {
            name1: room.name2
          },
          {
            name2: room.name1
          },
          {
            name2: room.name2
          }
        ]
      },
      function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          if (result == "" || result == undefined || result == null) {
            var today = Date.now();

            newRoom = new roomModel({
              name1: room.name1,
              name2: room.name2,
              roomName: room.roomName,
              lastActive: today,
              createdOn: today
            });

            newRoom.save(function(err, newResult) {
              if (err) {
                console.log("Error : " + err);
              } else if (
                newResult == "" ||
                newResult == undefined ||
                newResult == null
              ) {
                console.log("Some Error Occured During Room Creation.");
              } else {
                setRoom(newResult._id); //calling setRoom function.
              }
            }); //end of saving room.
          } else {
            var jresult = JSON.parse(JSON.stringify(result));
            setRoom(jresult[0]._id); //calling setRoom function.
          }
        } //end of else.
      }
    ); //end of find room.
  }); //end of get-room-data listener.
  //end of database operations for chat feature.

  //
  //

  //to verify for unique username and email at signup.
  //socket namespace for signup.
  const ioSignup = io.of("/signup");

  let checkUname, checkEmail; //declaring variables for function.

  ioSignup.on("connection", function(socket) {
    console.log("signup connected.");

    //verifying unique username.
    socket.on("checkUname", function(uname) {
      eventEmitter.emit("findUsername", uname); //event to perform database operation.
    }); //end of checkUname event.

    //function to emit event for checkUname.
    checkUname = function(data) {
      ioSignup.to(socket.id).emit("checkUname", data); //data can have only 1 or 0 value.
    }; //end of checkUsername function.

    //verifying unique email.
    socket.on("checkEmail", function(email) {
      eventEmitter.emit("findEmail", email); //event to perform database operation.
    }); //end of checkEmail event.

    //function to emit event for checkEmail.
    checkEmail = function(data) {
      ioSignup.to(socket.id).emit("checkEmail", data); //data can have only 1 or 0 value.
    }; //end of checkEmail function.

    //on disconnection.
    socket.on("disconnect", function() {
      console.log("signup disconnected.");
    });
  }); //end of ioSignup connection event.

  //database operations are kept outside of socket.io code.
  //event to find and check username.
  eventEmitter.on("findUsername", function(uname) {
    userModel.find(
      {
        username: uname
      },
      function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //console.log(result);
          if (result == "") {
            checkUname(1); //send 1 if username not found.
          } else {
            checkUname(0); //send 0 if username found.
          }
        }
      }
    );
  }); //end of findUsername event.

  //event to find and check username.
  eventEmitter.on("findEmail", function(email) {
    userModel.find(
      {
        email: email
      },
      function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //console.log(result);
          if (result == "") {
            checkEmail(1); //send 1 if email not found.
          } else {
            checkEmail(0); //send 0 if email found.
          }
        }
      }
    );
  }); //end of findUsername event.

  //
  //

  return io;
};