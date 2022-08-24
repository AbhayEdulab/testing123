var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const fs = require('fs');
const Grid = require('gridfs-stream');
const connect = mongoose.connection;
Grid.mongo = mongoose.mongo;
const path = require('path');
const logger = require('../../utils/logger');
const fileType = require('file-type');
var gfs;
const Upload = require('../../app/models/uploads');
var UserSchema = require('../../app/models/user');
var userModel = mongoose.model('User');
var JobListSchema = require('../../app/models/jobList');
var jobListModel = mongoose.model('JobList');
var eduactionalProfilesSchema = require('../../app/models/educationalProfiles')
var educationalProfilesModel = mongoose.model('educationalProfiles')
var studentProfileDetailsSchema = require('../../app/models/studentProfileDetails');
var studentProfileDetailsModel = mongoose.model('StudentProfileDetails');
var studentEducationCertificatesSchema = require('../../app/models/studentEducationCertificates');
var studentEducationCertificatesModel = mongoose.model('studentEducationCertificates');
var studentAchievmentCertificatesSchema = require('../../app/models/studentAchievmentCertificates');
var studentAchievmentCertificatesModel = mongoose.model('studentAchievmentCertificates');
var studentExpSchema = require('../../app/models/studentExp');
var studentExpModel = mongoose.model('studentExp')
var studentProjectsSchema = require('../../app/models/studentProjects');
var studentProjectsModel = mongoose.model('studentProjects')
var jobsAppliedSchema = require('../../app/models/jobsApplied')
var jobsAppliedModel = mongoose.model('jobsApplied')
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

router.post('/saveJobDetails', function (req, res) {
    saveJobDetails(req.body)
    if (req.body.id) {
        var query = {
            _id: req.body.id
        },
            update = {
                $set: {
                    companyName: req.body.companyName,
                    jobTitle: req.body.JobTitle,
                    jobDescription: req.body.jobDescription,
                    packageRange: req.body.package,
                    websiteLink: req.body.websiteLink,
                    addedBy: req.body.addedBy,
                    addedBy_Id: req.body.addedBy_Id
                }
            };
        jobListModel.findOneAndUpdate(query, update, function (err, job) {
            if (job) {
                res.send({
                    data: job,
                    status: 200,
                })
            } else {
                res.send({
                    status: 400,
                })
            }
        })
    } else {
        jobListModel.create({

            companyName: req.body.companyName,
            jobTitle: req.body.JobTitle,
            jobDescription: req.body.jobDescription,
            packageRange: req.body.package,
            websiteLink: req.body.websiteLink,
            addedBy: req.body.addedBy,
            addedBy_Id: req.body.addedBy_Id
        }, (err, data) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    data: data,
                    status: 200
                })
            }
        })
    }
});
async function saveJobDetails(body) {
    var user = await getId.getUserId(body.addedBy_Id, '')
    if (body.id) {
        jobListModel.find({
            _id: body.id
        }).then(joblist => {
            if (joblist) {
                models.joblist.find({
                    companyName: joblist.companyName,
                    jobTitle: joblist.jobTitle,
                    packageRange: joblist.packageRange,
                    jobDescription: joblist.jobDescription,
                    websiteLink: joblist.websiteLink
                }).then(data => {
                    if(data){
                        data.update({
                            companyName: body.companyName,
                            jobTitle: body.JobTitle,
                            jobDescription: body.jobDescription,
                            packageRange: body.package,
                            websiteLink: body.websiteLink,
                            addedById: user.id
                        }).then(updateJob => {
                            console.log("updateJob", updateJob)
                        })
                    }
                  
                })
            }

        })
    } else {
        models.joblist.create({
            companyName: body.companyName,
            jobTitle: body.JobTitle,
            jobDescription: body.jobDescription,
            packageRange: body.package,
            websiteLink: body.websiteLink,
            addedById: user.id
        }).then(JobData => {
            console.log("JobData", JobData)
        })
    }
}
router.get('/getJobDetails', function (req,res){
    jobListModel.find({
        _id : req.query.job_id,
    }).then(function (job) {
        if (job) {
            res.send({
                status: 200,
                data: job
            })
        } else {
            res.send({
                status: 400
            })

        }
    });
})

