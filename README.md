# twitter-pin

A dead simple Twitter PIN-based authorization module.

> The PIN-based OAuth flow is intended for applications which cannot
> access or embed a web browser in order to redirect the user to the
> authorization endpoint. Examples of such applications would be
> command-line applications, embedded systems, game consoles, and
> certain types of mobile apps.

[Twitter / Developers / Documentation / OAuth / PIN-based authorization](https://dev.twitter.com/oauth/pin-based)

[![Build status](https://travis-ci.org/watson/twitter-pin.svg?branch=master)](https://travis-ci.org/watson/twitter-pin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install twitter-pin
```

## Usage

The twitter-pin module should be initialzied with the `consumerKey` and
`consumerSecret` issued by Twitter when you [register your Twitter
application](https://apps.twitter.com). After registering click "manage
keys and access tokens" under the apps "Application Settings".

```js
var twitterPin = require('twitter-pin')(consumerKey, consumerSecret)

twitterPin.getUrl(function (err, url) {
  if (err) throw err

  console.log('1) Open:', url)
  console.log('2) Enter PIN:')

  process.stdin.once('data', function (pin) {
    twitterPin.authorize(pin.toString().trim(), function (err, result) {
      if (err) throw err

      console.log(result) // => { token: '...',
                          //      secret: '...',
                          //      user_id: 0,
                          //      screen_name: '...' }
    })
  })
})
```

## License

MIT
