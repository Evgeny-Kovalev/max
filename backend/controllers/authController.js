const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenExpiresIn = 1000 * 60 * 60 * 24; // DAY IN MS
// const tokenExpiresIn = 5000

exports.postSignup = async (req, res) => {
	try {
		const { email, password, name } = req.body;

		const user = await User.findOne({ email });
		if (user) return res.status(401).json({ message: 'User already exists' });

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = new User({
			name, email, password: hashedPassword, icon: `https://via.placeholder.com/100/28e097/000000?text=${name.charAt(0)}`,
		});
		await newUser.save();

		const token = jwt.sign(
			{
				email: newUser.email,
				userId: newUser._id.toString(),
			},
			process.env.SECRET_KEY,
			{ expiresIn: tokenExpiresIn },
		);

		return res.status(200).json({
			user: {
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				roles: newUser.roles,
				icon: newUser.icon,
				token,
				expiresIn: tokenExpiresIn,
			},
		});
	} catch (err) {
		res.status(401).json({ message: 'Signup failed' });
	}
};

exports.postLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const loadedUser = await User.findOne({ email });
		if (!loadedUser) return res.status(401).json({ message: 'User not found' });

		const isEqual = await bcrypt.compare(password, loadedUser.password);
		if (!isEqual) return res.status(401).json({ message: 'Email or password is not correct' });

		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
			},
			process.env.SECRET_KEY,
			{ expiresIn: tokenExpiresIn },
		);

		res.status(200).json({
			user: {
				_id: loadedUser._id,
				name: loadedUser.name,
				email: loadedUser.email,
				roles: loadedUser.roles,
				icon: loadedUser.icon,
				token,
				expiresIn: tokenExpiresIn,
			},
		});
	} catch (err) {
		res.status(401).json({ message: 'Login failed' });
	}
};
