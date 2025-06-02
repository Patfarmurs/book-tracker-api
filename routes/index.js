const express = require('express');
const router = express.Router();


const booksRoutes = require('./books');
const reviewsRoutes = require('./reviews');


router.use('/books', booksRoutes);
router.use('/reviews', reviewsRoutes);


module.exports = router;