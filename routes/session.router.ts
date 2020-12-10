import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.route('/status').get((req, res) => {
    // Read the token from the cookie
    const token = req.cookies.token;

    if (!token)
        return res.status(401).json('Access denied - No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (decoded)
            res.json(true);
    } catch (err) {
        console.error("Error", err);

        return res.status(400).send('Error decoding token: ' + err.message);
    }
});

router.route('/logout').post((req, res) => {
    res.clearCookie('token');
    res.json(true);
});

module.exports = router;