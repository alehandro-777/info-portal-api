const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  object: { type: Number},
  name: { type: String},
  value: { type: Number},
  state: { type: String},
  state_ts: { type: Date},
  time_stamp: { type: Date},
  total_gpa: { type: Number},
  work_gpa: { type: Number},
  repair_gpa: { type: Number},
  reserv_gpa: { type: Number},
  ks: [{}],
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('gas_stores', model); 