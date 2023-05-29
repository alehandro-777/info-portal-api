const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  year: { type: Number },
  object: { type: Number },
  value: { type: Number },
  state: { type: String },  
  start: { type: Date },
  end: { type: Date },
  np1_start: { type: Date },
  np1_end: { type: Date },
  np2_start: { type: Date },
  np2_end: { type: Date },
  start_inject_fact: { type: Date },
  end_inject_fact: { type: Date },
  injected: { type: Number },
  vtv_np1: { type: Number },
  vtv_np2: { type: Number },
  vtv_inj: { type: Number },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

model.index({ "object": 1, "year": 1}, {unique:true}); 

module.exports = mongoose.model('seasons-injects', model);