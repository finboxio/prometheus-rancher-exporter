var yoo = require('yoo')(__dirname)

module.exports = function (exporter) {
  yoo.get('/', return_name('prometheus rancher exporter'))
  yoo.get('/metrics', return_metrics(exporter))
  return yoo
}

var return_name = (name) => function * (next) { this.body = name }
var return_metrics = (exporter) => function * (next) { this.body = yield exporter.metrics() }
