const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

console.log('Installing Nexus CLI...');
execSync('curl -s https://cli.nexus.xyz | sh', { stdio: 'inherit' });

// Path Nexus CLI di Railway container
const cliPath = '/root/.nexus/bin/nexus-cli';

if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gagal diinstall!');
  process.exit(1);
}

console.log('Starting Nexus Node...');
execSync(`${cliPath} start --wallet ${WALLET}`, { stdio: 'inherit' });
