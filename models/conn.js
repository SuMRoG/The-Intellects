const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "default"
  },
  email: {
    type: String,
    required: true,
    default: ""
  },
  gender: {
    type: String,
    required: true,
    default: "Male"
  },
  department: {
    type: String,
    required: true,
    default: "NULL"
  },
  year: {
    type: String,
    required: true,
    default: "NULL"
  },
  state: {
    type: String,
    required: true,
    default: "NULL"
  },
  city: {
    type: String,
    default: "city"
  },
  profile: {
    type: String,
    default: ""
  },
  sender: {
    type: String,
    default: "admin"
  },
  bio: {
    type: String,
    default: ""
  }
}, {timestamps: true})

const Connect = mongoose.model('Connect', connectSchema);
module.exports = Connect;
