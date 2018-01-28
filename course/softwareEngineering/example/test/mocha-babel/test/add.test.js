import assert from 'assert'

import {add} from '../add'

describe('add', () => {
  it('should add two numbers', () => {
    assert.equal(add(1, 2), 3);
  });
});
