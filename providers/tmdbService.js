var http = require("http");
var config = require("dotenv").config();

var options = {
    hostname: 'api.themoviedb.org',
    port: null,
    path: '/movies',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWVjMjBmZjZmOTgzM2IyNmQ0ZmNhZDBlMjJiZTMwMSIsIm5iZiI6MTcyMDAwNzQwNi4zMjc2NDYsInN1YiI6IjY2ODUzMmQ5YTM5NDMzYTA2MWJiMDFmNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rFO8dj4nAjNuOavUFJCyAoUvsi3NkDfBuIxyQoinjz0'
    },
  };

module.exports = {
  getUpcoming : function(){
      options.method = "GET";
      options.path = "/3/movie/upcoming";
      let data = '';

      console.log("Calling " + options.path);
    
      return new Promise((resolve, reject) => {
        let req = http.request(options);
        let data = [];

        req.on('response', res => {
          console.log("Response adquired");
          
          //resolve(res);

          res.on('data', chunk => {
            console.log("Data adquired");
            //console.log(res);
  
            data.push(chunk);
  
            //resolve(res);
          });
  
          res.on('end', () => {
            console.log('Response ended: ');
            const movies = JSON.parse(Buffer.concat(data));
        
            //console.log(movies);

            resolve(movies);
          });
        });

        req.on('error', err => {
          console.log("Error adquired");

          reject(err);
        });

        req.end();
      });


      /*
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

}