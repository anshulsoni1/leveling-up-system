const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  currentBook: {
    type: String,
    default: ''
  },
  totalPages: {
    type: Number,
    default: 0
  },
  pagesRead: {
    type: Number,
    default: 0
  },
  logs: [{
    pages: { type: Number },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Book', bookSchema);
