var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var randomstring = require('randomstring');
var userSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
const cipher = require('../common/auth/cipherHelper');
var emailService = require('../../utils/emailService');
var notification_function = require('../../utils/function');
const Grid = require('gridfs-stream');
const logger = require('../../utils/logger');
const fileType = require('file-type');
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs;
var UserService = require('../common/user/userService');
const userService = new UserService();
var DivisionSchema = require('../../app/models/division');
var divisionModel = mongoose.model('Division');
const config = require('config');
const { filelink } = config.get('api');
var studentProfileDetailsSchema = require('../../app/models/studentProfileDetails');
var studentProfileDetailsModel = mongoose.model('StudentProfileDetails');
var studentEducationalDetailsSchema = require('../../app/models/studentEducationalDetails');
var studentEducationalDetailsModel = mongoose.model('StudentEducationalDetails');
var studentCertificationSchema = require('../../app/models/studentCertification');
var studentCertificationModel = mongoose.model('StudentCertification');

var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();


router.post('/setProfilePicture', async (req, res) => {
    gfs = Grid(connect.db);

    let { file } = req.files;
    let writeStream = gfs.createWriteStream({
        filename: `${file.name}`,
        mode: 'w',
        content_type: file.mimetype
    })

    writeStream.on('close', function (uploadedFile) {
        userModel.findOneAndUpdate({ _id: req.body.id }
            , {
                $set: {
                    doc_id: uploadedFile._id,
                    fileSize: uploadedFile.length,
                    imageName: uploadedFile.filename,
                    type: uploadedFile.contentType,

                }
            })
            .then(file => res.json({
                status: 200,
                message: "File was saved with success"
            }))
            .catch(err => {
                logger.error(`[*] Error, while uploading new files, with error: ${err}`);
                res.status(500).json({
                    message: `[*] Error while uploading new files, with error: ${err}`
                })
            })
    });
    writeStream.write(file.data);
    writeStream.end();
    if (file) {
        var user = await getId.getUserId(req.body.id, '')
        var dir = currentPath + "/src/public/Profile/" + user.id
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        var storage = multer.diskStorage({
            filename: function (req, file, callback) {
                console.log(file);
                callback(null, file.originalname);
                uploadFile = file.originalname;
            },
            destination: function (req, file, callback) {
                callback(null, dir);
            },
        });

        var upload = multer({
            storage: storage,
        }).single('file');
        upload(req, res, function (err, data) {
            fs.writeFile(dir + "/" + file.name, file.data, function (err) {
                if (err) {
                    console.log('Saved!', err);

                } else {
                    models.users.find({
                        where: {
                            id: user.id
                        }
                    }).then(user => {
                        if(user){
                            user.update({
                                fileSize: file.size,
                                imageName: file.name,
                                type: file.mimetype,
                            }).then(update => {
                                console.log("update")
                            })
                        }
                      
                    })
                }
            });
        })
    }
})

router.get('/getProfilePicture', (req, res) => {
    var flag = 'false';
    var data = {};

    let query = { _id: req.query.id };
    userModel.findOne(query, (err, files) => {

        if (files) {
            if (files.doc_id == null || files.doc_id == undefined || files.doc_id == '') {
                flag;
                res.json({
                    status: 404,
                    data: flag,
                    message: 'Image not found'
                })
            }
            else {
                data.fileLink = `${filelink}/api/usersData/download?document_id=${files.doc_id}`
                data.fileType = files.type
                data.fileDocId = files.doc_id;
                data.flag = 'true';
                res.json({
                    status: 200,
                    data: data
                })
            }
        }
        else {
        }
    })
})

router.get('/download', (req, res) => {
    gfs = Grid(connect.db);
    let {
        document_id
    } = req.query;
    gfs.findOne({
        _id: document_id
    }, (err, files) => {
        if (!files) {
            return res.status(404).send({
                message: 'File was not found'
            });
        }
        let data = [];
        let readstream = gfs.createReadStream({
            filename: files.filename
        });
        readstream.on('data', (chunk) => {
            data.push(chunk);
        });
        readstream.on('end', () => {
            data = Buffer.concat(data);
            let type = fileType(data);
            res.writeHead(200, {
                'Content-Type': type.mime,
                'Content-disposition': 'attachment; filename=' + files.filename + '.' + type.ext,
                'Content-Length': files.length
            });
            res.end(data);
        });
        readstream.on('error', (err) => {
            logger.error(`[*] Error, while downloading a file, with error:  ${err}`);
            res.status(400).send({
                message: `Error, while downloading a file, with error:  ${err}`
            });
        });
    });
});


