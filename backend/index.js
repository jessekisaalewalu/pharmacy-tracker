const { spawn } = require('child_process');
const path = require('path');

// Start the Python Flask backend
const pythonProcess = spawn('python', [path.join(__dirname, 'run.py')]);

pythonProcess.stdout.on('data', (data) => {
  console.log(`[Python Backend] ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`[Python Backend Error] ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python backend process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  pythonProcess.kill('SIGINT');
  process.exit(0);
});