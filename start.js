const { exec } = require('child_process');

const WALLET = process.env.NEXUS_WALLET;

if (!WALLET) {
  console.error('Set NEXUS_WALLET di Railway Variables!');
  process.exit(1);
}

console.log('Installing Nexus CLI...');
exec('curl https://cli.nexus.xyz | sh', (err) => {
  if (err) throw err;
  
  console.log('Starting Nexus Node...');
  exec(`~/.nexus/bin/nexus-cli start --wallet ${WALLET}`, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
  });
});
