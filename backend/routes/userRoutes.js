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

// Add a like to a post
router.post('/post/like', (req, res) => {
    const { userId, postId } = req.body;

    // Begin transaction
    connection.beginTransaction(error => {
        if (error) {
            return res.status(500).json({ message: 'Error starting transaction', error });
        }

        // Check if the user has already liked the post
        const checkSql = 'SELECT * FROM user_post_reactions WHERE user_id = ? AND post_id = ?';
        connection.query(checkSql, [userId, postId], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Error checking user reaction', error });
                });
            }

            if (results.length > 0) {
                // User has already reacted to this post
                return connection.rollback(() => {
                    res.status(409).json({ message: 'User has already reacted to this post' });
                });
            } else {
                // Insert new like into user_post_reactions
                const insertSql = 'INSERT INTO user_post_reactions (user_id, post_id, reaction_type) VALUES (?, ?, "like")';
                connection.query(insertSql, [userId, postId], (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error adding user reaction', error });
                        });
                    }

                    // Increment likes count in posts table
                    const updatePostSql = 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?';
                    connection.query(updatePostSql, [postId], (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error updating post like count', error });
                            });
                        }

                        // Commit transaction
                        connection.commit(error => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Error committing transaction', error });
                                });
                            }
                            res.json({ message: 'Like added to post successfully' });
                        });
                    });
                });
            }
        });
    });
});

// Add a dislike to a post
router.post('/post/dislike', (req, res) => {
    const { userId, postId } = req.body;

    // Begin transaction
    connection.beginTransaction(error => {
        if (error) {
            return res.status(500).json({ message: 'Error starting transaction', error });
        }

        // Check if the user has already disliked the post
        const checkSql = 'SELECT * FROM user_post_reactions WHERE user_id = ? AND post_id = ?';
        connection.query(checkSql, [userId, postId], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Error checking user reaction', error });
                });
            }

            if (results.length > 0) {
                // User has already reacted to this post
                return connection.rollback(() => {
                    res.status(409).json({ message: 'User has already reacted to this post' });
                });
            } else {
                // Insert new dislike into user_post_reactions
                const insertSql = 'INSERT INTO user_post_reactions (user_id, post_id, reaction_type) VALUES (?, ?, "dislike")';
                connection.query(insertSql, [userId, postId], (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error adding user reaction', error });
                        });
                    }

                    // Increment dislikes count in posts table
                    const updatePostSql = 'UPDATE posts SET dislikes_count = dislikes_count + 1 WHERE id = ?';
                    connection.query(updatePostSql, [postId], (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error updating post dislike count', error });
                            });
                        }

                        // Commit transaction
                        connection.commit(error => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Error committing transaction', error });
                                });
                            }
                            res.json({ message: 'Dislike added to post successfully' });
                        });
                    });
                });
            }
        });
    });
});

// Undo a like or dislike on a post
router.post('/post/undoReaction', (req, res) => {
    const { userId, postId, reactionType } = req.body;
    const validReactions = ['like', 'dislike'];
    
    if (!validReactions.includes(reactionType)) {
        return res.status(400).json({ message: 'Invalid reaction type' });
    }

    // Begin transaction
    connection.beginTransaction(error => {
        if (error) {
            return res.status(500).json({ message: 'Error starting transaction', error });
        }

        // Remove the user's reaction from user_post_reactions
        const deleteSql = 'DELETE FROM user_post_reactions WHERE user_id = ? AND post_id = ?';
        connection.query(deleteSql, [userId, postId], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Error removing user reaction', error });
                });
            }

            if (results.affectedRows === 0) {
                // No reaction was found to undo
                return connection.rollback(() => {
                    res.status(404).json({ message: 'No reaction found to undo' });
                });
            }

            // Decrement the likes or dislikes count in posts table
            const updatePostSql = `UPDATE posts SET ${reactionType}s_count = ${reactionType}s_count - 1 WHERE id = ? AND ${reactionType}s_count > 0`;
            connection.query(updatePostSql, [postId], (error, results) => {
                if (error) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: `Error decrementing post ${reactionType} count`, error });
                    });
                }

                // Commit transaction
                connection.commit(error => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error committing transaction', error });
                        });
                    }
                    res.json({ message: 'Reaction undone successfully' });
                });
            });
        });
    });
});




router.get('/feed', (req, res) => {
    const userId = req.query.userId; // Assuming the user's ID is passed as a query parameter
    const sql = `
        SELECT 
            posts.*,
            users.username AS authorName,
            IF(upr.reaction_type = 'like', TRUE, FALSE) AS userLiked,
            IF(upr.reaction_type = 'dislike', TRUE, FALSE) AS userDisliked,
            (posts.likes_count - posts.dislikes_count) AS popularityScore
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        INNER JOIN followers ON posts.user_id = followers.followed_id
        LEFT JOIN user_post_reactions upr ON posts.id = upr.post_id AND upr.user_id = ?
        WHERE followers.follower_id = ?
        ORDER BY 
            popularityScore DESC,
            posts.created_at DESC`;

    connection.query(sql, [userId, userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching feed', error });
        }
        // Process the results to format them as needed
        const posts = results.map(post => ({
            ...post,
            userLiked: post.userLiked ? true : false,
            userDisliked: post.userDisliked ? true : false
        }));
        res.json({ message: 'Feed fetched successfully', posts });
    });
});


module.exports = router;