const express = require('express');
const router = express.Router();
const { reviewValidationRules, validate } = require('../validators/validator');
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../data/database');


// GET /reviews
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   bookId:
 *                     type: string
 *                   reviewer:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
    try {
        const db = getDatabase();
        const reviews = await db.collection('Reviews').find().toArray();
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).send('Server Error');
    }
});



// POST /reviews
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review for a book
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - reviewer
 *               - rating
 *               - comment
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book being reviewed
 *                 example: "683ab4ec83f8f09934d32a81"
 *               reviewer:
 *                 type: string
 *                 description: Name of the reviewer
 *                 example: "Patrick Mukula"
 *               rating:
 *                 type: string
 *                 description: Rating score (e.g., 1 to 10)
 *                 example: "9"
 *               comment:
 *                 type: string
 *                 description: Review comment
 *                 example: "A timeless classic!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       422:
 *          description: Bad Request - Validation errors
 * *     500:
 *          description: Server error
 */
router.post('/', reviewValidationRules(), validate, async (req, res) => {
    try {
        const { bookId, reviewer, rating, comment } = req.body;
        const db = getDatabase();
        const result = await db.collection('Reviews').insertOne({
            bookId: new ObjectId(bookId),
            reviewer,
            rating,
            comment,
            createdAt: new Date()
        });

        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;