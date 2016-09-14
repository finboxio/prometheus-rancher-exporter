require('rootenv')

require('chai').should()
var test = require('@lr/ava').test

var Types = require('..')
var Errors = require('../errors.js')

test('RancherTypes should throw an error if a property value is invalid', function (t) {
  (() => new Types.Host({}))
    .should
    .throw(Errors.InvalidRancherTypePropertyError)
})

test('RancherTypes should not throw an error if all required properties are valid', function (t) {
  (() => new Types.Environment({ id: 'id', name: 'name', health: 1 }))
    .should
    .not
    .throw(Errors.InvalidRancherTypePropertyError)
})

test('RancherTypes should set property defaults where specified', function (t) {
  var env = new Types.Environment({ id: 'id', name: 'name' })
  env.healthy.should.equal(0)
})
