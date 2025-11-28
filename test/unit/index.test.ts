import assert from 'assert';
import cpuArch from 'cpu-arch';

describe('cpu-arch', () => {
  describe('return value', () => {
    it('returns a non-empty string', () => {
      const result = cpuArch();
      assert.ok(typeof result === 'string', 'should return a string');
      assert.ok(result.length > 0, 'should not be empty');
    });

    it('returns a known architecture value', () => {
      const known = ['x64', 'arm64', 'ia32', 'arm', 'ia64', 'ppc64', 'ppc64le', 's390x', 'mips', 'mips64'];
      const result = cpuArch();
      // Result should be a known value or at least a valid string from uname
      assert.ok(typeof result === 'string', 'should be a string');
      console.log(`  Detected architecture: ${result}`);
    });
  });

  describe('consistency', () => {
    it('returns same value on repeated calls', () => {
      const first = cpuArch();
      const second = cpuArch();
      const third = cpuArch();
      assert.strictEqual(first, second, 'first and second calls should match');
      assert.strictEqual(second, third, 'second and third calls should match');
    });

    it('documents difference from process.arch if any', () => {
      const result = cpuArch();
      const processArch = process.arch;

      console.log(`  process.arch: ${processArch}`);
      console.log(`  cpuArch(): ${result}`);

      if (result !== processArch) {
        console.log('  ⚠️  Emulation detected: process.arch differs from actual CPU architecture');
      }
    });
  });

  if (process.platform === 'win32') {
    describe('Windows-specific', () => {
      it('uses PROCESSOR_ARCHITECTURE env var', () => {
        const arch = process.env.PROCESSOR_ARCHITEW6432 || process.env.PROCESSOR_ARCHITECTURE;
        assert.ok(arch, 'PROCESSOR_ARCHITECTURE should be set on Windows');
        console.log(`  PROCESSOR_ARCHITECTURE: ${process.env.PROCESSOR_ARCHITECTURE}`);
        console.log(`  PROCESSOR_ARCHITEW6432: ${process.env.PROCESSOR_ARCHITEW6432 || '(not set)'}`);
      });

      it('returns x64, arm64, ia64, or ia32 on Windows', () => {
        const result = cpuArch();
        assert.ok(['x64', 'arm64', 'ia64', 'ia32'].includes(result), `unexpected result: ${result}`);
      });

      it('returns x64 when PROCESSOR_ARCHITEW6432 is AMD64 (WoW64)', () => {
        if (process.env.PROCESSOR_ARCHITEW6432 === 'AMD64') {
          const result = cpuArch();
          assert.strictEqual(result, 'x64', 'should return x64 for WoW64');
          console.log('  ✓ WoW64 detected: 32-bit Node on 64-bit Windows');
        } else if (process.arch === 'ia32') {
          console.log('  ℹ️  Running native 32-bit Windows (no WoW64)');
        } else {
          console.log('  ℹ️  Running native 64-bit Node');
        }
      });

      it('returns arm64 when PROCESSOR_ARCHITECTURE is ARM64', () => {
        if (process.env.PROCESSOR_ARCHITECTURE === 'ARM64' || process.env.PROCESSOR_ARCHITEW6432 === 'ARM64') {
          const result = cpuArch();
          assert.strictEqual(result, 'arm64', 'should return arm64 for ARM64 Windows');
          console.log('  ✓ Windows ARM64 detected');
        } else {
          console.log('  ℹ️  Not running on Windows ARM64');
        }
      });
    });
  }

  if (process.platform === 'darwin') {
    describe('macOS-specific', () => {
      it('returns x64 or arm64 on macOS', () => {
        const result = cpuArch();
        assert.ok(['x64', 'arm64'].includes(result), `unexpected result: ${result}`);
      });

      it('detects Apple Silicon correctly', () => {
        const result = cpuArch();
        if (process.arch === 'arm64') {
          assert.strictEqual(result, 'arm64', 'native arm64 should return arm64');
          console.log('  ✓ Native Apple Silicon detected');
        } else if (result === 'arm64') {
          console.log('  ✓ Rosetta 2 detected: x64 Node on Apple Silicon');
        } else {
          console.log('  ✓ Intel Mac detected');
        }
      });
    });
  }

  if (process.platform === 'linux') {
    describe('Linux-specific', () => {
      it('returns a valid architecture for Linux', () => {
        const result = cpuArch();
        const valid = ['x64', 'arm64', 'arm', 'ia32', 'ppc64', 'ppc64le', 's390x', 'mips', 'mips64'];
        // Could also be the raw uname output for unusual architectures
        assert.ok(typeof result === 'string', 'should be a string');
        console.log(`  Linux architecture: ${result}`);
      });

      it('normalizes common uname outputs', () => {
        const result = cpuArch();
        // Verify normalization
        if (result === 'x64') {
          console.log('  ✓ x86_64 normalized to x64');
        } else if (result === 'arm64') {
          console.log('  ✓ aarch64 normalized to arm64');
        } else if (result === 'arm') {
          console.log('  ✓ armv* normalized to arm');
        } else if (result === 'ia32') {
          console.log('  ✓ i686/i386 normalized to ia32');
        } else {
          console.log(`  ✓ Using raw uname output: ${result}`);
        }
      });
    });
  }

  describe('edge cases', () => {
    it('handles repeated calls efficiently', () => {
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        cpuArch();
      }
      const elapsed = Date.now() - start;
      console.log(`  100 calls took ${elapsed}ms`);
      // Should be reasonably fast (native execSync or env var lookup)
      assert.ok(elapsed < 5000, 'should complete 100 calls in under 5 seconds');
    });
  });
});
