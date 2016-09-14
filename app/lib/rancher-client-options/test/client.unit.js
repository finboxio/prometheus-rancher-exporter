require('rootenv')

require('chai').should()
var test = require('@lr/ava').test

var Client = require('..')
var Errors = require('../errors.js')

test('RancherClientOptions(opts) should throw an error if no url is provided', function (t) {
  (() => new Client({ access_key: 'key', secret_key: 'secret' }))
    .should
    .throw(Errors.InvalidRancherUrlError)
})

test('RancherClientOptions(opts) should throw an error if no access_key is provided', function (t) {
  (() => new Client({ url: 'url', secret_key: 'secret' }))
    .should
    .throw(Errors.InvalidRancherAccessKeyError)
})

test('RancherClientOptions(opts) should throw an error if no secret_key is provided', function (t) {
  (() => new Client({ access_key: 'key', url: 'url' }))
    .should
    .throw(Errors.InvalidRancherSecretKeyError)
})
