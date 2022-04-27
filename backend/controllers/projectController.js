const Project = require('../models/Project');
const User = require('../models/User');

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
