import execSync from './lib/execSync.ts';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE || '');

/**
 * Detect actual CPU architecture (not process architecture).
 *
 * Handles emulation scenarios:
 * - Windows WoW64: 32-bit Node on 64-bit Windows → returns 'x64'
 * - macOS Rosetta 2: x64 Node on Apple Silicon → returns 'arm64'
 * - Windows ARM64: Any Node on ARM Windows → returns 'arm64'
 *
 * @returns Architecture string: 'x64', 'arm64', 'ia32', 'arm', 'ia64', or raw uname output
 */
export default function cpuArch(): string {
  // macOS: Detect Rosetta 2 and return actual CPU
  if (process.platform === 'darwin') {
    if (process.arch === 'arm64') return 'arm64';
    try {
      // sysctl returns '1\n' if running via Rosetta
      const result = execSync('sysctl -in sysctl.proc_translated', { encoding: 'utf8' });
      if (result === '1\n') return 'arm64';
    } catch (_) {
      // sysctl failed, assume x64
    }
    return 'x64';
  }

  // Windows: Use environment variables (works for WoW64 and ARM64)
  if (isWindows) {
    // PROCESSOR_ARCHITEW6432 is set when 32-bit process on 64-bit Windows
    const arch = process.env.PROCESSOR_ARCHITEW6432 || process.env.PROCESSOR_ARCHITECTURE;
    if (arch === 'AMD64') return 'x64';
    if (arch === 'ARM64') return 'arm64';
    if (arch === 'IA64') return 'ia64';
    return 'ia32'; // x86
  }

  // Linux/other POSIX: Use uname -m
  try {
    const uname = execSync('uname -m', { encoding: 'utf8' }).trim();
    if (uname === 'x86_64') return 'x64';
    if (uname === 'aarch64') return 'arm64';
    if (uname.startsWith('armv7')) return 'arm';
    if (uname.startsWith('armv6')) return 'arm';
    if (uname === 'i686' || uname === 'i386') return 'ia32';
    // Return as-is for ppc64, ppc64le, s390x, mips, etc.
    return uname;
  } catch (_) {
    // uname failed, fall back to process.arch
  }

  // Fallback to process.arch
  return process.arch;
}

// Also export as named export for convenience
export { cpuArch };
