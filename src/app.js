/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const path = require('path');
const lms = require('./api/lms');
const attendance = require('./api/lms/attendance');
const viewCourse = require('./api/common/course/courseController');
const fs = require('fs');
const config = require('config');
const logger = require('./utils/logger');
const forum = require('./api/lms/forum');
const customlogger = require('./api/common/logger/customlogger');
require('./passport');

// common controllers
const authController = require('./api/common/auth/authController');
const userController = require('./api/common/user/userController');
const settingsController = require('./api/common/settings/settingsController');
const enrollStudent = require('./api/lms/enrollStudent');
const userApi = require('./api/common/user/userApi');
const SeedService = require('./api/seedService');
const seedService = new SeedService();
const users = require('./api/lms/users');
const app = express();
const { port, root } = config.get('api');
const busboyBodyParser = require('busboy-body-parser');
const upload = require('./api/common/course/upload');
const assignments = require('./api/common/course/assignments');
const uploadedAssignment = require('./api/common/course/uploadedAssignments');
const timetable = require('./api/lms/timetable');
const notification = require('./api/lms/notification');
const collegeTemplate = require('./api/lms/collegeTemplate');
const newTimeTable = require('./api/lms/newtimetable');
const teacher = require('./api/lms/teacher');
const search = require('./api/lms/search');
var mcache = require('memory-cache');
const support = require('./api/lms/support');
const bigbluebutton = require('./api/lms/bigbluebutton');
const analytics = require('./api/lms/analytics');
const questionPaper = require('./api/lms/questionPaper');
const feedback = require('./api/lms/feedback');
const library = require('./api/lms/library');
var multer = require('multer');
var Unzipper = require('decompress-zip');
const findRemoveSync = require('find-remove')
// Mobile route controller declaration
const studentRoute = require('./api/mobile/studentRoute')
const recruitment = require('./api/lms/recruitment')
const studentResult = require('./api/lms/studentResult')

//Creating file storage engine
var destPath = __dirname + "\\public\\";
var storage = multer.diskStorage({
  destination: destPath,
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + "." + fileFormat[fileFormat.length - 1]);
  }
});
var uploader = multer({ storage: storage, });
module.exports = uploader;


//for chat
var http = require('http').Server(app);

function logErrors(err, req, res, next) {
  logger.error(err);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something went wrong.' });
  } else {
    next(err);
  }
}

//cron email 
var moment = require('moment');
const cron = require('node-cron');
var sendgrid = require('@sendgrid/mail');
const { key } = config.get('sendGrid');
const sengrid_key = key;

// send mail
let filePath = '';

// cron scheduled to run at 26th of every month

cron.schedule('0 0 26 * *', async () => {
  // getting start and end date range.
  var startdate = moment().subtract(1, 'months').format('YYYY-MM-DD')
  var enddate = moment().format('YYYY-MM-DD')
  //exported function call to do what route (/sheduleExportExcel) does
  filePath = await newTimeTable.getMonthlydata(startdate, enddate, null)

  //check path and send mail
  if (filePath) {
    sendgrid.setApiKey(sengrid_key);
    attachment = fs.readFileSync(filePath).toString("base64");
    sendgrid.send({
      to: ['nishit@sdbi.in', 'accounts@sdbi.in','admin@sdbi.in'],
      from: 'updates@sdbi.in',
      subject: `Schedule: ${startdate} to ${enddate}`,
      html: `Hello Admin,`
        + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is for monthly scheduled data.`
        + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find the attachment given below for data from ${startdate} to ${enddate}`
        + `<br><br>Thank you,`
        + `<br>LMS Support Team`,

      attachments: [
        {
          content: attachment,
          filename: '("shedule")classes.xlsx',
          type: "application/xlsx",
          disposition: "attachment"
        }
      ]
    }).then(() => {
      console.log('Email sent')
    })
      .catch((error) => {
        console.error(error)
      })

  }
  else {
    console.log('filepath not found!!!');
  }
})





//socket.io
require('./libs/chat.js').sockets(http);

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
/****** Upload zipped articulate and articulate unzipped *******/
// app.post('/uploadZipFile', uploader.single('file'), function (req, res, next) {
//   if (req.file) {
//       // console.log("destination--"+req.file.destination);
// 		  // console.log("filename----"+req.file.filename);
//       var current =  path.basename(req.file.originalname, '.zip');
//       // console.log("current---"+current)
//       var dir = __dirname + "\\public\\" + current
//       // console.log("dir--->"+dir)
//       if (fs.existsSync(dir)) {
//             res.json({
//               status: 500,
//               message:'Directory already exist. Please rename directory name.'
//             })
//       }
//       else{
//            var filepath = path.join(req.file.destination, req.file.filename);

//           // console.log("filepath---"+filepath);

//           var unziper = new Unzipper(filepath);
//           // console.log("unziper---"+JSON.stringify(unziper));

//           unziper.on('error', function (err) {
//           // console.log('Caught an error',err);
//            });

//            unziper.on('progress', function (fileIndex, fileCount) {
//               // console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
//           });

//           unziper.on("extract", function(log){
//           // console.log("Finished extracting",log);
//          });

// 	  	    // console.log("destpth--->>"+destPath)
// 	  	    unziper.extract({ path: destPath });
//           // res.send({message:"'Single File sussessfully uploaded, and file unzipped'"})
//           res.json({
//             status: 200,
//             message:'Single File sussessfully uploaded, and file unzipped'
//             // data: fileData,
//           })
//     }

//    }
//   });
app.use(busboyBodyParser({ limit: '100mb' }));
app.use(express.static(__dirname + 'public'))

