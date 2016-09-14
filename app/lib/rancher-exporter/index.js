var co = require('co')
var assign = require('object-assign')
var prom = require('prom-client')
clearInterval(prom.defaultMetrics())

var RancherExporter = module.exports = function (client) {
  this._client = client
}

RancherExporter.prototype.metrics = co.wrap(function * () {
  prom.register.clear()

  var rancher = yield {
    environments: this._client.environments(),
    hosts: this._client.hosts(),
    stacks: this._client.stacks(),
    services: this._client.services()
  }

  var environments = rancher.environments.reduce((map, env) => assign(map, { [env.id]: env }), {})
  var stacks = rancher.stacks.reduce((map, stack) => assign(map, { [stack.id]: stack }), {})

  var environments_gauge = new prom.Gauge(
    'rancher_environment_health',
    'Value of 1 if the environment is active',
    [ 'environment' ]
  )
  rancher.environments.forEach((env) => {
    environments_gauge.set({
      environment: env.name
    }, env.healthy || 0)
  })

  var hosts_gauge = new prom.Gauge(
    'rancher_host_health',
    'Value of 1 if the host is active and healthy',
    [ 'environment', 'host' ]
  )
  rancher.hosts.forEach((host) => {
    hosts_gauge.set({
      environment: environments[host.environment].name,
      host: host.name
    }, host.healthy || 0)
  })

  var stacks_gauge = new prom.Gauge(
    'rancher_stack_health',
    'Value of 1 if the stack is active and healthy',
    [ 'environment', 'stack' ]
  )
  rancher.stacks.forEach((stack) => {
    stacks_gauge.set({
      environment: environments[stack.environment].name,
      stack: stack.name
    }, stack.healthy || 0)
  })

  var services_gauge = new prom.Gauge(
    'rancher_service_health',
    'Value of 1 if the service is active and healthy',
    [ 'environment', 'stack', 'service' ]
  )
  rancher.services.forEach((service) => {
    services_gauge.set({
      environment: environments[service.environment].name,
      stack: stacks[service.stack].name,
      service: service.name
    }, service.healthy || 0)
  })

  return prom.register.metrics()
})
