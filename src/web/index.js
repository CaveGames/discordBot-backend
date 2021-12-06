const express = require('express');
const app = express();
const cors = require('cors');

app.use(
	cors({
		origin: 'http://localhost:8080',
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
	path: '/api/socket',
	cors: {
		origin: 'http://localhost:8080',
	},
});

const usersRouter = require('./routes/users.routes');
const router = express.Router();

router.use('/users', usersRouter);

app.use('/api', router);

app.use(function(req, res, next) {
	res.status(404).json({
		message: 'No such route exists',
	});
});

server.listen(3000, () => {
	console.log('Lisitening on Web');
});
