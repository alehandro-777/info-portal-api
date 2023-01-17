const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: Number,
  password: { type: String, required: true   },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('passwords', model); 