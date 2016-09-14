require('rootenv')

require('chai').should()
var test = require('@lr/ava').test
var sinon = require('sinon')

var Exporter = require('..')
var Types = require('rancher-types')
var Client = require('rancher-client')

var environments = [{
  id: '1e1',
  name: 'env-1'
}].map((env) => new Types.Environment(env))

var hosts = [{
  id: '1h1',
  name: 'host-1',
  environment: '1e1'
}].map((host) => new Types.Host(host))

var stacks = [{
  id: '1s1',
  name: 'stack-1',
  environment: '1e1'
}].map((stack) => new Types.Stack(stack))

var services = [{
  id: '1s1-1',
  name: 'service-1',
  stack: '1s1',
  environment: '1e1'
}].map((service) => new Types.Service(service))

test.beforeEach((t) => {
  var client = new Client()
  sinon.stub(client, 'environments').returns(Promise.resolve(environments))
  sinon.stub(client, 'hosts').returns(Promise.resolve(hosts))
  sinon.stub(client, 'stacks').returns(Promise.resolve(stacks))
  sinon.stub(client, 'services').returns(Promise.resolve(services))
  t.context.exporter = new Exporter(client)
})

test('RancherExporter.metrics() should map names to labels', function * (t) {
  var metrics = yield t.context.exporter.metrics()
  metrics.should.equal(
`# HELP rancher_environment_health Value of 1 if the environment is active
# TYPE rancher_environment_health gauge
rancher_environment_health{environment="env-1"} 0
# HELP rancher_host_health Value of 1 if the host is active and healthy
# TYPE rancher_host_health gauge
rancher_host_health{environment="env-1",host="host-1"} 0
# HELP rancher_stack_health Value of 1 if the stack is active and healthy
# TYPE rancher_stack_health gauge
rancher_stack_health{environment="env-1",stack="stack-1"} 0
# HELP rancher_service_health Value of 1 if the service is active and healthy
# TYPE rancher_service_health gauge
rancher_service_health{environment="env-1",stack="stack-1",service="service-1"} 0
`)
})
