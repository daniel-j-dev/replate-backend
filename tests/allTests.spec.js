const request = require('supertest');
const server = require('../server.js');

//Comment out server.listen in server.js before running tests - https://github.com/visionmedia/supertest/issues/568

//Some of the tests take a 'token' - since the heroku deployment may have a different "secret" in environment variables will the tests fail?

//Tokens expire in year 2033

//Register

test('POST /register returns json if no accountType is provided', () => {
	return request(server)
		.post('/register')
		.send({  })
		.then((res) => {
			expect(res.body.message).toBe(
				'Provide an accountType of business or volunteer.'
			);
		});
});

test('POST /register returns json if not all business fields are provided', () => {
	return request(server)
		.post('/register')
		.send({accountType: 'business'})
		.then((res) => {
			expect(res.body.message).toBe(
				'Provide a username, password, phoneNumber, businessName and businessAddress.'
			);
		});
});

test('POST /register returns json if not all volunteer fields are provided', () => {
	return request(server)
		.post('/register')
		.send({ accountType: 'volunteer' })
		.then((res) => {
			expect(res.body.message).toBe(
				'Provide a username, password, phoneNumber and volunteerName.'
			);
		});
});

//Login

test('POST /login returns json if no username or password is provided', () => {
	return request(server)
		.post('/login')
		.send({})
		.then((res) => {
			expect(res.body.message).toBe('Provide a username and password.');
		});
});

test('POST /login returns json if no accountType is provided', () => {
	return request(server)
		.post('/login')
		.send({username: 'a', password: 'a'})
		.then((res) => {
			expect(res.body.message).toBe(
				'Provide an accountType of business or volunteer.'
			);
		});
});

test('POST /login returns json if no invalid credentials for volunteer', () => {
	return request(server)
		.post('/login')
		.send({ username: 'a', password: 'a', accountType: 'volunteer'})
		.then((res) => {
			expect(res.body.message).toBe('Invalid credentials.');
		});
});

test('POST /login returns json if no invalid credentials for business', () => {
	return request(server)
		.post('/login')
		.send({ username: 'a', password: 'a', accountType: 'business' })
		.then((res) => {
			expect(res.body.message).toBe('Invalid credentials.');
		});
});

test('POST /login returns token if valid credentials for business', () => {
	return request(server)
		.post('/login')
		.send({ username: 'user1', password: 'user1', accountType: 'business' })
		.then((res) => {
			expect(res.body).toHaveProperty('token')
		});
});

test('POST /login returns token if valid credentials for volunteer', () => {
	return request(server)
		.post('/login')
		.send({ username: 'user1', password: 'user1', accountType: 'volunteer' })
		.then((res) => {
			expect(res.body).toHaveProperty('token')
		});
});

// GET /volunteer and /business

test('GET /volunteer returns json if no jwt is provided', () => {
	return request(server)
		.get('/volunteer')
		.then((res) => {
			expect(res.body.message).toBe('Provide a token');
		});
});

test('GET /volunteer returns all volunteers if header is set with a valid token', () => {
	return request(server)
		.get('/volunteer')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.then((res) => {
			expect(res.body[0].id).toBe(1);
		});
});

test('GET /volunteer/username returns one volunteer if header is set with a valid token', () => {
	return request(server)
		.get('/volunteer/user1')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.then((res) => {
			expect(res.body.username).toBe('user1'); 
		});
});

test('GET /business returns json if no jwt is provided', () => {
	return request(server)
		.get('/business')
		.then((res) => {
			expect(res.body.message).toBe('Provide a token');
		});
});

test('GET /business returns all businesses if header is set with a valid token', () => {
	return request(server)
		.get('/business')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.then((res) => {
			expect(res.body[0].id).toBe(1);
		});
});

test('GET /business returns one business if header is set with a valid token', () => {
	return request(server)
		.get('/business/user1')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.then((res) => {
			expect(res.body.username).toBe('user1'); 
		});
});

