const dataService = require('../services/stat-act-gas');

exports.stats = async (req, res) => { 

    let from = req.query.from; 
    let to = req.query.to; 

    if (!req.query.objects) return res.status(400).json({ message: "&objects=  missing "});
    if (!req.query.parameters) return res.status(400).json({ message: "&parameters=  missing "});

    if (!from) {
        from = new Date().toISOString();
    }

    if (!to) {
        to = from;
    }        

    try {
        let objects = JSON.parse(req.query.objects); 
        let parameters = JSON.parse(req.query.parameters);

        if (!Array.isArray(objects)) return res.status(400).json({ message: "&objects=  is not array "});
        if (!Array.isArray(parameters)) return res.status(400).json({ message: "&parameters=  is not array "});

        const data = await dataService.findSeasonInYears(objects, parameters, new Date(from), new Date(to));
        return res.status(200).json({ data });
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}