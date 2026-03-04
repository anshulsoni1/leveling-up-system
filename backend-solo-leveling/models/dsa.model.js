const mongoose = require('mongoose');

const dsaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  categories: [{
    name: { type: String },
    topics: [{
      name: { type: String },
      solved: { type: Number, default: 0 }
    }]
  }]
});

module.exports = mongoose.model('DSA', dsaSchema);
