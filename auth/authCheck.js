const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    // Read the token from the cookie
    const token = req.cookies.token;

    if (!token) {
        //next();
        return res.status(401).json('Access denied - No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        req.user = decoded;

        next();
    } catch (err) {
        console.error("Error", err);

        res.clearCookie('token');

        return res.status(400).send('Error decoding token: ' + err.message);
    }
};

module.exports = authCheck;