const jwt = require('jsonwebtoken');

exports.token = (userId) => {
    return jwt.sign( { _id: userId }, `${process.env.JWT_SECRET}`, { expiresIn: process.env.JWT_EXPIRES_IN } );
}