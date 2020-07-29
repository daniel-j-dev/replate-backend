const db = require('./dbConfig.js');

//Volunteer CRUD Model

const newVolunteerAccount = (obj) => {
	return db('volunteerAccounts').insert(obj);
};

const findVolByUsername = (username) => {
	return db
		.column('id', 'username', 'phoneNumber', 'volunteerName')
		.from('volunteerAccounts')
		.where({ username })
		.first();
};

const findAllVolunteers = () => {
	return db
		.column('id', 'username', 'phoneNumber', 'volunteerName')
		.from('volunteerAccounts');
};

const updateVolunteer = (currentUsername, obj) => {
	return db('volunteerAccounts')
		.where({ username: currentUsername })
		.update(obj);
};

const deleteVolunteerAccount = (username) => {
	return db('volunteerAccounts').where({ username: username }).del();
};

//Business CRUD Model

const newBusinessAccount = (obj) => {
	return db('businessAccounts').insert(obj);
};

const findBizByUsername = (username) => {
	return db
		.column('id', 'username', 'phoneNumber', 'businessName', 'businessAddress')
		.from('businessAccounts')
		.where({ username })
		.first();
};

const findAllBusinesses = () => {
	return db
		.column('id', 'username', 'phoneNumber', 'businessName', 'businessAddress')
		.from('businessAccounts');
};

const updateBusiness = (currentUsername, obj) => {
	return db('businessAccounts')
		.where({ username: currentUsername })
		.update(obj);
};

const deleteBusinessAccount = (username) => {
	return db('businessAccounts').where({ username: username }).del();
};

//Dangerous reads - returns entries with hashed passwords

const findVolPasswordByUsername = (username) => {
	return db('volunteerAccounts').where({ username: username }).first();
};

const findBizPasswordByUsername = (username) => {
	return db('businessAccounts').where({ username: username }).first();
};

//Pickup Request Crud

const newPickupRequest = (obj) => {
	return db('pickupRequests').insert(obj);
};

const findAllPickupRequests = () => {
	return db('pickupRequests');
};

const findPickupById = (id) => {
	return db('pickupRequests').where({ id: id }).first();
};

const updatePickupRequest = (id, obj) => {
	return db('pickupRequests').where({ id: id }).update(obj);
};

const updatePickupRequestsByVolID = (volID, obj) => {
	return db('pickupRequests').where({ volunteerAccountID: volID }).update(obj);
};

const deletePickupRequest = (id) => {
	return db('pickupRequests').where({id: id}).del()
}

module.exports = {
	newVolunteerAccount,
	findVolByUsername,
	findAllVolunteers,
	newBusinessAccount,
	findBizByUsername,
	findAllBusinesses,
	findVolPasswordByUsername,
	findBizPasswordByUsername,
	updateBusiness,
	updateVolunteer,
	deleteBusinessAccount,
	deleteVolunteerAccount,
	newPickupRequest,
	findAllPickupRequests,
	updatePickupRequest,
	updatePickupRequestsByVolID,
	findPickupById,
	deletePickupRequest,
};
