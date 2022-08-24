const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var chapters = sequelize.define('chapters', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subject',
        key: 'id'
      }
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    objective: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    videoLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    chapterName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastUpdated: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    chapterDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      default : false,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'chapters',
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
        name: "cha_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "cha_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
      {
        name: "cha_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
  chapters.getSubject = function(id){
    var query ="SELECT cha.courseId,cha.semesterId,cha.chapterName,cha.subjectId,cha.id, sub.subject FROM chapters as cha JOIN subject as sub ON cha.subjectId = sub.id WHERE cha.id ="+id;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});

  }

  chapters.getChapterNoteData = function(courseId,subjectId,semesterId){
    var query ="SELECT c.chapterName,c.videoLink,c.icon,up.length ,up.name as uploadName ,up.type as uploadtype , up.typefOfUpload ,you.videoName ,you.typeOfUpload ,you.youTubeLink,m.sets , m.name as mcqName  FROM `chapters` as c left join uploads as up On c.id = up.lessonId left Join youtubelinks as you On c.id = you.chapterId left join mcqs as m On c.id = m.chapterId  where c.courseId = "+courseId+" and c.semesterId = "+subjectId+" and c.subjectId = "+semesterId
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  return chapters;
};
