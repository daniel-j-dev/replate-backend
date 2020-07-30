//Had to do too much logic that could break with small changes to the db.
//If I were to do this over, I'd seperate pickup requests into two or more tables

const express = require('express');
const tokenAuth = require('./authUtils/tokenAuthentication.js');
const db = require('../data/dbModel.js');

const router = express.Router();

//Path starts at /pickup

router.use('/', tokenAuth);

router.post('/', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		if (req.body.foodType && req.body.amount && req.body.preferredPickupTime) {
			db.newPickupRequest({
				businessAccountID: req.decodedToken.userID,
				foodType: req.body.foodType,
				amount: req.body.amount,
				preferredPickupTime: req.body.preferredPickupTime,
			})
				.then((returned) => {
					res
						.status(201)
						.json({ message: 'Pickup request created!', id: returned });
				})
				.catch((err) => {
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(400).json({
				message: 'Provide a foodType, amount and preferredPickupTime.',
			});
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
			res.status(500).json({ message: 'Server error', error: err.message });
		});
});

router.put('/:id', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		if (req.body) {
			//Checks if the business created the pickup request before allowing them to update it
			db.findPickupById(req.params.id)
				.then((found) => {
					if (found.businessAccountID === req.decodedToken.userID) {
						db.updatePickupRequest(req.params.id, {
							foodType: req.body.foodType,
							amount: req.body.amount,
							preferredPickupTime: req.body.preferredPickupTime,
						})
							.then((returned) => {
								// res.status(200).json({
								// 	message: 'Pickup request updated!',
								// 	updatedPickup: returned
								// });

								db.findPickupById(req.params.id).then((returned) => {
									res.status(200).json({
										message: 'Pickup request updated!',
										updatedPickup: returned,
									});
								});
							})
							.catch((err) => {
								res.status(500).json({
									message: 'Server error',
									error: err.message,
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
					res.status(500).json({ message: 'Server error', error: err.message });
				});
		} else {
			res.status(400).json({
				message: 'Provide a foodType, amount and preferredPickupTime.',
			});
		}
	} else if (req.decodedToken.accountType === 'volunteer') {
		if (req.body.status === 'Assigned') {
			db.findPickupById(req.params.id)
				.then((found) => {
					//Add check to see if it's not already assigned or complete
					if (found.status === 'Pending') {
						db.updatePickupRequest(req.params.id, {
							volunteerAccountID: req.decodedToken.userID,
							status: 'Assigned',
						}).then((returned) => {
							res.status(200).json({ message: 'Pickup request updated!' });
						});
					} else {
						res.json({
							message:
								'You do not have authorization to update this pickup request. The pickup request is already assigned.',
						});
					}
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Server error',
						error: err.message,
					});
				});
		} else if (
			req.body.status === 'Pending' ||
			req.body.status === 'Complete'
		) {
			db.findPickupById(req.params.id)
				.then((found) => {
					//Add a check to see if they're even the assigned volunteer first & that the pickup request isn't complete yet
					if (
						found.volunteerAccountID === req.decodedToken.userID &&
						found.status != 'Complete'
					) {
						switch (req.body.status) {
							//If attempting to cancel the pickup request, it sets the volunteer value to null and changes status to pending
							case 'Pending':
								db.updatePickupRequest(req.params.id, {
									volunteerAccountID: null,
									status: 'Pending',
								}).then((returned) => {
									res.status(200).json({
										message: 'Pickup request updated!',
									});
								});
								break;
							//If attempting to complete the pickup request, it sets it to complete
							case 'Complete':
								db.updatePickupRequest(req.params.id, {
									status: 'Complete',
								}).then((returned) => {
									res.status(200).json({
										message: 'Pickup request updated!',
									});
								});
						}
					} else {
						res.json({
							message:
								'You do not have authorization to update this pickup request. The pickup request may not be assigned to you or is already complete.',
						});
					}
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Server error',
						error: err.message,
					});
				});
		} else {
			res.status(400).json({
				message: 'Provide an object with "status" set to Complete or Pending.',
			});
		}
	}
});

router.delete('/:id', (req, res) => {
	if (req.decodedToken.accountType === 'business') {
		//Check if this biz made the pickup request first before letting them delete it
		db.findPickupById(req.params.id)
			.then((found) => {
				if (
					found.businessAccountID === req.decodedToken.userID &&
					found.status !== 'Complete'
				) {
					db.deletePickupRequest(req.params.id)
						.then((returned) => {
							res.status(200).json({ message: 'Pickup request deleted!' });
						})
						.catch((err) => {
							res.status(500).json({
								message: 'Failed to delete pickup request',
								error: err.message,
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
				res.status(500).json({ message: 'Server error', error: err.message });
			});
	} else {
		res.status(401).json({
			message: 'You do not have authorization to delete this pickup request.',
		});
	}
	// else if (req.decodedToken.accountType === 'volunteer') {
	// 	//Only allow a volunteer to delete (aka complete) a pickup if they're assigned to it
	// 	db.findPickupById(req.params.id)
	// 		.then((found) => {
	// 			if (found.volunteerAccountID === req.decodedToken.userID) {
	// 				console.log('equalk');
	// 				db.deletePickupRequest(req.params.id)
	// 					.then((returned) => {
	// 						res.status(200).json({ message: 'Pickup request deleted!' });
	// 					})
	// 					.catch((err) => {
	// 						res.status(500).json({
	// 							message: 'Failed to delete pickup request',
	// 							error: err.message,
	// 						});
	// 					});
	// 			}
	// 			else {
	// 				res.status(401).json({
	// 					message:
	// 						'You do not have authorization to delete this pickup request.',
	// 				});
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			res.status(500).json({ message: 'Server error', error: err });
	// 		});
	// }
});

module.exports = router;
