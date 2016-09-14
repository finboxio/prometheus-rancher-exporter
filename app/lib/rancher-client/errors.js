var util = require('util')

exports.InvalidRancherClientOptionsError = function (options) {
  this.name = 'InvalidRancherClientOptionsError'
  this.message = `RancherClient expects options of type RancherClientOptions (got ${typeof options})`
}
util.inherits(exports.InvalidRancherClientOptionsError, Error)
