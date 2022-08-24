var DataTypes = require("sequelize").DataTypes;
var _activitytrackers = require("./activitytrackers");
var _allowaccesstosubadmin = require("./allowaccesstosubadmin");
var _allowaccesstoteachers = require("./allowaccesstoteachers");
var _allowacesstosubadmin = require("./allowacesstosubadmin");
var _announcementbatches = require("./announcementbatches");
var _announcements = require("./announcements");
var _announcementuploads = require("./announcementuploads");
var _assignments = require("./assignments");
var _attendances = require("./attendances");
var _batchmaster = require("./batchmaster");
var _batchmasters = require("./batchmasters");
var _batchsemester = require("./batchsemester");
var _bbbinfos = require("./bbbinfos");
var _blogs = require("./blogs");
var _bloguploads = require("./bloguploads");
var _camtasiaanalytics = require("./camtasiaanalytics");
var _camtasialinks = require("./camtasialinks");
var _casestudyaccesses = require("./casestudyaccesses");
var _chapters = require("./chapters");
var _chaptersyllabusfiles = require("./chaptersyllabusfiles");
var _chats = require("./chats");
var _cohort = require("./cohort");
var _cohortattendance = require("./cohortattendance");
var _cohortteacher = require("./cohortteacher");
var _cohorttimetable = require("./cohorttimetable");
var _cohorttopicoftheday = require("./cohorttopicoftheday");
var _courses = require("./courses");
var _deletednotifications = require("./deletednotifications");
var _deliverablesuploads = require("./deliverablesuploads");
var _departments = require("./departments");
var _division = require("./division");
var _educationalprofiles = require("./educationalprofiles");
var _enrollmentdetails = require("./enrollmentdetails");
var _errorloggers = require("./errorloggers");
var _events = require("./events");
var _examupdates = require("./examupdates");
var _facultypayments = require("./facultypayments");
var _facultysubjects = require("./facultysubjects");
var _feedbacks = require("./feedbacks");
var _holidayhistories = require("./holidayhistories");
var _insights = require("./insights");
var _jobapplied = require("./jobapplied");
var _joblist = require("./joblist");
var _leaves = require("./leaves");
var _leaveuploads = require("./leaveuploads");
var _lecturejoinlinks = require("./lecturejoinlinks");
var _lessons = require("./lessons");
var _libraries = require("./libraries");
var _libraryupdates = require("./libraryupdates");
var _libraryuploads = require("./libraryuploads");
var _mcqs = require("./mcqs");
var _mcqscores = require("./mcqscores");
var _multitimetables = require("./multitimetables");
var _newlessons = require("./newlessons");
var _newsletters = require("./newsletters");
var _newtimetables = require("./newtimetables");
var _notices = require("./notices");
var _noticeuploads = require("./noticeuploads");
var _notifications = require("./notifications");
var _onlinelectureattendences = require("./onlinelectureattendences");
var _onlinelecturelinks = require("./onlinelecturelinks");
var _papersets = require("./papersets");
var _papersetters = require("./papersetters");
var _pdftrackings = require("./pdftrackings");
var _placements = require("./placements");
var _placementuploads = require("./placementuploads");
var _projectsubmissions = require("./projectsubmissions");
var _questionanswers = require("./questionanswers");
var _questions = require("./questions");
var _referencefiles = require("./referencefiles");
var _rooms = require("./rooms");
var _semester = require("./semester");
var _semesters = require("./semesters");
var _sessions = require("./sessions");
var _settings = require("./settings");
var _studentachievmentcertificates = require("./studentachievmentcertificates");
var _studentanalytics = require("./studentanalytics");
var _studentbatches = require("./studentbatches");
var _studentcertifications = require("./studentcertifications");
var _studenteducationaldetails = require("./studenteducationaldetails");
var _studentexp = require("./studentexp");
var _studentlogincounts = require("./studentlogincounts");
var _studentprofiledetails = require("./studentprofiledetails");
var _studentprojects = require("./studentprojects");
var _studentresult = require("./studentresult");
var _subject = require("./subject");
var _subjectreferences = require("./subjectreferences");
var _subjectviewtrackings = require("./subjectviewtrackings");
var _supports = require("./supports");
var _syllabusfiles = require("./syllabusfiles");
var _teacherdetailsuploads = require("./teacherdetailsuploads");
var _teachereducationaldetails = require("./teachereducationaldetails");
var _teachers = require("./teachers");
var _timetables = require("./timetables");
var _topiclibraries = require("./topiclibraries");
var _topicofthedays = require("./topicofthedays");
var _unapprovedsyllabuses = require("./unapprovedsyllabuses");
var _uploadedassignments = require("./uploadedassignments");
var _uploadedprojects = require("./uploadedprojects");
var _uploads = require("./uploads");
var _users = require("./users");
var _videorecords = require("./videorecords");
var _vimeolink = require("./vimeolink");
var _webinars = require("./webinars");
var _webinaruploads = require("./webinaruploads");
var _webinarusers = require("./webinarusers");
var _youtubelinks = require("./youtubelinks");
var _youtubetrackings = require("./youtubetrackings");
var _studentfeedback = require("./studentfeedback");

