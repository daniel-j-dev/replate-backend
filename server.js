//Imports

const express = require('express');

//Vars

const server = express();

const PORT = 8000;

//Middleware

server.use(express.json());

//Start server

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});