router.put('/removeProfilePicture/:id', function (req, res) {
    removeProfilePicture(req)
    var query = { _id: req.params.id }
    userModel.findOneAndUpdate(query, {
        $set: {
            doc_id: null,
            imageName: null,
            fileSize: null,
            type: null
        }
    }, (err, someFiles) => {
        if (err) {
            console.err(err);
        }
        else {
            res.json({
                status: 200,
                message: 'Profile Picture Removed Succesfully!!!'
            })
        }
    });
});

async function removeProfilePicture(req) {
    var user = await getId.getUserId(req.params.id, '')
    models.users.find({
        where: {
            id: user.id
        }
    }).then(user => {
        if(user){
            user.update({
                fileSize: null,
                imageName: null,
                type: null,
            }).then(update => {
                console.log("update")
            })
        }
       
    })
}

router.get("/usersDivisionWise", function (req, res) {
    var divname = req.query.division
    var userData = [];
    divisionModel.find({
        divisionName: req.query.division
    })
        .then(function (division) {
            if (division.length > 0) {
                studentDivisionModel.find({
                    divisionId: division[0]._id
                }).populate('studentId').populate('divisionId', ['divisionName']).populate('batchId', ['batchName']).exec(function (err, studentDivision) {
                    userModel.find({
                        "role": req.query.user_type
                    }).then(function (users) {
                        studentDivision.forEach(user => {
                            if (user.studentId.doc_id == '') {
                                var user = {
                                    id: user._id,
                                    name: user.studentId.fullName,
                                    status: user.studentId.status,
                                    role: user.studentId.role,
                                    email: user.studentId.email,
                                    flag: '0'
                                }
                                userData.push(user);
                            }
                            else {
                                var usr = {
                                    id: user._id,
                                    name: user.studentId.fullName,
                                    picture: `${filelink}/api/usersData/download?document_id=${user.studentId.doc_id}`,
                                    status: user.studentId.status,
                                    role: user.studentId.role,
                                    email: user.studentId.email,
                                    flag: '1'
                                }
                                userData.push(usr);
                            }
                        })
                        res.send({
                            status: 200,
                            data: userData
                        })
                    })
                })
            }
        })
});


router.get("/users", function (req, res) {
    var user_id = req.query.user_id
    var flag;
    var userData = [];
    userModel.find({
        "role": req.query.user_type
    }).sort({ "fullName": 1 }).then(function (users) {
        users.forEach(user => {

            if (user.doc_id == '') {
                var user = {
                    id: user._id,
                    name: user.fullName,
                    status: user.status,
                    role: user.role,
                    email: user.email,
                    lastLoginDate: user.lastLoginDate,
                    lastLoginTime: user.lastLoginTime,
                    flag: '0'
                }
                userData.push(user);
            }
            else {
                var usr = {
                    id: user._id,
                    name: user.fullName,
                    picture: `${filelink}/api/usersData/download?document_id=${user.doc_id}`,
                    status: user.status,
                    role: user.role,
                    email: user.email,
                    lastLoginDate: user.lastLoginDate,
                    lastLoginTime: user.lastLoginTime,
                    flag: '1'
                }

                userData.push(usr);
            }
        })
        res.send({
            status: 200,
            data: userData
        })
    })

});

