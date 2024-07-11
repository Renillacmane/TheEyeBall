var http = require("http");
var util = require("../utils/util");
var axios = require('axios');

var options = {
    //method: 'GET',
    //path: '/movies',
    hostname: process.env.HOSTNAME,
    port: null,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    },
  };

module.exports = {
  getUpcoming : function(){
      options.method = "GET";
      options.path = "/" + process.env.API_VERSION + process.env.PATH_UPCOMING_MOVIE;
      let data = '';
      
      util.printConsole(process.env.DEBUG_PRINT, "Calling " + options.path + " with promise");

      return new Promise((resolve, reject) => {
        let req = http.request(options);
        let data = [];

        req.on('response', res => {
          res.on('data', chunk => {
            data.push(chunk);
          });
  
          res.on('end', () => {
            const movies = JSON.parse(Buffer.concat(data));
            resolve(movies);
          });
        });

        req.on('error', err => {
          reject(err);
        });

        req.end();
      });
  },

  getUpcomingAxios : async function(){
    options.hostname = null;
    options.method = 'GET';
    options.url = process.env.HOSTNAME + "/" + process.env.API_VERSION + process.env.PATH_UPCOMING_MOVIE,

    util.printConsole(process.env.DEBUG_PRINT, "Calling " + options.url + " with axios");

    try {
        let res = await axios(options);
        if (res.status === 200){
            console.log("response coming");
        }

        return res.data.results;
    }
    catch(err) {
        console.log("Provider error with message: " + err.response.data.status_message);
        throw new Error("Provider service error");
    }
  }
        
    /* // Example with callback
    var request = http.request(options, (response) => {
        console.log("Setting up response");

        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');

        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            console.log(data);
            return data;
        });

        // Log errors if any occur
        request.on('error', (error) => {
        console.log("An error has ocurred: ");
        console.error(error);
        return [];
        });

        // End the request
        request.end();
    });
    */
}