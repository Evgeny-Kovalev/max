const Mongoose = require('mongoose');
const Iteration = require('./Iteration');
const Task = require('./Task');

const projectSchema = new Mongoose.Schema({
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
	},
	ownerId: {
		type: Mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	users: [{ type: Mongoose.Types.ObjectId, ref: 'User' }],
}, { versionKey: false });

projectSchema.post('findOneAndRemove', async (doc) => {
	await Iteration.deleteMany({ projectId: doc._id });
	await Task.deleteMany({ projectId: doc._id });
});

module.exports = Mongoose.model('Project', projectSchema);
