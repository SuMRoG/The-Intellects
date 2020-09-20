const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const accountSchema = new Schema({
  name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    unique: true
    // required: true,
  },
  image: {
    type: String,
    default: "img/default.png"
  },
  googleId: {
    type: String,
    // unique: true
  },
  username:{
    type: String,
  }
}, {
  timestamps: true
});


accountSchema.plugin(passportLocalMongoose);
accountSchema.plugin(findOrCreate);

const Account = mongoose.model('Account', accountSchema)
module.exports = Account;
