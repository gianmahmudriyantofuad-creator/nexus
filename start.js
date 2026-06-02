const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

console.log('Installing Nexus CLI...');
execSync('curl -s https://cli.nexus.xyz | sh', { stdio: 'inherit' });

const cliPath = '/root/.nexus/bin/nexus-cli';

if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gagal diinstall!');
  process.exit(1);
}

console.log('Starting Nexus Node...');
// Tambahin --non-interactive biar gak nunggu input
execSync(`${cliPath} start --wallet ${WALLET} --non-interactive --accept-terms`, { stdio: 'inherit' });
