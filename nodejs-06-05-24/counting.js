const interval = setInterval(() => {
    const newObj = { id: Math.floor(Math.random() * 1000), value: Math.floor(Math.random() * 1000) };
    process.stdout.write(JSON.stringify(newObj) + '\n');
  }, 10000);
  
  process.on('exit', () => {
    clearInterval(interval);
  });
  