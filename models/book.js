const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const bookSchema= new Schema({
  Department: [{
    id:interval,
    name: string
  }],
  Year:{
    type: int,
    required: true,
    default: 1
  }
},{timestamps: true })
