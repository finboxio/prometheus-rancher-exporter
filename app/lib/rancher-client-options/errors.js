var util = require('util')

exports.InvalidRancherUrlError = function (url) {
  this.name = 'InvalidRancherUrlError'
  this.url = url
  this.message = `Rancher URL "${url || '<undefined>'}" is invalid`
}
util.inherits(exports.InvalidRancherUrlError, Error)

exports.InvalidRancherAccessKeyError = function (key) {
  this.name = 'InvalidRancherAccessKeyError'
  this.key = key
  this.message = `Rancher Access Key "${key || '<undefined>'}" is invalid`
}
util.inherits(exports.InvalidRancherAccessKeyError, Error)

exports.InvalidRancherSecretKeyError = function (key) {
  this.name = 'InvalidRancherSecretKeyError'
  this.key = key
  this.message = `Rancher SecretKey "${key || '<undefined>'}" is invalid`
}
util.inherits(exports.InvalidRancherSecretKeyError, Error)
