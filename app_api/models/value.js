const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  object: { type: Number, ref: 'objects' },
  parameter: { type: Number, ref: 'parameters' },    
  time_stamp: { type: Date, required: true, default: Date.now  },
  value: { type: Number, default: 0 }, 
  state: { type: String, default: "Normal" }, 
  user: { type: Number, ref: 'users' },  
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

model.index({ "object": 1, "parameter": 1, "time_stamp": 1});    

module.exports = mongoose.model('op_data', model); 
