const chartService = require('../services/charts');
const dataService = require('../services/data');
const excellService = require('../services/excell');

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

exports.temperatures =  async (req, res) => {

    //if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
    
    try {
        const ts = req.query.gasday;      
        const data = await chartService.selectTemperatures(ts);           

        return res.status(200).json({ data });
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}

exports.actgas =  async (req, res) => {
    let from = req.query.from; 
    let to = req.query.to; 

    if (!from) {
        from = new Date().toISOString();
    }

    if (!to) {
        to = from;
    }   

    try {
             
        const data = await chartService.selectActGas(new Date(from), new Date(to));           

        return res.status(200).json({ data });
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    } 
    
}

exports.excel = async (req, res) => { 

    const xlsResult = "city-weather.xlsx";

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

        const data = await dataService.selectValueGroupByObjectTimeAsync(objects, parameters, new Date(from), new Date(to));
        //console.log(data)
        const map = excellService.dbdata2map(objects, parameters, data);
        //console.log(map)
        const stream = await excellService.createExcellStreamAsync(objects, parameters, map);


        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", `attachment; filename=${xlsResult}`);
        stream.pipe(res);
} 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}

exports.csv = async (req, res) => { 

    const resultFileName = "city-weather.csv";

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

        const data = await dataService.selectValueGroupByObjectTimeAsync(objects, parameters, new Date(from), new Date(to));
        //console.log(data)
        const map = excellService.dbdata2map(objects, parameters, data);
        //console.log(map)
        const stream = await excellService.createCsvStreamAsync(objects,parameters, map);


        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", `attachment; filename=${resultFileName}`);
        stream.pipe(res);
} 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}