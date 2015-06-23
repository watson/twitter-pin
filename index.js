'use strict'

var OAuth = require('oauth').OAuth

var TwitterPin = module.exports = function (consumerKey, consumerSecret) {
  if (!(this instanceof TwitterPin)) return new TwitterPin(consumerKey, consumerSecret)

  this._oa = new OAuth(
    'https://twitter.com/oauth/request_token',
    'https://twitter.com/oauth/access_token',
    consumerKey, consumerSecret, '1.0A', null, 'HMAC-SHA1')
}

TwitterPin.prototype.getUrl = function (cb) {
  this._oa.getOAuthRequestToken(function (err, token, secret) {
    if (err) return cb(formatOAuthError(err))
    this._token = token
    this._secret = secret
    cb(null, 'https://twitter.com/oauth/authorize?oauth_token=' + token)
  }.bind(this))
}

TwitterPin.prototype.authorize = function (pin, cb) {
  this._oa.getOAuthAccessToken(this._token, this._secret, pin, function (err, token, secret, result) {
    if (err) return cb(formatOAuthError(err))
    result.token = token
    result.secret = secret
    cb(null, result)
  })
}

var formatOAuthError = function (oauthErr) {
  var err

  if (oauthErr.data[0] === '{') {
    try {
      oauthErr.data = JSON.parse(oauthErr.data)
    } catch (e) {}
  }

  if (typeof oauthErr.data === 'string') {
    err = new Error(oauthErr.data)
  } else {
    // there might be multiple errors, but let's just show the user one at a time
    var error = oauthErr.data.errors[0]
    err = new Error(error.message)
    err.code = error.code
  }

  err.statusCode = oauthErr.statusCode

  return err
}
