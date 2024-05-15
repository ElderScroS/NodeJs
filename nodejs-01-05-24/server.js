const fs = require('fs');
const http = require('http');
const { Transform } = require('stream');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<form action="/readFile" method="POST"><button type="submit">Read</button></form>');
  } else if (req.url === '/readFile' && req.method === 'POST') {
    const readStream = fs.createReadStream('file.txt', 'utf8');
    const writeStream = fs.createWriteStream('reserve.txt');
    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        if (this.charCount >= 5000) {
          callback();
          return;
        }

        this.charCount += chunk.length;

        this.push(chunk);

        callback();
      }
    });

    transformStream.charCount = 0;

    readStream
      .pipe(transformStream)
      .pipe(writeStream)
      .on('finish', () => {
        console.log('File reading and writing completed.');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File reading and writing completed.');
      });

    console.log('File reading and writing started.');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
