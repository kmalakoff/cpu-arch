import cp from 'child_process';

export default function execCallback(cmd: string, options: cp.ExecOptions, callback: (error: cp.ExecException | null, stdout: string, stderr: string) => void): cp.ChildProcess {
  return cp.exec(cmd, options, callback);
}
