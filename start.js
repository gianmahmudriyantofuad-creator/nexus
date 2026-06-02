const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

console.log('Installing Nexus CLI...');
// Pipe "yes" biar auto accept semua prompt installer
execSync('yes | curl -s https://cli.nexus.xyz | sh', { stdio: 'inherit' });

const cliPath = '/root/.nexus/bin/nexus-cli';

if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gagal diinstall!');
  process.exit(1);
}

console.log('Starting Nexus Node...');
// Pipe "yes" juga ke command start biar gak nunggu input
execSync(`yes | ${cliPath} start --wallet ${WALLET}`, { stdio: 'inherit' });
