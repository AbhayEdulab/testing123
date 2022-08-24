const config = require('config');
const logger = require('../utils/logger');

const { domain } = config.get('frontEnd');
var sendgrid =  require('@sendgrid/mail');
const { key } = config.get('sendGrid');
const sengrid_key = key;
var textLocal  = config.get('textLocal');
var urlencode = require('urlencode');
var http = require('http');
var request = require('request');

function doSend(email, text) {
  logger.info(text);
  return Promise.resolve(true);
}

function sendResetPasswordEmail(email, fullName, token) {
  const text = `Hello ${fullName},`
  + '\nWe have received password reset request. '
  + `To do this, please proceed at ${domain}/#/auth/reset-password?reset_password_token=${token}`
  + '\nIf it wasn\'t you, take no action or contact support.'
  + '\n\nThank you,'
  + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Password Link',
    html : `Hello ${fullName},`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We have received password reset request.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To do this, please proceed at ${domain}/auth/reset-password?reset_password_token=${token}` 
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If it wasn\'t you, take no action or contact support.`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });
}

function ActiveStudentLms(email, fullName, token) {
  const text = `Hello ${fullName},`
  + '\nYour Lms Login Credentials. '
  + `To do this, please proceed at ${domain}/#/auth/reset-password?reset_password_token=${token}`
  + '\nIf it wasn\'t you, take no action or contact support.'
  + '\n\nThank you,'
  + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to :email,
    from : 'updates@sdbi.in',
    Subject : 'Login Credentials for LMS',
    html : `Hello ${fullName},`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You've been invited to participate in a class at SDBI on LMS.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Username/Email : ${email}`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password Link: <a  href="${domain}/auth/reset-password?reset_password_token=${token}"><button style="background-color: cornflowerblue;"> Get started </button> </a>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please reach out to the mentioned email ID for any query or issue.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email : info@sdbi.in`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });
}


function sendPasswordForUserEmail(email,password,fullname,callback){
  var text = `Hello ${fullname},`
  + '\nWelcome to Learning Management System.'
  + '\nYour Login details are' 
  + '\nUsername/Email : ' + email
  + '\nPassword : ' + password
  + '\n\nThank you,'
  + '\nLMS Support Team'
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Login Credentials for LMS',
    html : `Hello ${fullname},`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Login details are` 
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Username/Email :   ${email}`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password :  ${password}`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });

}

function evaluatorLoginEmail(email,password,fullname){
  var link = 'https://lms.sdbi.in'
  var text = `Hello ${fullname},`
  + '\nWelcome to Learning Management System.'
  + '\nYou have be chosen as a evaluator.'
  + '\nHere is how you log in and complete the evaluation.'
  + '\nYour Login details are' 
  + '\nUsername/Email : ' + email
  + '\nPassword : ' + password
  + '\n\nThank you,'
  + '\nLMS Support Team'
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Login Credentials for LMS',
    html : `Hello ${fullname},`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You have be chosen as a evaluator.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Here is how you log in and complete the evaluation.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Login details are <br>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Link :   ${link}`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Username/Email :   ${email}`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password :  ${password}`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });
}

function adminResetPassword(email,password,fullname,adminName){
  var text = `Hello ${fullname},`
  + '\nWelcome to Learning Management System. '
  + `\nYour Password has been reset by ${adminName}.`
  + `\nThe new password is ${password} .`
  + '\nIf it wasn\'t you, take no action or contact support.'
  + '\n\nThank you,'
  + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Login Credentials for LMS',
    html : `Hello ${fullname},`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Password has been reset by ${adminName}.` 
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The new password is: ${password} `
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });


}

function weeklyScheduleMsg(email,mobile){
  console.log(email);
  console.log(mobile);
  var text = `Dear Student,`
    + '\nLearning Management System. '
    + `\nYour weekly schedule has been updated. `
    + `\nPlease check LMS for further details.`
    + '\n\nThank you,'
    + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Weekkly Schedule',
    html : `Dear Student,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your weekly schedule has been updated.` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check LMS for further details.`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
      + `<br><br>Thank you,`
      + `<br>LMS Support Team`
  });
  
  var msg = "Dear Student,\n\nYour weekly schedule has been updated \n\nPlease check LMS for further details \n\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}
  
function deleteScheduleMsg(email,mobile,date,time){
  console.log(email);
  console.log(mobile);
  var text = `Dear Student,`
    + '\nLearning Management System. '
    + `\nA lecture has been cancelled on `
    + `${date} at ${time}`
    +`\nPlease check LMS for further details`
    + '\n\nThank you,'
    + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Cancel Lecture',
    html : `Dear Student,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A lecture has been cancelled on ${date} at ${time}` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check LMS for further details.`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
      + `<br><br>Thank you,`
      + `<br>LMS Support Team`
  });
    
  var msg = "Dear Student,\n\nA lecture has been cancelled on\n" + date + "\n" + time +"\n\nPlease check LMS for further details\n\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}
  
