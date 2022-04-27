const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		if (!users) return res.status(400).json({ message: 'Users not found' });

		return res.status(200).json(users);
	} catch (e) {
		next('Failed to get users!');
	}
};
