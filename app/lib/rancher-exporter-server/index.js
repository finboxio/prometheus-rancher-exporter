var yoo = require('yoo')(__dirname)
var request = require('request-promise')

module.exports = function (exporter, client) {
  yoo.get('/', return_name('prometheus rancher exporter'))
  yoo.get('/metrics', return_metrics(exporter))
  yoo.get('/server', proxy_server(client))
  return yoo
}

var return_name = (name) => function * (next) { this.body = name }
var return_metrics = (exporter) => function * (next) { this.body = yield exporter.metrics() }
var proxy_server = (client) => function * (next) {
  var url = yield client.graphiteUrl()
  var res = yield request.get(url)
  this.body = res
}