function initModels(sequelize) {
  var activitytrackers = _activitytrackers(sequelize, DataTypes);
  var allowaccesstosubadmin = _allowaccesstosubadmin(sequelize, DataTypes);
  var allowaccesstoteachers = _allowaccesstoteachers(sequelize, DataTypes);
  var allowacesstosubadmin = _allowacesstosubadmin(sequelize, DataTypes);
  var announcementbatches = _announcementbatches(sequelize, DataTypes);
  var announcements = _announcements(sequelize, DataTypes);
  var announcementuploads = _announcementuploads(sequelize, DataTypes);
  var assignments = _assignments(sequelize, DataTypes);
  var attendances = _attendances(sequelize, DataTypes);
  var batchmaster = _batchmaster(sequelize, DataTypes);
  var batchmasters = _batchmasters(sequelize, DataTypes);
  var batchsemester = _batchsemester(sequelize, DataTypes);
  var bbbinfos = _bbbinfos(sequelize, DataTypes);
  var blogs = _blogs(sequelize, DataTypes);
  var bloguploads = _bloguploads(sequelize, DataTypes);
  var camtasiaanalytics = _camtasiaanalytics(sequelize, DataTypes);
  var camtasialinks = _camtasialinks(sequelize, DataTypes);
  var casestudyaccesses = _casestudyaccesses(sequelize, DataTypes);
  var chapters = _chapters(sequelize, DataTypes);
  var chaptersyllabusfiles = _chaptersyllabusfiles(sequelize, DataTypes);
  var chats = _chats(sequelize, DataTypes);
  var cohort = _cohort(sequelize, DataTypes);
  var cohortattendance = _cohortattendance(sequelize, DataTypes);
  var cohortteacher = _cohortteacher(sequelize, DataTypes);
  var cohorttimetable = _cohorttimetable(sequelize, DataTypes);
  var cohorttopicoftheday = _cohorttopicoftheday(sequelize, DataTypes);
  var courses = _courses(sequelize, DataTypes);
  var deletednotifications = _deletednotifications(sequelize, DataTypes);
  var deliverablesuploads = _deliverablesuploads(sequelize, DataTypes);
  var departments = _departments(sequelize, DataTypes);
  var division = _division(sequelize, DataTypes);
  var educationalprofiles = _educationalprofiles(sequelize, DataTypes);
  var enrollmentdetails = _enrollmentdetails(sequelize, DataTypes);
  var errorloggers = _errorloggers(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var examupdates = _examupdates(sequelize, DataTypes);
  var facultypayments = _facultypayments(sequelize, DataTypes);
  var facultysubjects = _facultysubjects(sequelize, DataTypes);
  var feedbacks = _feedbacks(sequelize, DataTypes);
  var holidayhistories = _holidayhistories(sequelize, DataTypes);
  var insights = _insights(sequelize, DataTypes);
  var jobapplied = _jobapplied(sequelize, DataTypes);
  var joblist = _joblist(sequelize, DataTypes);
  var leaves = _leaves(sequelize, DataTypes);
  var leaveuploads = _leaveuploads(sequelize, DataTypes);
  var lecturejoinlinks = _lecturejoinlinks(sequelize, DataTypes);
  var lessons = _lessons(sequelize, DataTypes);
  var libraries = _libraries(sequelize, DataTypes);
  var libraryupdates = _libraryupdates(sequelize, DataTypes);
  var libraryuploads = _libraryuploads(sequelize, DataTypes);
  var mcqs = _mcqs(sequelize, DataTypes);
  var mcqscores = _mcqscores(sequelize, DataTypes);
  var multitimetables = _multitimetables(sequelize, DataTypes);
  var newlessons = _newlessons(sequelize, DataTypes);
  var newsletters = _newsletters(sequelize, DataTypes);
  var newtimetables = _newtimetables(sequelize, DataTypes);
  var notices = _notices(sequelize, DataTypes);
  var noticeuploads = _noticeuploads(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var onlinelectureattendences = _onlinelectureattendences(sequelize, DataTypes);
  var onlinelecturelinks = _onlinelecturelinks(sequelize, DataTypes);
  var papersets = _papersets(sequelize, DataTypes);
  var papersetters = _papersetters(sequelize, DataTypes);
  var pdftrackings = _pdftrackings(sequelize, DataTypes);
  var placements = _placements(sequelize, DataTypes);
  var placementuploads = _placementuploads(sequelize, DataTypes);
  var projectsubmissions = _projectsubmissions(sequelize, DataTypes);
  var questionanswers = _questionanswers(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);
  var referencefiles = _referencefiles(sequelize, DataTypes);
  var rooms = _rooms(sequelize, DataTypes);
  var semester = _semester(sequelize, DataTypes);
  var semesters = _semesters(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var settings = _settings(sequelize, DataTypes);
  var studentachievmentcertificates = _studentachievmentcertificates(sequelize, DataTypes);
  var studentanalytics = _studentanalytics(sequelize, DataTypes);
  var studentbatches = _studentbatches(sequelize, DataTypes);
  var studentcertifications = _studentcertifications(sequelize, DataTypes);
  var studenteducationaldetails = _studenteducationaldetails(sequelize, DataTypes);
  var studentexp = _studentexp(sequelize, DataTypes);
  var studentlogincounts = _studentlogincounts(sequelize, DataTypes);
  var studentprofiledetails = _studentprofiledetails(sequelize, DataTypes);
  var studentprojects = _studentprojects(sequelize, DataTypes);
  var studentresult = _studentresult(sequelize, DataTypes);
  var subject = _subject(sequelize, DataTypes);
  var subjectreferences = _subjectreferences(sequelize, DataTypes);
  var subjectviewtrackings = _subjectviewtrackings(sequelize, DataTypes);
  var supports = _supports(sequelize, DataTypes);
  var syllabusfiles = _syllabusfiles(sequelize, DataTypes);
  var teacherdetailsuploads = _teacherdetailsuploads(sequelize, DataTypes);
  var teachereducationaldetails = _teachereducationaldetails(sequelize, DataTypes);
  var teachers = _teachers(sequelize, DataTypes);
  var timetables = _timetables(sequelize, DataTypes);
  var topiclibraries = _topiclibraries(sequelize, DataTypes);
  var topicofthedays = _topicofthedays(sequelize, DataTypes);
  var unapprovedsyllabuses = _unapprovedsyllabuses(sequelize, DataTypes);
  var uploadedassignments = _uploadedassignments(sequelize, DataTypes);
  var uploadedprojects = _uploadedprojects(sequelize, DataTypes);
  var uploads = _uploads(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var videorecords = _videorecords(sequelize, DataTypes);
  var vimeolink = _vimeolink(sequelize, DataTypes);
  var webinars = _webinars(sequelize, DataTypes);
  var webinaruploads = _webinaruploads(sequelize, DataTypes);
  var webinarusers = _webinarusers(sequelize, DataTypes);
  var youtubelinks = _youtubelinks(sequelize, DataTypes);
  var youtubetrackings = _youtubetrackings(sequelize, DataTypes);
  var studentfeedback = _studentfeedback(sequelize, DataTypes);

  announcementbatches.belongsTo(announcements, { as: "announcement", foreignKey: "announcementId"});
  announcements.hasMany(announcementbatches, { as: "announcementbatches", foreignKey: "announcementId"});
  announcementuploads.belongsTo(announcements, { as: "announcement", foreignKey: "announcementId"});
  announcements.hasMany(announcementuploads, { as: "announcementuploads", foreignKey: "announcementId"});
  activitytrackers.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(activitytrackers, { as: "activitytrackers", foreignKey: "batchId"});
  announcementbatches.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(announcementbatches, { as: "announcementbatches", foreignKey: "batchId"});
  assignments.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(assignments, { as: "assignments", foreignKey: "batchId"});
  attendances.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(attendances, { as: "attendances", foreignKey: "batchId"});
  batchsemester.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(batchsemester, { as: "batchsemesters", foreignKey: "batchId"});
  blogs.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(blogs, { as: "blogs", foreignKey: "batchId"});
  casestudyaccesses.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(casestudyaccesses, { as: "casestudyaccesses", foreignKey: "batchId"});
  cohortattendance.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(cohortattendance, { as: "cohortattendances", foreignKey: "batchId"});
  division.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(division, { as: "divisions", foreignKey: "batchId"});
  enrollmentdetails.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(enrollmentdetails, { as: "enrollmentdetails", foreignKey: "batchId"});
  examupdates.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(examupdates, { as: "examupdates", foreignKey: "batchId"});
  holidayhistories.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(holidayhistories, { as: "holidayhistories", foreignKey: "batchId"});
  leaves.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(leaves, { as: "leaves", foreignKey: "batchId"});
  libraries.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(libraries, { as: "libraries", foreignKey: "batchId"});
  multitimetables.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(multitimetables, { as: "multitimetables", foreignKey: "batchId"});
  newtimetables.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(newtimetables, { as: "newtimetables", foreignKey: "batchId"});
  notices.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(notices, { as: "notices", foreignKey: "batchId"});
  placements.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(placements, { as: "placements", foreignKey: "batchId"});
  projectsubmissions.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(projectsubmissions, { as: "projectsubmissions", foreignKey: "batchId"});
  studentbatches.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(studentbatches, { as: "studentbatches", foreignKey: "batchId"});
  studentlogincounts.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(studentlogincounts, { as: "studentlogincounts", foreignKey: "batchId"});
  teachers.belongsTo(batchmasters, { as: "batch", foreignKey: "batchId"});
  batchmasters.hasMany(teachers, { as: "teachers", foreignKey: "batchId"});
  uploadedprojects.belongsTo(batchmasters, { as: "Batch", foreignKey: "BatchId"});
  batchmasters.hasMany(uploadedprojects, { as: "uploadedprojects", foreignKey: "BatchId"});
  bloguploads.belongsTo(blogs, { as: "blog", foreignKey: "blogId"});
  blogs.hasMany(bloguploads, { as: "bloguploads", foreignKey: "blogId"});
  camtasiaanalytics.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(camtasiaanalytics, { as: "camtasiaanalytics", foreignKey: "chapterId"});
  camtasialinks.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(camtasialinks, { as: "camtasialinks", foreignKey: "chapterId"});
  mcqs.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(mcqs, { as: "mcqs", foreignKey: "chapterId"});
  newlessons.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(newlessons, { as: "newlessons", foreignKey: "chapterId"});
  onlinelecturelinks.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(onlinelecturelinks, { as: "onlinelecturelinks", foreignKey: "chapterId"});
  pdftrackings.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(pdftrackings, { as: "pdftrackings", foreignKey: "chapterId"});
  uploads.belongsTo(chapters, { as: "lesson", foreignKey: "lessonId"});
  chapters.hasMany(uploads, { as: "uploads", foreignKey: "lessonId"});
  vimeolink.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(vimeolink, { as: "vimeolinks", foreignKey: "chapterId"});
  youtubelinks.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(youtubelinks, { as: "youtubelinks", foreignKey: "chapterId"});
  youtubetrackings.belongsTo(chapters, { as: "chapter", foreignKey: "chapterId"});
  chapters.hasMany(youtubetrackings, { as: "youtubetrackings", foreignKey: "chapterId"});
  cohortteacher.belongsTo(cohort, { as: "cohort", foreignKey: "cohortId"});
  cohort.hasMany(cohortteacher, { as: "cohortteachers", foreignKey: "cohortId"});
  cohorttimetable.belongsTo(cohort, { as: "cohort", foreignKey: "cohortId"});
  cohort.hasMany(cohorttimetable, { as: "cohorttimetables", foreignKey: "cohortId"});
  cohorttimetable.belongsTo(cohortteacher, { as: "cohortTeacher", foreignKey: "cohortTeacherId"});
  cohortteacher.hasMany(cohorttimetable, { as: "cohorttimetables", foreignKey: "cohortTeacherId"});
  cohortattendance.belongsTo(cohorttimetable, { as: "cohortTimeTable", foreignKey: "cohortTimeTableId"});
  cohorttimetable.hasMany(cohortattendance, { as: "cohortattendances", foreignKey: "cohortTimeTableId"});
  cohorttopicoftheday.belongsTo(cohorttimetable, { as: "cohortTimeTable", foreignKey: "cohortTimeTableId"});
  cohorttimetable.hasMany(cohorttopicoftheday, { as: "cohorttopicofthedays", foreignKey: "cohortTimeTableId"});
  activitytrackers.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(activitytrackers, { as: "activitytrackers", foreignKey: "courseId"});
  announcementbatches.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(announcementbatches, { as: "announcementbatches", foreignKey: "courseId"});
  assignments.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(assignments, { as: "assignments", foreignKey: "courseId"});
  attendances.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(attendances, { as: "attendances", foreignKey: "courseId"});
  batchsemester.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(batchsemester, { as: "batchsemesters", foreignKey: "courseId"});
  blogs.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(blogs, { as: "blogs", foreignKey: "courseId"});
  camtasiaanalytics.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(camtasiaanalytics, { as: "camtasiaanalytics", foreignKey: "courseId"});
  camtasialinks.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(camtasialinks, { as: "camtasialinks", foreignKey: "courseId"});
  casestudyaccesses.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(casestudyaccesses, { as: "casestudyaccesses", foreignKey: "courseId"});
  chapters.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(chapters, { as: "chapters", foreignKey: "courseId"});
  chaptersyllabusfiles.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(chaptersyllabusfiles, { as: "chaptersyllabusfiles", foreignKey: "courseId"});
  cohortattendance.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(cohortattendance, { as: "cohortattendances", foreignKey: "courseId"});
  division.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(division, { as: "divisions", foreignKey: "courseId"});
  enrollmentdetails.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(enrollmentdetails, { as: "enrollmentdetails", foreignKey: "courseId"});
  events.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(events, { as: "events", foreignKey: "courseId"});
  examupdates.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(examupdates, { as: "examupdates", foreignKey: "courseId"});
  holidayhistories.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(holidayhistories, { as: "holidayhistories", foreignKey: "courseId"});
  leaves.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(leaves, { as: "leaves", foreignKey: "courseId"});
  libraries.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(libraries, { as: "libraries", foreignKey: "courseId"});
  multitimetables.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(multitimetables, { as: "multitimetables", foreignKey: "courseId"});
  newlessons.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(newlessons, { as: "newlessons", foreignKey: "courseId"});
  newtimetables.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(newtimetables, { as: "newtimetables", foreignKey: "courseId"});
  notices.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(notices, { as: "notices", foreignKey: "courseId"});
  papersets.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(papersets, { as: "papersets", foreignKey: "courseId"});
  papersetters.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(papersetters, { as: "papersetters", foreignKey: "courseId"});
  pdftrackings.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(pdftrackings, { as: "pdftrackings", foreignKey: "courseId"});
  placements.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(placements, { as: "placements", foreignKey: "courseId"});
  projectsubmissions.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(projectsubmissions, { as: "projectsubmissions", foreignKey: "courseId"});
  questions.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(questions, { as: "questions", foreignKey: "courseId"});
  semesters.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(semesters, { as: "semesters", foreignKey: "courseId"});
  studentbatches.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(studentbatches, { as: "studentbatches", foreignKey: "courseId"});
  studentlogincounts.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(studentlogincounts, { as: "studentlogincounts", foreignKey: "courseId"});
  subject.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(subject, { as: "subjects", foreignKey: "courseId"});
  subjectreferences.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(subjectreferences, { as: "subjectreferences", foreignKey: "courseId"});
  subjectviewtrackings.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(subjectviewtrackings, { as: "subjectviewtrackings", foreignKey: "courseId"});
  syllabusfiles.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(syllabusfiles, { as: "syllabusfiles", foreignKey: "courseId"});
  teachers.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(teachers, { as: "teachers", foreignKey: "courseId"});
  topicofthedays.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(topicofthedays, { as: "topicofthedays", foreignKey: "courseId"});
  unapprovedsyllabuses.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(unapprovedsyllabuses, { as: "unapprovedsyllabuses", foreignKey: "courseId"});
  uploadedprojects.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(uploadedprojects, { as: "uploadedprojects", foreignKey: "courseId"});
  users.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(users, { as: "users", foreignKey: "courseId"});
  youtubetrackings.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(youtubetrackings, { as: "youtubetrackings", foreignKey: "courseId"});
  batchmasters.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(batchmasters, { as: "batchmasters", foreignKey: "departmentId"});
  batchsemester.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(batchsemester, { as: "batchsemesters", foreignKey: "departmentId"});
  courses.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(courses, { as: "courses", foreignKey: "departmentId"});
  examupdates.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(examupdates, { as: "examupdates", foreignKey: "departmentId"});
  studentbatches.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(studentbatches, { as: "studentbatches", foreignKey: "departmentId"});
  studentcertifications.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(studentcertifications, { as: "studentcertifications", foreignKey: "departmentId"});
  teachers.belongsTo(departments, { as: "department", foreignKey: "departmentId"});
  departments.hasMany(teachers, { as: "teachers", foreignKey: "departmentId"});
  attendances.belongsTo(division, { as: "division", foreignKey: "divisionId"});
  division.hasMany(attendances, { as: "attendances", foreignKey: "divisionId"});
  multitimetables.belongsTo(division, { as: "division", foreignKey: "divisionId"});
  division.hasMany(multitimetables, { as: "multitimetables", foreignKey: "divisionId"});
  newtimetables.belongsTo(division, { as: "division", foreignKey: "divisionId"});
  division.hasMany(newtimetables, { as: "newtimetables", foreignKey: "divisionId"});
  studentbatches.belongsTo(division, { as: "division", foreignKey: "divisionId"});
  division.hasMany(studentbatches, { as: "studentbatches", foreignKey: "divisionId"});
  teachers.belongsTo(division, { as: "division", foreignKey: "divisionId"});
  division.hasMany(teachers, { as: "teachers", foreignKey: "divisionId"});
  jobapplied.belongsTo(joblist, { as: "job", foreignKey: "jobId"});
  joblist.hasMany(jobapplied, { as: "jobapplieds", foreignKey: "jobId"});
  leaveuploads.belongsTo(leaves, { as: "leave", foreignKey: "leaveId"});
  leaves.hasMany(leaveuploads, { as: "leaveuploads", foreignKey: "leaveId"});
  videorecords.belongsTo(lecturejoinlinks, { as: "lesson", foreignKey: "lessonsId"});
  lecturejoinlinks.hasMany(videorecords, { as: "videorecords", foreignKey: "lessonsId"});
  mcqscores.belongsTo(mcqs, { as: "mcq", foreignKey: "mcqId"});
  mcqs.hasMany(mcqscores, { as: "mcqscores", foreignKey: "mcqId"});
  multitimetables.belongsTo(newtimetables, { as: "timeTable", foreignKey: "timeTableId"});
  newtimetables.hasMany(multitimetables, { as: "multitimetables", foreignKey: "timeTableId"});
  onlinelectureattendences.belongsTo(newtimetables, { as: "timeTable", foreignKey: "timeTableId"});
  newtimetables.hasMany(onlinelectureattendences, { as: "onlinelectureattendences", foreignKey: "timeTableId"});
  noticeuploads.belongsTo(notices, { as: "notice", foreignKey: "noticeId"});
  notices.hasMany(noticeuploads, { as: "noticeuploads", foreignKey: "noticeId"});
  placementuploads.belongsTo(placements, { as: "placement", foreignKey: "placementId"});
  placements.hasMany(placementuploads, { as: "placementuploads", foreignKey: "placementId"});
  questionanswers.belongsTo(questions, { as: "question", foreignKey: "questionId"});
  questions.hasMany(questionanswers, { as: "questionanswers", foreignKey: "questionId"});
  batchsemester.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(batchsemester, { as: "batchsemesters", foreignKey: "semesterId"});
  camtasiaanalytics.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(camtasiaanalytics, { as: "camtasiaanalytics", foreignKey: "semesterId"});
  camtasialinks.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(camtasialinks, { as: "camtasialinks", foreignKey: "semesterId"});
  chapters.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(chapters, { as: "chapters", foreignKey: "semesterId"});
  chaptersyllabusfiles.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(chaptersyllabusfiles, { as: "chaptersyllabusfiles", foreignKey: "semesterId"});
  cohortteacher.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(cohortteacher, { as: "cohortteachers", foreignKey: "semesterId"});
  cohorttimetable.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(cohorttimetable, { as: "cohorttimetables", foreignKey: "semesterId"});
  examupdates.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(examupdates, { as: "examupdates", foreignKey: "semesterId"});
  multitimetables.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(multitimetables, { as: "multitimetables", foreignKey: "semesterId"});
  newtimetables.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(newtimetables, { as: "newtimetables", foreignKey: "semesterId"});
  papersets.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(papersets, { as: "papersets", foreignKey: "semesterId"});
  papersetters.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(papersetters, { as: "papersetters", foreignKey: "semesterId"});
  questions.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(questions, { as: "questions", foreignKey: "semesterId"});
  subject.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(subject, { as: "subjects", foreignKey: "semesterId"});
  subjectreferences.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(subjectreferences, { as: "subjectreferences", foreignKey: "semesterId"});
  subjectviewtrackings.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(subjectviewtrackings, { as: "subjectviewtrackings", foreignKey: "semesterId"});
  syllabusfiles.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(syllabusfiles, { as: "syllabusfiles", foreignKey: "semesterId"});
  teachers.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(teachers, { as: "teachers", foreignKey: "semesterId"});
  unapprovedsyllabuses.belongsTo(semesters, { as: "semester", foreignKey: "semesterId"});
  semesters.hasMany(unapprovedsyllabuses, { as: "unapprovedsyllabuses", foreignKey: "semesterId"});
  camtasiaanalytics.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(camtasiaanalytics, { as: "camtasiaanalytics", foreignKey: "subjectId"});
  camtasialinks.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(camtasialinks, { as: "camtasialinks", foreignKey: "subjectId"});
  chapters.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(chapters, { as: "chapters", foreignKey: "subjectId"});
  cohortteacher.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(cohortteacher, { as: "cohortteachers", foreignKey: "subjectId"});
  cohorttimetable.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(cohorttimetable, { as: "cohorttimetables", foreignKey: "subjectId"});
  newtimetables.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(newtimetables, { as: "newtimetables", foreignKey: "subjectId"});
  questions.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(questions, { as: "questions", foreignKey: "subjectId"});
  referencefiles.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(referencefiles, { as: "referencefiles", foreignKey: "subjectId"});
  teachers.belongsTo(subject, { as: "subject", foreignKey: "subjectId"});
  subject.hasMany(teachers, { as: "teachers", foreignKey: "subjectId"});
  unapprovedsyllabuses.belongsTo(syllabusfiles, { as: "syllabusFile", foreignKey: "syllabusFilesId"});
  syllabusfiles.hasMany(unapprovedsyllabuses, { as: "unapprovedsyllabuses", foreignKey: "syllabusFilesId"});
  newtimetables.belongsTo(teachers, { as: "teacher", foreignKey: "teacherId"});
  teachers.hasMany(newtimetables, { as: "newtimetables", foreignKey: "teacherId"});
  attendances.belongsTo(newtimetables, { as: "timeTable", foreignKey: "timeTableId"});
  timetables.hasMany(attendances, { as: "attendances", foreignKey: "timeTableId"});
  topicofthedays.belongsTo(newtimetables, { as: "newtimetables", foreignKey: "timeTableId"});
  timetables.hasMany(topicofthedays, { as: "topicofthedays", foreignKey: "timeTableId"});
  libraryupdates.belongsTo(topiclibraries, { as: "topicLib", foreignKey: "topicLibId"});
  topiclibraries.hasMany(libraryupdates, { as: "libraryupdates", foreignKey: "topicLibId"});
  libraryuploads.belongsTo(topiclibraries, { as: "topicLib", foreignKey: "topicLibId"});
  topiclibraries.hasMany(libraryuploads, { as: "libraryuploads", foreignKey: "topicLibId"});
  allowaccesstoteachers.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(allowaccesstoteachers, { as: "allowaccesstoteachers", foreignKey: "teacherId"});
  allowacesstosubadmin.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(allowacesstosubadmin, { as: "allowacesstosubadmins", foreignKey: "userId"});
  assignments.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(assignments, { as: "assignments", foreignKey: "teacherId"});
  attendances.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(attendances, { as: "attendances", foreignKey: "userId"});
  bbbinfos.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(bbbinfos, { as: "bbbinfos", foreignKey: "teacherId"});
  camtasiaanalytics.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(camtasiaanalytics, { as: "camtasiaanalytics", foreignKey: "userId"});
  casestudyaccesses.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(casestudyaccesses, { as: "casestudyaccesses", foreignKey: "userId"});
  casestudyaccesses.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(casestudyaccesses, { as: "teacher_casestudyaccesses", foreignKey: "teacherId"});
  chaptersyllabusfiles.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(chaptersyllabusfiles, { as: "chaptersyllabusfiles", foreignKey: "userId"});
  cohortattendance.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(cohortattendance, { as: "cohortattendances", foreignKey: "userId"});
  cohortteacher.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(cohortteacher, { as: "cohortteachers", foreignKey: "teacherId"});
  cohorttimetable.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(cohorttimetable, { as: "cohorttimetables", foreignKey: "teacherId"});
  deletednotifications.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(deletednotifications, { as: "deletednotifications", foreignKey: "userId"});
  educationalprofiles.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(educationalprofiles, { as: "educationalprofiles", foreignKey: "studentId"});
  enrollmentdetails.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(enrollmentdetails, { as: "enrollmentdetails", foreignKey: "userId"});
  events.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(events, { as: "events", foreignKey: "userId"});
  facultypayments.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(facultypayments, { as: "facultypayments", foreignKey: "teacherId"});
  facultysubjects.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(facultysubjects, { as: "facultysubjects", foreignKey: "userId"});
  insights.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(insights, { as: "insights", foreignKey: "studentId"});
  jobapplied.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(jobapplied, { as: "jobapplieds", foreignKey: "studentId"});
  joblist.belongsTo(users, { as: "addedBy", foreignKey: "addedById"});
  users.hasMany(joblist, { as: "joblists", foreignKey: "addedById"});
  leaves.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(leaves, { as: "leaves", foreignKey: "userId"});
  lessons.belongsTo(users, { as: "course", foreignKey: "courseId"});
  users.hasMany(lessons, { as: "lessons", foreignKey: "courseId"});
  mcqscores.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(mcqscores, { as: "mcqscores", foreignKey: "userId"});
  notifications.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "userId"});
  papersetters.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(papersetters, { as: "papersetters", foreignKey: "userId"});
  pdftrackings.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(pdftrackings, { as: "pdftrackings", foreignKey: "userId"});
  projectsubmissions.belongsTo(users, { as: "evaluator", foreignKey: "evaluatorId"});
  users.hasMany(projectsubmissions, { as: "projectsubmissions", foreignKey: "evaluatorId"});
  questionanswers.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(questionanswers, { as: "questionanswers", foreignKey: "userId"});
  questions.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(questions, { as: "questions", foreignKey: "userId"});
  studentachievmentcertificates.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentachievmentcertificates, { as: "studentachievmentcertificates", foreignKey: "studentId"});
  studentanalytics.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(studentanalytics, { as: "studentanalytics", foreignKey: "userId"});
  studentbatches.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentbatches, { as: "studentbatches", foreignKey: "studentId"});
  studentcertifications.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentcertifications, { as: "studentcertifications", foreignKey: "studentId"});
  studenteducationaldetails.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studenteducationaldetails, { as: "studenteducationaldetails", foreignKey: "studentId"});
  studentexp.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentexp, { as: "studentexps", foreignKey: "studentId"});
  studentlogincounts.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(studentlogincounts, { as: "studentlogincounts", foreignKey: "userId"});
  studentprofiledetails.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentprofiledetails, { as: "studentprofiledetails", foreignKey: "studentId"});
  studentprojects.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentprojects, { as: "studentprojects", foreignKey: "studentId"});
  teacherdetailsuploads.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(teacherdetailsuploads, { as: "teacherdetailsuploads", foreignKey: "userId"});
  teachereducationaldetails.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(teachereducationaldetails, { as: "teachereducationaldetails", foreignKey: "userId"});
  teachers.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(teachers, { as: "teachers", foreignKey: "teacherId"});
  unapprovedsyllabuses.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  users.hasMany(unapprovedsyllabuses, { as: "unapprovedsyllabuses", foreignKey: "teacherId"});
  uploadedassignments.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(uploadedassignments, { as: "uploadedassignments", foreignKey: "userId"});
  uploadedprojects.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(uploadedprojects, { as: "uploadedprojects", foreignKey: "userId"});
  videorecords.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(videorecords, { as: "videorecords", foreignKey: "userId"});
  youtubetrackings.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(youtubetrackings, { as: "youtubetrackings", foreignKey: "userId"});
  webinaruploads.belongsTo(webinars, { as: "webinar", foreignKey: "webinarId"});
  webinars.hasMany(webinaruploads, { as: "webinaruploads", foreignKey: "webinarId"});
  webinarusers.belongsTo(webinars, { as: "webinar", foreignKey: "webinarId"});
  webinars.hasMany(webinarusers, { as: "webinarusers", foreignKey: "webinarId"});
  youtubetrackings.belongsTo(youtubelinks, { as: "youtube", foreignKey: "youtubeId"});
  youtubelinks.hasMany(youtubetrackings, { as: "youtubetrackings", foreignKey: "youtubeId"});
  studentfeedback.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(studentfeedback, { as: "studentfeedback", foreignKey: "studentId"});
  // studentfeedback.belongsTo(users, { as: "teacher", foreignKey: "teacherId"});
  // users.hasMany(studentfeedback, { as: "studentfeedback", foreignKey: "teacherId"});
  studentfeedback.belongsTo(semesters, { as: "semesters", foreignKey: "semesterId"});
  semesters.hasMany(studentfeedback, { as: "studentfeedback", foreignKey: "semesterId"});
  
  
  return {
    activitytrackers,
    allowaccesstosubadmin,
    allowaccesstoteachers,
    allowacesstosubadmin,
    announcementbatches,
    announcements,
    announcementuploads,
    assignments,
    attendances,
    batchmaster,
    batchmasters,
    batchsemester,
    bbbinfos,
    blogs,
    bloguploads,
    camtasiaanalytics,
    camtasialinks,
    casestudyaccesses,
    chapters,
    chaptersyllabusfiles,
    chats,
    cohort,
    cohortattendance,
    cohortteacher,
    cohorttimetable,
    cohorttopicoftheday,
    courses,
    deletednotifications,
    deliverablesuploads,
    departments,
    division,
    educationalprofiles,
    enrollmentdetails,
    errorloggers,
    events,
    examupdates,
    facultypayments,
    facultysubjects,
    feedbacks,
    holidayhistories,
    insights,
    jobapplied,
    joblist,
    leaves,
    leaveuploads,
    lecturejoinlinks,
    lessons,
    libraries,
    libraryupdates,
    libraryuploads,
    mcqs,
    mcqscores,
    multitimetables,
    newlessons,
    newsletters,
    newtimetables,
    notices,
    noticeuploads,
    notifications,
    onlinelectureattendences,
    onlinelecturelinks,
    papersets,
    papersetters,
    pdftrackings,
    placements,
    placementuploads,
    projectsubmissions,
    questionanswers,
    questions,
    referencefiles,
    rooms,
    semester,
    semesters,
    sessions,
    settings,
    studentachievmentcertificates,
    studentanalytics,
    studentbatches,
    studentcertifications,
    studenteducationaldetails,
    studentexp,
    studentlogincounts,
    studentprofiledetails,
    studentprojects,
    studentresult,
    subject,
    subjectreferences,
    subjectviewtrackings,
    supports,
    syllabusfiles,
    teacherdetailsuploads,
    teachereducationaldetails,
    teachers,
    timetables,
    topiclibraries,
    topicofthedays,
    unapprovedsyllabuses,
    uploadedassignments,
    uploadedprojects,
    uploads,
    users,
    videorecords,
    vimeolink,
    webinars,
    webinaruploads,
    webinarusers,
    youtubelinks,
    youtubetrackings,
    studentfeedback
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
