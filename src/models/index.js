"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
// var constant  = require(__dirname + '/../config/constant');
// var env       = constant.ENVIRONMENT;
// var env_ad       = constant.AD;
var config = require(__dirname + '/../../config/config.json')['live'];
//var config_ad    = require(__dirname + '/../config/config.json')[env_ad];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
//var sequelize_ad = new Sequelize(config_ad.database, config_ad.username, config_ad.password, config_ad);
var db = {};
//var db_ad  = {};
fs
.readdirSync(__dirname)
.filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    //var model_ad = sequelize_ad.import(path.join(__dirname, file));
    db[model.name] = model;
    //db_ad[model_ad.name] = model_ad;
});

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

// Object.keys(db_ad).forEach(function(modelName_ad) {
//   if ("associate" in db_ad[modelName_ad]) {
//     db_ad[modelName_ad].associate(db_ad);
//   }
// });

db.sequelize = sequelize;
//db_ad.sequelize_ad = sequelize;
db.Sequelize = Sequelize;

//module.exports = db,db_ad;
module.exports = db;
