var express = require('express');
var jwt = require('jsonwebtoken');

// Import models
var User = require('../models/user.js')

var config = require('../config');

//// --- Routing
var router = express.Router();

// User Controller -- Collection: users
// Get all Users
router.get('/', function(req,res,next) {
    User.find(function (err, users) {
        if (err) return console.log(err);
        res.json(users);
    })
});

// Authenticate User
router.post('/auth', function(req, res) {
	// Find User
	User.findOne({ email: req.body.email }, function(err, user) {
		if (err) throw err;
		if (!user) {
			// User doesnt exist
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// Password match check
			if (user.password != req.body.password) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// Create token
				const payload = { admin: 'true' };
				var token = jwt.sign(payload, config.secret, { 
					expiresIn: 43200 // expires in 12 hours
				});

				// Return token as json
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

router.get('/verify_admin', function(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {      
			if (err) {
				console.log(err);
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				res.json({ success: true, message: 'Valid user' });
				next();
			}
		});
	} else {
		// Return error if no token
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	}
});


/*
// Middleware
router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} else {
		// Return error if no token
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	}
});
*/
// --- TESTING / DEBUG ---
// Random message
router.get('/random', function(req,res,next) {
	console.log('### RANDOM MIDDLEWARE TEST ###')
    res.json({ message: "SUCCESFULL TOKEN" });
});

// TESTING: Setup Test User
router.get('/setup', function(req,res,next) {
	// Create a sample user
	var magicdraw = new User({ 
		email: 'magicdraw@magicdraw.com', 
		password: 'password'
	});

	// Save the sample user
	magicdraw.save(function(err) {
	if (err) throw err;
		console.log('User saved successfully');
		res.json({ success: true });
	});
});
/*

*/
module.exports = router;

// https://auth0.com/blog/secure-your-react-and-redux-app-with-jwt-authentication/
// https://auth0.com/blog/adding-authentication-to-react-native-using-jwt/

/*
// --- ESTA ES LA IMPORTANTE
// https://stackoverflow.com/questions/14527360/can-i-set-a-global-header-for-all-ajax-requests


*/