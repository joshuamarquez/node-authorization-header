'use strict';

const AuthorizationHeaderError = require('./error/AuthorizationHeaderError');

module.exports = function authorizationHeader(options, cb) {

  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  else if (cb && typeof cb !== 'function') {
    throw new Error('Second argument must be a function callback');
  }

  options = (options || {});

  // Set default `type` to `Bearer`
  // in case it is not provided.
  const type = options.type || 'Bearer';

  // `attachTo` option to allow the user to override the
  // default `key` where the `token` will be attached to.
  const attachTo = options.attachTo || 'token';

  return function middleware(req, res, next) {
    let parts;

    if (!req.headers || !req.headers.authorization) {
      return finish({
        status: 401,
        code: 'E_AUTHORIZATION_REQUIRED',
        message: 'No Authorization header is present.'
      });
    }

    // Extract `type` and `token` values
    parts = req.headers.authorization.replace(/\s+/g, ' ').trim().split(' ');

    if (parts.length !== 2) {
      return finish({
        status: 401,
        code: 'E_AUTHORIZATION_INVALID_FORMAT',
        message: 'Formats should be `Authorization: <type> <token>`.'
      });
    }

    if (parts[0] !== type) {
      return finish({
        status: 401,
        code: 'E_AUTHORIZATION_INVALID_TYPE',
        message: `Authorization of type ${type} was expected.`
      });
    }

    function finish(error) {
      if (error) {
        return res.status(error.status).json(error);
      }

      req[attachTo.toString()] = parts[1];

      if (cb) {
        return cb(error, req, res, next);
      }

      return next();
    }

    finish();
  };
};