router.post("/setPasswordAndSendMail", function (req, res) {
    setPasswordAndSendMail(req)
    var email = req.body.email
    var randomStringPassword = randomString(10);
    const { salt, passwordHash } = cipher.saltHashPassword(randomStringPassword);
    userModel.findOneAndUpdate({ email: email }, { $set: { salt: salt, passwordHash: passwordHash } }, { new: true }, function (err, user) {
        if (err) {
            res.send({ status: 400 });
        } else {
            emailService.sendPasswordForUserEmail(email, randomStringPassword, user.fullName);
            res.send({ status: 200 });
        }
    })

});
async function setPasswordAndSendMail(req) {
    var email = req.body.email
    var randomStringPassword = randomString(10);
    const { salt, passwordHash } = cipher.saltHashPassword(randomStringPassword);
    models.users.find({
        where: {
            email: email
        }
    }).then(user => {
        user.update({
            salt: salt,
            passwordHash: passwordHash
        }).then(update => {
            console.log("update")
        })
    })
}
router.post("/sendnotification", function (req, res) {
    sendnotification(req)
    var user_id = req.body.user_id
    var role = req.body.role;
    userModel.find({
        _id: user_id
    }, function (err, user) {
        if (err) {
            res.send({ status: 400 });
        } else {
            var action = "Updated Email.";
            var updated_name = (role == ('admin' || 'subadmin')) ? 'admin' : user[0].fullName + '(' + user[0].email + ')';
            var notification_data = updated_name + " updated email id.";
            notification_function.notification(action, notification_data, '5ff2f26313e8ff112bf670fc');
            notification_function.notification(action, notification_data, '6006d6e64a3d296fec9c8744');
            res.send({ status: 200 });
        }
    })

});

router.get("/checkEmail", function (req, res) {
    userModel.findOne({
        "email": req.query.email
    }).then(function (users) {
        if (users) {
            res.send({
                status: 200,
            })
        } else {
            res.send({
                status: 400,
            })
        }
    })

});

router.post("/changePassword", function (req, res) {
    changePassword(req)
    var id = req.body.id;
    var password = req.body.password;
    const { salt, passwordHash } = cipher.saltHashPassword(password);
    userService.changePassword(id, salt, passwordHash).then(data => {
        var result = JSON.parse(data);
        if (result.ok == 1) {
            res.send({
                status: 200
            })
        } else {
            res.send({
                status: 400
            })
        }
    });

});
async function changePassword(req) {
    var user = await getId.getUserId(req.body.id, '')
    var password = req.body.password;
    const { salt, passwordHash } = cipher.saltHashPassword(password);
    models.users.find({
        where: {
            id: user.id
        }
    }).then(change => {
        if(change){
            change.update({
                salt: salt,
                password: passwordHash
            }).then(update => {
                console.log("update")
            })
        }
       
    })

}
router.post("/changeStatus/:id", function (req, res) {
    changeStatus(req)
    var id = req.params.id;
    var status = req.body.status;
    userModel.findOneAndUpdate({ _id: id }, { $set: { status: status } }, { new: true }, function (err, user) {
        if (err) {
            res.send({ status: 400 });
        } else {
            res.send({ status: 200 });
        }
    })

});
async function changeStatus(req) {
    var user = await getId.getUserId(req.params.id, '')
    var status = req.body.status;
    models.users.find({
        where: {
            id: user.id
        }
    }).then(change => {
        if(change){
            change.update({
                status: status
            }).then(update => {
                console.log("update")
            })
        }
       
    })
}
router.get("/getBankDetails", function (req, res) {
    var bankDetails = {};

    userModel.aggregate([{
        $addFields: {
            id: {
                $toString: "$_id"
            }
        }
    },
    {
        $match: {
            id: {
                $eq: req.query.user_id
            }
        }
    },
    {
        "$lookup": {
            "from": "teacherdetailsuploads",
            "localField": "id",
            "foreignField": "userId",
            "as": "details"
        }
    },
    {
        "$lookup": {
            "from": "teachereducationaldetails",
            "localField": "id",
            "foreignField": "userId",
            "as": "educationaldetails"
        }
    },
    ]).then(function (detailsData) {
        if (detailsData) {
            res.send({
                status: 200,
                data: detailsData,
            })
        }
    })

});


router.get('/getDivision', (req, res) => {
    divisionModel.find({

    }).exec(function (err, division) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else {
            res.json({
                status: 200,
                data: division
            });
        }
    })
})

