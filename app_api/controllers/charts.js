const chartService = require('../services/charts');

exports.chart =  async (req, res) => {

    //if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
    
    try {
        const ts = req.query.gasday;      
        const data = await chartService.selectOpData(ts);           

        return res.status(200).json({ data });
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}