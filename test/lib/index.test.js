'use strict';

const assert = require('assert');
const authorizationHeader = require('../../lib/index');
const getReq = require('../fixtures/request');
const getRes = require('../fixtures/response');

describe('AuthorizationHeader', function() {

  let token = 'qwerty';

  it('should set "req.token" correctly', function() {
    let req = getReq('Bearer', token);

    authorizationHeader()(req, null, function() {
      assert.equal(token, req.token);
    });
  });

  it('should set "req.token" correctly (callback provided)', function() {
    let req = getReq('Bearer', token);

    authorizationHeader(function(err, req, res, next) {
      assert.ifError(err);
      assert.equal(token, req.token);
    })(req);
  });

  it('should return error `E_AUTHORIZATION_REQUIRED` (callback provided)', function() {
    let req = { req: {} };

    authorizationHeader(function(err, req, res, next) {
      assert(err);
      assert.equal(err.code, 'E_AUTHORIZATION_REQUIRED');
    })(req);
  });

  it('should set "req.token" correctly (callback provided) using "Basic" type', function() {
    let req = getReq('Basic', token);

    authorizationHeader({
      type: 'Basic'
    }, function(err, req, res, next) {
      assert.ifError(err);
      assert.equal(token, req.token);
    })(req);
  });

  it('should override default attachTo key', function() {
    let req = getReq('Bearer', token);
    let newKey = 'apiKey';

    authorizationHeader({
      attachTo: newKey
    })(req, null, function() {
      assert.ok(req[newKey]);
      assert.equal(token, req[newKey]);
    });
  });

  it('should set `compareTo` option', function() {
    let req = getReq('Bearer', token);

    authorizationHeader({
      compareTo: token
    })(req, null, function() {
      assert.ok(req.token);
      assert.equal(token, req.token);
    });
  });

  it('should fail using `compareTo` option `E_AUTHORIZATION_INVALID_TOKEN`', function() {
    let req = getReq('Bearer', token);
    let res = getRes('E_AUTHORIZATION_INVALID_TOKEN');

    authorizationHeader({
      compareTo: 'invalid_token'
    })(req, res);
  });

  it('should fail using `compareTo` option `E_AUTHORIZATION_INVALID_TOKEN` (callback provided)', function() {
    let req = getReq('Bearer', token);

    authorizationHeader({
      compareTo: 'invalid_token'
    }, function(err, req, res, next) {
      assert(err);
      assert.equal(err.code, 'E_AUTHORIZATION_INVALID_TOKEN');
    })(req);
  });

  it('should return default attachTo key as undefined', function() {
    let req = getReq('Bearer', token);

    authorizationHeader({
      attachTo: 'accessToken',
    })(req, null, function() {
      assert.ok(req.token === undefined);
    });
  });

  it('should throw if second argument is not a function', function() {
    try {
      authorizationHeader(null, 'invalid_callback');
    } catch (err) {
      assert.ok(err);
      assert(/Second argument must be a function callback/.test(err));
    }
  });

  it('should return E_AUTHORIZATION_REQUIRED', function() {
    let req = { req: {} };
    let res = getRes('E_AUTHORIZATION_REQUIRED');

    authorizationHeader()(req, res);
  });

  it('should return E_AUTHORIZATION_INVALID_FORMAT', function() {
    let req = getReq('Bearer');
    let res = getRes('E_AUTHORIZATION_INVALID_FORMAT');

    authorizationHeader()(req, res);
  });

  it('should return E_AUTHORIZATION_INVALID_TYPE', function() {
    let req = getReq('Bearer', token);
    let res = getRes('E_AUTHORIZATION_INVALID_TYPE');

    authorizationHeader({ type: 'Basic' })(req, res);
  });
});
