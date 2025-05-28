var http = require("http");
var util = require("../utils/util");
var axios = require('axios');

var options = {
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
      options.path = `/api/${process.env.API_VERSION}${process.env.PATH_UPCOMING_MOVIE}`;
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
    try {
        const url = `${process.env.HOSTNAME}/${process.env.API_VERSION}${process.env.PATH_UPCOMING_MOVIE}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });

        console.log("TMDB Response:", {
            status: res.status,
            hasData: !!res.data,
            dataType: typeof res.data,
            results: res.data?.results ? 'present' : 'missing'
        });

        if (res.status === 200 && res.data) {
            // TMDB API returns { results: [...movies] }
            const movies = res.data.results || [];
            console.log(`Retrieved ${movies.length} movies from TMDB`);
            return movies;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        console.error("TMDB API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getNowPlayingAxios : async function(){
    try {
        const url = `${process.env.HOSTNAME}/${process.env.API_VERSION}${process.env.PATH_NOW_PLAYING}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });

        console.log("TMDB Response:", {
            status: res.status,
            hasData: !!res.data,
            dataType: typeof res.data,
            results: res.data?.results ? 'present' : 'missing'
        });

        if (res.status === 200 && res.data) {
            const movies = res.data.results || [];
            console.log(`Retrieved ${movies.length} movies from TMDB`);
            return movies;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        console.error("TMDB API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getTopRatedAxios : async function(){
    try {
        const url = `${process.env.HOSTNAME}/${process.env.API_VERSION}${process.env.PATH_TOP_RATED}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });

        console.log("TMDB Response:", {
            status: res.status,
            hasData: !!res.data,
            dataType: typeof res.data,
            results: res.data?.results ? 'present' : 'missing'
        });

        if (res.status === 200 && res.data) {
            const movies = res.data.results || [];
            console.log(`Retrieved ${movies.length} movies from TMDB`);
            return movies;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        console.error("TMDB API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  }
}
