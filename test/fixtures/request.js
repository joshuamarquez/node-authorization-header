'use strict';

module.exports = function getReq(type, token) {
  let values = [];

  if (type) {
    values.push(type);
  }

  if (token) {
    values.push(token);
  }

  return {
    headers: {
      authorization: values.join(' ')
    }
  };
};
