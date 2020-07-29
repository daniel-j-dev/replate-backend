const request = require('supertest');
const server = require('../server.js');

test('Returns json if no jwt is provided', () => {
	return request(server)
		.get('/volunteer')
		.then((res) => {
			expect(res.body.message).toBe('Provide a token');
		});
});
