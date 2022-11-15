class BaseController {
    constructor (model) {
        this.Entity = model
    }

    get model  ()       { return this.Entity }
    
    create (req, res) {
    
        if(!req.body) return res.status(400).json({ message: "Empty body"});
        
        this.Entity.create(req.body, (err, data)=>{
            if(err) return res.status(500).json({ message: err});
            
            return res.status(201).json({ data: data});
        } );          
     }

     update(req, res) {

         

        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
        if(!req.body) return res.status(400).json({ message: "Empty body"});
    
        this.Entity.findById(req.params.id).exec( (err, entity)=>{
    
            if(err) return res.status(500).json({ message: err});
    
            if(!entity) return res.status(404).json({ message: "Not found"});
      
            Object.assign(entity, req.body);
            
            entity.__v++;

            entity.save( (err, data)=>{
                if(err) return res.status(500).json({ message: err});
                return res.status(200).json({ data: data});
            });
        } );          
     }
    
    delete(req, res) {
    
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
    
        this.Entity.findByIdAndRemove(req.params.id).exec( (err) => {
    
                    if (err) return res.status(500).json({ message: err});
                  
                    return res.status(204).json({ data: null});
                } 
            )
    };
    
    findOne(req, res) { 
        let {include=""} = req.query;

        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
    
            this.Entity.findById(req.params.id).populate(include).exec( (err, data) => {                
    
                    if (err)  return res.status(500).json({ message: err});
    
                    if (!data) return res.status(404).json({ message: "Not found"});
    
                    return res.status(200).json({ data: data });
                }
            )
    }

    select(req, res) {  
        //console.log(this);
        
        let {skip=0, include="", limit=process.env.SELECT_LIMIT, fields, sort, ...filter} = req.query;
    
        if(fields) fields = fields.replace(/,/g, " ");
    
        this.Entity.find(filter).countDocuments( (err, total)=> {
            
            if (err) return res.status(500).json({ message: err});
    
            this.Entity.find(filter).select(fields).skip(+skip).limit(+limit).sort(sort).populate(include).exec( (err, data) => {
    
                    if (err) return res.status(500).json({ message: err});
    
                    return res.status(200).json({ skip, limit, total, data });
                } 
            )  
    
        } );   
    }        
}

module.exports  = BaseController;