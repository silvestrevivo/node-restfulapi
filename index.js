//
// Title: node-restfulapi
// Description: exercise of udemy tutorial
// Author: @silvestrevivo
// Date: 02/05/2014
//

// Dependencies
const http = require('http'),
  https = require('https'),
  fs = require('fs'),
  url = require('url'),
  StringDecoder = require('string_decoder').StringDecoder,
  config = require('./config');

// Instatiate the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode now`);
  // We can type now on the terminal $ NODE_ENV=staging node index.js
  // and we get the same environment than by default determinated in config.js
});

// Instatiate the HTTPs server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem'),
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode now`);
  // We can type now on the terminal $ NODE_ENV=staging node index.js
  // and we get the same environment than by default determinated in config.js
});


// All the server logic fot both servers, http and https
var unifiedServer = function(req, res){
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
};

// Defining handlers
const handlers = {
  ping: (data, callback) => {
    // Callback an http status code, and a payload object
    callback(200)
  },
  notFound: (data, callback) => {
    callback(404)
  }
};

// Defining a request router
const router = {
  'ping': handlers.ping,
  'notFound': handlers.notFound
};
