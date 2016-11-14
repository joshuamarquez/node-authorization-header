# node-authorization-header

[![npm version](https://badge.fury.io/js/authorization-header.svg)](https://badge.fury.io/js/authorization-header) [![Build Status](https://travis-ci.org/joshuamarquez/node-authorization-header.svg?branch=master)](https://travis-ci.org/joshuamarquez/node-authorization-header)

Authorization Header middleware for Express and Sails.js

Validates and extracts `token` value from Authorization Header of a given type, e.g. `Bearer`.

## Install

```
$ npm install authorization-header --save
```

## Overview

### authorizationHeader(options, [callback])

`options`

* `type` The type of Authorization, e.g. `Bearer`, `Basic`, `Digest`, etc.
* `attachTo` Where the token value extracted will be attach to, defaults to `token`.

### Usage in Express

Default behavior

```javascript
const authorizationHeader = require('authorization-header');

app.get('/', authorizationHeader(), function(req, res) {
  // toke value extracted can be found at `req.token`
});
```

Usage of `type` and `attachTo` options.

```javascript
const authorizationHeader = require('authorization-header');

app.use(authorizationHeader({
  type: 'Basic',
  attachTo: 'apiKey'
});

app.get('/', function(req, res) {
  res.send(req.apiKey);
});
```

### Usage in Sails.js

Default behavior

```javascript
// Will return 401 HTTP status code if any errors occurred.
// policies/authorizationHeader.js
module.exports = require('authorization-header')({ type: 'Digest' });
```

Default behavior

```javascript
// policies/authorizationHeader.js
module.exports = require('authorization-header')(function(err, req, res, next) {
  if (!err) {
    return next();
  }

  return res.unauthorized(err);
});
```

## Error handling

Possible thrown errors

### AuthorizationHeaderError

| message                                            | code                                 |
| ---------------------------------------------------|:------------------------------------:|
| No Authorization header is present.                | `E_AUTHORIZATION_REQUIRED`           |
| Formats should be `Authorization: <type> <token>`. | `E_AUTHORIZATION_INVALID_FORMAT`     |
| Authorization of type `<type>` was expected.       | `E_AUTHORIZATION_INVALID_TYPE`       |

Suppose `E_AUTHORIZATION_INVALID_TYPE` error was thrown

```javascript
app.use(authorizationHeader(function(err, req, res, next) {
  if (err) {
    console.log(err.toJSON());
    /*
      {
        status: 401,
        message: 'Authorization of type Bearer was expected',
        code: 'E_AUTHORIZATION_INVALID_TYPE'
      }
    */
  }
}));
```

## Test

```
$ npm test
```
