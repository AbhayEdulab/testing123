LMSSERVER

Prerequisites:-

1. Node version 10.13.0
2. Npm version 6.4.1
3. Nvm (incase if you have different version of node for version control)

Installations:-

1. Git clone https://github.com/worldfellow/lmsserver.git
2. Run npm install in node terminal
3. npm start
4. Go to mongodb on local machine and add
   db.getCollection("users").insert( {
   "firstName" : "Admin",
   "lastName" : "Admin",
   "email" : "admin@admin.com",
   "fullName" : "Admin Admin",
   "role" : "admin",
   "salt" : "da21540446122894",
   "passwordHash" : "20d3e6b8d2a779f2f9e2e35542c4691764a5388367989997d365829bbd2fe362758868ebd1581451b44929cc70c9a0c88a4cbe1817fddd410e5d0d4f7daf3bc8",
   "doc_id" : null,
   "fileSize" : null,
   "imageName" : null,
   "type" : null,
   "status" : "active",
   "loginCount" : "1",
   "onboarding" : "no",
   "departmentName" : "",
   "courseName" : "",
   "calendarOnOff" : true,
   "academicYear" : "",
   "theme" : "default",
   "aadhar" : null,
   "address" : {
   "street" : "edulab",
   "city" : "mumbai",
   "zipCode" : "400093"
   },
   "age" : "",
   "altemail" : null,
   "altmobile" : null,
   "bankDetails" : {
   "bankName" : "",
   "accountNumber" : "",
   "IFSC" : "",
   "acType" : ""
   },
   "courseId" : null,
   "dateOfBirth" : null,
   "experience" : null,
   "gender" : null,
   "jobDescreption" : null,
   "linkedinlink" : null,
   "login" : "@admin",
   "mobile" : "9309848291",
   "panId" : "",
   "studentId" : "",
   "otp" : 1
   } );

### From Developers

Made with :heart: by [Edulab team](http://www.edulab.in/).
We're always happy to receive your feedback!
