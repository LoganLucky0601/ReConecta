const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { pathToFileURL } = require('node:url');
const { runTests } = require('@vscode/test-electron');

async function main() {
  const workspace = path.resolve(process.argv[2] || '.');
  const extension = fs.mkdtempSync(path.join(os.tmpdir(), 'reconecta-vscode-'));
  fs.writeFileSync(path.join(extension, 'package.json'), JSON.stringify({
    name: 'reconecta-launch-test', publisher: 'reconecta', version: '0.0.1',
    engines: { vscode: '^1.90.0' }, main: './extension.cjs', activationEvents: ['*']
  }));
  fs.writeFileSync(path.join(extension, 'extension.cjs'), 'exports.activate = () => {};');
  await runTests({
    extensionDevelopmentPath: extension,
    extensionTestsPath: path.join(__dirname, 'suite.cjs'),
    launchArgs: ['--folder-uri', pathToFileURL(workspace).href, '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes', '--disable-gpu'],
    extensionTestsEnv: { ...process.env, RECONNECTA_WORKSPACE: workspace }
  });
}
main().catch(error => { console.error(error); process.exitCode = 1; });
