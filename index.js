//
// Title: node-restfulapi
// Description: exercise of udemy tutorial
// Author: @silvestrevivo
// Date: 02/05/2014
//

// Dependencies
const http = require('http'),
  url = require('url');

// The server should respond to all request with a string
const server = http.createServer((req, res) => {

  // Get the URL and parse it to get the metadata of the request
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  console.log('Query parameters as object', queryStringObject)
  //http://localhost:3000/status?title=ElQuijote&author=Cervantes
  //queryStringObject => { title: 'ElQuijote', author: 'Cervantes' }

  // Get the HTTP Method => usually is Get
  const method = req.method.toLowerCase();

  // Get the Headers as an object => usually for Post Requests
  const headers = req.headers;

  // Response from the server to the screen
  res.end(`Hello World! This is printed on screen.
  You are connected to the port localhost://3000${trimmedPath ? `/${trimmedPath}` : ''}`);
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000 now')
});
