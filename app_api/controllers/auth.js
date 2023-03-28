const jwt = require('jsonwebtoken');
const Entity = require('../models/user')
const PassWCollection = require('../models/pass');
const ad = require('../services/active-directory');
const crypto = require('../services/passwords');
const dns = require('dns');

module.exports.login = function (req, res) { 
    
    Entity.findOne({ "login": req.body.login, "password": req.body.password}).exec( (err, user)=> {

            if (err) return res.status(500).json({ message: err });

            if (user) {          
                const payload = createPayload(user);

                    // RS256 === RS256 code =decode !!!
                const jwtBearerToken = jwt.sign(payload, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256'}); 
    
                return res.status(201).json({ ...user, jwt: jwtBearerToken });
            }
            else {
                //user not found Unauthorized Requesting a restricted URL with incorrect credentials
                return res.status(401).json({ message: "User not found"});
            }
        }
    );
};

module.exports.loginCookies = async function (req, res) {     

    req.body.password = 'Esr0323--';// TEMP TEMP

    dns.lookupService(req.ip, 22, (err, hostname, service) => {
        console.log("Try login:",new Date(), req.body, "ip:", req.ip, "host:", hostname);
    });

    const usr = await Entity.findOne({ "login": req.body.username }).exec();
/*
    if (!usr) return res.status(401).json({ message: "User not found !"});
    
    //local or domain user
    if (usr.is_domain) {
        //domain authentificaton
        try {
            let res = await ad.authenticateAsync(req.body.username, req.body.password);
            //console.log(res)           
            if (!res) return res.status(401).json({ message: "AD doesn't accept user !"});
        } catch (error) {
            //console.log(error)  
            return res.status(401).json({ message: "AD doesn't accept user !", error});
        }
    } else {
        //local authentification
        const hash = await PassWCollection.findById(usr._id).exec();
        let res = await crypto.isValidPassAsync(hash.password, req.body.password);
        if (!res) return res.status(401).json({ message: "Password wrong !"});
    }
*/ 

    const user  = {_id:1, name:"Username 1", role:"admin"};
    
    const payload = createPayload(user);

    // RS256 === RS256 code =decode !!!
    const jwtBearerToken = jwt.sign(payload, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    return res.cookie("access_token", jwtBearerToken, {
        maxAge: 60*60*process.env.JWT_EXP_DAYS*1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(user);
}

module.exports.logout = function (req, res) {
    return res.clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
}


function createPayload(user) {
    const issued = new Date();
    const expiry = new Date();
    //add hours
    expiry.setTime(expiry.getTime() + 60*60*process.env.JWT_EXP_DAYS*1000);   //expires in + ... days from now              

    const payload = {
        iat : parseInt(issued.getTime() / 1000),
        iss: "rest api",
        sub: user._id,                  
        exp: parseInt(expiry.getTime() / 1000), //alow exp in seconds !!!!!
        role: user.role
      };
      return payload;
}