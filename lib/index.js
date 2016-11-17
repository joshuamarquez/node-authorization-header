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

  // This options allows user to pass a value to compare
  // against the extracted `token`.
  const compareValue = options.compareTo || undefined;

  return function middleware(req, res, next) {
    let parts;
    let token;

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

    // Extract `token` value from `parts`.
    token = parts[1];

    // If `compareValue` if defined check if it matches
    // the `token` extracted from Authorization header.
    if (compareValue && compareValue !== token) {
      return finish({
        status: 401,
        code: 'E_AUTHORIZATION_INVALID_TOKEN',
        message: `Token provided is invalid.`
      });
    }

    function finish(error) {
      // Create `AuthorizationHeaderError` instance with `error` if exists.
      error = error ? new AuthorizationHeaderError(error) : undefined;

      // Return error immediately if callback was not provided.
      if (error && !cb) {
        return res.status(error.status).json(error);
      }

      // Append `token` extracted to request, if `compareTo` was
      // provided and returns an error this happens anyways.
      if (token) {
        req[attachTo.toString()] = token;
      }

      // Always execute callback if exists whether
      // there is an error or not.
      if (cb) {
        return cb(error, req, res, next);
      }

      return next();
    }

    finish();
  };
};
