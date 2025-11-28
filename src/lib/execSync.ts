import cp from 'child_process';
import Module from 'module';
import path from 'path';
import url from 'url';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

let functionExec: ((options: { callbacks: boolean }, workerPath: string, cmd: string, execOptions: { encoding?: BufferEncoding }) => string) | null = null;

/**
 * Local execSync implementation that doesn't pollute global namespace.
 * Uses native cp.execSync if available (Node 0.12+), otherwise falls back
 * to function-exec-sync polyfill.
 */
export default function execSync(cmd: string, options: { encoding?: BufferEncoding } = {}): string {
  // Use native execSync if available (Node 0.12+)
  if (typeof cp.execSync === 'function') {
    return cp.execSync(cmd, options) as unknown as string;
  }

  // Polyfill for Node < 0.12 using function-exec-sync
  if (!functionExec) {
    functionExec = _require('function-exec-sync');
  }
  const workerPath = path.join(__dirname, 'worker.cjs');
  return functionExec!({ callbacks: true }, workerPath, cmd, options);
}
