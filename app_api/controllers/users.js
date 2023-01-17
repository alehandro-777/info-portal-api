const Entity = require('../models/user')
const BaseController = require('../controllers/base-controller')

//db.collection.find().limit(1).sort({$natural:-1}) 
class NewController extends BaseController {
    create (req, res) {
    
        if(!req.body) return res.status(400).json({ message: "Empty body"});
        //get last doc in collection
        super.model.find().limit(1).sort({$natural:-1}).select("_id").exec((err, data)=>{
            if(err) return res.status(500).json({ message: err});

            let id = data.length == 0 ? 0 : data[0]._id;
            id++;
            //--
            req.body._id = id;
            //console.log(super.model, id)
            super.model.create(req.body, (err, data)=>{
                if(err) return res.status(500).json({ message: err});
                
                return res.status(201).json({ data: data});
            } );          
    
            //--
        }) 

     }
}

module.exports = new NewController(Entity);