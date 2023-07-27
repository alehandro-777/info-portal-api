const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  object: { type: Number},
  psg: { type: Number},
  ceh: { type: Number},
  name: { type: String},
  value: { type: Number},
  state: { type: String},
  state_ts: { type: Date},

  time_stamp: { type: Date},

  drive_id: { type: Number},
  compr_id: { type: Number},
  
  drive_name: { type: String},
  compr_name: { type: String},

  res_kp_d: { type: Number},
  res_cp_d: { type: Number},
  res_to_d: { type: Number},
  rest_kp_d: { type: Number},
  rest_cp_d: { type: Number},
  rest_to_d: { type: Number},
  
  cent_kp_d: { type: Number},
  cent_cp_d: { type: Number},
  cent_to_d: { type: Number},

  res_kp_n: { type: Number},
  res_cp_n: { type: Number},
  res_to_n: { type: Number},
  rest_kp_n: { type: Number},
  rest_cp_n: { type: Number},
  rest_to_n: { type: Number},
  cent_kp_n: { type: Number},
  cent_cp_n: { type: Number},
  cent_to_n: { type: Number},

},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('aggregates', model); 