router.put('/updateCount', function (req, res) {
    updateCount(req)
    var query = {
        _id: req.body._id
    },
        update = {
            $set: {
                loginCount: 1,
                onboarding: req.body.data
            }
        };

    userModel.updateMany(query, update, function (err, updateCount) {
        if (err) {
            console.error(err);
        } else {
            res.json({
                status: 200,
                data: updateCount
            });
        }

    });

});
async function updateCount(req) {
    var user = await getId.getUserId(req.body._id, '')
    models.users.find({
        where: {
            id: user.id
        }
    }).then(change => {
        if(change){
            change.update({
                loginCount: 1,
                onBoarding: req.body.data
            }).then(update => {
                console.log("update")
            }) 
        }
       
    })
}
router.post("/onboarding", function (req, res) {
    onboarding(req)
    userModel.findByIdAndUpdate({

        _id: req.query._id,

    }).then(function (users) {

        if (users) {
            users.update({
                onboarding: req.body.data
            }).then((updateData) => {
                res.send({
                    status: 200,
                })
            })

        } else {
            res.send({
                status: 400,
            })
        }
    })
});
async function onboarding(req) {
    var user = await getId.getUserId(req.query._id, '')
    models.users.find({
        where: {
            id: user.id
        }
    }).then(change => {
        if(change){
            change.update({
                onBoarding: req.body.data
            }).then(update => {
                console.log("update")
            })
        }
       
    })
}
router.put('/adminMakePasswords', (req, res) => {
    adminMakePasswords(req)
    var id = req.body.userid;
    var password = req.body.pass;
    var studentFullName = req.body.studentFullName;
    var adminName = req.body.adminName;
    var email = req.body.email;
    const { salt, passwordHash } = cipher.saltHashPassword(password);
    userService.changePassword(id, salt, passwordHash).then(data => {
        var result = JSON.parse(data);
        if (result.ok == 1) {
            emailService.adminResetPassword(email, password, studentFullName, adminName);
            res.json({
                status: 200,
                message: 'Successfully changed password'
            })
        }
        else {
            res.json({
                message: "Password wasn't updated"
            })
        }
    })
})
async function adminMakePasswords(req) {
    var user = await getId.getUserId(req.body.userid, '')
    var password = req.body.password;
    const { salt, passwordHash } = cipher.saltHashPassword(password);
    var studentFullName = req.body.studentFullName;
    var adminName = req.body.adminName;
    var email = req.body.email;
    models.users.find({
        where: {
            id: user.id
        }
    }).then(change => {
        if(change){
            change.update({
                salt: salt,
                password: passwordHash
            }).then(update => {
                console.log("update")
                // emailService.adminResetPassword(email,password,studentFullName,adminName);
    
            })
        }
      
    })

}
router.post('/addStudentProfileData', function (req, res) {
    addStudentProfileData(req)
    studentProfileDetailsModel.find({
        studentId: req.body.studentId
    }).then(function (studentData) {
        if (studentData != '') {
            var query = {
                studentId: req.body.studentId
            },
                update = {
                    $set: {
                        fullName: req.body.stuFullNameCtrl,
                        mobile_number: req.body.stuMobileNumberCtrl,
                        whatsapp_number: req.body.stuWaNumberCtrl,
                        email_id: req.body.stuEmailIdCtrl,
                        dob: req.body.stuDobCtrl,
                        mother_name: req.body.stuMotherNameCtrl,
                        mother_contact_number: req.body.stuMotherContactNumberCtrl,
                        father_name: req.body.stuFatherNameCtrl,
                        father_contact_number: req.body.stuFatherContactNumberCtrl,
                        home_address: req.body.stuHomeAddressCtrl,
                        city: req.body.stuCityCtrl,
                        state: req.body.stuStateCtrl,
                        country: req.body.stuCountryCtrl,
                        nationality: req.body.stuNationalityCtrl,
                        admission_category: req.body.admissionCategoryCtrl,
                        guardian_full_name: req.body.guardianFullNameCtrl,
                        guardian_email_id: req.body.guardianEmailIdCtrl,
                        guardian_mobile_number: req.body.guardianMobileNumberCtrl,
                    }
                };
            studentProfileDetailsModel.updateMany(query, update, function (err, student) {
                if (err) {
                    console.error("err" + err)
                    return res.status(400).json({
                        message: 'Bad Request'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: student
                    })
                }

            });
        } else {
            var studentProfileDetails = new studentProfileDetailsModel({
                studentId: req.body.studentId,
                fullName: req.body.stuFullNameCtrl,
                mobile_number: req.body.stuMobileNumberCtrl,
                whatsapp_number: req.body.stuWaNumberCtrl,
                email_id: req.body.stuEmailIdCtrl,
                dob: req.body.stuDobCtrl,
                mother_name: req.body.stuMotherNameCtrl,
                mother_contact_number: req.body.stuMotherContactNumberCtrl,
                father_name: req.body.stuFatherNameCtrl,
                father_contact_number: req.body.stuFatherContactNumberCtrl,
                home_address: req.body.stuHomeAddressCtrl,
                city: req.body.stuCityCtrl,
                state: req.body.stuStateCtrl,
                country: req.body.stuCountryCtrl,
                nationality: req.body.stuNationalityCtrl,
                admission_category: req.body.admissionCategoryCtrl,
                guardian_full_name: req.body.guardianFullNameCtrl,
                guardian_email_id: req.body.guardianEmailIdCtrl,
                guardian_mobile_number: req.body.guardianMobileNumberCtrl,
            });

            studentProfileDetails.save(function (err, result) {
                if (err) {
                    console.error(err);
                    return res.status(400).json({
                        message: 'Bad Request'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: result
                    })
                }

            });
        }
    })

});
async function addStudentProfileData(req) {
    var user = await getId.getUserId(req.body.studentId, '')
    models.studentprofiledetails.find({
        where: {
            studentId: user.id
        }
    }).then(studentData => {
        if (studentData != '') {
            studentData.update({
                fullName: req.body.stuFullNameCtrl,
                mobileNumber: req.body.stuMobileNumberCtrl,
                whatsappNumber: req.body.stuWaNumberCtrl,
                emailId: req.body.stuEmailIdCtrl,
                dob: req.body.stuDobCtrl,
                motherName: req.body.stuMotherNameCtrl,
                motherContactNumber: req.body.stuMotherContactNumberCtrl,
                fatherName: req.body.stuFatherNameCtrl,
                fatherContactNumber: req.body.stuFatherContactNumberCtrl,
                homeAddress: req.body.stuHomeAddressCtrl,
                city: req.body.stuCityCtrl,
                state: req.body.stuStateCtrl,
                country: req.body.stuCountryCtrl,
                nationality: req.body.stuNationalityCtrl,
                admissionCategory: req.body.admissionCategoryCtrl,
                guardianFullName: req.body.guardianFullNameCtrl,
                guardianEmailId: req.body.guardianEmailIdCtrl,
                guardianMobileNumber: req.body.guardianMobileNumberCtrl,
            })
        } else {
            models.studentprofiledetails.create({
                studentId: user.id,
                fullName: req.body.stuFullNameCtrl,
                mobileNumber: req.body.stuMobileNumberCtrl,
                whatsappNumber: req.body.stuWaNumberCtrl,
                emailId: req.body.stuEmailIdCtrl,
                dob: req.body.stuDobCtrl,
                motherName: req.body.stuMotherNameCtrl,
                motherContactNumber: req.body.stuMotherContactNumberCtrl,
                fatherName: req.body.stuFatherNameCtrl,
                fatherContactNumber: req.body.stuFatherContactNumberCtrl,
                homeAddress: req.body.stuHomeAddressCtrl,
                city: req.body.stuCityCtrl,
                state: req.body.stuStateCtrl,
                country: req.body.stuCountryCtrl,
                nationality: req.body.stuNationalityCtrl,
                admissionCategory: req.body.admissionCategoryCtrl,
                guardianFullName: req.body.guardianFullNameCtrl,
                guardianEmailId: req.body.guardianEmailIdCtrl,
                guardianMobileNumber: req.body.guardianMobileNumberCtrl,

            }).then(studentprofiledetails => {
                console.log("studentprofiledetails")
            })
        }
    })
}
router.post('/addEducationalData', function (req, res) {
    addEducationalData(req)
    studentEducationalDetailsModel.find({
        studentId: req.body.studentId
    }).then(function (eduData) {
        if (eduData != '') {
            var query = {
                studentId: req.body.studentId
            },

                update = {
                    $set: {
                        stream: req.body.streamCtrl,
                        exam1: req.body.exam1Ctrl,
                        year1: req.body.year1Ctrl,
                        board_university1: req.body.board_university1Ctrl,
                        percentage1: req.body.percentage1Ctrl,
                        exam2: req.body.exam2Ctrl,
                        year2: req.body.year2Ctrl,
                        board_university2: req.body.board_university2Ctrl,
                        percentage2: req.body.percentage2Ctrl,
                        exam3: req.body.exam3Ctrl,
                        year3: req.body.year3Ctrl,
                        board_university3: req.body.board_university3Ctrl,
                        percentage3: req.body.percentage3Ctrl,
                        exam4: req.body.exam4Ctrl,
                        year4: req.body.year4Ctrl,
                        board_university4: req.body.board_university4Ctrl,
                        percentage4: req.body.percentage4Ctrl,
                        exam5: req.body.exam5Ctrl,
                        year5: req.body.year5Ctrl,
                        board_university5: req.body.board_university5Ctrl,
                        percentage5: req.body.percentage5Ctrl,
                    }
                };

            studentEducationalDetailsModel.updateMany(query, update, function (err, student) {
                if (err) {
                    console.error("err" + err)
                    return res.status(400).json({
                        message: 'Bad Request'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: student
                    })
                }

            });
        } else {
            var studentEducationalDetails = new studentEducationalDetailsModel({
                studentId: req.body.studentId,
                stream: req.body.streamCtrl,
                exam1: req.body.exam1Ctrl,
                year1: req.body.year1Ctrl,
                board_university1: req.body.board_university1Ctrl,
                percentage1: req.body.percentage1Ctrl,
                exam2: req.body.exam2Ctrl,
                year2: req.body.year2Ctrl,
                board_university2: req.body.board_university2Ctrl,
                percentage2: req.body.percentage2Ctrl,
                exam3: req.body.exam3Ctrl,
                year3: req.body.year3Ctrl,
                board_university3: req.body.board_university3Ctrl,
                percentage3: req.body.percentage3Ctrl,
                exam4: req.body.exam4Ctrl,
                year4: req.body.year4Ctrl,
                board_university4: req.body.board_university4Ctrl,
                percentage4: req.body.percentage4Ctrl,
                exam5: req.body.exam5Ctrl,
                year5: req.body.year5Ctrl,
                board_university5: req.body.board_university5Ctrl,
                percentage5: req.body.percentage5Ctrl,
            });

            studentEducationalDetails.save(function (err, result) {
                if (err) {
                    console.error(err);
                    return res.status(400).json({
                        message: 'Bad Request'
                    });
                } else {
                    userModel.find({
                        _id: req.body.studentId
                    }).then(function (userdetails) {
                        if (userdetails) {
                            var action = "Added Education Details";
                            var notification_data = userdetails[0].fullName + " added profile details.";
                            notification_function.notification(action, notification_data, '5ff2f26313e8ff112bf670fc');
                            notification_function.notification(action, notification_data, '6006d6e64a3d296fec9c8744');
                        }
                    })
                    res.json({
                        status: 200,
                        data: result
                    })
                }

            });
        }
    })
});
async function addEducationalData(req) {
    var user = await getId.getUserId(req.body.studentId, '')
    models.studenteducationaldetails.find({
        where: {
            studentId: user.id
        }
    }).then(studentDetails => {
        if (studentDetails != '') {
            studentDetails.update({
                stream: req.body.streamCtrl,
                exam1: req.body.exam1Ctrl,
                year1: req.body.year1Ctrl,
                boardUniversity1: req.body.board_university1Ctrl,
                percentage1: req.body.percentage1Ctrl,
                exam2: req.body.exam2Ctrl,
                year2: req.body.year2Ctrl,
                boardUniversity2: req.body.board_university2Ctrl,
                percentage2: req.body.percentage2Ctrl,
                exam3: req.body.exam3Ctrl,
                year3: req.body.year3Ctrl,
                boardUniversity3: req.body.board_university3Ctrl,
                percentage3: req.body.percentage3Ctrl,
                exam4: req.body.exam4Ctrl,
                year4: req.body.year4Ctrl,
                boardUniversity4: req.body.board_university4Ctrl,
                percentage4: req.body.percentage4Ctrl,
                exam5: req.body.exam5Ctrl,
                year5: req.body.year5Ctrl,
                boardUniversity5: req.body.board_university5Ctrl,
                percentage5: req.body.percentage5Ctrl,
            }).then(update => {
                console.log("update")
            })
        } else {
            models.studenteducationaldetails.find({
                studentId: user.id,
                stream: req.body.streamCtrl,
                exam1: req.body.exam1Ctrl,
                year1: req.body.year1Ctrl,
                boardUniversity1: req.body.board_university1Ctrl,
                percentage1: req.body.percentage1Ctrl,
                exam2: req.body.exam2Ctrl,
                year2: req.body.year2Ctrl,
                boardUniversity2: req.body.board_university2Ctrl,
                percentage2: req.body.percentage2Ctrl,
                exam3: req.body.exam3Ctrl,
                year3: req.body.year3Ctrl,
                boardUniversity3: req.body.board_university3Ctrl,
                percentage3: req.body.percentage3Ctrl,
                exam4: req.body.exam4Ctrl,
                year4: req.body.year4Ctrl,
                boardUniversity4: req.body.board_university4Ctrl,
                percentage4: req.body.percentage4Ctrl,
                exam5: req.body.exam5Ctrl,
                year5: req.body.year5Ctrl,
                boardUniversity5: req.body.board_university5Ctrl,
                percentage5: req.body.percentage5Ctrl,
            }).then(data => {
                console.log("data")
            })
        }
    })
}
router.post('/uploadStudentCertification', (req, res) => {
    gfs = Grid(connect.db);
    let {
        file
    } = req.files;
    if (file == null || file == undefined || file == '') {
        res.json({
            status: 404,
            message: 'File not found'
        })
    } else {
        // flag = "true";
        let writeStream = gfs.createWriteStream({
            filename: `${file.name}`,
            mode: 'w',
            content_type: file.mimetype
        });
        writeStream.on('close', function (uploadedFile) {

            let certification = new studentCertificationModel({
                doc_id: uploadedFile._id,
                length: uploadedFile.length,
                name: uploadedFile.filename,
                type: uploadedFile.contentType,
                studentId: req.body.id,
                type_of_document: req.body.type_of_document

            });
            certification.save((err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    if (data) {
                        res.json({
                            status: 200
                        })
                    }

                }

            })
        });
        writeStream.write(file.data);
        writeStream.end();
    }
});

