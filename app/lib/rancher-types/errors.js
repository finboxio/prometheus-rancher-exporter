var util = require('util')

exports.InvalidRancherTypePropertyError = function (obj, property, value) {
  this.name = 'InvalidRancherTypePropertyError'
  this.property = property
  this.value = value
  if (obj) this.type = obj.type
  this.message = `"${value}" is not a valid value for property ${property} of type ${this.type}`
}

util.inherits(exports.InvalidRancherTypePropertyError, Error)
