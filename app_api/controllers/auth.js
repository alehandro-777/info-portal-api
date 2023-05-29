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

module.exports.whoami = async function (req, res) {
    //init whoami request (userId set by middleware)
    if (req.userId) {
        const active_user  = await Entity.findOne({ "_id": req.userId }).exec();
        if (!active_user) return res.status(401).json({ message: "User not found !"});
        return res.status(200).json(active_user);    
    } else
    {
        return res.status(400).json({ message: "req userId == null"});
    }
}

module.exports.loginCookies = async function (req, res) {     

    dns.lookupService(req.ip, 22, (err, hostname, service) => {
        console.log("Try login:",new Date(), req.body, "ip:", req.ip, "host:", hostname);
    });

    const usr = await Entity.findOne({ "login": req.body.username }).exec();

    if (!usr) return res.status(403).json({ message: "User not found in portal DB!"});
    
    console.log(usr)


    //local or domain user
    if (usr.is_domain) {
        //domain authentificaton
        try {
            let res = await ad.authenticateAsync(req.body.username, req.body.password);
            //console.log(res)           
            if (!res) return res.status(403).json({ message: "Error AD authentification!"});
        } catch (error) {
            console.log(error)  
            return res.status(403).json({ message: "Error AD authentification!", error});
        }
    } else {
        //local authentification
        console.log("Local authentification start")
        const hash = await PassWCollection.findById(usr._id).exec();
        let res = await crypto.isValidPassAsync(hash.password, req.body.password);
        if (!res) return res.status(403).json({ message: "Wrong Password!"});
    }


    
    const payload = createPayload(usr);

    // RS256 === RS256 code =decode !!!
    const jwtBearerToken = jwt.sign(payload, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    return res.cookie("access_token", jwtBearerToken, {
        maxAge: 60*60*process.env.JWT_EXP_DAYS*1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(usr);
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