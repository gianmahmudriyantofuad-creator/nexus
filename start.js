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

console.log('Registering wallet...');
try {
  // Register dulu, kalau udah register dia bakal skip otomatis
  execSync(`yes | NEXUS_WALLET=${WALLET} ${cliPath} register`, { 
    stdio: 'inherit',
    env: { ...process.env, NEXUS_WALLET: WALLET }
  });
} catch (e) {
  console.log('Wallet mungkin sudah terdaftar, lanjut...');
}

console.log('Starting Nexus Node...');
execSync(`yes | NEXUS_WALLET=${WALLET} ${cliPath} start`, { 
  stdio: 'inherit',
  env: { ...process.env, NEXUS_WALLET: WALLET }
});
