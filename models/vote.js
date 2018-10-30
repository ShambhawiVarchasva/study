const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  Branch: {
    type: String,
    required: true
  },
 Eligible_Candidates: {
    type: String,
    required: true
  },
  Placed: {
    type: String,
    required: true
  },
  Job_Offers: {
    type: String,
    required: true
  },
  Placement_Percent: {
    type: String,
    required: true
  },
  avg_ctc: {
    type: String,
    required: true
  },
  max_ctc: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
});

// Create collection and add schema
const Vote = module.exports = mongoose.model('Vote', VoteSchema);
