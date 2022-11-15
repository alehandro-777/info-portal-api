const Entity = require('../models/user')
const BaseController = require('../controllers/base-controller')

//class NewController extends BaseController {

module.exports = new BaseController(Entity);