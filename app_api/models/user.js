const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: Number,
  name: String,         //not too ling - display on side panel
  login: { type: String, required: true },  //corp email or local login
  password: { type: String, default: ""  },      //if damain - empty, else local - password hash
  is_domain: { type: Boolean, required:false, default:true },   //local, domain
  role: { type: String, ref: "user_roles" },        
  profile: { type: Number, ref: "user_profiles" }, //ref to gui profiles
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('users', model);  