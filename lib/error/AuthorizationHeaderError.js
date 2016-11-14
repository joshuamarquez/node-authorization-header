'use strict';

const util = require('util');

function AuthorizationHeaderError(properties) {
  Error.call(this);
  Error.captureStackTrace(this, AuthorizationHeaderError);

  properties = (properties || {});

  this.name = this.constructor.name;
  this.message = properties.message || 'Encountered an unexpected error';

  this.status = properties.status || 500;
  this.code = properties.code || 'E_UNKNOWN';
}

util.inherits(AuthorizationHeaderError, Error);

AuthorizationHeaderError.prototype.toString = function() {
  return util.format('[%s (%s) %s]', this.name, this.code, this.message);
};

AuthorizationHeaderError.prototype.toJSON = function() {
  return {
    status: this.status,
    code: this.code,
    message: this.message
  };
};

module.exports = AuthorizationHeaderError;
