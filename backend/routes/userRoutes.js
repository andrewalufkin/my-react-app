// userRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Import database connection module

router.get('/search', (req, res) => {
    const { searchTerm } = req.query;

    // SQL query to search for users. This uses a LIKE statement for partial matching.
    const sql = 'SELECT id, username FROM users WHERE username LIKE ?';

    connection.query(sql, [`%${searchTerm}%`], (error, results) => {
        if (error) {
            console.error('Error searching users:', error);
            return res.status(500).json({ message: 'Error searching for users', error });
        }

        res.json({ users: results });
    });
});


// Follow a user
router.post('/follow', (req, res) => {
    const { followerId, followedId } = req.body;
    const sql = 'INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)';

    connection.query(sql, [followerId, followedId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error following user', error });
        }
        res.json({ message: 'Followed successfully', results });
    });
});

// Unfollow a user
router.post('/unfollow', (req, res) => {
    const { followerId, followedId } = req.body;
    const sql = 'DELETE FROM followers WHERE follower_id = ? AND followed_id = ?';

    connection.query(sql, [followerId, followedId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error unfollowing user', error });
        }
        res.json({ message: 'Unfollowed successfully', results });
    });
});

// Create a post
router.post('/post', (req, res) => {
    const { userId, content } = req.body;
    const sql = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';

    connection.query(sql, [userId, content], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error creating post', error });
        }
        res.json({ message: 'Post created successfully', results });
    });
});

router.get('/feed', (req, res) => {
    const userId = req.query.userId; // Assuming the user's ID is passed as a query parameter
    const sql = `
        SELECT posts.*
        FROM posts
        INNER JOIN followers ON posts.user_id = followers.followed_id
        WHERE followers.follower_id = ?`;

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching feed', error });
        }
        res.json({ message: 'Feed fetched successfully', posts: results });
    });
});

module.exports = router;