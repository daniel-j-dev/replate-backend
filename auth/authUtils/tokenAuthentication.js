const jwt = require('jsonwebtoken');

const secrets = require('./secrets.js');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;
	const secret = secrets.jwtSecret;

	// try {
	// 	if (token) {
	// 		let decoded = jwt.verify(token, secret);
	// 		return { ...decoded, status: true };
	// 	} else {
	// 		return { status: false, message: 'Provide a token' };
	// 	}
	// } catch (err) {
	// 	return { status: false, message: 'Invalid or expired token' };
	// }

	if (token) {
		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				res.status(401).json({ you: 'Invalid or expired token' });
			} else {
				req.decodedToken = decodedToken;

				next();
			}
		});
	} else {
		res.status(400).json({ message: 'Provide a token' });
	}
};
