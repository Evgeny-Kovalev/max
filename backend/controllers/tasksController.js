const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getTask = async (req, res, next) => {
	const { taskId } = req.params;

	try {
		const task = await Task.findById(taskId).populate({
			path: 'assignee',
			model: 'User',
			select: ['_id', 'name', 'email', 'icon'],
		});
		if (!task) return res.status(400).json({ message: 'Task not found' });
		return res.status(200).json(task);
	} catch (e) {
		next('Failed to get the task');
	}
};

exports.getTasks = async (req, res, next) => {
	const { projectId, iterationId } = req.query;

	try {
		const project = await Project.findById(projectId);
		if (!project) return res.status(400).json({ message: 'Project not found' });

		const projectTasks = await Task
			.find({
				projectId: project._id,
				iterationId: (iterationId || { $exists: true }),
			})
			.populate({
				path: 'assignee',
				model: 'User',
				select: ['_id', 'name', 'email', 'icon'],
			});

		if (!projectTasks) return res.status(400).json({ message: 'Tasks not found' });

		return res.status(200).json(projectTasks);
	} catch (e) {
		next('Failed to get tasks!');
	}
};

exports.postTask = async (req, res, next) => {
	const { task } = req.body;
	const {
		title, text, status, projectId, storyPoint, startTime, endTime, assignee,
	} = task;
	const { iterationId } = req.query;

	try {
		const taskExist = await Task.findOne({ title });
		if (taskExist) return res.status(400).json({ message: 'A Task with the same title already exists' });

		const project = await Project.findById(projectId);
		if (!project) return res.status(400).json({ message: 'Project not found' });

		const newTask = new Task({
			title,
			text,
			projectId,
			storyPoint,
			status: status || 'todo',
			startTime: startTime || new Date(),
			endTime,
			assignee,
		});

		if (iterationId) newTask.iterationId = iterationId;

		await newTask.populate({
			path: 'assignee',
			model: 'User',
			select: ['_id', 'name', 'email', 'icon'],
		});

		await newTask.save();

		return res.status(200).json({
			message: 'Task created successfully.',
			task: newTask,
		});
	} catch (e) {
		next('Failed to create task!');
	}
};

exports.putEditTask = async (req, res, next) => {
	const { taskId } = req.params;
	const { editedTask } = req.body;

	editedTask.endTime = editedTask.status === 'done' ? new Date() : null;

	try {
		const task = await Task.findByIdAndUpdate(taskId, editedTask, { new: true })
			.populate({
				path: 'assignee',
				model: 'User',
				select: ['_id', 'name', 'email', 'icon'],
			});
		if (!task) return res.status(400).json({ message: 'Task not found' });

		return res.status(200).json({
			message: 'Task edited successfully',
			task,
		});
	} catch (e) {
		next('Failed to edit task.');
	}
};

exports.deleteTask = async (req, res, next) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findByIdAndRemove(taskId);
		if (!task) return res.status(400).json({ message: 'Task not found' });

		return res.status(200).json({ message: 'Task deleted successfully.' });
	} catch (e) {
		next('Failed to delete the task.');
	}
};
