const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		const error = new Error("Not authenticated.");
		error.statusCode = 401;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	if (!token) {
		const error = new Error("incorrect token.");
		error.statusCode = 401;
		throw error;
	}

	try {
		decodedToken = jwt.verify(token, process.env.SECRET_KEY);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}

	if (!decodedToken) {
		const error = new Error("invalid or expired token.");
		error.statusCode = 401;
		throw error;
	}

	req.userId = decodedToken.userId;
	next();
};

module.exports = isAuth;
