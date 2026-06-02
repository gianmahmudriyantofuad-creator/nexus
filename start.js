const { execSync } = require('child_process');
const fs = require('fs');

const WALLET = process.env.NEXUS_WALLET;
const HOME_DIR = '/root';

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

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

// Step 1: Register user dulu
run(`yes | ${cliPath} register-user --wallet-address ${WALLET}`, 'Register User');

// Step 2: Baru start node
run(`${cliPath} start`, 'Start Node');
