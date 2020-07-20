const express    = require('express'), 
      data 	 = require('../data'), 
      bcrypt  	 = require('bcryptjs'),
      router     = express.Router(),
      userData   = data.users,
      saltRounds = 5;

router.get('/logout', async (req, res) => {
	if (!req.session.user) {
		return res.status(403).render('errorshbs/error403');
	}
	req.session.destroy();
	res.redirect('back');
});

router.get('/:id', async (req, res) => {
	if (!req.session.user) {
		return res.status(401).redirect('/houses');
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

router.post('/new', async (req, res) => {
	if (req.session.user) {
		return res.sendStatus(403);
	}
	let userInfo = req.body;
	if (!userInfo.username || !userInfo.email || !userInfo.phoneNumber || !userInfo.password) {
		return res.status(401).send('Please check that every field is filled');
	}
	try {
		const userList = await userData.getAllUsers();
		const username = userInfo.username.toLowerCase();
		const email = userInfo.email.toLowerCase();
		for (let i = 0; i < userList.length; i++) {
			if (username === userList[i].username.toLowerCase()) {
				return res.status(401).send('The username you entered is invalid, please try another one');
			}
			if (email === userList[i].email.toLowerCase()) {
				return res.status(401).send('The email you entered is invalid, please try another one');
			}
		}
	} catch (e) {
		return res.sendStatus(500);
	}
	try {
		const password = await bcrypt.hash(userInfo.password, saltRounds);
		const user = await userData.addUser(userInfo.username, userInfo.email, userInfo.phoneNumber, password);
		req.session.user = {id: user._id, name: user.username};
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(500);
	}
});

router.post('/login', async (req, res) => {
	if (req.session.user) {
		return res.sendStatus(403);
	}
	let userInfo = req.body;
	let user;
	
	if (!userInfo.loginInfo || !userInfo.password) {
		return res.status(401).send('Please check that you\'ve entered username/email and password');
	}
	try {
		try {
			user = await userData.getUserByName(userInfo.loginInfo);
		} catch (e) {
			user = await userData.getUserByEmail(userInfo.loginInfo);
		}
		const isCorrectPassword = await bcrypt.compare(userInfo.password, user.password);
		if (isCorrectPassword) {
			req.session.user = {id: user._id, name: user.username};
			return res.sendStatus(200);
		} 
		else {
			res.status(401).send('Either username/email or password does not match');
		}
	} catch (e) {
		res.sendStatus(500);
	}
});

router.put('/:id/edit', async (req, res) => {
	if (!req.session.user || req.session.user.id !== req.params.id) {
		return res.sendStatus(403);
	}
	const reqBody = req.body;
	let user;
	let allEmails = [];
	try {
		const userList = await userData.getAllUsers();
		for (let i = 0; i < userList.length; i++) {
			allEmails.push(userList[i].email);
		}
	} catch (e) {
		return res.sendStatus(500);
	}
	try {
		user = await userData.getUserById(req.params.id);
        if (reqBody.email) {
			const email = reqBody.email.toLowerCase();
			for (let i = 0; i < allEmails.length; i++) {
				if (email === allEmails[i].toLowerCase()) {
					return res.status(403).send('The email you entered is invalid, please try another one');
				}
			}
			user.email = reqBody.email;
		}
        if (reqBody.phoneNumber && reqBody.phoneNumber !== user.phoneNumber) {
			user.phoneNumber = reqBody.phoneNumber;
		}
        if (reqBody.password) {
			user.password = await bcrypt.hash(reqBody.password, saltRounds);
		}
	} catch (e) {
		return res.sendStatus(404);
	}
	try {
		await userData.updateUser(req.params.id, user);
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(500);
	}
});

module.exports = router;
