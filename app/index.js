require('rootenv')

var envvar = require('envvar')

var RancherClient = require('rancher-client')
var RancherClientOptions = require('rancher-client-options')
var RancherExporter = require('rancher-exporter')
var RancherExporterServer = require('rancher-exporter-server')

var CATTLE_CONFIG_URL = envvar.string('CATTLE_CONFIG_URL')
var CATTLE_ACCESS_KEY = envvar.string('CATTLE_ACCESS_KEY')
var CATTLE_SECRET_KEY = envvar.string('CATTLE_SECRET_KEY')

var client_options = new RancherClientOptions({
  url: CATTLE_CONFIG_URL,
  access_key: CATTLE_ACCESS_KEY,
  secret_key: CATTLE_SECRET_KEY
})

var client = new RancherClient(client_options)
var exporter = new RancherExporter(client)
var server = new RancherExporterServer(exporter)

// Yoo needs to be updated to to handle undefined/0 port
// since newer versions of node don't accept undefined
var PORT = envvar.number('PORT', 0)
process.env.PORT = PORT

server.listen(PORT, function () {
  var addr = this.address()
  console.log('listening on port %d', addr.port)
})
