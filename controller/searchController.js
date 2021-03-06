const axios = require('axios');
const config = require('config');
const path = require('path');
const Review = require('../model/reviewModel');

const TheMovieDBInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        Authorization: config.get('THEMOVIEDB_API_KEY')
    }
});

// Searches movies in the TheMovieDB API given the query 
const searchMovie = async (query) => {
    if (query === '' || typeof query !== 'string') {
        throw new Error('Invalid string provided');
    }

    const response = await TheMovieDBInstance('/search/movie', {
        params: {
            language: 'en-US',
            query: query,
            include_adult: 'false'
        }
    });

    return response;
};

exports.postSearch = async (req, res, next) => {
    // Check if query fields exists
    const { query } = req.body;
    console.log(query);

    // Query the movieDB API for results
    try {
        const { data } = await searchMovie(query);
        return res.status(200).send(data.results);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error in querying MovieDB"});
    }
};

exports.getTrending = async (req, res, next) => {
    // Query the movieDB API for results
    try {
        const { data } = await TheMovieDBInstance('/trending/movie/week');
        
        return res.status(200).send(data.results);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error in querying MovieDB for trending movies"});
    }
};

exports.getUpcoming = async (req, res, next) => {
    // Query the movieDB API for results
    try {
        const { data } = await TheMovieDBInstance('/movie/upcoming', {
            params: {
                region: 'us'
            }
        });
        
        return res.status(200).send(data.results);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error in querying MovieDB for upcoming movies"});
    }
};

exports.getLatest = async (req, res, next) => {
    // Query the movieDB API for results
    try {
        const { data } = await TheMovieDBInstance('/movie/now_playing', {
            params: {
                region: 'us'
            }
        });
        
        return res.status(200).send(data.results);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error in querying MovieDB for latest movies"});
    }
};

exports.getMovieDetails = async (req, res, next) => {
    // Extract movie title from path
    const movieTitle = req.query.title;
    
    console.log(movieTitle);

    // Get movie reviews
    const reviews = await Review.find().where('movieTitle').equals(movieTitle);

    // Get average ratings
    let average = await Review.aggregate(
        [
            {$match: {"movieTitle": movieTitle} },
            {$group: {_id: "$movieTitle", average: {$avg: "$rating"}}}
        ]
    );

    console.log(average);

    if (average.length === 0) {
        average = '?'
    } else {
        average = average[0].average.toFixed(2);
    }

    // Get movie data (poster, description, and release date)
    const { data } = await searchMovie(movieTitle);

    const movieData = data.results[0];

    console.log(reviews);

    return res.render(path.join(__dirname, '../', 'public', 'pages', 'movie-details.ejs'), {
        movieTitle: movieData.title,
        description: movieData.overview,
        releaseDate: movieData.release_date,
        posterURL: 'https://image.tmdb.org/t/p/w300/' + movieData.poster_path,
        reviews: reviews,
        average: average
    });
};