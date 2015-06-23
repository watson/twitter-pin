'use strict'

var test = require('tape')
var TwitterPin = require('./')

var consumerKey = 'foo'
var consumerSecret = 'bar'

test('constructor', function (t) {
  var twitterPin = new TwitterPin(consumerKey, consumerSecret)
  t.equal(twitterPin._oa._consumerKey, consumerKey)
  t.equal(twitterPin._oa._consumerSecret, consumerSecret)
  t.end()
})

test('getUrl()', function (t) {
  var twitterPin = new TwitterPin(consumerKey, consumerSecret)

  twitterPin._oa.getOAuthRequestToken = function (cb) {
    process.nextTick(function () {
      cb(null, 'token1', 'secret1')
    })
  }

  twitterPin.getUrl(function (err, url) {
    t.error(err)
    t.equal(url, 'https://twitter.com/oauth/authorize?oauth_token=token1')
    t.end()
  })
})

test('authorize()', function (t) {
  var twitterPin = new TwitterPin(consumerKey, consumerSecret)

  twitterPin._oa.getOAuthRequestToken = function (cb) {
    process.nextTick(function () {
      cb(null, 'token1', 'secret1')
    })
  }

  twitterPin._oa.getOAuthAccessToken = function (token, secret, pin, cb) {
    t.equal(token, 'token1')
    t.equal(secret, 'secret1')
    t.equal(pin, 'pin')
    process.nextTick(function () {
      cb(null, 'token2', 'secret2', { foo: 'bar' })
    })
  }

  twitterPin.getUrl(function (err, url) {
    t.error(err)
    twitterPin.authorize('pin', function (err, result) {
      t.error(err)
      t.equal(result.foo, 'bar')
      t.equal(result.token, 'token2')
      t.equal(result.secret, 'secret2')
    })
    t.end()
  })
})

test('getUrl() - invalid consumer', function (t) {
  var twitterPin = new TwitterPin('invalid', 'invalid')
  twitterPin.getUrl(function (err, url) {
    t.equal(err.statusCode, 401)
    t.equal(err.code, 32)
    t.equal(err.message, 'Could not authenticate you.')
    t.end()
  })
})

test('authorize() - invalid consumer', function (t) {
  var twitterPin = new TwitterPin(consumerKey, consumerSecret)

  twitterPin._oa.getOAuthRequestToken = function (cb) {
    process.nextTick(function () {
      cb(null, 'token1', 'secret1')
    })
  }

  twitterPin.getUrl(function (err, url) {
    t.error(err)
    twitterPin.authorize('invalid', function (err) {
      t.equal(err.statusCode, 401)
      t.equal(err.message, 'Invalid request token.')
      t.end()
    })
  })
})
