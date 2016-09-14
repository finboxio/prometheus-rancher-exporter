require('rootenv')

require('chai').should()
var test = require('@lr/ava').test
var nock = require('nock')
var fs = require('fs')

var Client = require('..')
var Errors = require('../errors')
var Options = require('rancher-client-options')

test.beforeEach((t) => {
  t.context.options = new Options({
    url: 'http://rancher/v1',
    access_key: 'test-access-key',
    secret_key: 'test-secret-key'
  })
  t.context.client = new Client(t.context.options)
})

test('RancherClient() should throw if created with something other than RancherClientOptions', function (t) {
  (() => new Client({}))
    .should
    .throw(Errors.InvalidRancherClientOptionsError)
})

test('RancherClient.hosts() should return a list of registered rancher hosts', function * (t) {
  nock('http://rancher')
    .get('/v1/hosts')
    .basicAuth({ user: t.context.options.access_key, pass: t.context.options.secret_key })
    .reply(200, require('./nock.hosts.json'))

  var hosts = yield t.context.client.hosts()
  hosts.should.deep.equal(require('./expected.hosts.json'))
})

test('RancherClient.environments() should return a list of rancher environments', function * (t) {
  nock('http://rancher')
    .get('/v1/projects')
    .basicAuth({ user: t.context.options.access_key, pass: t.context.options.secret_key })
    .reply(200, require('./nock.environments.json'))

  var environments = yield t.context.client.environments()
  environments.should.deep.equal(require('./expected.environments.json'))
})

test('RancherClient.stacks() should return a list of rancher stacks', function * (t) {
  nock('http://rancher')
    .get('/v1/environments')
    .basicAuth({ user: t.context.options.access_key, pass: t.context.options.secret_key })
    .reply(200, fs.createReadStream('./nock.stacks.json'))

  var stacks = yield t.context.client.stacks()
  stacks.should.deep.equal(require('./expected.stacks.json'))
})

test('RancherClient.services() should return a list of rancher services', function * (t) {
  nock('http://rancher')
    .get('/v1/services')
    .basicAuth({ user: t.context.options.access_key, pass: t.context.options.secret_key })
    .reply(200, fs.createReadStream('./nock.services.json'))

  var services = yield t.context.client.services()
  services.should.deep.equal(require('./expected.services.json'))
})
