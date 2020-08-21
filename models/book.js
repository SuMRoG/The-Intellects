const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  Department: [{
    id: String,
    name: String
  }],
  Year: {
    type: Number,
    required: true,
    default: 1
  },
  Subject: [{
    id: String,
    name: String
  }],
}, {
  timestamps: true
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
