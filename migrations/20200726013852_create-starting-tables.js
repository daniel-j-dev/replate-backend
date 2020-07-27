const { table } = require('console');

exports.up = function (knex) {
	return knex.schema
		.createTable('volunteerAccounts', (tbl) => {
			tbl.increments();
			tbl.text('username').unique().notNullable();
			tbl.text('password').notNullable();
			tbl.text('phoneNumber').notNullable();
			tbl.text('volunteerName').notNullable();
		})
		.createTable('businessAccounts', (tbl) => {
			tbl.increments();
			tbl.text('username').unique().notNullable();
			tbl.text('password').notNullable();
			tbl.text('phoneNumber').notNullable();
			tbl.text('businessName').notNullable();
			tbl.text('businessAddress').notNullable();
		})
		.createTable('pickupRequests', (tbl) => {
			tbl.increments();
			tbl
				.integer('businessAccountID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('businessAccounts')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			tbl.text('foodType').notNullable();
			tbl.datetime('preferredPickupTime', { precision: 6 }).notNullable();
			tbl
				.integer('volunteerAccountID')
				.references('id')
				.inTable('volunteerAccounts')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists('pickupRequests')
		.dropTableIfExists('businessAccounts')
		.dropTableIfExists('volunteerAccounts');
};