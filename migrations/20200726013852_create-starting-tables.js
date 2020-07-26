const { table } = require('console');

exports.up = function (knex) {
	return knex.schema
		.createTable('users', (tbl) => {
			tbl.increments()
			tbl.text('username').unique().notNullable();
			tbl.text('password').notNullable();
			tbl.text('accountType').notNullable();
			tbl.text('phoneNumber').notNullable();
		})
		.createTable('businessProfiles', (tbl) => {
			tbl.increments();
			tbl
				.integer('userID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			tbl.text('businessName').notNullable();
			tbl.text('businessAddress').notNullable();
			tbl.text('businessPhoneNumber').notNullable();
		})
		.createTable('volunteerProfiles', (tbl) => {
			tbl.increments();
			tbl
				.integer('userID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			tbl.text('volunteerName').notNullable();
		})
		.createTable('pickupRequests', (tbl) => {
			tbl.increments()
			tbl
				.integer('businessUserID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			tbl.text('foodType').notNullable();
			tbl.datetime('preferredPickupTime', { precision: 6 }).notNullable();
		})
		.createTable('assignedPickups', (tbl) => {
			tbl.increments();
			tbl
				.integer('pickupRequestID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('pickupRequests')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			tbl
				.integer('volunteerID')
				.unique()
				.notNullable()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists('assignedPickups')
		.dropTableIfExists('pickupRequests')
        .dropTableIfExists('volunteerProfiles')
        .dropTableIfExists('businessProfiles')
        .dropTableIfExists('users');
};
