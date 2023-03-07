const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  name: { type: String, default:" " },
  value: { type: String, default:" " },    
  object: { type: Number },  
  tab: { type: Number },
});

module.exports = mongoose.model('nsi', model); 