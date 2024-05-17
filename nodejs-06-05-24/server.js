const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

let data = [];

app.post('/add', (req, res) => {
  const newObj = { id: data.length + 1, value: req.body.value };
  data.push(newObj);
  res.status(201).json({ message: 'Object added successfully', object: newObj });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const childProcess = spawn('node', ['counting.js']);

childProcess.stdout.on('data', (message) => {
  console.log(`Child process message: ${message}`);
  const newObj = JSON.parse(message);
  data.push(newObj);
});

childProcess.stderr.on('data', (err) => {
  console.error(`Child process error: ${err}`);
});
