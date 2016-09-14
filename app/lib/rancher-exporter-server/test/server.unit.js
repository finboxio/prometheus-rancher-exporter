require('chai').should()
var test = require('@lr/ava').test
var st = require('supertest')
var sinon = require('sinon')

var Server = require('..')
var Exporter = require('rancher-exporter')

process.env.PORT = 0

test.beforeEach((t) => {
  var exporter = new Exporter()
  sinon.stub(exporter, 'metrics').returns(Promise.resolve('metrics'))
  t.context.server = new Server(exporter)
})

test('GET / should identify itself', function * (t) {
  var res = yield (done) => st(t.context.server.listen())
    .get('/')
    .expect(200)
    .end(done)
  res.text.should.equal('prometheus rancher exporter')
})

test('GET /metrics should return metrics from the exporter', function * (t) {
  var res = yield (done) => st(t.context.server.listen())
    .get('/metrics')
    .expect(200)
    .end(done)
  res.text.should.deep.equal('metrics')
})
