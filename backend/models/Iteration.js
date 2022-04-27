const Mongoose = require('mongoose');
const Task = require('./Task');

const iterationSchema = new Mongoose.Schema({
	startTime: {
		type: Date,
		required: true,
	},
	finishTime: {
		type: Date,
		required: true,
	},
	projectId: {
		type: Mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true,
	},
}, { versionKey: false });

iterationSchema.post('findOneAndRemove', async (doc) => {
	await Task.deleteMany({ iterationId: doc._id });
});

module.exports = Mongoose.model('Iteration', iterationSchema);
