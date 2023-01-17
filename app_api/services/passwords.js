const Collection = require('../models/pass');
const bcrypt = require("bcrypt");

// Hashing user's salt and password with 10 iterations,
const saltRounds = 10;

exports.saveUserPassAsync = async (userId, textPass) => {
    const salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(textPass, salt);
    console.log(userId, textPass, hash);
    await Collection.findOneAndUpdate( {_id:userId }, {_id:userId, password:hash}, {upsert: true}).exec();
}

exports.isValidPassAsync = async (userId, textPass) => {
    let doc = await Collection.findById(userId).exec();
    return await bcrypt.compare(textPass, doc.password);
}