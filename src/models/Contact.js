const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10,15}$/
  },
  email: {
    type: String,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    sparse: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);