/****** quize articulate start ******/
// app.get('/articulate',(req,res) =>{
//       // console.log("req.query.file--"+req.query.file);
//         var assest = req.query.file 
//        if(assest){
//         var destPath = __dirname + "\\public\\"+assest;
//         // console.log("destpath----"+destPath)
//         app.use(express.static(destPath));
//         res.sendFile('story.html', { root: destPath }, (err) => {
//           res.end();
//           if (err) throw(err);
//         }); 
//   }
// });

/**** View articulate quiz data ****/
// app.get('/openFile', function(req, res) {
//   // var result = findRemoveSync(destPath, {files: 'file.zip'})
//   // console.log("result--"+JSON.stringify(result))
//     //passsing directoryPath and callback function
//     fs.readdir(destPath, function (err, files) {
//         //listing all files using forEach
//         files.forEach(function (file) {
//            // Do whatever you want to do with the file
//           //  console.log(file); 
//        });
//         //handling error
//         if (err) {
//           // return console.log('Unable to scan directory: ' + err);
//           return res.status(400).json({
//             message: 'Unable to scan directory:'
//           });
//       } else{
//         res.json({
//           status:'Getting public folder files',
//           data:files
//         })
//       }

// })

// });

/*****Delete articulate in admin side*******/
// app.delete('/deleteFile',(req, res) => {	
//   var destPath = __dirname + "\\public\\";
// app.use(express.static(destPath)); 
// // console.log("req.query.file--"+req.query.file);
// var assest = req.query.file
//     if(assest){
//       const removeDir = function(assest) {
//         if (fs.existsSync(assest)) {
//           const files = fs.readdirSync(assest)

//           if (files.length > 0) {
//             files.forEach(function(filename) {
//               if (fs.statSync(assest + "/" + filename).isDirectory()) {
//                 removeDir(assest + "/" + filename)
//               } else {
//                 fs.unlinkSync(assest + "/" + filename)
//               }
//             })
//             fs.rmdirSync(assest)
//           } else {
//             fs.rmdirSync(assest)
//           }
//         } else {
//           console.log("Directory path not found.")
//         }
//       }

//       const pathToDir = path.join(__dirname, "\\public\\"+assest)
//       // console.log("pathToDir ----"+pathToDir)

//       removeDir(pathToDir)
//       res.json({
//         status: 200,
//         message:'articulate deleted Successfully !!!'
//       })
//     }
//   })

const auth = passport.authenticate('jwt', { session: false });

// seed data in case of empty data base
seedService.checkAndSeed();

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

// routes for common controllers
app.use(`${root}/auth`, authController);
app.use(`${root}/users`, auth, userController);
app.use(`${root}/usersapi`, userApi);
app.use(`${root}/settings`, auth, settingsController);
app.use(`${root}/lms`, lms);
app.use(`${root}/attendance`, attendance);
app.use(`${root}/courseEnrollement`, enrollStudent);
app.use(`${root}/usersData`, users);
app.use(`${root}/viewCourse`, viewCourse);
app.use(`${root}/upload`, upload);
app.use(`${root}/forum`, forum);
app.use(`${root}/logger`, customlogger);
app.use(`${root}/assignments`, assignments);
app.use(`${root}/uploadedAssignment`, uploadedAssignment);
app.use(`${root}/timetable`, timetable);
app.use(`${root}/newTimeTable`, newTimeTable.router);
app.use(`${root}/notification`, notification);
app.use(`${root}/search`, search);
app.use(`${root}/support`, support);
app.use(`${root}/collegeTemplate`, collegeTemplate);
app.use(`${root}/teacher`, teacher);
app.use(`${root}/analytics`, analytics);
app.use(`${root}/studentResult`, studentResult);
app.use(`${root}/bigbluebutton`, bigbluebutton);
app.use(`${root}/questionPaper`, questionPaper);
app.use(`${root}/feedback`, feedback);
app.use(`${root}/library`, library);
app.use(`${root}/android`, studentRoute);
app.use(`${root}/recruitmentApi`,recruitment)
var models = require("./models");
app.use(logErrors);
app.use(clientErrorHandler);

//db connection via moongoose
var dbPath = "mongodb://localhost/socketChatDB";
const { url, name } = config.get('db');
mongoose.connect(url);
mongoose.connection.once('open', function () {
  console.log("Database Connection Established Successfully.");
});

//Sql connection
models.sequelize.sync().then(function (test) {
  logger.debug("connected to  MYSQL database");
});
//http method override middleware
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


//session setup
var sessionInit = session({
  name: 'userCookie',
  secret: '9743-980-270-india',
  resave: true,
  httpOnly: true,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  // Session Timeout to 12 hours
  cookie: { maxAge: 1000 * 60 * 60 * 12 }
});

app.use(sessionInit);


//parsing middlewares
//app.use(express.bodyParser({limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

//including models files for any os.
var modelsdir = path.normalize(__dirname + '/app/models/');
fs.readdirSync(modelsdir).forEach(function (file) {
  if (file.indexOf(".js")) {
    require(modelsdir + file);
  }
});

//including controllers files.
var controllersdir = path.normalize(__dirname + '/app/controllers/');
fs.readdirSync(controllersdir).forEach(function (file) {
  if (file.indexOf(".js")) {
    var route = require(controllersdir + file);
    //calling controllers function and passing app instance.
    route.controller(app);
  }
});


//app level middleware for setting logged in user.

var userModel = mongoose.model('User');

app.use(function (req, res, next) {

  if (req.session && req.session.user) {
    userModel.findOne({ 'email': req.session.user.email }, function (err, user) {

      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        delete req.session.user.password;
        next();
      }

    });
  }
  else {
    next();
  }

});//end of set Logged In User.

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//app.listen(port);
http.listen(port, function () {
  console.log("LMS App started at port :" + port);
});

logger.info(`Server start listening port: ${port}`);