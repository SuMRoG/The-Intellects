const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  year: {
    type: Number,
    required: true,
    default: 1
  },
  department: [String],
  subject: {
    type: String,
    default: "maths"
  },
  url: {
    type: String,
    default: "#"
  }
  type: {
    type: String,
    default: "endsem"
  }
}, {
  timestamps: true
})

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
