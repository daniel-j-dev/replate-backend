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
		accountType: user.accountType,
	};

	const secret = secrets.jwtSecret;
	const options = {
		expiresIn: '1d',
	};

	return jwt.sign(payload, secret, options);
};

//Middleware

router.use('/volunteer/', tokenAuth);
router.use('/business/', tokenAuth);

//Create

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
						error: err.message,
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
						error: err.message,
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

//Read

router.get('/business/:username', (req, res) => {
	db.findBizByUsername(req.params.username)
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'User not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err.message });
		});
});

router.get('/volunteer/:username', (req, res) => {
	db.findVolByUsername(req.params.username)
		.then((found) => {
			if (found) {
				res.status(200).json(found);
			} else {
				res.status(404).json({ message: 'User not found!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err.message });
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
			res.status(500).json({ message: 'Server error', error: err.message });
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
			res.status(500).json({ message: 'Server error', error: err.message });
		});
});

//Update

router.put('/business/:username', (req, res) => {
	if (req.body.password) {
		let hashedPass = bcrypt.hashSync(req.body.password, 12);
		if (
			req.decodedToken.username === req.params.username &&
			req.decodedToken.accountType === 'business'
		) {
			db.updateBusiness(req.decodedToken.username, {
				...req.body,
				password: hashedPass,
			})
				.then((returned) => {
					res.json({ message: 'Account updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(401).json({
				message: 'You do not have authorization to update this account.',
			});
		}
	} else {
		if (
			req.decodedToken.username === req.params.username &&
			req.decodedToken.accountType === 'business'
		) {
			db.updateBusiness(req.decodedToken.username, req.body)
				.then((returned) => {
					res.json({ message: 'Account updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(401).json({
				message: 'You do not have authorization to update this account.',
			});
		}
	}
});

router.put('/volunteer/:username', (req, res) => {
	if (req.body.password) {
		let hashedPass = bcrypt.hashSync(req.body.password, 12);
		if (
			req.decodedToken.username === req.params.username &&
			req.decodedToken.accountType === 'volunteer'
		) {
			db.updateVolunteer(req.decodedToken.username, {
				...req.body,
				password: hashedPass,
			})
				.then((returned) => {
					res.json({ message: 'Account updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(401).json({
				message: 'You do not have authorization to update this account.',
			});
		}
	} else {
		if (
			req.decodedToken.username === req.params.username &&
			req.decodedToken.accountType === 'volunteer'
		) {
			db.updateVolunteer(req.decodedToken.username, req.body)
				.then((returned) => {
					res.json({ message: 'Account updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(401).json({
				message: 'You do not have authorization to update this account.',
			});
		}
	}
});

//Delete

router.delete('/business/:username', (req, res) => {
	if (
		req.decodedToken.username === req.params.username &&
		req.decodedToken.accountType === 'business'
	) {
		db.deleteBusinessAccount(req.decodedToken.username)
			.then((returned) => {
				res.status(200).json({ message: 'Account deleted.' });
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server error', error: err.message });
			});
	} else {
		res.status(401).json({
			message: 'You do not have authorization to delete this account.',
		});
	}
});

router.delete('/volunteer/:username', (req, res) => {
	if (
		req.decodedToken.username === req.params.username &&
		req.decodedToken.accountType === 'volunteer'
	) {
		//Sets pickup requests assigned to this user to 'Pending' then deletes the user
		db.updatePickupRequestsByVolID(req.decodedToken.userID, {
			volunteerAccountID: null,
			status: 'Pending',
		})
			.then(() => {
				db.deleteVolunteerAccount(req.params.username).then(() => {
					res.status(200).json({
						message:
							'Deleted account and set their assigned pickup requests to Unassigned.',
					});
				});
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server error', error: err.message });
			});
	} else {
		res.status(401).json({
			message: 'You do not have authorization to delete this account.',
		});
	}
});

//Login

router.post('/login', (req, res) => {
	if (req.body.username && req.body.password) {
		if (req.body.accountType === 'business') {
			db.findBizPasswordByUsername(req.body.username)
				.then((found) => {
					if (found && bcrypt.compareSync(req.body.password, found.password)) {
						const token = generateToken({
							id: found.id,
							username: found.username,
							accountType: 'business',
						});
						res
							.status(200)
							.json({ message: 'Login successful!', token: token });
					} else {
						res.status(400).json({ message: 'Invalid credentials.' });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else if (req.body.accountType === 'volunteer') {
			db.findVolPasswordByUsername(req.body.username)
				.then((found) => {
					if (found && bcrypt.compareSync(req.body.password, found.password)) {
						const token = generateToken({
							id: found.id,
							username: found.username,
							accountType: 'volunteer',
						});
						res
							.status(200)
							.json({ message: 'Login successful!', token: token });
					} else {
						res.status(400).json({ message: 'Invalid credentials.' });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
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
