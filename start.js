const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;
const HOME_DIR = '/root';

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

// Buat folder .nexus biar Nexus bisa simpan config
fs.mkdirSync(`${HOME_DIR}/.nexus`, { recursive: true });

function run(cmd, desc) {
  try {
    console.log(`\n=== ${desc} ===`);
    execSync(cmd, { 
      stdio: 'inherit',
      env: { ...process.env, HOME: HOME_DIR }
    });
  } catch (e) {
    console.error(`\nGAGAL di step: ${desc}`);
    process.exit(1);
  }
}

run(`yes | curl -s https://cli.nexus.xyz | sh`, 'Install Nexus CLI');

const cliPath = `${HOME_DIR}/.nexus/bin/nexus-cli`;
if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gak ketemu di:', cliPath);
  process.exit(1);
}

// Langsung start, gak usah register. Wallet diambil dari env
run(`yes | NEXUS_WALLET=${WALLET} ${cliPath} start`, 'Start Node');
