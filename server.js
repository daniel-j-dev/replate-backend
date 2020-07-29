//Imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRouter = require('./auth/userRouter.js');
const pickupRequestsRouter = require('./auth/pickupRequestsRouter.js');

//Vars

const server = express();

const port = process.env.PORT;

//Middleware

server.use(cors());
server.use(express.json());
server.use('/', userRouter);
server.use('/pickup', pickupRequestsRouter);

server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});