const http = require('http');

const server = http.createServer((request, response) => {
	response.writeHead(200, { 'content-type': 'text/plain' });
	response.end('Hello, Avanters!!');
});

server.listen(3000, () => {
	console.log('running server');
});
