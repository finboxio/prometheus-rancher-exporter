var Errors = require('./errors')

var RancherClientOptions = module.exports = function (opts) {
  validate(opts)
  this.url = opts.url
  this.access_key = opts.access_key
  this.secret_key = opts.secret_key
}

var validate = RancherClientOptions.validate = function (opts) {
  if (!opts.url) throw new Errors.InvalidRancherUrlError()
  if (!opts.access_key) throw new Errors.InvalidRancherAccessKeyError()
  if (!opts.secret_key) throw new Errors.InvalidRancherSecretKeyError()
}
