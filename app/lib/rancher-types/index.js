var Errors = require('./errors')

exports.Environment = function (env) {
  env.type = 'RancherEnvironment'
  ensure_property('id', env)
  ensure_property('name', env)
  ensure_property('healthy', env, 0)
  return env
}

exports.Host = function (host) {
  host.type = 'RancherHost'
  ensure_property('id', host)
  ensure_property('name', host)
  ensure_property('environment', host)
  ensure_property('healthy', host, 0)
  return host
}

exports.Stack = function (stack) {
  stack.type = 'RancherStack'
  ensure_property('id', stack)
  ensure_property('name', stack)
  ensure_property('environment', stack)
  ensure_property('healthy', stack, 0)
  return stack
}

exports.Service = function (service) {
  service.type = 'RancherService'
  ensure_property('id', service)
  ensure_property('name', service)
  ensure_property('environment', service)
  ensure_property('stack', service)
  ensure_property('healthy', service, 0)
  return service
}

function ensure_property (prop, obj, def) {
  obj[prop] = obj[prop] || def
  if (obj[prop] === undefined) {
    console.log(obj)
    throw new Errors.InvalidRancherTypePropertyError(obj, prop, obj[prop] || '<undefined>')
  }
}
