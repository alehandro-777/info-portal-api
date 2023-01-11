const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: Number,
  name: String,   //display  name  in select
  full_name: String,
},
{
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('user_roles', model); 