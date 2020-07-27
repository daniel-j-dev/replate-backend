//Imports

const express = require('express');
const userRouter = require('./auth/userRouter.js');
const pickupRequestsRouter = require('./auth/pickupRequestsRouter.js');

//Vars

const server = express();

const PORT = 8000;

//Middleware

server.use(express.json());
server.use('/', userRouter);
server.use('/pickup', pickupRequestsRouter);

//Start server

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});