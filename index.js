//
// Title: node-restfulapi
// Description: exercise of udemy tutorial
// Author: @silvestrevivo
// Date: 02/05/2014
//

// Dependencies
const http = require('http');

// The server should respond to all request with a string
const server = http.createServer((req, res) => {

  // Response from the server to the screen
  res.end('Hello World! This is printed on screen. You are connected to the port 3000')
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000 now')
});
