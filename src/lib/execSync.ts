import cp from 'child_process';
import Module from 'module';
import path from 'path';
import url from 'url';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

// Worker MUST always load from dist/cjs/ for old Node compatibility
const workerPath = path.join(__dirname, '..', '..', 'cjs', 'lib', 'worker.js');

let functionExec = null; // break dependencies
export default function execSync(cmd: string, options: { encoding?: BufferEncoding } = {}): string {
  // Use native execSync if available (Node 0.12+)
  if (typeof cp.execSync === 'function') {
    return cp.execSync(cmd, options) as unknown as string;
  }

  if (!functionExec) functionExec = _require('function-exec-sync');
  return functionExec?.({ callbacks: true }, workerPath, cmd, options);
}
