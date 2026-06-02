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

// Healthcheck biar Railway gak sleep
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Nexus Node Running');
}).listen(PORT, function() {
  console.log('Railway healthcheck server running on port ' + PORT);
});

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

  console.log('\n=== Start Node - 500MB Mode ===');
  const child = spawn(cliPath, ['start', '--headless'], {
    env: { 
      ...process.env, 
      HOME: HOME_DIR,
      NEXUS_WORKERS: '1',                    // 1 worker aja
      NODE_OPTIONS: '--max-old-space-size=350' // Limit 350MB, sisain 150MB buat sistem
    },
    stdio: 'inherit'
  });

  child.on('exit', function(code) {
    console.error('Nexus CLI exited with code ' + code + ', restart 15s...');
    setTimeout(startNexus, 15000); // restart 15 detik kalau crash
  });
}

startNexus();
