import cp from 'child_process';
import { bindSync } from 'node-version-call-local';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const workerPath = path.join(__dirname, '..', '..', 'cjs', 'lib', 'execSync.js');

function run(cmd: string, options: { encoding?: BufferEncoding } = {}): string {
  return cp.execSync(cmd, options) as unknown as string;
}

type execSyncFunction = (cmd: string, options?: { encoding?: BufferEncoding }) => string;

// execSync was added in Node 0.12
// spawnOptions: false - no node/npm spawn (shell commands only)
const worker = (typeof cp.execSync === 'function' ? run : bindSync('>=0.12', workerPath, { spawnOptions: false })) as execSyncFunction;

export default function execSync(cmd: string, options: { encoding?: BufferEncoding } = {}): string {
  return worker(cmd, options) as string;
}
