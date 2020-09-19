const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // createdAt: new Date(),
  snippet: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: "Admin"
  },
  authorId: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    required: true
  },
  bannerimage: {
    type: String,
    default: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1600"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true });

const Blog = mongoose.model('Blog',blogSchema);
module.exports = Blog;
