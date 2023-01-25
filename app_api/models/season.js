const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  object: { type: Number },
  value: { type: Number },
  state: { type: String },  
  start: { type: Date },
  end: { type: Date },
  neutral_start: { type: Date },
  neutral_end: { type: Date },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

model.index({ "object": 1, "value": 1, "start": 1}, {unique:true}); 

module.exports = mongoose.model('seasons', model);