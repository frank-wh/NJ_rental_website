const express     = require('express'), 
 	  data 		  = require('../data'), 
	  bcrypt  	  = require('bcryptjs'),
	  router      = express.Router(),
	  userData    = data.users,
	  houseData   = data.houses,
	  saltRounds  = 5;

router.get('/new', async (req, res) => {
	res.render('usershbs/new', {partial: 'users-new-scripts'});
});

router.get('/login', async (req, res) => {
	res.render('usershbs/login', {partial: 'users-login-scripts'});
});

router.get('/profile', async (req, res) => {
	res.redirect(`/users/${req.session.user.id}`);
});

router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.redirect('/houses');
});

router.get('/:id', async (req, res) => {
	if (!req.session.user) {
		return res.status(401).redirect('/users/login');
	} 
	else if(req.session.user.id !== req.params.id) {
		return res.status(403).render('errorshbs/error403');
	}
	try {
		const user = await userData.getUserById(req.params.id);
		res.render('usershbs/single', {user: user, partial: 'users-single-scripts'});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

router.get('/:id/edit', async (req, res) => {
	try {
		const user = await userData.getUserById(req.params.id);
		res.render('usershbs/edit', {user: user, partial: 'users-edit-scripts'});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

router.get('/:id/newHouse', async (req, res) => {
	try {
		await userData.getUserById(req.params.id);
		res.render('houseshbs/new', {userid: req.params.id, partial: 'houses-new-scripts'});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

router.post('/new', async (req, res) => {
	if (req.session.user) {
		return res.status(403).render('errorshbs/error403');
	}
	let userInfo = req.body;
	let errors = [];
	let allNames = [];
	let allEmails = [];
	try {
		const userList = await userData.getAllUsers();
		for (let i = 0; i < userList.length; i++) {
			allNames.push(userList[i].username);
			allEmails.push(userList[i].email);
		}
	} catch (e) {
		return res.status(500).render('errorshbs/error500');
	}
	if (!userInfo.username) {
		errors.push('Error: Please check that you\'ve entered an username');
	} else {
		let username = userInfo.username;
		for (let i = 0; i < allNames.length; i++) {
			if (username.toLowerCase() === allNames[i].toLowerCase()) {
				errors.push('Error: The username you entered is invalid, please try another one');
			}
		}
	}
	if (!userInfo.email) {
		errors.push('Error: Please check that you\'ve entered an email');
	} else {
		const email = userInfo.email.toLowerCase();
		for (let i = 0; i < allEmails.length; i++) {
			if (email === allEmails[i].toLowerCase()) {
				errors.push('Error: The email you entered is invalid, please try another one');
			}
		}
	}
	if (!userInfo.phoneNumber) errors.push('Error: Please check that you\'ve entered a phone number');
	let phoneArr = userInfo.phoneNumber.split('-');

	if (!userInfo.password)    errors.push('Error: Please check that you\'ve entered a password');
	if (errors.length > 0) {
		return res.render('usershbs/new', {
			errors: errors,
			hasErrors: true,
			newUser: userInfo,
			phone: phoneArr,
			partial: 'users-new-scripts'
		});
	}

	try {
		const pw = await bcrypt.hash(userInfo.password, saltRounds);
		const user = await userData.addUser(
			userInfo.username, userInfo.email, userInfo.phoneNumber, pw
		);
		req.session.user = {id: user._id, name: user.username};
		res.redirect(`/users/${user._id}`);
	} catch (e) {
		res.status(500).render('errorshbs/error500');
	}
});

router.post('/login', async (req, res) => {
	let userInfo = req.body;
	let errors = []; 
	const message = "Error: Either username or password does not match";
	
	if (!userInfo.username) errors.push('Error: Please check that you\'ve entered an username');
	if (!userInfo.password) errors.push('Error: Please check that you\'ve entered a password');
	if (errors.length > 0) {
		return res.status(401).render('usershbs/login', {
			error: errors, 
			hasErrors: true, 
			partial: 'users-login-scripts'
		});
	}

	try {
		const user = await userData.getUserByName(userInfo.username);
		const passwordIsCorrect = await bcrypt.compare(userInfo.password, user.password);
		if (passwordIsCorrect) {
			req.session.user = {id: user._id, name: user.username};
			return res.redirect(`/users/${user._id}`);
		} else {
			return res.status(401).render('usershbs/login', {
				error: [message], 
				hasErrors: true,
				partial: 'users-login-scripts'
			});
		}
	} catch (e) {
		res.status(401).render('usershbs/login', {
			error: [message], 
			hasErrors: true,
			partial: 'users-login-scripts'
		});
	}
});

router.patch('/:id/edit', async (req, res) => {
	if (!req.session.user || req.session.user.id !== req.params.id) {
		return res.status(403).render('errorshbs/error403');
	}
	const reqBody = req.body;
	
	let allEmails = [];
	try {
		const userList = await userData.getAllUsers();
		for (let i = 0; i < userList.length; i++) {
			allEmails.push(userList[i].email);
		}
	} catch (e) {
		return res.status(500).render('errorshbs/error500');
	}

	let updatedObject = {};
	try {
		const user = await userData.getUserById(req.params.id);
        if (reqBody.email) {
			const email = reqBody.email.toLowerCase();
			for (let i = 0; i < allEmails.length; i++) {
				if (email === allEmails[i].toLowerCase()) {
					return res.render(`usershbs/edit`, {
						user: user,
						errors: 'Error: The email you entered is invalid, please try another one', 
						hasErrors: true,
						partial: 'users-edit-scripts'
					});
				}
			}
			updatedObject.email = reqBody.email;
		}
        if (reqBody.phoneNumber && reqBody.phoneNumber !== user.phoneNumber) {
			updatedObject.phoneNumber = reqBody.phoneNumber;
		}
        if (reqBody.password) {
			const pw = await bcrypt.hash(reqBody.password, saltRounds);
			updatedObject.password = pw;
		}
	} catch (e) {
		return res.status(404).render('errorshbs/error404');
	}
	try {
		await userData.updateUser(req.params.id, updatedObject);
		res.redirect(`/users/${req.params.id}`);
	} catch (e) {
		res.status(500).render('errorshbs/error500');
	}
});

router.delete('/removestorehouse/:houseid', async (req, res) => {
	try {
		await houseData.getHouseById(req.params.houseid);
		await houseData.removeStoreByUser(req.params.houseid, req.session.user.id);
	} catch (e) {
		try {
			await userData.userRemoveStoredHouse(req.session.user.id, req.params.houseid);
		} catch(err) {
			return res.status(404).render('errorshbs/error404');
		}
	}
	res.sendStatus(200);
});

module.exports = router;