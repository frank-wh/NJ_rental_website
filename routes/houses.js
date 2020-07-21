const express     = require('express'),
	  data        = require('../data'),
	  router      = express.Router(),
	  houseData   = data.houses,
	  userData    = data.users,
	  commentData = data.comments;

/*********************************************************************************/
const path = require('path');
const crypto = require('crypto');
const mongo = require('mongodb');
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

let gfs;
mongo.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    const db = client.db('JerseyCityRentalWeb');
    gfs = Grid(db, mongo);
    gfs.collection('images');
});

const storage = new GridFsStorage({
	url: "mongodb://localhost:27017/JerseyCityRentalWeb", 
	file: (req, file) => {
	  	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
			const buf = crypto.randomBytes(16);
			const filename = buf.toString('hex') + path.extname(file.originalname);
			return {filename: filename, bucketName: 'images'};
	  	} else {
			return null;
	  	}
	}
});
const upload = multer({ storage });
/*********************************************************************************/

router.get('/', async (req, res) => {
	try {
		const houseList = await houseData.getAllHouses();
		const isEmpty = houseList.length == 0;
		const errorMsg = isEmpty ? "Sorry, we couldn't find any house available now!" : null;
		res.render('houseshbs/index', {
			houses: houseList, 
			isEmpty: isEmpty, 
			error: errorMsg,
			login: 'login',
			partial: 'houses-index-scripts'
		});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

// todo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/new', async (req, res) => {
	if (!req.session.user) {
		return res.redirect('/houses');
	}
	res.render('houseshbs/new', {
		userid: req.session.user.id, 
		partial: 'houses-new-scripts'
	});
});

router.get('/:id', async (req, res) => {
	try {
		const house = await houseData.getHouseById(req.params.id);
		let isStored = false;
		if (req.session.user) {
			const storeList = house.storedByUsers;
			for (let i = 0; i < storeList.length; i++) {
				if (storeList[i]._id === req.session.user.id) {
					isStored = true;
				}
			}
		}
		res.render('houseshbs/single', {
			houses: house, 
			houseId: req.params.id,
			isStored: isStored,
			login: 'login',
			partial: 'houses-single-scripts'
		});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

router.get('/:id/edit', async (req, res) => {
	if (!req.session.user) {
		return res.redirect(`/houses/${req.params.id}`);
	}
	try {
		const house = await houseData.getHouseById(req.params.id);
		if (req.session.user.id !== house.user._id) {
			return res.status(403).render('errorshbs/error403');
		}
		let imgs = [];
		let hasImages = false;
		if (house.images.length > 0) {
			for (let i = 0; i < house.images.length; i++) {
				const img = await gfs.files.findOne({ filename: house.images[i] });
				imgs.push(img);
			}
			hasImages = true;
		}
		res.render('houseshbs/edit', {
			house: house, 
			hasImages: hasImages,
			images: imgs,
			partial: 'houses-edit-scripts'
		});
	} catch (e) {
		res.status(404).render('errorshbs/error404');
	}
});

router.get('/image/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file || file.length === 0) {
            return res.sendStatus(404);
        }
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    } catch (e) {
        res.sendStatus(404);
    }
});

router.post('/search', async (req, res) => {
	const roomType = req.body.roomType;
	const sortData = req.body.sort;
	let low = Number( req.body.low );
	let high = Number( req.body.high );
	let houseList = [];
	if (low > high) {
		high = low;
	}
	try {
		if (sortData && roomType) {
			houseList = await houseData.findSortedHouses(sortData, roomType, low, high);
		}
		else if (sortData && !roomType) {
			houseList = await houseData.findBySortDataAndPriceRange(sortData, low, high);
		}
		else if (!sortData && roomType) {
			houseList = await houseData.findByRoomTypeAndPriceRange(roomType, low, high);
		}
		else {
			houseList = await houseData.findByPriceRange(low, high);
		}
	} catch (e) {
		return res.sendStatus(500);
	}
	const isEmpty = houseList.length == 0;
	const errorMsg = isEmpty ? "Sorry, we couldn't find any house, please change your search range!" : null;
	return res.render('partials/houselist', {
		layout: null,
		houses: houseList, 
		isEmpty: isEmpty, 
		error: errorMsg
	});
});

router.post('/storehouse/:id', async (req, res) => {
	if (!req.session.user) {
		return res.sendStatus(403);
	}
	try {
		await houseData.getHouseById(req.params.id);
	} catch (e) {
		return res.sendStatus(404);
	}
	try {
		const house = await houseData.storedByUser(req.params.id, req.session.user.id);
		res.render('partials/storehouse', {
			layout: null,
			houseId: house._id,
			storeLength: house.storedByUsers.length
		});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.post('/', upload.single('image'), async (req, res) => {
	if (!req.session.user) {
		return res.sendStatus(403);
	}
	let house = req.body;
	if (!house.address || !house.statement || !house.lat || !house.lng || !house.roomType || !house.price || !req.file) {
		return res.status(403).send('Please make sure that every field is filled');
	}
	house.lat = Number( house.lat );
	house.lng = Number( house.lng );
	house.price = Number( house.price );
	house.id = req.session.user.id;
	try {
		const {address, statement, id, lat, lng, roomType, price} = house;
		const newhouse = await houseData.addHouse(address, statement, id, lat, lng, roomType, price, req.file.filename);
		res.json({redirectURL : `/houses/${newhouse._id}`});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.post('/addimg/:id', upload.single('image'), async (req, res) => {
	if (!req.file) {
		return res.sendStatus(500);
	}
	let updatedObject = {};
	let house;
	try {
		house = await houseData.getHouseById(req.params.id);
		if (!req.session.user || req.session.user.id !== house.user._id) {
			return res.sendStatus(403);
		}
		updatedObject.images = house.images;
		updatedObject.images.push(req.file.filename);
	} catch (e) {
		return res.sendStatus(404);
	}
	try {
		await houseData.updateHouse(req.params.id, updatedObject);
		res.render('partials/houseaddimage', {
			layout: null,
			filename: req.file.filename,
			houseId: house._id
		});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.patch('/:id', async (req, res) => {
	const reqBody = req.body;
	let updatedObject = {};
	try {
		const house = await houseData.getHouseById(req.params.id);
		if (!req.session.user || req.session.user.id !== house.user._id) {
			return res.status(403).redirect('errorshbs/error403');
		}
        if (reqBody.statement && reqBody.statement !== house.statement) {
			updatedObject.statement = reqBody.statement;
		}
        if (reqBody.roomType && reqBody.roomType !== house.roomType) {
			updatedObject.roomType = reqBody.roomType;
		}
        if (reqBody.price) {
			const price = Number( reqBody.price );
			if(price !== house.price) {
				updatedObject.price = price;
			}
		} 
	} catch (e) {
		return res.status(404).render('errorshbs/error404');
	}
	try {
		await houseData.updateHouse(req.params.id, updatedObject);
		res.redirect(`/houses/${req.params.id}/edit`);
	} catch (e) {
		res.status(500).render('errorshbs/error500');
	}
});

router.delete('/:id/removeimage/:filename', async (req, res) => {
	let updatedObject = {};
	try {
		const house = await houseData.getHouseById(req.params.id);
		if (!req.session.user || req.session.user.id !== house.user._id) {
			return res.sendStatus(403);
		}
		updatedObject.images = house.images;
		const index = updatedObject.images.indexOf(req.params.filename);
		if (index > -1) {
			updatedObject.images.splice(index, 1);
		}
	} catch (e) {
		return res.sendStatus(404);
	}
    try{
		await houseData.updateHouse(req.params.id, updatedObject);
        await gfs.remove({ filename: req.params.filename, root: 'images' });
        res.sendStatus(200);
    } catch(e) {
        res.sendStatus(500);
    }
});

router.delete('/removestorehouse/:id', async (req, res) => {
	if (!req.session.user) {
		return res.sendStatus(403);
	}
	try {
		await houseData.getHouseById(req.params.id);
	} catch (e) {
		try {
			await userData.userRemoveStoredHouse(req.session.user.id, req.params.id);
		} catch (err) {
			return res.sendStatus(404);
		}
		return res.sendStatus(200);
	}
	try {
		const house = await houseData.removeStoreByUser(req.params.id, req.session.user.id);
		res.render('partials/removestore', {
			layout: null,
			houseId: house._id,
			storeLength: house.storedByUsers.length
		});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const house = await houseData.getHouseById(req.params.id);
		if (!req.session.user || req.session.user.id !== house.user._id) {
			return res.status(403).redirect('errorshbs/error403');
		}
		if (house.comments.length !== 0) {
			for (let i = 0; i < house.comments.length; i++) {
				const commentId = house.comments[i]._id;
				await commentData.removeComment(commentId);
			}
		}
		if (house.images.length !== 0) {
			for (let i = 0; i < house.images.length; i++) {
				const filename = house.images[i];
				await gfs.remove({ filename: filename, root: 'images' });
			}
		}
	} catch (e) {
		return res.status(404).render('errorshbs/error404');
	}
	try {
		await houseData.removeHouse(req.params.id);
		res.redirect(303, `/users/${req.session.user.id}`);
	} catch (e) {
		res.status(500).render('errorshbs/error500');
	}
});

module.exports = router;