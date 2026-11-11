const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vscode = require('vscode');

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalize = value => process.platform === 'win32' ? path.resolve(value).toLowerCase() : path.resolve(value);
async function until(probe, description, timeout = 60000) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try { const value = await probe(); if (value) return value; } catch (error) { lastError = error; }
    await pause(250);
  }
  throw new Error('Timeout: ' + description + (lastError ? ': ' + lastError.message : ''));
}

exports.run = async () => {
  const logs = [];
  const sessions = new Map();
  const subscriptions = [];
  function log(message) { logs.push(message); console.log(message); }
  try {
    const folder = vscode.workspace.workspaceFolders[0];
    log('Workspace: ' + folder.uri.fsPath);
    assert.equal(normalize(folder.uri.fsPath), normalize(process.env.RECONNECTA_WORKSPACE));

    // Reproduce the old shell task on Windows with scripts disabled.
    // This policy is scoped to the child process; no machine policy is changed.
    if (process.platform === 'win32') {
      const root = process.env.GITHUB_WORKSPACE;
      const relative = normalize(root) === normalize(folder.uri.fsPath) ? '.vscode/tasks.json' : 'ReConecta 1.0/.vscode/tasks.json';
      const old = JSON.parse(spawnSync('git', ['show', 'd9c40489b55749b6151adf96ae7ab4cab0654e1d:' + relative], { cwd: root, encoding: 'utf8' }).stdout).tasks[0];
      const quote = value => "'" + value.replace(/'/g, "''") + "'";
      const command = '& ' + old.command + ' ' + old.args.map(quote).join(' ');
      const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Restricted', '-Command', command], { cwd: folder.uri.fsPath, encoding: 'utf8', timeout: 15000 });
      log('Old task under Restricted PowerShell: ' + result.stderr);
      assert.notEqual(result.status, 0, 'old task should reproduce the script-policy failure');
      assert.match(result.stderr, /npm\.ps1|PSSecurityException|UnauthorizedAccess/);
    }

    subscriptions.push(vscode.debug.onDidStartDebugSession(session => { sessions.set(session.id, session); log('Started: ' + session.type + ' / ' + session.name); }));
    subscriptions.push(vscode.debug.onDidTerminateDebugSession(session => { sessions.delete(session.id); log('Terminated: ' + session.type); }));
    subscriptions.push(vscode.debug.registerDebugAdapterTrackerFactory('*', {
      createDebugAdapterTracker() {
        return { onDidSendMessage(message) {
          if (message.type === 'event' && message.event === 'output') log(message.body.output.trimEnd());
        } };
      }
    }));

    // Launch the actual saved configuration through VS Code's debugger API (F5).
    // Repeat after stopping to detect a Vite process left occupying port 5173.
    for (let cycle = 1; cycle <= 2; cycle++) {
      log('Request F5 cycle ' + cycle);
      const started = await Promise.race([
        vscode.debug.startDebugging(folder, 'Abrir Re-Conecta (Vite)'),
        pause(60000).then(() => { throw new Error('F5 startDebugging did not return'); })
      ]);
      assert.equal(started, true);
      const chrome = await until(() => [...sessions.values()].find(session => /chrome/i.test(session.type)), 'automatic Chrome debug session');
      await until(async () => {
        const response = await chrome.customRequest('evaluate', {
          expression: 'location.href === "http://127.0.0.1:5173/" && document.getElementById("root")?.children.length > 0 && document.body.innerText.length > 100 && !document.querySelector("vite-error-overlay")',
          context: 'repl'
        });
        return response.result === 'true';
      }, 'React rendering at the exact requested URL');
      const content = await chrome.customRequest('evaluate', { expression: 'document.body.innerText', context: 'repl' });
      log('PASS F5 cycle ' + cycle + ': ' + content.result.slice(0,1200));
      const server = [...sessions.values()].find(session => /node/i.test(session.type));
      assert.ok(server, 'Vite debug session is running');
      await vscode.debug.stopDebugging(server);
      await until(() => sessions.size === 0, 'server and browser terminate');
      await until(async () => {
        try { await fetch('http://127.0.0.1:5173/'); return false; } catch { return true; }
      }, 'port 5173 released');
    }
    log('PASS: actual VS Code debugger, automatic Chrome, React rendering, stop and restart.');
  } finally {
    for (const session of sessions.values()) await vscode.debug.stopDebugging(session);
    subscriptions.forEach(subscription => subscription.dispose());
    fs.writeFileSync(path.join(process.env.GITHUB_WORKSPACE, 'vscode-launch-results.txt'), logs.join('\n'));
  }
};
