const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;

router.post('/', async (req, res) => {
	if (!req.session.user || !req.body || !req.body.text) {
		return res.sendStatus(403);
	}
	try {
		const comment = await commentData.addComment(req.session.user.id, req.body.houseId, req.body.text);
		res.render('partials/newcomment', {
			layout: null,
			id: comment._id,
			username: comment.user.username,
			commentDate: comment.commentDate,
			text: comment.text
		});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const comment = await commentData.getCommentById(req.params.id);
		if (!req.session.user || req.session.user.id !== comment.user._id) {
			return res.sendStatus(403);
		}
		await commentData.removeComment(req.params.id);
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(500);
	}
});

module.exports = router;