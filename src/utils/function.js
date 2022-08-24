var moment = require('moment');
var fs = require('fs');
var path = require('path');
var root_path = path.dirname(require.main.filename);
var mongoose = require('mongoose');
require("./../../src/app/models/notification");
const notificationModel = mongoose.model("Notification");
require('./../../src/app/models/activityTracker');
const activityTrackerModel = mongoose.model('ActivityTracker');

var TeacherSchema = require('../app/models/teacher');
var teacherModel = mongoose.model('Teacher');
module.exports = {
	notification: function (action, notification_data, userId, url_data, query_params) {
		var today = Date.now();
		var newnotification = new notificationModel({
			action: action,
			notification_data: notification_data,
			UserID: userId,
			url_data: url_data,
			query_params: query_params
		});
		newnotification.save(function (err, result) {

		});
	},

	activity: function (action, activity_data, courseId, batchId) {
		var newactivity = new activityTrackerModel({
			activity: action,
			data: activity_data,
			courseId: courseId,
			batchId: batchId,
		});
		newactivity.save(function (err, result) {
			console.log("err--->" + err)
		});
	},

	hoursCalculate: async function (semesterId) {
		console.log("semesterId", semesterId)
		var data1 = []
		await teacherModel.aggregate([
			{
				$match: {
					semesterId: semesterId,
				}
			},
			{
				$addFields: {
					courseId: {
						$toObjectId: "$course_id"
					}
				}
			},
			{
				$lookup: {
					from: "newtimetables",
					let: {
						courseId: "$course_id",
						userId: "$teacher_id",
						semester_id: "$semesterId",
						subject: "$subject",
						approval: 'Approved'
					},
					pipeline: [{
						$match: {
							$expr: {
								$and: [{
									$eq: ["$course_id", "$$courseId"],

								}, {
									$eq: ["$teacher_id", "$$userId"],

								}, {
									$eq: ["$semester_id", "$$semester_id"],

								}, {
									$eq: ["$subject", "$$subject"],

								}, {
									$eq: ["$approval", "$$approval"],

								}]
							}
						}
					}],
					as: "timeTable"
				}
			},
			{
				$unwind: {
					path: "$timeTable",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$addFields: {
					timeId: {
						$toString: "$timeTable._id"
					}
				}
			},
			{
				$lookup: {
					from: "topicofthedays",
					localField: "timeId",
					foreignField: "timeTableId",
					as: "topic"
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: [{
							$arrayElemAt: ["$topic", 0]
						}, "$$ROOT"]
					}
				}
			},
			{
				$lookup: {
					from: "collegecourses",
					localField: "courseId",
					foreignField: "_id",
					as: "Course"
				}
			},
			{
				$addFields: {
					teacherId: {
						$toObjectId: "$teacher_id"
					}
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$addFields: {
					batchId: {
						$toObjectId: "$batch_id"
					}
				}
			},
			{
				$lookup: {
					from: "batchmasters",
					localField: "batchId",
					foreignField: "_id",
					as: "Batch"
				}
			},

			{
				$addFields: {
					semesterId: {
						$toObjectId: "$semesterId"
					}
				}
			},
			{
				$lookup: {
					from: "semesterNew",
					localField: "semesterId",
					foreignField: "_id",
					as: "Semester"
				}
			},
			{
				$group: {
					_id: "$teacher_id",
					course_GROUP: {
						$push: {

							timeTable: "$timeTable",
							Batch: "$Batch",
							Course: "$Course",
							topic: '$topic',
							Semester: 'Semester',
							user: '$user'

						}
					}
				},
			}
		]).then(async data => {
			await data.forEach(async elm => {
				var totalTime = 0
				await elm.course_GROUP.forEach(async element => {
					if (element.topic.length > 0) {
						if (element.timeTable) {
							const MOMENT = require('moment');
							const TimeDiff = (startTime, endTime, format) => {

								startTime = MOMENT(startTime, 'YYYY-MM-DD HH:mm:ss');
								endTime = MOMENT(endTime, 'YYYY-MM-DD HH:mm:ss');
								return endTime.diff(startTime, format);
							}
							date = element.timeTable.date;
							fromTime = element.timeTable.fromTime;
							toTime = element.timeTable.toTime;
							var start = date + " " + fromTime;
							var end = date + " " + toTime;

							let startTime = new Date(start);
							let endTime = new Date(end);
							if (element.timeTable.totalMinutes > 0) {
								totalMinutes = element.timeTable.totalMinutes
							} else {
								totalMinutes = TimeDiff(startTime, endTime, 'minutes');
							}

							totalTime = totalTime + parseInt(totalMinutes);

						}


					}

				})
				var d = totalTime;
				var h = Math.floor(d / 60);
				var m = Math.floor(d % 60 % 60);

				var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
				var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
				var remaining = Math.floor(60 - h)
				if(elm.course_GROUP[0].timeTable){
					await data1.push({
						courseName: elm.course_GROUP[0].Course[0].courseName,
						batchName: elm.course_GROUP[0].Batch[0].batchName,
						batchYear: elm.course_GROUP[0].Batch[0].year,
						semesterName: elm.course_GROUP[0].timeTable.semesterName,
						subject: elm.course_GROUP[0].timeTable.subject,
						teacherName: elm.course_GROUP[0].timeTable.teacherName,
						email: elm.course_GROUP[0].user[0].email,
						hours: hDisplay ? hDisplay : '0 hours',
						min: mDisplay ? mDisplay : '0 minutes',
						remaining: remaining,
	
					})
				}
				
			})

		})
		return data1
	}
};