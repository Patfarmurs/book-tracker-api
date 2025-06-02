// data/database.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let db = null;

async function initdb(callback) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        return callback('MONGODB_URI not found in .env file');
    }

    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        db = client.db(); // defaults to the database name in the URI
        console.log('Connected to MongoDB');
        callback(null);
    } catch (err) {
        callback(err);
    }
}

function getDatabase() {
    if (!db) throw new Error('Database not initialized');
    return db;
}

module.exports = { initdb, getDatabase };
