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

fs.mkdirSync(HOME_DIR + '/.nexus', { recursive: true });

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Nexus Node Running');
}).listen(PORT, function() {
  console.log('Railway healthcheck server running on port ' + PORT);
});

// BIKIN SWAP 1GB - WAJIB BUAT RAILWAY TRIAL
console.log('Creating 1GB swap file...');
try {
  execSync('dd if=/dev/zero of=/swapfile bs=1M count=1024', { stdio: 'inherit' });
  execSync('chmod 600 /swapfile', { stdio: 'inherit' });
  execSync('mkswap /swapfile', { stdio: 'inherit' });
  execSync('swapon /swapfile', { stdio: 'inherit' });
  console.log('Swap 1GB active');
} catch (e) {
  console.log('Swap failed:', e.message);
}

function startNexus() {
  console.log('Installing Nexus CLI...');
  execSync('yes | curl -s https://cli.nexus.xyz | sh', { 
    stdio: 'inherit',
    env: { ...process.env, HOME: HOME_DIR }
  });

  const cliPath = HOME_DIR + '/.nexus/bin/nexus-cli';

  console.log('\n=== Register User ===');
  execSync('yes | ' + cliPath + ' register-user --wallet-address ' + WALLET, { 
    stdio: 'inherit',
    env: { ...process.env, HOME: HOME_DIR }
  });

  console.log('\n=== Register Node ===');
  execSync('yes | ' + cliPath + ' register-node', { 
    stdio: 'inherit',
    env: { ...process.env, HOME: HOME_DIR }
  });

  console.log('\n=== Start Node ===');
  const child = spawn(cliPath, ['start', '--headless'], {
    env: { 
      ...process.env, 
      HOME: HOME_DIR,
      NEXUS_WORKERS: '2',
      NODE_OPTIONS: '--max-old-space-size=384'  // <-- naikin jadi 900MB
    },
    stdio: 'inherit'
  });

  child.on('exit', function(code) {
    console.error('Nexus CLI exited with code ' + code + ', restarting in 10s...');
    setTimeout(startNexus, 10000);
  });
}

startNexus();
