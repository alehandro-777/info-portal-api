const Season = require('../models/season-inject');

exports.find =  async (req, res) => {
    let filter = {};

    if (req.query.object) filter = { ...filter, object : req.query.object };
    if (req.query.year) filter = { ...filter, year : req.query.year };

    try {
        const data = await Season.find(filter).sort({start:1}).exec();

        return res.status(200).json(data);
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}

exports.findById =  async (req, res) => {

    let id = req.params.id;
        
    try {
        const data = await Season.findById(id);
                   
        return res.status(200).json(data);
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}

