const db = require('./dbConfig.js');

//Volunteer CRUD Model

const newVolunteerAccount = (obj) => {
	return db('volunteerAccounts').insert(obj);
};

const findVolByUsername = (username) => {
	return db
		.column('username', 'phoneNumber', 'volunteerName')
		.from('volunteerAccounts')
		.where({ username })
		.first();
};

const findAllVolunteers = () => {
	return db
		.column('username', 'phoneNumber', 'volunteerName')
		.from('volunteerAccounts');
};

//Business CRUD Model

const newBusinessAccount = (obj) => {
	return db('businessAccounts').insert(obj);
};

const findBizByUsername = (username) => {
	return db
		.column('username', 'phoneNumber', 'businessName', 'businessAddress')
		.from('businessAccounts')
		.where({ username })
		.first();
};

const findAllBusinesses = () => {
	return db
		.column('username', 'phoneNumber', 'businessName', 'businessAddress')
		.from('businessAccounts');
};

module.exports = {
	newVolunteerAccount,
	findVolByUsername,
	findAllVolunteers,
	newBusinessAccount,
	findBizByUsername,
	findAllBusinesses,
};
