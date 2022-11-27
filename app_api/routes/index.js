const express = require('express')
const jwt = require('jsonwebtoken');

const authController = require('../controllers/auth')
const objectController = require('../controllers/object')
const parameterController = require('../controllers/parameter')
const userController = require('../controllers/users')
const valueController = require('../controllers/value')
const chartsController = require('../controllers/charts')


const router = express.Router()

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user) RSA_PUBLIC_KEY
        jwt({ secret : process.env.RSA_PUBLIC_KEY, algorithms: ['RS256'] }),
        
        // authorize based on user role
        (req, res, next) => {

            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
        
    ];
}

const authorize_cookie = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token,  process.env.RSA_PRIVATE_KEY, { algorithms: ['RS256'] } );
    console.log(data);

    req.userId = data.sub;
    req.userRole = data.role;
    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
};

router.route('/auth/login').post( authController.login );
router.route('/auth/loginc').post( authController.loginCookies );
router.route('/auth/logout').post( authorize_cookie, authController.logout );

router.route('/charts').get( chartsController.chart );
router.route('/temperatures').get( chartsController.temperatures );

//------------------------------------------------
router.route('/users')
  .get( (req,res)=>userController.select(req,res) )
  .post( (req,res)=>userController.create(req,res) );

router.route('/users/:id')
  .get( (req,res)=>userController.findOne(req,res) )
  .put( (req,res)=>userController.update(req,res) )
  .delete( (req,res)=>userController.delete(req,res) );
//------------------------------------------------
router.route('/objects')
  .get( (req,res)=>objectController.select(req,res) )
  .post( (req,res)=>objectController.create(req,res) );

router.route('/objects/:id')
  .get( (req,res)=>objectController.findOne(req,res) )
  .put( (req,res)=>objectController.update(req,res) )
  .delete( (req,res)=>objectController.delete(req,res) );
//------------------------------------------------
router.route('/parameters')
  .get( (req,res)=>parameterController.select(req,res) )
  .post( (req,res)=>parameterController.create(req,res) );

router.route('/parameters/:id')
  .get( (req,res)=>parameterController.findOne(req,res) )
  .put( (req,res)=>parameterController.update(req,res) )
  .delete( (req,res)=>parameterController.delete(req,res) );
//------------------------------------------------
router.route('/values')
  .get( (req,res)=>parameterController.select(req,res) )
  .post( (req,res)=>parameterController.create(req,res) );

router.route('/values/:id')
  .get( (req,res)=>valueController.findOne(req,res) )
  .put( (req,res)=>valueController.update(req,res) )
  .delete( (req,res)=>valueController.delete(req,res) );



module.exports =  router 