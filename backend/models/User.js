const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
	icon: {
		type: String,
		required: true,
	},
	roles: { type: [String], default: ['USER'] },
}, { versionKey: false });

module.exports = Mongoose.model('User', userSchema);
