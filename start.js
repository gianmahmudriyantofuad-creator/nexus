console.log('\n=== Start Node ===');

// Cek dulu file nya ada apa gak
if (!fs.existsSync(cliPath)) {
  console.error('CRITICAL: nexus-cli not found at', cliPath);
  process.exit(1);
}

console.log('Found nexus-cli at:', cliPath);

const child = spawn(cliPath, ['start', '--headless'], {
  env: { 
    ...process.env, 
    HOME: HOME_DIR,
    NEXUS_WORKERS: '1'
  },
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Failed to start nexus-cli:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.error(`Nexus CLI exited with code ${code}`);
  process.exit(code);
});
