const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatisticsSchema = new Schema({
  branch: {
    type: String,
    required: true
  },
 Eligible_Candidates: {
    type: String
    //required: true
  },
  placed: {
    type: String,
    required: true
  },
  Job_Offers: {
    type: String
  },
  Placement_Percent: {
    type: String
  },
  avg_ctc: {
    type: String
  },
  max_ctc: {
    type: String,
    required: true
  },
  year: {
    type: String
  }
});

// Create collection and add schema
const Statistics = module.exports = mongoose.model('Statistics', StatisticsSchema);
