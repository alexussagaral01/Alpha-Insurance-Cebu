const handler = require('serve-handler');
const http = require('http');
const path = require('path');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: path.join(__dirname, 'build'),
    rewrites: [
      { source: '/**', destination: '/index.html' }
    ]
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});