require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const errorLogger = require('./middleware/errorLogger');

const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const iterationsRoutes = require('./routes/iterations');
const tasksRoutes = require('./routes/tasks');
const usersRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/projects', projectsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/iterations', iterationsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
	res.status(404).send('Page not found');
});

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(process.env.DB_URL)
	.then(() => {
		console.info('Connected!');
		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => console.error(err));
