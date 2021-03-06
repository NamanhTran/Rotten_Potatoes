const express = require('express');

const searchController = require('../controller/searchController');

const router = express.Router();

router.post('/search', searchController.postSearch);

router.get('/trending', searchController.getTrending);

router.get('/upcoming', searchController.getUpcoming);

router.get('/latest', searchController.getLatest);

router.get('/movieDetails', searchController.getMovieDetails);

module.exports = router;