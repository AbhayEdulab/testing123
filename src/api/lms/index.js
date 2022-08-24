
const express = require('express');

const router = express.Router();

var Course = require('../../app/models/course');
var Lesson = require('../../app/models/lessons');



router.get('/course', function(req, res) {
    Course.find(function(err, course) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.json(course);
    });
  });

  router.get('/lessons', function(req, res) {
    Lesson.find(function(err, lessons) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.json(lessons);
    });
  });


  router.post('/course', function(req, res) {
    var query = {
      instructor  : req.body.instructor,
      term        : req.body.term,
      title       : req.body.title,
      description : req.body.description
    };
  
    Course.create(query, function(err, course) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(201).json(course);
    });
  });

  router.post('/lessons', function(req, res) {
    var query = {
        courseId     : req.body.courseId,
        title        : req.body.title,
        objective    : req.body.objective,
        dueDate      : req.body.dueDate,
        instructions : req.body.instructions,
        text         : req.body.text
      };
  
    Lesson.create(query, function(err, lessons) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(201).json(lessons);
    });
  });

  router.put('/course/:id', function(req, res) {
    var query  = { _id : req.params.id },
        update = {
              $set: {
                  instructor  : req.body.instructor,
                  term        : req.body.term,
                  title       : req.body.title,
                  description : req.body.description
                }
             };
  
    Course.findOneAndUpdate(query, update, function(err, course) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(200).json(course);
    });
  });


  router.put('/lessons/:id', function(req, res) {
    var query  = { _id : req.params.id },
        update = {
              $set: {
                  title        : req.body.title,
                  objective    : req.body.objective,
                  dueDate      : req.body.dueDate,
                  instructions : req.body.instructions,
                  text         : req.body.text
                }
              };
  
    Lesson.findOneAndUpdate(query, update, function(err, lessons) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(200).json(lessons);
    });
  });

  router.delete('/course/:id', function(req, res) {
    var query  = { _id : req.params.id };
  
    Course.findOneAndRemove(query, function(err, course) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(200).json(course);
    });
  });

  router.delete('/lessons/:id', function(req, res) {
    var query  = { _id : req.params.id };
  
    Lesson.findOneAndRemove(query, function(err, lessons) {
      if (err) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }
      res.status(200).json(lessons);
    });
  });
  
  
  if (require.main === module) {
    runServer(function(err) {
      if (err) {
        console.error(err);
      }
    });
  };

module.exports = router;