router.get('/getAllJobs', function (req, res) {
    if(req.query.role == 'admin' || req.query.role == 'subadmin'){
        jobListModel.aggregate([
            {
                $addFields: {
                  id: {
                    $toString: "$_id"
                  }
                }
              },
              {
                "$lookup": {
                  "from": "jobsapplieds",
                  "localField": "id",
                  "foreignField": "jobId",
                  "as": "appliedUsers"
                }
              },
        ]).then(function (job) {
            if (job) {
                res.send({
                    status: 200,
                    data: job
                })
            } else {
                res.send({
                    status: 400
                })
    
            }
        });
    }else if(req.query.role == 'student'){
        jobListModel.aggregate([
             {
                $addFields: {
                  jobId: {
                    $toString: "$_id"
                  },
                }
              },
              {
                "$lookup": {
                  "from": "jobsapplieds",
                  let: {
                    jobId: "$jobId",
                    studentId: req.query.userId,
                    
                  },
                  pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$jobId", "$$jobId"],
                            },
                            {
                                $eq: ["$studentId", "$$studentId"],
                              }
                        ]
                        }
                    }
                  }],                  
                  as: "appliedUsers"
                }
              },
        ]).then(function (job) {
            if (job) {
                res.send({
                    status: 200,
                    data: job
                })
            } else {
                res.send({
                    status: 400
                })
    
            }
        });
    }else{
        jobListModel.aggregate([
            {
                $match: {
                    addedBy_Id: {
                    $eq: req.query.userId
                  }
                }
              },
            {
                $addFields: {
                  id: {
                    $toString: "$_id"
                  }
                }
              },
              {
                "$lookup": {
                  "from": "jobsapplieds",
                  "localField": "id",
                  "foreignField": "jobId",
                  "as": "appliedUsers"
                }
              },
        ]).then(function (job) {  
            if (job) {
                res.send({
                    status: 200,
                    data: job
                })
            } else {
                res.send({
                    status: 400
                })
    
            }
        });
    }
});

router.get("/getAllRecruiters", function (req, res) {
    userModel.find({
        "role": 'recruiter'
    }).then(function (recruiters) {
        if (recruiters) {
            res.send({
                status: 200,
                data: recruiters
            })
        } else {
            res.send({
                status: 400
            })

        }
    });
})

router.delete('/deleteJob', function (req, res) {
    var query = {
        _id: req.query.job_id
    }
    jobListModel.find({
        _id: req.query.job_id
    }).exec(function (err, deleteJob) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else if (deleteJob != '' || deleteJob != null || deleteJob != 'undefined' || deleteJob != undefined) {
            jobListModel.findOneAndRemove(query).exec(function (err, job) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: job,
                        message: 'Job Deleted Successfully!!!....'
                    });
                }

            });

        }
    });

});

