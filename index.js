//
// Title: node-restfulapi
// Description: exercise of udemy tutorial
// Author: @silvestrevivo
// Date: 02/05/2014
//

// Dependencies
const http = require('http'),
  url = require('url'),
  StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all request with a string
const server = http.createServer((req, res) => {

  // Get the URL and parse it to get the metadata of the request
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // console.log('Query parameters as object', queryStringObject)
  //http://localhost:3000/status?title=ElQuijote&author=Cervantes
  //queryStringObject => { title: 'ElQuijote', author: 'Cervantes' }

  // Get the HTTP Method => usually is Get
  const method = req.method.toLowerCase();

  // Get the Headers as an object => usually for Post Requests
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => { // this happens when the request is ended
    buffer += decoder.end();

    // Choose the handler this request should to go
    // If one is not found use the notFound handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }

    // Route the request to the handler specificied in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the hanaler, or default to 200
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof (payload) == 'object' ? payload : {};

      // Convert the paylad to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');//get the payload as a parsed json
      res.writeHead(statusCode)

      // Response from the server to the screen when the buffer is ended
      res.end(`Hello World! This is printed on screen.
      You are connected to the port localhost://3000${trimmedPath ? `/${trimmedPath}` : ''}.
      Request recieved with this payloadString: ${payloadString}.`);

      // Log the request path
      console.log('Returning this response:', statusCode, payloadString);
    })
  });

});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000 now')
});

// Defining handlers
const handlers = {
  sample: (data, callback) => {
    // Callback an http status code, and a payload object
    callback(406, { 'name': 'sample handler' })
  },
  notFound: (data, callback) => {
    callback(404)
  }
};

// Defining a request router
const router = {
  'sample': handlers.sample,
  'notFound': handlers.notFound
};
