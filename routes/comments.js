const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;

router.post('/', async (req, res) => {
	if (!req.body || !req.body.text) {
		return res.redirect(`/houses/${req.body.houseId}`);
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
		res.status(500).render('errorshbs/error500');
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const comment = await commentData.getCommentById(req.params.id);
		if (!req.session.user || req.session.user.id !== comment.user._id) {
			return res.status(403).render('errorshbs/error403');
		}
		await commentData.removeComment(req.params.id);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).render('errorshbs/error500');
	}
});

module.exports = router;