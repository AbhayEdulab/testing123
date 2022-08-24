var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var fbmodel = require('../../app/models/feedback');
var feedbackModel = mongoose.model('feedback');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
var topicLibrarySchema = require('../../app/models/topiclibrary');
const {
    on
} = require('../../utils/logger');
var topicLibraryModel = mongoose.model('topicLibrary');
require('../../app/models/libraryUploads');
var libraryUploadsModel = mongoose.model('LibraryUploads');
require('../../app/models/libraryupdates');
var libraryUpdatesModel = mongoose.model('LibraryUpdates');
const notification = require('../../utils/function')
require('../../app/models/user');
const userModel = mongoose.model('User');

//Sql
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models  = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
const { AddOnResultInstance } = require('twilio/lib/rest/api/v2010/account/recording/addOnResult');
var getId = new getSqlId();

router.post('/saveTopicdetails', function (req, res) {
    saveTopicdetails(req.body)
    var data = new topicLibraryModel({
        topicname: req.body.data.topicname,
        tags: req.body.data.tags,
        videos: req.body.data.videolink,
        podcasts: req.body.data.podcasts,
        editortext: req.body.data.editortext,
        setImptopic: req.body.data.setImptopic,
        websites: req.body.data.websites,
        reftopicId: req.body.data.reftopic
    })

    data.save(function (err, result) {

        if (err) {
            return res.status(400).json({
                message: 'Bad Request'
            })
        } else {
            res.json({
                status: 200,
                data: result
            })
        }
    })
})
async function saveTopicdetails(body){
    var view_data = []
    body.data.reftopic.forEach(elm=>{
        topicLibraryModel.find({
            _id : elm._id 
        }).then(element=>{
            models.topiclibraries.find({
                where:{
                    topicName: element.topicname,
                    tags: element.tags,
                    videos: element.videolink,
                    podcasts: element.podcasts,
                    setIMPTopic: element.setImptopic,
                    websites: element.websites,
                }
                
            }).then(data=>{
                view_data.push({
                    id: data.id
                })
                
            })
        })
    }) 
    models.topiclibraries.create({
        topicName: body.data.topicname,
        tags: body.data.tags,
        videos: body.data.videolink,
        podcasts: body.data.podcasts,
        description: body.data.editortext,
        setIMPTopic: body.data.setImptopic,
        websites: body.data.websites,
        refTopicId: view_data
    }).then(data=>{
        console.log("data")
    })  
}
router.get('/getTopicLibrary', function (req, res) {
    topicLibraryModel.find({}, (err, topics) => {
        var view_data1 = [];
        var view_data2 = [];
        var view_data = [];
        if (err) {
            console.log("err==>" + err)
            return res.status(400).json({
                message: 'Bad Request'
            });
        } else {
            topics.forEach(function (topicData) {
                if (topicData.setImptopic == true) {
                    view_data1.push({
                        _id: topicData._id,
                        topicname: topicData.topicname,
                        tags: topicData.tags,
                        createdOn: topicData.createdOn,
                        setImptopic: topicData.setImptopic,
                        description: topicData.editortext,
                        vedio: topicData.vedio,
                        podcasts: topicData.podcasts,
                        files: topicData.files,
                        reftopicId: topicData.reftopicId

                    });
                } else {
                    view_data2.push({
                        _id: topicData._id,
                        topicname: topicData.topicname,
                        tags: topicData.tags,
                        createdOn: topicData.createdOn,
                        setImptopic: topicData.setImptopic,
                        description: topicData.editortext,
                        vedio: topicData.vedio,
                        podcasts: topicData.podcasts,
                        files: topicData.files,
                        reftopicId: topicData.reftopicId
                    });
                }
            })
            setTimeout(function () {
                view_data = view_data1.concat(view_data2);
                res.json({
                    status: 200,
                    data: view_data
                })

            }, 500)
        }

    })
})

router.delete('/deletetopic', function (req, res) {
    topicLibraryModel.findByIdAndRemove({
        _id: req.query.topicId
    }, (err, librarytopics) => {

        if (err) {
            res.json({
                status: 400
            })
        } else if (librarytopics) {
            res.json({
                status: 200,
                data: librarytopics
            })
        }
    })
})

router.get('/getdetails', function (req, res) {

    promise1 = new Promise((resolve, reject) => {
        topicLibraryModel.find({
            _id: req.query.id
        }, (err, details) => {
            if (err) {
                reject('error');
            } else if (details) {
                setTimeout(() => {
                    resolve(details);
                }, 1000)
            }
        })
    })
    Promise.all([promise1]).then(result => {

        setTimeout(() => {
            if (result != undefined) {
                res.json({
                    status: 200,
                    data: result[0]
                })
            }
        }, 1000);
    })

})


