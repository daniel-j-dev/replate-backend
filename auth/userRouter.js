//Imports

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../data/dbModel.js');
const jwt = require('jsonwebtoken');
const secrets = require('./authUtils/secrets.js');

const tokenAuth = require('./authUtils/tokenAuthentication.js');

//Variables & Functions

const router = express.Router();

let generateToken = (user) => {
	//What happens when a user changes their username while logged in?
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

//Middleware

router.use('/volunteer/', tokenAuth);
router.use('/business/', tokenAuth)

//CRUD

router.post('/register', (req, res) => {
	if (req.body.accountType === 'business') {
		if (
			req.body.username &&
			req.body.password &&
			req.body.phoneNumber &&
			req.body.businessName &&
			req.body.businessAddress
		) {
			let hashedPass = bcrypt.hashSync(req.body.password, 12);
			db.newBusinessAccount({
				username: req.body.username,
				password: hashedPass,
				phoneNumber: req.body.phoneNumber,
				businessName: req.body.businessName,
				businessAddress: req.body.businessAddress,
			})
				.then((returned) => {
					res.status(201).json({ message: 'Account created!' });
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Server error - does the username already exists?',
						error: err,
					});
				});
		} else {
			res.status(400).json({
				message:
					'Provide a username, password, phoneNumber, businessName and businessAddress.',
			});
		}
	} else if (req.body.accountType === 'volunteer') {
		if (
			req.body.username &&
			req.body.password &&
			req.body.phoneNumber &&
			req.body.volunteerName
		) {
			let hashedPass = bcrypt.hashSync(req.body.password, 12);
			db.newVolunteerAccount({
				username: req.body.username,
				password: hashedPass,
				phoneNumber: req.body.phoneNumber,
				volunteerName: req.body.volunteerName,
			})
				.then((returned) => {
					res.status(201).json({ message: 'Account created!' });
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Server error - does the username already exists?',
						error: err,
					});
				});
		} else {
			res.status(400).json({
				message: 'Provide a username, password, phoneNumber and volunteerName.',
			});
		}
	} else {
		res
			.status(400)
			.json({ message: 'Provide an accountType of business or volunteer.' });
	}
});

router.get('/business/:id', (req, res) => {
	db.findBizByUsername(req.params.id)
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'User not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err });
		});
});

router.get('/volunteer/:id', (req, res) => {
	db.findVolByUsername(req.params.id)
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'User not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err });
		});
});

router.get('/volunteer/', (req, res) => {
	db.findAllVolunteers()
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'Volunteers not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err });
		});
});

router.get('/business/', (req, res) => {
	db.findAllBusinesses()
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'Businesses not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err });
		});
});

//Login

router.post('/login', (req, res) => {
	if (req.body.username && req.body.password) {
		if (req.body.accountType === 'business') {
			db.findBizByUsername(req.body.username)
				.then((found) => {
					if (found && bcrypt.compareSync(req.body.password, found.password)) {
						const token = generateToken(found);
						res
							.status(200)
							.json({ message: 'Login successful!', token: token });
					} else {
						res.status(400).json({ message: 'Invalid credentials.' });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else if (req.body.accountType === 'volunteer') {
			db.findVolByUsername(req.body.username)
				.then((found) => {
					if (found && bcrypt.compareSync(req.body.password, found.password)) {
						const token = generateToken(found);
						res
							.status(200)
							.json({ message: 'Login successful!', token: token });
					} else {
						res.status(400).json({ message: 'Invalid credentials.' });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else {
			res
				.status(400)
				.json({ message: 'Provice an accountType of business or volunteer.' });
		}
	} else {
		res.status(400).json({ message: 'Provide a username and password.' });
	}
});



module.exports = router;