// PUT /volunteer.username and /business/username

test('PUT /business/username updates fileds provided', () => {
	return request(server)
		.put('/business/user1')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.send({
			phoneNumber: '123-456-7890',
		})
		.then((res) => {
			expect(res.body.message).toBe('Account updated!');
		});
});

test('PUT /volunteer/username updates fileds provided', () => {
	return request(server)
		.put('/volunteer/user1')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6InZvbHVudGVlciIsImlhdCI6MTU5NjA4MzI5NywiZXhwIjoxOTk0ODA2ODYxfQ.MYJR2AgVbCWS-qj70kOtFkqe-vI9zLCjXelZG06BiG0'
		)
		.send({
			phoneNumber: '123-456-7890',
		})
		.then((res) => {
			expect(res.body.message).toBe('Account updated!');
		});
});   

////////////////////// Pickup requests

test('POST /pickup creates pickup request if logged in as a business', () => {
	return request(server)
		.post('/pickup')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.send({
			foodType: 'fruit',
			amount: '900000 tons',
			preferredPickupTime: '1 second from now',
		})
		.then((res) => {
			expect(res.body.message).toBe('Pickup request created!');
		});
});

test('POST /pickup fails if a required field is not provided', () => {
	return request(server)
		.post('/pickup')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.send({
			amount: '900000 tons',
			preferredPickupTime: '1 second from now',
		})
		.then((res) => {
			expect(res.body.message).toBe(
				'Provide a foodType, amount and preferredPickupTime.'
			);
		});
});

test('POST /pickup fails if logged in as a volunteer', () => {
	return request(server)
		.post('/pickup')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6InZvbHVudGVlciIsImlhdCI6MTU5NjA4MzI5NywiZXhwIjoxOTk0ODA2ODYxfQ.MYJR2AgVbCWS-qj70kOtFkqe-vI9zLCjXelZG06BiG0'
		)
		.send({
			foodType: 'fruit',
			amount: '900000 tons',
			preferredPickupTime: '1 second from now',
		})
		.then((res) => {
			expect(res.body.message).toBe(
				'You do not have authorization to create a pickup request.'
			);
		});
});

test('GET /pickup returns all pickup requests', () => {
	return request(server)
		.get('/pickup')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.then((res) => {
			expect(res.body[0]).toHaveProperty('id');
		});
});

test('PUT /pickup/:id fails if not logged into the account that created the pickup request', () => {
	return request(server)
		.put('/pickup/58')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.send({
			amount: '2 tons',
		})
		.then((res) => {
			expect(res.body.message).toBe(
				'You do not have authorization to update this pickup request.'
			);
		});
});

test('PUT /pickup/:id works if logged into the account that created the pickup request', () => {
	return request(server)
		.put('/pickup/2')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6ImJ1c2luZXNzIiwiaWF0IjoxNTk2MDgzMjk3LCJleHAiOjE5OTQ4MDY4NjF9.ea9ja57tFKH71H2PIJ9xds7FbtKzJfyZkqX3D4zI90I'
		)
		.send({
			amount: '2 tons',
		})
		.then((res) => {
			expect(res.body.message).toBe('Pickup request updated!');
		});
});

test('PUT /pickup/:id setting status to Complete fails if not signed in as a volunteer that is assigned to the pickup request', () => {
	return request(server)
		.put('/pickup/2')
		.set(
			'Authorization',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoidXNlcjEiLCJhY2NvdW50VHlwZSI6InZvbHVudGVlciIsImlhdCI6MTU5NjA4MzI5NywiZXhwIjoxOTk0ODA2ODYxfQ.MYJR2AgVbCWS-qj70kOtFkqe-vI9zLCjXelZG06BiG0'
		)
		.send({
			status: 'Complete',
		})
		.then((res) => {
			expect(res.body.message).toBe(
				'You do not have authorization to update this pickup request. The pickup request may not be assigned to you or is already complete.'
			);
		});
});