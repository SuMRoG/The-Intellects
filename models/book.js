const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title:{
    type: String,
    default: "Book"
  },
  author:{
    type: String,
    default: "nota"
  },
  type:{
    type: String,
    default: "book"
  },
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
  cover:{
    type: Number,
    default: 0
  },
  sender:{
    type: String,
    default: "admin"
  },
  url:{
    type: String,
    default: "#"
  }
}, {
  timestamps: true
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
