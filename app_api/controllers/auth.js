const jwt = require('jsonwebtoken');
const Entity = require('../models/user')

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

module.exports.loginCookies = function (req, res) { 
    
    const user  = {_id:1, name:"Username 1", role:"admin"};
    
    const payload = createPayload(user);

    // RS256 === RS256 code =decode !!!
    const jwtBearerToken = jwt.sign(payload, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    return res.cookie("access_token", jwtBearerToken, {
        maxAge: payload.exp,
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
    expiry.setDate(expiry.getDate() + process.env.JWT_EXP_DAYS);   //expires in + ... days from now 
                    
    const payload = {
        iat : parseInt(issued.getTime() / 1000),
        iss: "rest api",
        sub: user._id,                  
        exp: parseInt(expiry.getTime() / 1000), //alow exp in seconds !!!!!
        role: user.role
      };
      return payload;
}