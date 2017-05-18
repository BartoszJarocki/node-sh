const mongoose = require('mongoose');

const Company = mongoose.model('Company', {
  name: {
    type: String,
    required: true,
    minlenght: 1
  },
  description: {
    type: String,
    required: true,
    minlenght: 1
  },
  url: {
    type: String,
    required: true,
    minlenght: 1
  }
});

module.exports = { Company }