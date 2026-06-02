const { execSync, spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const WALLET = process.env.NEXUS_WALLET;
const PORT = process.env.PORT || 3000;
const HOME_DIR = '/root';

if (!WALLET) {
  console.error('ERROR: Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

fs.mkdirSync(`${HOME_DIR}/.nexus`, { recursive: true });

// Healthcheck server biar Railway gak kill
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Nexus Node Running');
}).listen(PORT, () => {
  console.log(`Railway healthcheck server running on port ${PORT}`);
});

// Bikin swap 512MB biar gak kena SIGKILL
console.log('Creating swap file...');
try {
  execSync('dd if=/dev/zero of=/swapfile bs=1M count=512 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile', { stdio: 'inherit' });
  console.log('Swap 512MB created');
} catch (e) {
  console.log('Swap creation failed, continuing anyway');
}

// Install Nexus CLI
console.log('Installing Nexus CLI...');
execSync(`yes | curl -s https://cli.nexus.xyz | sh && source ${HOME_DIR}/.profile`, { 
  stdio: 'inherit',
  env: { ...process.env, HOME: HOME_DIR }
});

const cliPath = `${HOME_DIR}/.nexus/bin/nexus-cli`;
if (!fs.existsSync(cliPath)) {
  console.error('ERROR: Nexus CLI gak ketemu di:', cliPath);
  process.exit(1);
}

console.log('Found nexus-cli at:', cliPath);

function run(cmd, desc) {
  console.log(`\n=== ${desc} ===`);
  execSync(cmd, { 
    stdio: 'inherit',
    env: { ...process.env, HOME: HOME_DIR }
  });
}

// Register
run(`yes | ${cliPath} register-user --wallet-address ${WALLET}`, 'Register User');
run(`yes | ${cliPath} register-node`,