router.get('/getStudentProfileData', function (req, res) {
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

router.post('/updateStudentProfileData', function (req, res) {
    updateStudentProfileData(req)
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
                        father_name: req.body.stuFatherNameCtrl,
                        admission_category: req.body.admissionCategoryCtrl,
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
async function updateStudentProfileData(req) {
    userModel.find({
        _id: req.body.studentId
    }).then(user => {
        models.users.find({
            where: {
                email: user[0].email
            }
        }).then(async studentData => {
                models.studentprofiledetails.find({
                    where: {
                        studentId: studentData.id
                    }
                }).then(async profiledetails => {
                    if(profiledetails != null){
                        profiledetails.update({
                            mobileNumber: req.body.stuMobileNumberCtrl,
                            whatsappNumber: req.body.stuWaNumberCtrl,
                            emailId: req.body.stuEmailIdCtrl,
                            dob: req.body.stuDobCtrl,
                            motherName: req.body.stuMotherNameCtrl,
                            fatherName: req.body.stuFatherNameCtrl,
                            admissionCategory: req.body.admissionCategoryCtrl,
                        }).then(updateprofiledetails => {
                            console.log('updateprofiledetails')
                        })
                    }else {
                        var user = await getId.getUserId(req.body.studentId, '')
                        models.studentprofiledetails.create({
                            studentId: user.id,
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
                        }).then(profiledetails => {
                            console.log("Createprofiledetails")
                        })
                    
                    }
                  
                })
           
               
        })
    })

}
router.post('/updateEducationalProfile', function (req, res) {
    updateEducationalProfile(req)
    educationalProfilesModel.find({
        studentId: req.body.studentId
    }).then(function (studentData) {
        if (studentData != '') {
            var query = {
                studentId: req.body.studentId
            }
            if (req.body.type == 'Matric') {
                var update = {
                    $set: {
                        matriculation: {
                            matricInstituteName: req.body.matriculation.matricInstituteName,
                            matricBoard_uni: req.body.matriculation.matricBoard_uni,
                            matricEducationType: req.body.matriculation.matricEducationType,
                            matricScore: req.body.matriculation.matricScore,
                            matricStartDate: req.body.matriculation.matricStartDate,
                            matricEndDate: req.body.matriculation.matricEndDate,
                        }
                    }
                }
            }
            else if (req.body.type == 'Inter') {
                var update = {
                    $set: {
                        intermediate: {
                            interInstituteName: req.body.intermediate.interInstituteName,
                            interBoard_uni: req.body.intermediate.interBoard_uni,
                            interEducationType: req.body.intermediate.interEducationType,
                            interSpecialization: req.body.intermediate.interSpecialization,
                            interScore: req.body.intermediate.interScore,
                            interStartDate: req.body.intermediate.interStartDate,
                            interEndDate: req.body.intermediate.interEndDate,
                        }
                    }
                }

            }
            else if (req.body.type == 'Curr') {
                var update = {
                    $set: {
                        currentCourse: {
                            currInstituteName: req.body.currentCourse.currInstituteName,
                            currBoard_uni: req.body.currentCourse.currBoard_uni,
                            currEducationType: req.body.currentCourse.currEducationType,
                            currSpecialization: req.body.currentCourse.currSpecialization,
                            currSubjects: req.body.currentCourse.currSubjects,
                            currStartDate: req.body.currentCourse.currStartDate,
                            currEndDate: req.body.currentCourse.currEndDate,
                        }
                    }
                }

            }
            educationalProfilesModel.updateMany(query, update, function (err, student) {
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
            var educationalProfiles = new educationalProfilesModel({
                studentId: req.body.studentId,
                matriculation: {
                    matricInstituteName: req.body.matriculation.matricInstituteName,
                    matricBoard_uni: req.body.matriculation.matricBoard_uni,
                    matricEducationType: req.body.matriculation.matricEducationType,
                    matricScore: req.body.matriculation.matricScore,
                    matricStartDate: req.body.matriculation.matricStartDate,
                    matricEndDate: req.body.matriculation.matricEndDate,
                },
                intermediate: {
                    interInstituteName: req.body.intermediate.interInstituteName,
                    interBoard_uni: req.body.intermediate.interBoard_uni,
                    interEducationType: req.body.intermediate.interEducationType,
                    interSpecialization: req.body.intermediate.interSpecialization,
                    interScore: req.body.intermediate.interScore,
                    interStartDate: req.body.intermediate.interStartDate,
                    interEndDate: req.body.intermediate.interEndDate,
                },
                currentCourse: {
                    currInstituteName: req.body.currentCourse.currInstituteName,
                    currBoard_uni: req.body.currentCourse.currBoard_uni,
                    currEducationType: req.body.currentCourse.currEducationType,
                    currSpecialization: req.body.currentCourse.currSpecialization,
                    currSubjects: req.body.currentCourse.currSubjects,
                    currStartDate: req.body.currentCourse.currStartDate,
                    currEndDate: req.body.currentCourse.currEndDate,
                }


            });

            educationalProfiles.save(function (err, result) {
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
async function updateEducationalProfile(req) {
    var user = await getId.getUserId(req.body.studentId,'')
    models.educationalprofiles.find({
        where: {
            studentId: user.id
        }
    }).then(studentData => {
        if (studentData != null) {
            if (req.body.type == 'Matric') {
                studentData.update({
                    matriculation: {
                        matricInstituteName: req.body.matriculation.matricInstituteName,
                        matricBoard_uni: req.body.matriculation.matricBoard_uni,
                        matricEducationType: req.body.matriculation.matricEducationType,
                        matricScore: req.body.matriculation.matricScore,
                        matricStartDate: req.body.matriculation.matricStartDate,
                        matricEndDate: req.body.matriculation.matricEndDate,
                    }
                })
            } else if (req.body.type == 'Matric') {
                studentData.update({
                    intermediate: {
                        interInstituteName: req.body.intermediate.interInstituteName,
                        interBoard_uni: req.body.intermediate.interBoard_uni,
                        interEducationType: req.body.intermediate.interEducationType,
                        interSpecialization: req.body.intermediate.interSpecialization,
                        interScore: req.body.intermediate.interScore,
                        interStartDate: req.body.intermediate.interStartDate,
                        interEndDate: req.body.intermediate.interEndDate,
                    }
                })
            } else if (req.body.type == 'Curr') {
                studentData.update({
                    currentCourse: {
                        currInstituteName: req.body.currentCourse.currInstituteName,
                        currBoard_uni: req.body.currentCourse.currBoard_uni,
                        currEducationType: req.body.currentCourse.currEducationType,
                        currSpecialization: req.body.currentCourse.currSpecialization,
                        currSubjects: { subjectNames: req.body.currentCourse.currSubjects.subjectName, },
                        currScore: req.body.currentCourse.currScore,
                        currStartDate: req.body.currentCourse.currStartDate,
                        currEndDate: req.body.currentCourse.currEndDate,
                    }
                })
            }
        } else {
            models.educationalprofiles.create({
                studentId: user.id,
                matriculation: {
                    matricInstituteName: req.body.matriculation.matricInstituteName,
                    matricBoard_uni: req.body.matriculation.matricBoard_uni,
                    matricEducationType: req.body.matriculation.matricEducationType,
                    matricScore: req.body.matriculation.matricScore,
                    matricStartDate: req.body.matriculation.matricStartDate,
                    matricEndDate: req.body.matriculation.matricEndDate,
                },
                intermediate: {
                    interInstituteName: req.body.intermediate.interInstituteName,
                    interBoard_uni: req.body.intermediate.interBoard_uni,
                    interEducationType: req.body.intermediate.interEducationType,
                    interSpecialization: req.body.intermediate.interSpecialization,
                    interScore: req.body.intermediate.interScore,
                    interStartDate: req.body.intermediate.interStartDate,
                    interEndDate: req.body.intermediate.interEndDate,
                },
                currentCourse: {
                    currInstituteName: req.body.currentCourse.currInstituteName,
                    currBoard_uni: req.body.currentCourse.currBoard_uni,
                    currEducationType: req.body.currentCourse.currEducationType,
                    currSpecialization: req.body.currentCourse.currSpecialization,
                    currSubjects: [{ subjectName: req.body.currentCourse.currSubjects.subjectName }],
                    currScore: req.body.currentCourse.currScore,
                    currStartDate: req.body.currentCourse.currStartDate,
                    currEndDate: req.body.currentCourse.currEndDate,
                }

            }).then(data => {
            })
        }
    })

}
router.get('/getEducationProfileData', function (req, res) {
    educationalProfilesModel.find({
        studentId: req.query.userId
    }).then(function (eduProfileData) {
        if (eduProfileData != '') {
            res.json({
                status: 200,
                data: eduProfileData
            });
        } else {
            res.json({
                status: 400,
                message: 'bad request'
            });
        }
    })
})

router.post('/uploadEduCertificates',async  (req, res) => {
    gfs = Grid(connect.db);
    let { file } = req.files;

    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    studentEducationCertificatesModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                studentEducationCertificatesModel.find({
                    studentId: req.body.studentId,
                    document_category: req.body.category,
                }).then(function (details) {
                    if (details == null || details == '' || details == 'undefined') {
                        studentEducationCertificatesModel.create({
                            studentId: req.body.studentId,
                            doc_id: uploadedFile._id,
                            file_type: uploadedFile.contentType,
                            document_name: uploadedFile.filename,
                            document_category: req.body.category,
                            curriculumName: req.body.type,
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
                    } else {
                        var query = {
                            studentId: req.body.studentId,
                            document_category: req.body.category,
                            curriculumName: req.body.type,
                        },
                            update = {
                                $set: {
                                    doc_id: uploadedFile._id,
                                    file_type: uploadedFile.contentType,
                                    document_name: uploadedFile.filename,
                                    document_category: req.body.category,
                                    curriculumName: req.body.type,
                                }
                            };
                        studentEducationCertificatesModel.findOneAndUpdate(query, update, function (req, studentData) {
                            res.json({
                                status: 200,
                                data: studentData
                            });

                        })

                    }
                })


            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })

    var user = await getId.getUserId(req.body.studentId,'')
    models.studenteducationcertification.find({
        where: {
            studentId: user.id,
            documentCategory: req.body.category
        }
    }).then(details => {
        if (details == null || details == '' || details == 'undefined') {
            models.studenteducationcertification.create({
                studentId: user.id,
                fileType: file.mimetype,
                documentName: file.name,
                documentCategory: req.body.category,
                curriculumName: req.body.type,
            }).then(educationcertificates => {
                if (file) {
                    var currentPath = process.cwd();
                    var dir = currentPath + '/src/public/EducationCertificates/' + educationcertificates.id + '/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    var storage = multer.diskStorage({
                        filename: function (req, file, callback) {
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
                        fs.writeFile(dir + file.name, file.data, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });

                    })
                }
                // res.json({
                //     status : 200,
                //     data : educationcertificates
                // })
            })
        } else {
            details.update({
                fileType: file.mimetype,
                documentName: file.name,
                documentCategory: req.body.category,
                curriculumName: req.body.type,
            }).then(educationcertificates => {
                if (file) {
                    var currentPath = process.cwd();
                    var dir = currentPath + '/src/public/EducationCertificates/' + educationcertificates.id + '/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    var storage = multer.diskStorage({
                        filename: function (req, file, callback) {
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
                        fs.writeFile(dir + file.name, file.data, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });

                    })
                }
            })
        }
    })
});


router.post('/uploadAchivementCertificates',async (req, res) => {
    gfs = Grid(connect.db);
    let { file } = req.files;
    var number = 1;
    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }
    studentAchievmentCertificatesModel.countDocuments({}, function (error, numOfDocs) {
        var num = Number(numOfDocs += 1)
        number = pad(num, 3);

        const extension = path.extname(file.name);
        const justFileName = path.basename(file.name, extension);
        const filename = justFileName + "-" + number + extension;
        if (filename) {
            let writeStream = gfs.createWriteStream({
                filename: `${filename}`,
                mode: 'w',
                content_type: file.mimetype
            })

            writeStream.on('close', function (uploadedFile) {
                studentAchievmentCertificatesModel.find({
                    studentId: req.body.studentId,
                    document_category: req.body.category,
                    achievementName: req.body.AchievementName,
                }).then(function (details) {
                    if (details == null || details == '' || details == 'undefined') {
                        studentAchievmentCertificatesModel.create({
                            studentId: req.body.studentId,
                            doc_id: uploadedFile._id,
                            file_type: uploadedFile.contentType,
                            document_name: uploadedFile.filename,
                            document_category: req.body.category,
                            curriculumName: req.body.type,
                            achievementName: req.body.AchievementName,
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
                    } else {
                        var query = {
                            studentId: req.body.studentId,
                            document_category: req.body.category,
                            curriculumName: req.body.type,
                            achievementName: req.body.AchievementName,
                        },
                            update = {
                                $set: {
                                    doc_id: uploadedFile._id,
                                    file_type: uploadedFile.contentType,
                                    document_name: uploadedFile.filename,
                                    document_category: req.body.category,
                                    curriculumName: req.body.type,
                                    achievementName: req.body.AchievementName,
                                }
                            };
                        studentAchievmentCertificatesModel.findOneAndUpdate(query, update, function (req, studentData) {
                            res.json({
                                status: 200,
                                data: studentData
                            });

                        })

                    }
                })


            });
            writeStream.write(file.data);
            writeStream.end();
        }
    })
    var user = await getId.getUserId(req.body.studentId,'')
    models.studentachievmentcertificates.find({
        where: {
            studentId: user.id,
            documentCategory: req.body.category,
            curriculumName: req.body.type,
            achievementName: req.body.AchievementName,
        }
    }).then(details => {
        if (details == null || details == '' || details == 'undefined') {
            models.studentachievmentcertificates.create({
                studentId:user.id,
                fileType: file.mimetype,
                documentName: file.name,
                documentCategory: req.body.category,
                curriculumName: req.body.type,
                achievementName: req.body.AchievementName
            }).then(achievement => {
                if (file) {
                    var currentPath = process.cwd();
                    var dir = currentPath + '/src/public/AchievmentCertificates/' + achievement.id + '/';
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
                        fs.writeFile(dir + file.name, file.data, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });

                    })
                }
                // res.json({
                //     status : 200,
                //     data:file
                // })
            })
        } else {
            details.update({
                fileType: file.mimetype,
                documentName: file.name,
                documentCategory: req.body.category,
                curriculumName: req.body.type,
                achievementName: req.body.AchievementName
            }).then(update => {
                console.log("update")
                if (file) {
                    var currentPath = process.cwd();
                    var dir = currentPath + '/src/public/AchievmentCertificates/' + update.id + '/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    var storage = multer.diskStorage({
                        filename: function (req, file, callback) {
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
                        fs.writeFile(dir + file.name, file.data, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });

                    })
                }
                // res.json({
                //     stauts:200,
                //     data:update
                // })

            })
        }
    })

});

router.post('/addStudentExp', function (req, res) {
    addStudentExp(req)
    studentExpModel.find({
        studentId: req.body.studentId,
    }).then(function (data) {
        if (data != "") {
            var query = {
                studentId: req.body.studentId
            },
                update = {
                    $set: {
                        companyName: req.body.companyName,
                        jobTitle: req.body.jobTitle,
                        location: req.body.location,
                        position: req.body.position,
                        jobFunction: req.body.jobFunction,
                        description: req.body.description,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                    }
                };
            studentExpModel.findOneAndUpdate(query, update, function (err, job) {
                if (job) {
                    res.send({
                        data: job,
                        status: 200,
                    })
                } else {
                    res.send({
                        status: 400,
                    })
                }
            })
        } else {
            studentExpModel.create({
                studentId: req.body.studentId,
                companyName: req.body.companyName,
                jobTitle: req.body.jobTitle,
                location: req.body.location,
                position: req.body.position,
                jobFunction: req.body.jobFunction,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }, (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    res.json({
                        data: data,
                        status: 200
                    })
                }
            })
        }
    })
});
async function addStudentExp(req) {
    var user = await getId.getUserId(req.body.studentId,'')
    models.studentexp.find({
        where: {
            studentId:user.id
        }
    }).then(studentData => {
        if (studentData != null) {
            studentData.update({
                companyName: req.body.companyName,
                jobTitle: req.body.jobTitle,
                location: req.body.location,
                position: req.body.position,
                jobFunction: req.body.jobFunction,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }).then(data => {
                console.log("data")
            })
        } else {
            models.studentexp.create({
                studentId: user.id,
                companyName: req.body.companyName,
                jobTitle: req.body.jobTitle,
                location: req.body.location,
                position: req.body.position,
                jobFunction: req.body.jobFunction,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }).then(studentexp => {
                console.log("studentexp")
            })
        }
    })
}
router.get('/getStudentExpData', function (req, res) {
    studentExpModel.find({
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

router.post('/addProjects', function (req, res) {
    addProject(req)
    if (req.body.id != '' && req.body.id != null && req.body.id != undefined && req.body.id != 'undefined' && req.body.id != "null") {
        studentProjectsModel.find({
            _id: req.body.id
        }).then(function (data) {
            if (data != '') {
                var query = {
                    _id: req.body.id,
                    studentId: req.body.studentId,
                }
                var update = {
                    $set: {
                        projectTitle: req.body.projectTitle,
                        projectCat: req.body.projectCat,
                        problemStatement: req.body.problemStatement,
                        domain: req.body.domain,
                        description: req.body.description,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                    }
                }
                studentProjectsModel.findOneAndUpdate(query, update, function (err, job) {
                    if (job) {
                        res.send({
                            data: job,
                            status: 200,
                        })
                    } else {
                        res.send({
                            status: 400,
                        })
                    }
                })

            }
        })
    } else {
        studentProjectsModel.create({
            studentId: req.body.studentId,
            projectTitle: req.body.projectTitle,
            projectCat: req.body.projectCat,
            problemStatement: req.body.problemStatement,
            domain: req.body.domain,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        }, (err, data) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    data: data,
                    status: 200
                })
            }
        })
    }
})
async function addProject(req) {
    if (req.body.id != '' && req.body.id != null && req.body.id != undefined && req.body.id != 'undefined' && req.body.id != "null") {
        studentProjectsModel.find({
            _id: req.body.id
        }).then(async project => {
            var user = await getId.getUserId(project.studentId,'')
            models.studentprojects.find({
                studentId: user.id,
                projectTitle: project[0].projectTitle,
                projectCat: project[0].projectCat,
                domain: project[0].domain
            }).then(details => {
                if (details != '') {
                    details.update({
                        projectTitle: req.body.projectTitle,
                        projectCat: req.body.projectCat,
                        problemStatement: req.body.problemStatement,
                        domain: req.body.domain,
                        description: req.body.description,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                    }).then(update => {
                        console.log("update")
                    })
                }
            })
        })
    } else {
        var User = await getId.getUserId(req.body.studentId,'')
        models.studentprojects.create({
            studentId: User.id,
            projectTitle: req.body.projectTitle,
            projectCat: req.body.projectCat,
            problemStatement: req.body.problemStatement,
            domain: req.body.domain,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        }).then(data => {
            console.log("data")
        })
    }
}
router.get('/getEduWiseProjects', function (req, res) {
    studentProjectsModel.find({
        studentId: req.query.userId,
        projectCat: req.query.cat,
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

router.get('/getEduWiseAchievments', function (req, res) {
    studentAchievmentCertificatesModel.find({
        studentId: req.query.userId,
        document_category: req.query.cat,
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

router.delete('/deleteAchievements', function (req, res) {
    var query = {
        _id: req.query.ach_id
    }
    studentAchievmentCertificatesModel.find({
        _id: req.query.ach_id
    }).exec(function (err, deleteAch) {
        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else if (deleteAch != '' || deleteAch != null || deleteAch != 'undefined' || deleteAch != undefined) {
            studentAchievmentCertificatesModel.findOneAndRemove(query).exec(function (err, job) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error!!!....'
                    });
                } else {
                    res.json({
                        status: 200,
                        data: job,
                        message: 'Achievment Deleted Successfully!!!....'
                    });
                }

            });

        }
    });

});

router.post('/saveApplied', function (req, res) {
    saveApplied(req)
    jobsAppliedModel.find({
        studentId: req.body.studentId,
        jobId: req.body.jobId,
    }).then(data => {
        if (data != '') {
            res.json({
                message: "You have already applied for the Job.",
                status: 400,
            })
        }
        else {
            jobsAppliedModel.create({
                studentId: req.body.studentId,
                jobId: req.body.jobId,
                status: req.body.status,
            }, (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    res.json({
                        data: data,
                        status: 200
                    })
                }
            })
        }
    })
})
async function saveApplied(req) {
    var user = await getId.getUserId(req.body.studentId,'')
    jobListModel.find({
        _id: req.body.jobId
    }).then(job => {
        models.joblist.find({
            where: {
                companyName: job[0].companyName,
                jobTitle: job[0].jobTitle,
                jobDescription: job[0].jobDescription
            }
        }).then(data => {
            models.jobapplied.find({
                where: {
                    studentId: user.id,
                    jobId: data.id
                }
            }).then(jobapplied => {
                if (jobapplied) {
                    // res.json({
                    //     message: "You have already applied for the Job.",
                    //     status: 400,
                    // })
                } else {
                    models.jobapplied.create({
                        studentId: user.id,
                        jobId: data.id,
                        status: req.body.status,
                    }).then(applied => {
                        console.log("applied")
                    })
                }
            })
        })
    })

}
router.post('/updateApplicationStatus', function (req, res) {
    updateApplicationStatus(req.body)
    var query = {
        _id: req.body.id
    },
        update = {
            $set: {
                  status: req.body.status,
            }
        };
    jobsAppliedModel.findOneAndUpdate(query, update, function (err, job) {
        if (job) {
            res.send({
                data: job,
                status: 200,
            })
        } else {
            res.send({
                status: 400,
            })
        }
    })
})
async function updateApplicationStatus(body) {
    jobsAppliedModel.find({
        _id: body.id
    }).then(async data => {
        if (data) {
            var user = await getId.getUserId(body.studentId,'')
             var job = await getId.getJobId(body.id)
            models.jobapplied.find({
                studentId: user.id,
                jobId: job.id
            }).then(jobapplied => {
                if(jobapplied){
                    jobapplied.update({
                        status: body.status
                    }).then(updated => {
                        console.log("updated")
                    })
                }
              
            })
        }
    })
}
router.get('/getAppliedJobs', function (req, res) {
    if (req.query.userId != '' && req.query.userId != null && req.query.userId != undefined && req.query.userId != 'undefined' && req.query.userId != "null") {
        jobsAppliedModel.find({
            studentId: req.query.userId
        }).populate('studentId', ['fullName']).populate('jobId', ['companyName', 'addedBy', 'jobTitle']).then(function (data) {
            if (data != '') {
                res.send({
                    status: 200,
                    data: data
                })
            } else {
                res.send({
                    status: 400
                })
            }
        }
        )
    }
    else {
        jobsAppliedModel.find({}).populate('studentId', ['fullName']).populate('jobId', ['companyName', 'addedBy', 'jobTitle']).then(function (data) {
            if (data != '') {
                res.send({
                    status: 200,
                    data: data
                })
            } else {
                res.send({
                    status: 400
                })
            }
        })
    }

})
router.get('/getStudentById',function (req,res){
    jobsAppliedModel .find({
        jobId : req.query.jobId
    }).populate('studentId', ['fullName']).populate('jobId', ['companyName', 'addedBy', 'jobTitle']).then(function (studentData) {

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


module.exports = router;