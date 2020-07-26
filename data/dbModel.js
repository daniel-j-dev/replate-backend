const db = require('./dbConfig.js');

const newAccount = (obj) => {
	return db('users').insert(obj);
};

const findByUsername = (username) => {
	return db('users').where({ username }).first();
};

const findAll = () => {
	return db('users');
};

module.exports = {
	newAccount,
	findByUsername,
	findAll,
};
