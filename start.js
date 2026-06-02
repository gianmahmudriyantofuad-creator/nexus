const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;
const HOME_DIR = '/root';

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

// Buat folder .nexus manual biar gak error
fs.mkdirSync(`${HOME_DIR}/.nexus`, { recursive: true });

console.log('Installing Nexus CLI...');
execSync(`yes | curl -s https://cli.nexus.xyz | sh`, { 
  stdio: 'inherit',
  env: { ...process.env, HOME: HOME_DIR }
});

const cliPath = `${HOME_DIR}/.nexus/bin/nexus-cli`;

if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gagal diinstall!');
  process.exit(1);
}

console.log('Registering wallet...');
execSync(`yes | ${cliPath} register --wallet ${WALLET}`, { 
  stdio: 'inherit',
  env: { ...process.env, HOME: HOME_DIR }
});

console.log('Starting Nexus Node...');
execSync(`${cliPath} start --wallet ${WALLET}`, { 
  stdio: 'inherit',
  env: { ...process.env, HOME: HOME_DIR }
});
