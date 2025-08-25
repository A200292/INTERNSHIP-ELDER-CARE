const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchCriteriaSchema = new Schema({
    
  caregiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  specializations: {
    type: [String],   // ["physiotherapy", "elderly care"]
    default: []
  },
  availableDays: {
    type: [String],   //  ["Monday", "Wednesday", "Friday"]
    default: []
  },
  locations: {
    type: [String],   //  ["Beirut", "Hamra", "Tripoli"]
    default: []
  },
  maxEldersAssigned: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("MatchCriteria", matchCriteriaSchema);
