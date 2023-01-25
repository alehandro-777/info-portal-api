const Season = require('../models/season');
const SeasonStatService = require('../services/seasons-stat');

exports.find =  async (req, res) => {

    let filter = req.query.object ? {object : req.query.object} : {}
        
    try {
        const data = await Season.find(filter).exec();

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

exports.statistics =  async (req, res) => {

    let id = req.params.id;
        
    try {
        const data = await SeasonStatService.create(id);
                   
        return res.status(200).json(data);
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}