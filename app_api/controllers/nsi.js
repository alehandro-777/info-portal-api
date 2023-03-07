const Entity = require('../models/nsi')
const BaseController = require('./base-controller')

//class NewController extends BaseController {

module.exports = new BaseController(Entity);