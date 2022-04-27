const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];

		if (!token) return res.status(403).json({ message: 'User is not logged in' });

		const decodedData = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decodedData;
		next();
	} catch (e) {
		return res.status(403).json({ message: 'User is not logged in' });
	}
};
