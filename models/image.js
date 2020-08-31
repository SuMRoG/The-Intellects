const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const imageSchema = new Schema({
  // _id: Number,
  name: {
    type: String,
    required: true
  },
  desc:{
    type: String,
    required:true
  },
  image:{
    data: Buffer,
    contentType: String,
  }
},{timestamps: true});

const Image = mongoose.model('Image',imageSchema)
module.exports= Image;
