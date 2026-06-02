const { execSync, spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const WALLET = process.env.NEXUS_WALLET;
const PORT = process.env.PORT || 3000;
const HOME_DIR = '/root';

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

fs.mkdirSync(`${HOME_DIR}/.nexus`, { recursive: true });

// Bikin server dummy biar Railway gak kill proses
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Nexus Node Running');
}).listen(PORT, () => {
  console.log(`Railway healthcheck server running on port ${PORT}`);
});

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

console.log('Installing Nexus CLI...');
execSync(`yes | curl -s https://cli.nexus.xyz | sh && source ${HOME_DIR}/.profile`, { 
  stdio: 'inherit',
  env: { ...process.env, HOME: HOME_DIR }
});

const cliPath = `${HOME_DIR}/.nexus/bin/nexus-cli`;
if (!fs.existsSync(cliPath)) {
  console.error('Nexus CLI gak ketemu di:', cliPath);
  process.exit(1);
}

run(`yes | ${cliPath} register-user --wallet-address ${WALLET}`, 'Register User');
run(`yes | ${cliPath} register-node`, 'Register Node');

console.log('\n=== Start Node ===');
// Pakai spawn biar gak blocking, jadi server HTTP tetep jalan
const child = spawn(cliPath, ['start'], {
  env: { ...process.env, HOME: HOME_DIR },
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.error(`Nexus CLI exited with code ${code}`);
  process.exit(code);
});