function updateScheduleMsg(email,mobile,date,time){
  var text = `Dear Student,`
    + '\nLearning Management System. '
    + `\nThere is an update in your schedule on `
    + `${date} at ${time}`
    +`\nPlease check LMS for further details`
    + '\n\nThank you,'
    + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Time table updated',
    html : `Dear Student,`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There is an update in your schedule on ${date} at ${time}` 
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check LMS for further details.`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
    + `<br><br>Thank you,`
    + `<br>LMS Support Team`
  });
  
  var msg = "Dear Student,\n\nThere is an update in your schedule on\n" + date + "\n" + time +"\n\nPlease check LMS for further details\n\nThank you.";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}

function sendNoticeMsgAndMail(email,mobile){
  var text = `Dear Student,`
    + '\nLearning Management System. '
    + `\nThere is a new notice which is issued. `
    + `\nKindly log in and check for updates.`
    + '\n\nThank you,'
    + '\nSupport team.';
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Added New Notice',
    html : `Dear Student,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There is a new notice which is issued.` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kindly log in and check for updates.`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
      + `<br><br>Thank you,`
      + `<br>LMS Support Team`
  });
  
  var msg = "Dear Student,\n\nThere is a new notice which is issued \n\nKindly log in and check for updates \n\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}

function sendAnnouncementEmail(email,mobile){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Announcement',
    html : `Dear Student,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your announcement has been updated.` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check LMS for further details.`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
      + `<br><br>Thank you,`
      + `<br>LMS Support Team`
  });
    
  var msg = "Dear Student,\n\nYour announcement has been updated \n\nPlease check LMS for further details \n\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}

function sendWebinarLink(email,mobile,link){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : 'Succesfully Registered',
    html : `Dear Student,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There is an update in your schedule on ${link} ` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check LMS for further details.`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click here to visit : ${`https://lms.sdbi.in`}.`
      + `<br><br>Thank you,`
      + `<br>LMS Support Team`
  });
  
  var msg = "Dear Student,\n\nlink for join webinar\n" + link  +"\n\n\nThank you.";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}

function attendanceReminder(teacher){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : teacher.email,
    from : 'updates@sdbi.in',
    Subject : 'Attendance Reminder',
    html : `Dear Faculty,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attendance has not been marked for your lecture of ${teacher.subject} conducted on ${teacher.date} from ${teacher.fromTime} to ${teacher.toTime}` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Request you to update the records before 6pm today.`
      + `<br><br>Thank you,`
  });
    
  var msg = "Dear Faculty,\nAttendance has not been marked for your lecture of "+ teacher.subject + " on "+ teacher.date + " from "+ teacher.fromTIme +" to " + teacher.toTime + ".\nRequest you to update the records before 6pm today.\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + teacher.mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}


function bigblueAttendenceMarked(details){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : details.email,
    from : 'updates@sdbi.in',
    Subject : `SDBI: BigBlueButton Attendence Marked!`,
    html : `Dear Sir,`
    +`<br>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BigBlueButton Attendence Marked...!`
    +`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; For Subject <b> ${details.meetingName}</b>`
    +`<br>&nbsp;&nbsp; Users List : `
    +`<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${details.data}`
    +`<br>`
    +`<br>`
    +`<br>`
    + `<br>&nbsp;&nbsp;Follow us on our social media for daily updates in the world of Data Science`
    + `<br>&nbsp;&nbsp;Instagram: ${`https://www.instagram.com/sdbiofficial/`}`
    + `<br>&nbsp;&nbsp;Facebook: ${`https://www.facebook.com/sdbi.official/`}`
    + `<br>&nbsp;&nbsp;Linkedin:  ${`https://www.linkedin.com/company/sdbiofficial`}`
    + `<br><br>Thanks and Regards,`
    + `<br>Team SDBI`
  });
}

function attendanceReminderOneDay(teacher){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : teacher.email,
    from : 'updates@sdbi.in',
    Subject : 'Attendance Reminder For Yesterday',
    html : `Dear Faculty,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attendance has not been marked for your lecture of ${teacher.subject} conducted on ${teacher.date} from ${teacher.fromTime} to ${teacher.toTime}` 
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;College will not be able to process the payment for the session due to failure to mark attendance.`
      + `<br><br>Thank you,`
  });
  
  var msg = "Dear Faculty,\nAttendance has not been marked for your lecture of "+ teacher.subject + " on "+ teacher.date + " from "+ teacher.fromTIme +" to " + teacher.toTime + ".\nCollege will not be able to process the payment for the session due to failure to mark attendance.\nThank you";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + teacher.mobile_no + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}





function markAttedanceTodaysReport(data){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : data.email,
    from : 'updates@sdbi.in',
    Subject : "Today's Attendance Report",
    html : `Dear Admin,`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to <b>Learning Management System.</b>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find Attachment of Today's Attendance Report Excel` 
      + `<br><br>Thank you,`,
    attachments: [
      data.attachments
    ]
  });
}

