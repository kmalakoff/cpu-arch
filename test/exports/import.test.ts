import assert from 'assert';
import cpuArch, { cpuArch as cpuArchNamed } from 'cpu-arch';

describe('exports .ts', () => {
  it('default', () => {
    assert.equal(typeof cpuArch, 'function');
  });
  it('cpuArch', () => {
    assert.equal(typeof cpuArchNamed, 'function');
  });
});
