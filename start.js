console.log('\n=== Start Node ===');
const child = spawn(cliPath, ['start', '--headless'], {
  env: { 
    ...process.env, 
    HOME: HOME_DIR,
    NEXUS_WORKERS: '1'  // limit RAM biar gak di SIGKILL Railway
  },
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.error(`Nexus CLI exited with code ${code}`);
  process.exit(code);
});
