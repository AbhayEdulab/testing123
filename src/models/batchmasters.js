const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var batchmasters = sequelize.define('batchmasters', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    batchName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batchStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'batchmasters',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "bat_dep_depid",
        using: "BTREE",
        fields: [
          { name: "departmentId" },
        ]
      },
    ]
  });
  batchmasters.getBatchData = function(){
    var query ="SELECT c.courseName, d.departmentName,b.id as batchId,b.batchName,b.courseId,b.departmentId,b.year,b.batchStatus FROM batchmasters as b JOIN departments as d ON b.departmentId =d.id JOIN courses as c ON b.courseId= c.id";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  batchmasters.getUpdateBatch = function(batchId){
    var query ="SELECT c.courseName, d.departmentName,b.* FROM batchmasters as b JOIN departments as d ON b.departmentId =d.id JOIN courses as c ON b.id="+batchId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }

  batchmasters.batchData = function(batchId){
    var query ="SELECT c.courseName, d.departmentName ,b.* FROM batchmasters as b JOIN departments as d ON b.departmentId =d.id JOIN courses as c ON b.courseId= c.id WHERE b.id ="+batchId+" ORDER BY created_at ASC";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
     }

  batchmasters.getData = function(courseId){
    var query ="SELECT c.courseName, d.departmentName ,b.* FROM batchmasters as b JOIN departments as d ON b.departmentId =d.id JOIN courses as c ON b.courseId= c.id WHERE b.courseId ="+courseId+" ORDER BY created_at ASC";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  batchmasters.getCourse = function(){
    var query ="SELECT b.*,c.courseName FROM batchmasters as b JOIN  courses as c ON b.courseId = c.id";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});

  }
  batchmasters.getbatchchat=function(batchId,n){
    var query ="SELECT * FROM batchmasters where id = "+batchId+" and  year like '%"+n+"%'";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  batchmasters.getdetailbatch=function(id){
    var query ="SELECT bm.*, c.courseName , d.departmentName FROM batchmasters as bm JOIN courses as c ON c.id = bm.courseId JOIN departments as d ON d.id = bm.departmentId where bm.id = "+id+" ORDER BY bm.created_at";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT}); 
  }
  batchmasters.getOnlyRunningBatchDataForAnalytics = function(){
    var query ="SELECT bm.*, c.courseName , d.departmentName FROM batchmasters as bm JOIN courses as c On bm.courseId = c.id JOIN departments as d On bm.departmentId = d.id where batchStatus ='true'";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  return batchmasters ;
};
