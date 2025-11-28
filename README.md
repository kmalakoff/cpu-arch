# cpu-arch

Detect CPU architecture (not process architecture).

Handles emulation scenarios where `process.arch` returns the wrong value:

- **Windows WoW64**: 32-bit Node on 64-bit Windows → returns `x64`
- **macOS Rosetta 2**: x64 Node on Apple Silicon → returns `arm64`
- **Windows ARM64**: Any Node on ARM Windows → returns `arm64`

## Installation

```bash
npm install cpu-arch
```

## Usage

```javascript
const cpuArch = require('cpu-arch');

console.log(cpuArch());
// => 'x64', 'arm64', 'ia32', 'arm', etc.
```

## Why Not `process.arch`?

`process.arch` returns the architecture of the **Node.js binary**, not the **CPU**:

| Scenario | `process.arch` | `cpuArch()` |
|----------|----------------|-------------|
| 32-bit Node on 64-bit Windows | `ia32` | `x64` |
| x64 Node on Apple Silicon (Rosetta) | `x64` | `arm64` |
| Native arm64 Node on Apple Silicon | `arm64` | `arm64` |

This matters when selecting native binaries (e.g., `@swc/core`, Node.js downloads).

## Return Values

| Value | Description |
|-------|-------------|
| `x64` | 64-bit Intel/AMD |
| `arm64` | 64-bit ARM (Apple Silicon, ARM64 Windows/Linux) |
| `ia32` | 32-bit Intel/AMD |
| `arm` | 32-bit ARM |
| `ia64` | Intel Itanium |
| Other | Raw `uname -m` output (ppc64, s390x, etc.) |

## Platform Detection Methods

| Platform | Method |
|----------|--------|
| Windows | `PROCESSOR_ARCHITEW6432` / `PROCESSOR_ARCHITECTURE` env vars |
| macOS | `sysctl -in sysctl.proc_translated` for Rosetta detection |
| Linux | `uname -m` |

## License

MIT
