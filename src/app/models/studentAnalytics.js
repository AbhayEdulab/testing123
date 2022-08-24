const mongoose = require('mongoose')

const StudentAnalyticSchema = new mongoose.Schema( {
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    home_component: {
        type: Number,
        default: 0
    },
    forum_component: {
        type: Number,
        default: 0
    },
    assingment_component: {
        type: Number,
        default: 0
    },
    schedule_component: {
        type: Number,
        default: 0
    },
    submission_component: {
        type: Number,
        default: 0
    },
    chat_component:{
        type: Number,
        default: 0
    },
    library_component:{
        type: Number,
        default: 0
    },
    chapter_component:{
        type: Number,
        default: 0
    },
    lesson_component:{
        type: Number,
        default: 0
    },
    attendance_component:{
        type: Number,
        default: 0
    },
    settings_component:{ 
        type: Number,
        default: 0
    },
    analytic_date: {
        type: Number,
        required: true
    },
    client_type: {
        type: String,
    },
})

const StudentAnalytic = mongoose.model('StudentAnalytic', StudentAnalyticSchema);

module.exports = StudentAnalytic; 