router.post('/updatetopicLibary', function (req, res) {
    updatetopicLibary(req)
    topicLibraryModel.findOne({
        _id: req.body.data.updateId
    }, function (err, topicdetails) {

        if (topicdetails.podcasts != undefined) {


            var a = topicdetails.podcasts
            var b = req.body.data.podcasts

            function comparer(otherArray) {
                return function (current) {
                    return otherArray.filter(function (other) {
                        return other.podcastlink == current.podcastlink && other.uploadpodcast == current.uploadpodcast &&
                            other.podcastdesc == current.podcastdesc && other.podcastname == current.podcastname
                    }).length == 0;
                }
            }

            var onlyInA = a.filter(comparer(b));
            var onlyInB = b.filter(comparer(a));

            result = onlyInA.concat(onlyInB);

            if (onlyInB.length == 0) {} else {
                var data = new libraryUpdatesModel({
                    name: "Podcast Updated",
                    updatetype: "podcast",
                    description: "podcats updated in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notification_data = "Libary : Podcast updated in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notification_data, user._id, '', '');
                            })
                        });
                    }
                })
            }

        } else {

            if (req.body.data.podcasts[0].podcastlink != '' && req.body.data.podcasts[0].uploadpodcast != '') {

                var data = new libraryUpdatesModel({
                    name: "Podcast Added",
                    updatetype: "podcast",
                    description: "podcats added in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notification_data = "Libary : Podcast added in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notification_data, user._id, '', '');
                            })
                        });
                    }
                })
            }
        }


        if (topicdetails.videolink != undefined) {

            var c = topicdetails.videolink
            var d = req.body.data.videolink

            function comparer2(otherArray) {
                return function (current) {
                    return otherArray.filter(function (other) {
                        return other.videoname == current.videoname && other.videolink == current.videolink &&
                            other.videodesc == current.videodesc && other.videoThumbnail == current.videoThumbnail
                    }).length == 0;
                }
            }

            var onlyInC = c.filter(comparer2(d));
            var onlyInD = d.filter(comparer2(c));

            result = onlyInC.concat(onlyInD);

            if (onlyInD.length == 0) {} else {
                var data = new libraryUpdatesModel({
                    name: "Video Updated",
                    updatetype: "video",
                    description: "Video updated in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notificationData = "Libary: Video updated in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notificationData, user._id, '', '');
                            })
                        });
                    }
                })
            }
        } else {
            if (req.body.data.videolink[0].videoname != '' && req.body.data.videolink[0].videolink != '' && req.body.data.videolink[0].videodesc != '' &&
                req.body.data.videolink[0].videoname != undefined && req.body.data.videolink[0].videolink != undefined && req.body.data.videolink[0].videodesc != undefined &&
                req.body.data.videolink[0].videoname != null && req.body.data.videolink[0].videolink != null && req.body.data.videolink[0].videodesc != null) {

                var data = new libraryUpdatesModel({
                    name: "Video added",
                    updatetype: "video",
                    description: "Video added in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notificationData = "Libary: Video added in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notificationData, user._id, '', '');
                            })
                        });
                    }
                })
            }
        }


        if (topicdetails.websites != undefined) {

            var e = topicdetails.websites
            var f = req.body.data.websites

            function comparer3(otherArray) {
                return function (current) {
                    return otherArray.filter(function (other) {
                        return other.websitelink == current.websitelink
                    }).length == 0;
                }
            }

            var onlyInE = e.filter(comparer3(f));
            var onlyInF = f.filter(comparer3(e));

            result = onlyInE.concat(onlyInF);

            if (onlyInF.length == 0) {} else {
                var data = new libraryUpdatesModel({
                    name: "Pdf links Updated",
                    updatetype: "links",
                    description: "Pdf links updated in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notificationData = "Libary : Pdf links updated in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notificationData, user._id, '', '');
                            })
                        });

                    }
                })
            }
        } else {
            if (req.body.data.websites[0].websitelink != null || req.body.data.websites[0].websitelink != undefined) {
                var data = new libraryUpdatesModel({
                    name: "Pdf links Updated",
                    updatetype: "links",
                    description: "Pdf links updated in " + req.body.data.topicname,
                    topiclibID: req.body.data.updateId,
                    topicName: req.body.data.topicname
                })

                data.save(function (err, result) {
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notificationData = "Libary : Pdf links added in " + req.body.data.topicname + "."

                        userModel.find({
                            "role": 'student'
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notificationData, user._id, '', '');
                            })
                        });

                    }
                })
            }

        }

    })

    var query = {
        _id: req.body.data.updateId
    }
    update = {
        $set: {
            topicname: req.body.data.topicname,
            tags: req.body.data.tags,
            videos: req.body.data.videolink,
            podcasts: req.body.data.podcasts,
            editortext: req.body.data.editortext,
            setImptopic: req.body.data.setImptopic,
            websites: req.body.data.websites,
            files: req.body.data.files
        },
    }

    topicLibraryModel.findOneAndUpdate(query, update, (err, details) => {

        if (err) {
            res.json({
                status: 400
            })
        } else if (details) {
            res.json({
                status: 200,
                data: details
            })
        }
    })
})
async function updatetopicLibary(req){
    topicLibraryModel.find({
        _id : req.body.data.updateId
    }).then(data=>{
        models.topiclibraries.find({
            topicName : data[0].topicName,
            tags : data[0].tags,
            description : data[0].editortext,   
        }).then(topicdetails=>{
            if (topicdetails.podcasts != undefined) {
            
                var a = topicdetails.podcasts
                var b = req.body.data.podcasts
    
                function comparer(otherArray) {
                    return function (current) {
                        return otherArray.filter(function (other) {
                            return other.podcastlink == current.podcastlink && other.uploadpodcast == current.uploadpodcast &&
                                other.podcastdesc == current.podcastdesc && other.podcastname == current.podcastname
                        }).length == 0;
                    }
                }
    
                var onlyInA = a.filter(comparer(b));
                var onlyInB = b.filter(comparer(a));
    
                result = onlyInA.concat(onlyInB);
                if (onlyInD.length == 0) {} else {
                    models.libraryupdates.create({
                        name: "Video Updated",
                        updateType: "video",
                        description: "Video updated in " + req.body.data.topicname,
                        topicLibId: topicdetails.id,
                        topicName: req.body.data.topicname
                    }).then(created=>{
                        if (req.body.data.sendNotificationFlag == true) {
                            var action = "Library Notitfication";
                            var notificationData = "Libary: Video updated in " + req.body.data.topicname + "."
    
                            models.users.find({
                                where:{
                                    role: 'student'
                                }
                            }).then(function (users) {
                                users.forEach(function (user) {
                                    notification.notification(action, notificationData, user.id, '', '');
                                })
                            });
                        }
                    })
                }
            }else{
                if(req.body.data.podcasts[0].podcastlink != '' && req.body.data.podcasts[0].uploadpodcast != ''){
                    models.libraryupdates.create({
                            name: "Podcast Added",
                            updateType: "podcast",
                            description: "podcats added in " + req.body.data.topicname,
                            topicLibId: topicdetails.id,
                            topicName: req.body.data.topicname
                    }).then(create=>{
                        if (req.body.data.sendNotificationFlag == true) {
                            var action = "Library Notitfication";
                            var notification_data = "Libary : Podcast added in " + req.body.data.topicname + "."
                            models.users.find({
                                where:{
                                    "role": 'student'
                                }
                            }).then(function (users) {
                                users.forEach(function (user) {
                                    notification.notification(action, notification_data, user.id, '', '');
                                })
                            });
                        }
                    })
                }
            }

            if (topicdetails.videolink != undefined) {
               
            var c = topicdetails.videolink
            var d = req.body.data.videolink

            function comparer2(otherArray) {
                return function (current) {
                    return otherArray.filter(function (other) {
                        return other.videoname == current.videoname && other.videolink == current.videolink &&
                            other.videodesc == current.videodesc && other.videoThumbnail == current.videoThumbnail
                    }).length == 0;
                }
            }

            var onlyInC = c.filter(comparer2(d));
            var onlyInD = d.filter(comparer2(c));

            result = onlyInC.concat(onlyInD);

            if (onlyInD.length == 0) {} else {
                models.libraryupdates.create({
                    name: "Video Updated",
                    updateType: "video",
                    description: "Video updated in " + req.body.data.topicname,
                    topicLibId: topicdetails.id,
                    topicName: req.body.data.topicname
                }).then(create=>{
                    if (req.body.data.sendNotificationFlag == true) {
                        var action = "Library Notitfication";
                        var notificationData = "Libary: Video updated in " + req.body.data.topicname + "."

                        models.users.find({
                            where:{
                                role: 'student'
                            }
                        }).then(function (users) {
                            users.forEach(function (user) {
                                notification.notification(action, notificationData, user.id, '', '');
                            })
                        });
                    }
                })
            } 
            }else{
                if (req.body.data.videolink[0].videoname != '' && req.body.data.videolink[0].videolink != '' && req.body.data.videolink[0].videodesc != '' &&
                req.body.data.videolink[0].videoname != undefined && req.body.data.videolink[0].videolink != undefined && req.body.data.videolink[0].videodesc != undefined &&
                req.body.data.videolink[0].videoname != null && req.body.data.videolink[0].videolink != null && req.body.data.videolink[0].videodesc != null) {
                    models.libraryupdates.create({
                        name: "Video Updated",
                        updateType: "video",
                        description: "Video updated in " + req.body.data.topicname,
                        topicLibId: topicdetails.id,
                        topicName: req.body.data.topicname
                    }).then(create=>{
                        if (req.body.data.sendNotificationFlag == true) {
                            var action = "Library Notitfication";
                            var notificationData = "Libary: Video updated in " + req.body.data.topicname + "."
    
                            models.users.find({
                                where:{
                                    role: 'student'
                                }
                            }).then(function (users) {
                                users.forEach(function (user) {
                                    notification.notification(action, notificationData, user.id, '', '');
                                })
                            });
                        }
                    })
                }
            }

            if (topicdetails.websites != undefined) {
                
            var e = topicdetails.websites
            var f = req.body.data.websites

            function comparer3(otherArray) {
                return function (current) {
                    return otherArray.filter(function (other) {
                        return other.websitelink == current.websitelink
                    }).length == 0;
                }
            }

            var onlyInE = e.filter(comparer3(f));
            var onlyInF = f.filter(comparer3(e));

            result = onlyInE.concat(onlyInF);
            models.libraryupdates.create({
                name: "Pdf links Updated",
                updateType: "links",
                description: "Pdf links updated in " + req.body.data.topicname,
                topicLibId: topicdetails.id,
                topicName: req.body.data.topicname
            }).then(create=>{
                if (req.body.data.sendNotificationFlag == true) {
                    var action = "Library Notitfication";
                        var notificationData = "Libary : Pdf links updated in " + req.body.data.topicname + "."

                    models.users.find({
                        where:{
                            role: 'student'
                        }
                    }).then(function (users) {
                        users.forEach(function (user) {
                            notification.notification(action, notificationData, user.id, '', '');
                        })
                    });
                }
            })
            }else {
                if (req.body.data.websites[0].websitelink != null || req.body.data.websites[0].websitelink != undefined) {
                    models.libraryupdates.create({
                        name: "Pdf links Updated",
                        updateType: "links",
                        description: "Pdf links updated in " + req.body.data.topicname,
                        topicLibId: topicdetails.id,
                        topicName: req.body.data.topicname
                    }).then(create=>{
                        if (req.body.data.sendNotificationFlag == true) {
                            var action = "Library Notitfication";
                                var notificationData = "Libary : Pdf links updated in " + req.body.data.topicname + "."
        
                            models.users.find({
                                where:{
                                    role: 'student'
                                }
                            }).then(function (users) {
                                users.forEach(function (user) {
                                    notification.notification(action, notificationData, user.id, '', '');
                                })
                            });
                        }
                    }) 
                } 
            }
            topicdetails.update({
                topicName: req.body.data.topicname,
                tags: req.body.data.tags,
                videos: req.body.data.videolink,
                podcasts: req.body.data.podcasts,
                description: req.body.data.editortext,
                setIMPTopic: req.body.data.setImptopic,
                websites: req.body.data.websites,
                files: req.body.data.files
            }).then(updatelibary=>{
                console.log("updatelibary")
            })
        })
       
    })   
}

router.get('/getLibraryUpdates', function (req, res) {
    const numberOfDaysToLookBack = 10;

    libraryUpdatesModel.find({
        createdOn: {
            $gte: new Date((new Date().getTime() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000)))
        }
    }).sort({
        createdOn: 'desc'
    }).lean().exec(function (err, uploadNotice) {
        console.log(new Date((new Date().getTime() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000))) + "/uploadNotice==>" + JSON.stringify(uploadNotice));
        if (err) {
            res.json({
                status: 400
            })
        } else {
            res.json({
                status: 200,
                data: uploadNotice
            });
        }
    })




})

router.get('/getreftopic', (req, res) => {
    var view_data = [];
    topicLibraryModel.find({
        _id: req.query.id
    }).then((data) => {
        var ref = data[0].reftopicId;
        if (ref.length > 0) {
            topicLibraryModel.find({
                $or: ref
            }).then(function (references) {
                references.forEach((ref1) => {
                    view_data.push({
                        _id: ref1._id,
                        topicname: ref1.topicname,
                        editortext: ref1.editortext,
                    });
                })
            })
        }
        setTimeout(() => {

            res.json({
                status: 200,
                data: view_data
            })

        }, 1000);
    })
})
module.exports = router;