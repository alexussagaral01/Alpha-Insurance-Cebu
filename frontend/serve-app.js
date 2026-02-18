const handler = require('serve-handler');
const http = require('http');
const path = require('path');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: path.join(__dirname, 'build'),
    headers: [
      {
        source: '/images/**',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      }
    ],
    rewrites: [
      { source: '/**', destination: '/index.html' }
    ]
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});