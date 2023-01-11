const Entity = require('../models/user-role')
const BaseController = require('../controllers/base-controller')

class NewController extends BaseController {
    fill_select(req, res) {  
        let fields = "name";

        this.Entity.find().select(fields).sort({_id:1}).exec( (err, data) => {
    
            if (err) return res.status(500).json({ message: err});

            return res.status(200).json( data );
        } 
    )   
    } 
}

module.exports = new NewController(Entity);