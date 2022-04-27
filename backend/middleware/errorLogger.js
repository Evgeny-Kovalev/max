module.exports = (err, req, res, next) => {
	console.error(err);
	next(err);
};
