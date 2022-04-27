const Iteration = require('../models/Iteration');
const Project = require('../models/Project');

exports.getIterations = async (req, res, next) => {
	const { projectId } = req.query;

	try {
		const iterations = await Iteration.find({ projectId });
		if (!iterations) return res.status(400).json({ message: 'Iterations not found' });

		return res.status(200).json(iterations);
	} catch (e) {
		next('Failed to get iterations!');
	}
};

exports.getIteration = async (req, res, next) => {
	const { iterationId } = req.params;

	try {
		const iteration = await Iteration.findById(iterationId);
		if (!iteration) return res.status(400).json({ message: 'Iteration not found.' });

		return res.status(200).json(iteration);
	} catch (e) {
		next('Failed to get the iteration.');
	}
};

exports.postIteration = async (req, res, next) => {
	const { iteration, projectId } = req.body;
	const { startTime, finishTime } = iteration;

	try {
		const projectExist = await Project.findById(projectId);
		if (!projectExist) return res.status(400).json({ message: 'Project not found!' });

		const newIteration = new Iteration({
			startTime,
			finishTime,
			projectId,
		});

		await newIteration.save();

		return res.status(200).json({
			message: 'Iteration created successfully.',
			iteration: newIteration,
		});
	} catch (e) {
		next('Failed to create iteration!');
	}
};

exports.putEditIteration = async (req, res, next) => {
	const { iterationId } = req.params;
	const { iteration } = req.body;

	try {
		const editedIteration = await Iteration.findByIdAndUpdate(iterationId, iteration, { new: true });
		if (!editedIteration) return res.status(400).json({ message: 'Iteration not found' });

		return res.status(200).json({
			message: 'Iteration edited successfully',
			iteration: editedIteration,
		});
	} catch (e) {
		next('Failed to edit iteration.');
	}
};

exports.deleteIteration = async (req, res, next) => {
	const { iterationId } = req.params;

	try {
		await Iteration.findByIdAndRemove(iterationId);
		return res.status(200).json({ message: 'Iteration deleted successfully.' });
	} catch (e) {
		next('Failed to delete the iteration.');
	}
};
