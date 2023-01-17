const passService = require('../services/passwords');

exports.setUserPass =  async (req, res) => {
   
    try {
        await passService.saveUserPassAsync(req.body._id, req.body.password);
        return res.status(204).json();
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }  
}