var http = require("http");
var util = require("../utils/util");
var axios = require('axios');

// TMDB API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org';
const API_VERSION = process.env.API_VERSION || '3';
const PATH_UPCOMING_MOVIE = process.env.PATH_UPCOMING_MOVIE || '/movie/upcoming';
const PATH_NOW_PLAYING = process.env.PATH_NOW_PLAYING || '/movie/now_playing';
const PATH_TOP_RATED = process.env.PATH_TOP_RATED || '/movie/top_rated';

// Validate API key
if (!TMDB_API_KEY) {
    console.error('❌ TMDB_API_KEY is not set in environment variables');
    throw new Error('TMDB_API_KEY is required');
}

var options = {
    hostname: 'api.themoviedb.org',
    port: 443,
    headers: {
      'Content-Type': 'application/json',
    },
};

module.exports = {
  getUpcoming : function(){
      options.method = "GET";
      options.path = `/${API_VERSION}${PATH_UPCOMING_MOVIE}?api_key=${TMDB_API_KEY}`;
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
        const url = `${TMDB_BASE_URL}/${API_VERSION}${PATH_UPCOMING_MOVIE}?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Calling " + url);
        
        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
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
        // Always print errors regardless of debug setting
        console.error("TMDB Upcoming Movies API Error:", {
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
        const url = `${TMDB_BASE_URL}/${API_VERSION}${PATH_NOW_PLAYING}?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
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
        // Always print errors regardless of debug setting
        console.error("TMDB Now Playing API Error:", {
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
        const url = `${TMDB_BASE_URL}/${API_VERSION}${PATH_TOP_RATED}?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
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
        // Always print errors regardless of debug setting
        console.error("TMDB Top Rated API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getMovieDetailsAxios : async function(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/${API_VERSION}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        console.log(res)

        util.printConsole(process.env.DEBUG_PRINT, "Movie Details Response: \n");
        util.printConsole(process.env.DEBUG_PRINT, (res.data || []));

        if (res.status === 200 && res.data) {
            return res.data;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        // Always print errors regardless of debug setting
        console.error("TMDB Movie Details API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  searchMoviesAxios : async function(query, sortBy = 'release_date.desc'){
    try {
        const url = `${TMDB_BASE_URL}/${API_VERSION}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&sort_by=${sortBy}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");
        console.log("Requesting URL:", url);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        console.log("TMDB Search Response:", {
            status: res.status,
            hasData: !!res.data,
            dataType: typeof res.data,
            results: res.data?.results ? 'present' : 'missing'
        });

        if (res.status === 200 && res.data) {
            const movies = res.data.results || [];
            console.log(`Retrieved ${movies.length} movies from TMDB search`);
            return movies;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        // Always print errors regardless of debug setting
        console.error("TMDB Search API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getMovieCreditsAxios : async function(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/${API_VERSION}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        // util.printConsole(process.env.DEBUG_PRINT, "Movie Credits Response:", {
        //     status: res.status,
        //     hasData: !!res.data,
        //     dataType: typeof res.data,
        //     data: res.data
        // });

        if (res.status === 200 && res.data) {
            return res.data;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        // Always print errors regardless of debug setting
        console.error("TMDB Movie Credits API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getMovieImagesAxios : async function(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/${API_VERSION}/movie/${movieId}/images?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, "Calling " + url + " with axios");

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        // util.printConsole(process.env.DEBUG_PRINT, "Movie Images Response:", {
        //     status: res.status,
        //     hasData: !!res.data,
        //     dataType: typeof res.data,
        //     data: res.data
        // });

        if (res.status === 200 && res.data) {
            return res.data;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        // Always print errors regardless of debug setting
        console.error("TMDB Movie Images API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  },

  getMovieVideosAxios : async function(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/${API_VERSION}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
        
        util.printConsole(process.env.DEBUG_PRINT, `Requesting videos for movie ${movieId}`);

        const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        if (res.status === 200 && res.data) {
            // Look for official trailers
            const videos = res.data.results || [];
            const officialTrailer = videos.find(video => 
                video.type === 'Trailer' && 
                video.official === true && 
                video.site === 'YouTube'
            );

            util.printConsole(process.env.DEBUG_PRINT, {
                totalVideos: videos.length,
                hasOfficialTrailer: !!officialTrailer
            });

            return officialTrailer || null;
        }
        
        throw new Error("Invalid response format from provider");
    }
    catch(err) {
        // Always print errors regardless of debug setting
        console.error("TMDB Movie Videos API Error:", {
            message: err.message,
            response: err.response?.data,
            url: err.config?.url,
            status: err.response?.status
        });
        throw err;
    }
  }
}
