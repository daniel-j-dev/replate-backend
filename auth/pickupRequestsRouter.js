const express = require('express');
const tokenAuth = require('./authUtils/tokenAuthentication.js');
const db = require('../data/dbModel.js');

const router = express.Router();

//Path starts at /pickup

router.use('/', tokenAuth);

router.post('/', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		if (req.body.foodType && req.body.preferredPickupTime) {
			db.newPickupRequest({
				businessAccountID: req.decodedToken.userID,
				foodType: req.body.foodType,
				preferredPickupTime: req.body.preferredPickupTime,
			})
				.then((returned) => {
					res.status(201).json({ message: 'Pickup request created!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else {
			res
				.status(400)
				.json({ message: 'Provide a foodType and preferredPickupTime.' });
		}
	} else {
		res.status(401).json({
			message: 'You do not have authorization to create a pickup request.',
		});
	}
});

router.get('/', (req, res) => {
	db.findAllPickupRequests()
		.then((returned) => {
			res.json(returned);
		})
		.catch((err) => {
			res.status(500).json({ message: 'Server error', error: err });
		});
});

router.put('/:id', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		if (req.body.foodType && req.body.preferredPickupTime) {
			//Check if the business created the pickup request before allowing them to update it
			db.findPickupById(req.params.id)
				.then((found) => {
					if (found.businessAccountID === req.decodedToken.userID) {
						db.updatePickupRequest(req.params.id, {
							foodType: req.body.foodType,
							preferredPickupTime: req.body.preferredPickupTime,
						})
							.then((returned) => {
								res.status(200).json({
									message: 'Pickup request updated!',
								});
							})
							.catch((err) => {
								res.status(500).json({
									message: 'Server error',
									error: err,
								});
							});
					} else {
						res.status(401).json({
							message:
								'You do not have authorization to update this pickup request.',
						});
					}
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else {
			res
				.status(400)
				.json({ message: 'Provide a foodType and preferredPickupTime.' });
		}
	} else if (req.decodedToken.accountType === 'volunteer') {
		if (req.body.assign === true) {
			db.updatePickupRequest(req.params.id, {
				volunteerAccountID: req.decodedToken.userID,
			})
				.then((returned) => {
					res.status(200).json({ message: 'Pickup request updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else if (req.body.assign === false) { //Add a check to see if they're even the assigned volunteer first
			db.updatePickupRequest(req.params.id, {
				volunteerAccountID: null,
			})
				.then((returned) => {
					res.status(200).json({ message: 'Pickup request updated!' });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err });
				});
		} else {
			res.status(400).json({
				message: 'Provide an object with "assign" set to true or false.',
			});
		}
	}
});

router.delete('/:id', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		//Check if this biz made the pickup request first before letting them delete it
		db.findPickupById(req.params.id)
			.then((found) => {
				if (found.businessAccountID === req.decodedToken.userID) {
					db.deletePickupRequest(req.params.id)
						.then((returned) => {
							res.status(200).json({ message: 'Pickup request deleted!' });
						})
						.catch((err) => {
							res.status(500).json({
								message: 'Failed to delete pickup request',
								error: err,
							});
						});
				}
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server error', error: err });
			});
	} else if (req.decodedToken.accountType === 'volunteer') {
		//Only allow a volunteer to delete (aka complete) a pickup if they're assigned to it
		db.findPickupById(req.params.id)
			.then((found) => {
				if (found.volunteerAccountID === req.decodedToken.userID) {
					console.log('equalk');
					db.deletePickupRequest(req.params.id)
						.then((returned) => {
							res.status(200).json({ message: 'Pickup request deleted!' });
						})
						.catch((err) => {
							res.status(500).json({
								message: 'Failed to delete pickup request',
								error: err,
							});
						});
				} else {
					res.status(401).json({
						message:
							'You do not have authorization to delete this pickup request.',
					});
				}
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server error', error: err });
			});
	}
});

module.exports = router;