router.get('/getOtherCertificationDoc', function (req, res) {
    studentCertificationModel.find({
        studentId: req.query.userId,
        type_of_document: 'otherCertification'
    }).then(function (userDoc) {
        if (userDoc != '') {
            res.json({
                status: 200,
                data: userDoc
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })

});

router.get('/getWorkExperienceCertificationDoc', function (req, res) {
    studentCertificationModel.find({
        studentId: req.query.userId,
        type_of_document: 'workExperienceDoc'
    }).then(function (userDoc) {
        if (userDoc != '') {
            res.json({
                status: 200,
                data: userDoc
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })
});

router.get('/getPersonalInformation', function (req, res) {
    studentProfileDetailsModel.find({
        studentId: req.query.userId
    }).then(function (studentData) {
        if (studentData != '') {
            res.json({
                status: 200,
                data: studentData
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })
});

router.get('/getEducationalInformation', function (req, res) {
    studentEducationalDetailsModel.find({
        studentId: req.query.userId
    }).then(function (studentData) {
        if (studentData != '') {
            res.json({
                status: 200,
                data: studentData
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })
})

router.get('/getStudentProfileAndEducationalData', function (req, res) {
    var view_Data = {
        studentProfileData: [],
        studentEducationalData: [],
        studentCertification: []
    }
    studentProfileDetailsModel.find({
        studentId: req.query.userId
    }).then(function (studentProfile) {
        studentProfile.forEach(function (stuProfile) {
            view_Data.studentProfileData.push({
                studentProfileId: stuProfile._id,
                studentId: stuProfile.studentId,
                fullName: stuProfile.fullName,
                mobile_number: stuProfile.mobile_number,
                whatsapp_number: stuProfile.whatsapp_number,
                email_id: stuProfile.email_id,
                dob: stuProfile.dob,
                mother_name: stuProfile.mother_name,
                mother_contact_number: stuProfile.mother_contact_number,
                father_name: stuProfile.father_name,
                father_contact_number: stuProfile.father_contact_number,
                home_address: stuProfile.home_address,
                city: stuProfile.city,
                state: stuProfile.state,
                country: stuProfile.country,
                nationality: stuProfile.nationality,
                admission_category: stuProfile.admission_category,
                guardian_full_name: stuProfile.guardian_full_name ? stuProfile.guardian_full_name : 'NA',
                guardian_email_id: stuProfile.guardian_email_id ? stuProfile.guardian_email_id : 'NA',
                guardian_mobile_number: stuProfile.guardian_mobile_number ? stuProfile.guardian_mobile_number : 'NA'
            })
        })

        studentEducationalDetailsModel.find({
            studentId: req.query.userId
        }).then(function (studentEducational) {
            studentEducational.forEach(function (stuEducational) {
                view_Data.studentEducationalData.push({
                    studentEducationalId: stuEducational._id,
                    studentId: stuEducational.studentId,
                    stream: stuEducational.stream,
                    exam1: stuEducational.exam1,
                    year1: stuEducational.year1,
                    board_university1: stuEducational.board_university1,
                    percentage1: stuEducational.percentage1,
                    exam2: stuEducational.exam2,
                    year2: stuEducational.year2,
                    board_university2: stuEducational.board_university2,
                    percentage2: stuEducational.percentage2,
                    exam3: stuEducational.exam3,
                    year3: stuEducational.year3,
                    board_university3: stuEducational.board_university3,
                    percentage3: stuEducational.percentage3,
                    exam4: stuEducational.exam4 ? stuEducational.exam4 : 'NA',
                    year4: stuEducational.year4 ? stuEducational.year4 : 'NA',
                    board_university4: stuEducational.board_university4 ? stuEducational.board_university4 : 'NA',
                    percentage4: stuEducational.percentage4 ? stuEducational.percentage4 : 'NA',
                    exam5: stuEducational.exam5 ? stuEducational.exam5 : 'NA',
                    year5: stuEducational.year5 ? stuEducational.year5 : 'NA',
                    board_university5: stuEducational.board_university5 ? stuEducational.board_university5 : 'NA',
                    percentage5: stuEducational.percentage5 ? stuEducational.percentage5 : 'NA',
                })
            })

            studentCertificationModel.find({
                studentId: req.query.userId
            }).then(function (documents) {
                documents.forEach(function (doc) {
                    view_Data.studentCertification.push({
                        name: doc.name,
                        doc_id: doc.doc_id,
                        type: doc.type
                    })
                })

                setTimeout(() => {
                    res.json({
                        status: 200,
                        message: 'Dashboard success',
                        data: view_Data
                    });
                }, 1500);
            });

        });
    })

});

router.delete('/deleteDoc', function (req, res) {
    var query = {
        _id: req.query.certificationId,
        studentId: req.query.userId
    }
    studentCertificationModel.find({
        _id: req.query.certificationId
    }).exec(function (err, deletedoc) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else if (deletedoc != '' || deletedoc != null || deletedoc != 'undefined' || deletedoc != undefined) {
            studentCertificationModel.findOneAndRemove(query).exec(function (err, doc) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: doc,
                        message: 'doc Deleted Successfully!!!....'
                    });
                }

            });

        }
    });


});


function randomString(length) {
    if (length == undefined) {
        return randomstring.generate();
    } else {
        return randomstring.generate(length);
    }
}
module.exports = router;