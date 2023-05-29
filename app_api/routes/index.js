const express = require('express')
const jwt = require('jsonwebtoken');

const authController = require('../controllers/auth')
const objectController = require('../controllers/object')
const parameterController = require('../controllers/parameter')
const userController = require('../controllers/users')
const valueController = require('../controllers/value')
const chartsController = require('../controllers/charts')
const rolesController = require('../controllers/user-roles')
const profilesController = require('../controllers/user-profiles')

const passwordController = require('../controllers/password')
const seasonController = require('../controllers/season')
const seasonInjController = require('../controllers/season-inject')
const nsiController = require('../controllers/nsi')

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
    //console.log(data);

    req.userId = data.sub;
    req.userRole = data.role;
    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
};

router.route('/auth/whoami').get( authorize_cookie, authController.whoami );
//router.route('/auth/login').post( authController.login );
router.route('/auth/loginc').post( authController.loginCookies );
router.route('/auth/logout').post( authController.logout );

router.route('/dataset/:id').get(authorize_cookie, chartsController.set );
router.route('/charts').get(authorize_cookie, chartsController.chart );
router.route('/temperatures').get(authorize_cookie, chartsController.temperatures );
router.route('/table').get( authorize_cookie, chartsController.table );
router.route('/stats').get( authorize_cookie, chartsController.stats );

router.route('/actgas').get(authorize_cookie, chartsController.actgas ); //???? temp temp

router.route('/excell').get(authorize_cookie, chartsController.excel );
router.route('/csv').get(authorize_cookie, chartsController.csv );

router.route('/seasons').get(authorize_cookie, seasonController.find );
router.route('/seasons/:id').get(authorize_cookie, seasonController.findById );
router.route('/seasons/:id/stat').get(authorize_cookie, seasonController.statistics );

router.route('/seasons-inject').get( authorize_cookie, seasonInjController.find );
router.route('/seasons-inject/:id').get( authorize_cookie, seasonInjController.findById );


//------------------------------------------------
router.route('/users/:id/password').post(authorize_cookie, (req,res)=> passwordController.setUserPass(req,res) );


router.route('/users')
  .get(authorize_cookie, (req,res)=>userController.select(req,res) )
  .post(authorize_cookie, (req,res)=>userController.create(req,res) );

router.route('/users/:id')
  .get(authorize_cookie, (req,res)=>userController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>userController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>userController.delete(req,res) );
//------------------------------------------------
router.route('/objects')
  .get(authorize_cookie, (req,res)=>objectController.select(req,res) )
  .post(authorize_cookie, (req,res)=>objectController.create(req,res) );

router.route('/objects/:id')
  .get(authorize_cookie, (req,res)=>objectController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>objectController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>objectController.delete(req,res) );
//------------------------------------------------
router.route('/parameters')
  .get(authorize_cookie,(req,res)=>parameterController.select(req,res) )
  .post(authorize_cookie, (req,res)=>parameterController.create(req,res) );

router.route('/parameters/:id')
  .get(authorize_cookie, (req,res)=>parameterController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>parameterController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>parameterController.delete(req,res) );
//------------------------------------------------
router.route('/values')
  .get(authorize_cookie, (req,res)=>valueController.select(req,res) )
  .post(authorize_cookie, (req,res)=>valueController.create(req,res) );

router.route('/values/:id')
  .get(authorize_cookie, (req,res)=>valueController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>valueController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>valueController.delete(req,res) );
//-------------------------------------------------------------------------------
  
router.route('/user-profiles')
  .get(authorize_cookie, (req,res)=>profilesController.select(req,res) )
  .post(authorize_cookie, (req,res)=>profilesController.create(req,res) );
  
router.route('/user-profiles/:id')
  .get(authorize_cookie, (req,res)=>profilesController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>profilesController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>profilesController.delete(req,res) );

router.route('/user-profiles-fill-select')
  .get(authorize_cookie, (req,res)=>profilesController.fill_select(req,res) )

//------------------------------------------------------------------------------
router.route('/user-roles')
  .get(authorize_cookie, (req,res)=>rolesController.select(req,res) )
  .post(authorize_cookie, (req,res)=>rolesController.create(req,res) );  
router.route('/user-roles/:id')
  .get(authorize_cookie, (req,res)=>rolesController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>rolesController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>rolesController.delete(req,res) );  

router.route('/user-roles-fill-select')
  .get(authorize_cookie, (req,res)=>rolesController.fill_select(req,res) )

//------------------------------------------------
router.route('/nsi')
  .get(authorize_cookie, (req,res)=>nsiController.select(req,res) )
  .post(authorize_cookie, (req,res)=>nsiController.create(req,res) );

router.route('/nsi/:id')
  .get(authorize_cookie, (req,res)=>nsiController.findOne(req,res) )
  .put(authorize_cookie, (req,res)=>nsiController.update(req,res) )
  .delete(authorize_cookie, (req,res)=>nsiController.delete(req,res) );
//-------------------------------------------------------------------------------


module.exports =  router 