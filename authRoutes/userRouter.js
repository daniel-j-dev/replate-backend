//Imports

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../data/dbModel.js');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');

//Variables & Functions

const router = express.Router();

let generateToken = (user) => { //What happens when a user changes their username while logged in?
	const payload = {
		userID: user.id,
		username: user.username,
	};

	const secret = secrets.jwtSecret;
	const options = {
		expiresIn: '1d',
	};

	return jwt.sign(payload, secret, options);
};

//Routes - Path starts at root

router.post('/register', (req, res) => {
	if (
		req.body.username &&
		req.body.password &&
		req.body.accountType &&
		req.body.phoneNumber
	) {
		if (
			req.body.accountType === 'business' ||
			req.body.accountType === 'volunteer'
		) {
			let hashedPass = bcrypt.hashSync(req.body.password, 12);
			db.newAccount({
				username: req.body.username,
				password: hashedPass,
				accountType: req.body.accountType,
				phoneNumber: req.body.phoneNumber,
			})
				.then((returned) => {
					res.status(201).json({ message: 'Account created!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else {
			res
				.status(400)
				.json({ message: 'The accountType must be business or volunteer.' });
		}
	} else {
		res.status(400).json({
			message: 'Provide a username, password, accountType and phoneNumber.',
		});
	}
});

router.post('/login', (req, res) => {
	if (req.body.username && req.body.password) {
		db.findByUsername(req.body.username)
			.then((found) => {
				if (found && bcrypt.compareSync(req.body.password, found.password)) {
                    const token = generateToken(found);
                    res.status(200).json({message: 'Login successful!', token: token});
				} else {
                    res.status(400).json({message: 'Invalid credentials.'});
                }
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server error', error: err });
			});
	} else {
		res.status(400).json({ message: 'Provide a username and password.' });
	}
});

module.exports = router;
