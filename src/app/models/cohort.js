var mongoose = require('mongoose')
var Schema = mongoose.Schema
var cohortSchema = new Schema(
  {
    cohortName: {
      type: String,
      required: true,
    },
    batchesData: {
      type: [Object],
      required: true,
    },
    batchesId:{
      type : Array , "default" : [] 
    },
    batchesArr: {
      type: [String],
      required: true,
    },
    batchesArrView: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

mongoose.model('Cohort', cohortSchema)