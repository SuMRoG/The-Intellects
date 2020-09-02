const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  department:{
    type: String,
    required: true
  },
  year:{
      type: Number,
      required: true
  },
  state:{
    type: String,
    required: true
  },
  city:{
    type: String
  },
  profile:{
    type: String,
    required: true
  },
  bio:{
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Connect = mongoose.model('Connect', connectSchema);
module.exports = Connect;