function webinarReply(email,mobile,topic,speaker,date,time,link,description){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : email,
    from : 'updates@sdbi.in',
    Subject : `SDBI: Registration for Webinar ${topic}`,
    html : `Dear Student,`
    +`<br>`
    + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Thank you for registering for the webinar <b> ${topic} </b> by <b> ${speaker} </b> on <b> ${date} </b> at <b> ${time}</b> .`
    + `<br>&nbsp;&nbsp;${description}`
    + `<br>&nbsp;&nbsp;<b><i>The link to join the webinar is :<u> ${link}</u></i></b>.`
    +`<br>`
    +`<br>`
    +`<br>`
    + `<br>&nbsp;&nbsp;In case of any queries, you can contact us on ${`+919372777617`} or ${`info@sdbi.in`}.`
    + `<br>&nbsp;&nbsp;Hope to see you soon at the webinar. Have a good day!`
    +`<br>`
    + `<br>&nbsp;&nbsp;Follow us on our social media for daily updates in the world of Data Science`
    + `<br>&nbsp;&nbsp;Instagram: ${`https://www.instagram.com/sdbiofficial/`}`
    + `<br>&nbsp;&nbsp;Facebook: ${`https://www.facebook.com/sdbi.official/`}`
    + `<br>&nbsp;&nbsp;Linkedin:  ${`https://www.linkedin.com/company/sdbiofficial`}`
    + `<br><br>Thanks and Regards,`
    + `<br>Team SDBI`
  });
  
}

function sheduleReminderToTeacher(teacher){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    to : teacher.email,
    from : 'updates@sdbi.in',
    Subject : 'Session Reminder of tomorrow',
    html : `Hi ${teacher.fullName},`
      + `<br>`
      + `<br>`
      + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is a reminder for your session tomorrow for "${teacher.subject}" at ${teacher.fromTime} .` 
      + `<br><br><br><br>Regards,`
    + `<br>Team SDBI`
  });
  
  var msg = "Hi " + teacher.fullName +",\nThis is a reminder for your session tomorrow for "+ teacher.subject+ "  at  "+ teacher.fromTime + ".\nRegards, \nTeam SDBI ";
  var message = urlencode(msg);
  var data = 'username=' + textLocal.username + '&hash=' + textLocal.hashForSMS + '&sender=' + textLocal.sender + '&numbers=' + teacher.mobile + '&message=' + message;
  var options = {
    host: textLocal.hostForSMS, path:'/send?' + data
  };
  console.log('options = ', options); 
  callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
      console.log("data: == "+ str);
    });
    response.on('end', function () {
      console.log("end : == " + str);
    });
  }
  console.log("ALL DATA");
  http.request(options,callback).end();
}

function ExamUpdateMail(email,title,name,description){
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    
      to : email,
      from : 'updates@sdbi.in',
      Subject : title,
      html : `Dear ${name},`
        + `<br><br>${description} `
        + `<br><br>Thank you,`,
    
  })
}

function StudentcancelLecture(data,reason){
  
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    
      to :data.email,
      from : 'updates@sdbi.in',
      Subject :' Lecture cancellation update',
      html : `Dear Student,`
        +`The lecture for ${data.subject} scheduled at ${data.date} ${data.fromTime}-${data.toTime} for ${data.courseName} ${data.batchName} has been cancelled by the faculty. `
        + `Reason : ${reason}`
        + `<br><br>Thank you,`,
    
  })
}

function AdmincancelLecture(data,reason){
  
  sendgrid.setApiKey(sengrid_key);
  sendgrid.send({
    
      to :['admin@sdbi.in','priyanka.bhosale@sdbi.in','info@sdbi.in','bobby@sdbi.in'],
      from : 'updates@sdbi.in',
      Subject :' Lecture cancellation update',
      html : `Dear Admin,`
        +`<br>The lecture for ${data.subject} scheduled at ${data.date} ${data.fromTime}-${data.toTime} for ${data.courseName} ${data.batchName} has been cancelled by the faculty.`
        + `<br>Reason : ${reason}`
        + `<br><br>Thank you,`,
    
  })
}
  
module.exports = {
  sendResetPasswordEmail,
  sendPasswordForUserEmail,
  adminResetPassword,
  weeklyScheduleMsg,
  deleteScheduleMsg,
  updateScheduleMsg,
  sendNoticeMsgAndMail,
  sendAnnouncementEmail,
  evaluatorLoginEmail,
  sendWebinarLink,
  attendanceReminder,
  attendanceReminderOneDay,
  markAttedanceTodaysReport,
  webinarReply,
  sheduleReminderToTeacher,
  bigblueAttendenceMarked,
  ExamUpdateMail,
  ActiveStudentLms,
  StudentcancelLecture,
  AdmincancelLecture
};

