const Entity = require('../models/gpa')
const BaseController = require('./base-controller')

//class NewController extends BaseController {

module.exports = new BaseController(Entity);