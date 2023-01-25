const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: {object: Number, parameter: Number, season: mongoose.ObjectId},
  count: { type: Number },
  begin: { type: Date },
  first: Number,
  avg: Number,
  sum: Number,
  max: Number,
  min: Number,
  last: Number,
  end: Date,
  updated_at: Date
});

module.exports = mongoose.model('season_stats', model); 