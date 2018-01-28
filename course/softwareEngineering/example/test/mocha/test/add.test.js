var assert = require('assert')

const add = require('../add');

describe('add', () => {
  it('should add two numbers', () => {
    assert.equal(add(1, 2), 3);
  });
});
