const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

console.log('Installing Nexus CLI...');
execSync('yes | curl -s https://cli.nexus.xyz | sh', { stdio: 'inherit' });

const cliPath = '/root/.nexus/bin/nexus-cli';

if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gagal diinstall!');
  process.exit(1);
}

console.log('Starting Nexus Node...');
// Set env var + pipe yes, tanpa --wallet
execSync(`yes | NEXUS_WALLET=${WALLET} ${cliPath} start`, { 
  stdio: 'inherit',
  env: { ...process.env, NEXUS_WALLET: WALLET }
});
