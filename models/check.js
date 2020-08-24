const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const userSchema = new Schema({
  user:[{
    name: {
      type: String,
    },
    email:{
      type: String,
    },
    gender:{
      type: String,
    },
    password:{
      type: String,
    },
    username:{
        type: String,
    }
  }]

},{timestamps: true});

const User= mongoose.model('user',userSchema)
module.exports= User;
