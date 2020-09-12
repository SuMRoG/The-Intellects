const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const accountSchema = new Schema({
  // _id: Number,
  name: {
    type: String,
    // required: true
  },
  email: {
    type: Array,
    // required: true,
    // unique: true
  },
  gender: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  username: {
    type: String,
    // required: true,
    unique: true
  },
  image: {
    type: String,
    default: "img/default.png"
  },
  googleId:{
    type: String,
    // unique: true
  }
}, {
  timestamps: true
});


accountSchema.plugin(passportLocalMongoose);
accountSchema.plugin(findOrCreate);

const Account = mongoose.model('Account', accountSchema)
module.exports = Account;
