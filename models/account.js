const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  // _id: Number,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: "img/default.png"
  }
}, {
  timestamps: true
});

const Account = mongoose.model('Account', accountSchema)
module.exports = Account;
