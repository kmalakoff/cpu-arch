const assert = require('assert');
const cpuArch = require('cpu-arch');

describe('exports .cjs', () => {
  it('default', () => {
    assert.equal(typeof cpuArch, 'function');
  });
  it('cpuArch', () => {
    assert.equal(typeof cpuArch.cpuArch, 'function');
  });
});
