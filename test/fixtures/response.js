'use strict';

const assert = require('assert');

module.exports = function getRes(codeExpected) {
  return {
    status: (status) => {
      return {
        json: (err) => {
          assert.ok(err);
          assert.equal(err.code, codeExpected);
        }
      };
    }
  };
};
