var co = require('co')
var request = require('request-promise')
var debug = require('debug')('prometheus:rancher')

var RancherTypes = require('rancher-types')
var RancherClientOptions = require('rancher-client-options')
var Errors = require('./errors')

var RancherClient = module.exports = function (options) {
  if (options && !(options instanceof RancherClientOptions)) {
    throw new Errors.InvalidRancherClientOptionsError(options)
  }

  if (options) {
    this._request = request.defaults({
      baseUrl: options.url,
      gzip: true,
      json: true,
      auth: {
        user: options.access_key,
        pass: options.secret_key,
        sendImmediately: true
      }
    })
  }
}

// The routes here may be a little confusing, but rancher
// has changed its terminology. "environment" is the legacy
// term for what is now called a "stack", and "project" is
// the legacy term for what is now called an "environment".
//
// The functions exposed by this module prefer the new
// terminology.

RancherClient.prototype.hosts = co.wrap(function * () {
  var res = yield this._request.get('/hosts')
  return res.data.filter(drop_purged).map(map_host)
})

RancherClient.prototype.environments = co.wrap(function * () {
  var res = yield this._request.get('/projects')
  return res.data.filter(drop_purged).map(map_environment)
})

RancherClient.prototype.stacks = co.wrap(function * () {
  var res = yield this._request.get('/environments')
  return res.data.filter(drop_purged).map(map_stack)
})

RancherClient.prototype.services = co.wrap(function * () {
  var res = yield this._request.get('/services')
  return res.data.filter(drop_purged).map(map_service)
})

function drop_purged (obj) {
  return obj.state !== 'purged'
}

function map_host (host) {
  debug('host %s environment=%s agentState=%s state=%s', host.name || host.hostname, host.accountId, host.agentState, host.state)
  return new RancherTypes.Host({
    id: host.id,
    name: host.name || host.hostname,
    environment: host.accountId,
    labels: host.labels,
    healthy: ((!host.agentState || host.agentState === 'active') && host.state === 'active') ? 1 : 0
  })
}

function map_environment (env) {
  debug('environment %s state=%s', env.name, env.state)
  return new RancherTypes.Environment({
    id: env.id,
    name: env.name,
    healthy: env.state === 'active' ? 1 : 0
  })
}

function map_stack (stack) {
  debug('stack %s environment=%s healthState=%s state=%s', stack.name, stack.accountId, stack.state, stack.healthState)
  return new RancherTypes.Stack({
    id: stack.id,
    name: stack.name,
    environment: stack.accountId,
    healthy: (stack.state === 'active' && (!stack.healthState || stack.healthState === 'healthy')) ? 1 : 0
  })
}

function map_service (service) {
  debug('service %s environment=%s healthState=%s state=%s', service.name, service.accountId, service.state, service.healthState)
  return new RancherTypes.Service({
    id: service.id,
    name: service.name,
    environment: service.accountId,
    stack: service.environmentId,
    healthy: (service.state === 'active' && (!service.healthState || service.healthState === 'healthy' || service.healthState === 'started-once')) ? 1 : 0
  })
}
