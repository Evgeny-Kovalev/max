const { ObjectId } = require('mongoose').Types;
const moment = require('moment');
const { TextEncoderStream } = require('stream/web');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.getProjects = async (req, res, next) => {
	const { userId } = req.query;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(400).json({ message: 'User not found' });

		const userProjects = await Project.find({ ownerId: user._id })
			.populate({
				select: ['_id', 'name', 'email', 'icon'],
				model: 'User',
				path: 'users',
			});
		return res.status(200).json(userProjects);
	} catch (e) {
		next('Failed to get projects!');
	}
};

exports.getProject = async (req, res, next) => {
	const { id } = req.params;

	try {
		const project = await Project.findById(id).populate({
			path: 'users',
			select: ['_id', 'name', 'email', 'icon'],
			model: 'User',
		});
		if (!project) return res.status(400).json({ message: 'Project not found' });
		return res.status(200).json(project);
	} catch (e) {
		next('Failed to get the project');
	}
};

exports.postProject = async (req, res, next) => {
	const { project, userId } = req.body;
	const { title, description, users } = project;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(400).json({ message: 'User not found' });

		const projectExist = await Project.findOne({ title, ownerId: userId });
		if (projectExist) return res.status(400).json({ message: 'A Project with the same title already exists' });

		const newProject = new Project({
			title,
			description,
			users,
			ownerId: user._id,
		});

		await newProject.populate({
			select: ['_id', 'name', 'email', 'icon'],
			model: 'User',
			path: 'users',
		});

		await newProject.save();

		return res.status(200).json({
			message: 'Project created successfully.',
			project: newProject,
		});
	} catch (e) {
		next('Failed to create project!');
	}
};

exports.putEditProject = async (req, res, next) => {
	const { id } = req.params;
	const { project } = req.body;

	try {
		const editedProject = await Project.findByIdAndUpdate(id, project, { new: true })
			.populate({
				select: ['_id', 'name', 'email', 'icon'],
				model: 'User',
				path: 'users',
			});
		return res.status(200).json({
			message: 'Project edited successfully',
			project: editedProject,
		});
	} catch (e) {
		next('Failed to edit project.');
	}
};

exports.deleteProject = async (req, res, next) => {
	const { id } = req.params;

	try {
		await Project.findByIdAndRemove(id);
		return res.status(200).json({ message: 'Project deleted successfully.' });
	} catch (e) {
		next('Failed to delete the project.');
	}
};

exports.getTimesheet = async (req, res, next) => {
	const { id } = req.params;

	const dates = [];

	for (let i = 0; i < 5; i += 1) {
		const now = moment().set({ hour: 0, minute: 0, second: 0 });
		dates.push(now.subtract(i, 'days').format('D/MMMM'));
	}

	try {
		const project = await Project.findById(id).populate({
			path: 'users',
			select: ['_id', 'name', 'email', 'icon'],
			model: 'User',
		});
		if (!project) return res.status(400).json({ message: 'Project not found' });

		const tasks = await Task
			.find({
				assignee: {
					$in: project.users.map((user) => user._id),
				},
			})
			.populate({
				path: 'assignee',
				select: ['_id', 'name', 'email', 'icon'],
				model: 'User',
			});

		const tasksGroupedByDate = tasks.reduce((acc, task) => {
			const end = moment(task.endTime, 'D/MMMM').format('D/MMMM');
			const item = { user: task.assignee, data: { hours: task.timeSpent } };

			if (acc[end]) {
				const idx = acc[end].findIndex((itemExisted) => item.user._id.toString() === itemExisted.user._id.toString());
				if (idx >= 0) {
					acc[end][idx].data.hours += item.data.hours;
				} else {
					acc[end].push(item);
				}
			} else {
				acc[end] = [item];
			}
			return acc;
		}, {});

		const result = project.users.map((user) => {
			const de = dates.map((date) => {
				const key = moment(date, 'D/MMMM').format('D/MMMM');
				if (tasksGroupedByDate[key]) {
					const data = tasksGroupedByDate[key].find((item) => item.user._id.toString() === user._id.toString());
					if (data) return { value: key, ...data.data };
				}
				return { value: key, hours: null };
			});
			return {
				user,
				dates: de,
			};
		});

		return res.status(200).json(result);
	} catch (e) {
		console.log(e);
		next('Failed to get the project');
	}
};
