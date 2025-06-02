const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../data/database');



// GET /books
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   publishedYear:
 *                     type: string
 *                   ISBN:
 *                     type: string
 *                   pages:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', async (req, res) => {
    try {
        const db = getDatabase();
        const books = await db.collection('Books').find().toArray();
        console.log('Books:', books);
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});



// POST /books
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *               - publishedYear
 *               - ISBN
 *               - pages
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Pearl of Great Price"
 *               author:
 *                 type: string
 *                 example: "Joseph Smith"
 *               genre:
 *                 type: string
 *                 example: "Religious Scripture"
 *               publishedYear:
 *                 type: string
 *                 example: "1972"
 *               ISBN:
 *                 type: string
 *                 example: "9781411466371"
 *               pages:
 *                 type: string
 *                 example: "65"
 *               status:
 *                 type: string
 *                 example: "Available"
 *     responses:
 *       201:
 *         description: Book added successfully
 */
router.post('/', async (req, res) => {
    try {
        const { title, author, genre, publishedYear, ISBN, pages, status } = req.body;
        if (!title || !author || !genre || !publishedYear || !ISBN || !pages || !status) {
            return res.status(400).send('All fields are required');
        }

        const db = getDatabase();
        const result = await db.collection('Books').insertOne({
            title,
            author,
            genre,
            publishedYear,
            ISBN,
            pages,
            status
        });

        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        console.error('Err adding book:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = getDatabase();
        const book = await db.collection('Books').findOne({ _id: new ObjectId(req.params.id) });
        if (!book) return res.status(404).send('Book not found');
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', err);
        res.status(500).send('Server Error');
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { title, author, genre, publishedYear, ISBN, pages, status } = req.body;
        if (!title || !author || !genre || !publishedYear || !ISBN || !pages || !status) {
            return res.status(400).send('All fields are required');
        }

        const db = getDatabase();
        const result = await db.collection('Books').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, author, genre, publishedYear, ISBN, pages, status } }
        );

        if (result.matchedCount === 0) 
            return res.status(404).send('Book not found');
            res.status(204).send();
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).send('Server Err');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = getDatabase();
        const result = await db.collection('Books').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) 
            return res.status(404).send('Book not found');
            res.status(200).send('Book deleted'); 
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Server Error');
    }
});

        
module.exports = router;