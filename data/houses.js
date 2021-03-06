const mongoCollections = require('../config/mongoCollections');
const houses = mongoCollections.houses;
const users = require('./users');
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    async getAllHouses() {
        const houseCollection = await houses();
        return await houseCollection.find({}).sort({ _id: -1 }).toArray();
    },
    
    async findSortedHouses(sortData, roomType, low, high){
        if (!sortData || typeof sortData !== 'string') throw '(HOUSE) You must provide data to sort';
        if (!roomType || typeof roomType !== 'string') throw '(HOUSE) You must provide room type';
        if (!low || typeof low !== 'number') throw '(HOUSE) You must provide min price';
        if (!high || typeof high !== 'number') throw '(HOUSE) You must provide max price';

        const houseCollection = await houses();
        let houseList = [];

        if(sortData === 'priceUp') {
            houseList = await houseCollection
                .find({ 
                    $and: [ { 'roomType': roomType }, {'price': {$gte: low, $lte: high}} ]
                })
                .sort({ price: 1 }).toArray();
        }
        else if(sortData === 'priceDown') {
            houseList = await houseCollection
                .find({ 
                    $and: [ { 'roomType': roomType }, {'price': {$gte: low, $lte: high}} ]
                })
                .sort({ price: -1 }).toArray();
        }
        else if(sortData === 'newest') {
            houseList = await houseCollection
                .find({ 
                    $and: [ { 'roomType': roomType }, {'price': {$gte: low, $lte: high}} ]
                })
                .sort({ postedDate: -1 }).toArray();
        }
        return houseList;
    },

    
    async findBySortDataAndPriceRange(sortData, low, high){
        if (!sortData || typeof sortData !== 'string') throw '(HOUSE) You must provide data to sort';
        if (!low || typeof low !== 'number') throw '(HOUSE) You must provide min price';
        if (!high || typeof high !== 'number') throw '(HOUSE) You must provide max price';

        const houseCollection = await houses();
        let houseList = [];

        if(sortData === 'priceUp') {
            houseList = await houseCollection.find({ 'price': {$gte: low, $lte: high} }).sort({ price: 1 }).toArray();
        }
        else if(sortData === 'priceDown') {
            houseList = await houseCollection.find({ 'price': {$gte: low, $lte: high} }).sort({ price: -1 }).toArray();
        }
        else if(sortData === 'newest') {
            houseList = await houseCollection.find({ 'price': {$gte: low, $lte: high} }).sort({ postedDate: -1 }).toArray();
        }
        return houseList;
    },

    async findByRoomTypeAndPriceRange(roomType, low, high){
        if (!roomType || typeof roomType !== 'string') throw '(HOUSE) You must provide room type';
        if (!low || typeof low !== 'number') throw '(HOUSE) You must provide min price';
        if (!high || typeof high !== 'number') throw '(HOUSE) You must provide max price';

        const houseCollection = await houses();
        return await houseCollection
            .find({ 
                $and: [ { 'roomType': roomType }, {'price': {$gte: low, $lte: high}} ]
            })
            .toArray();
    },

    async findByPriceRange(low, high){
        if (!low || typeof low !== 'number') throw '(HOUSE) You must provide min price';
        if (!high || typeof high !== 'number') throw '(HOUSE) You must provide max price';

        const houseCollection = await houses();
        return await houseCollection.find({ 'price': {$gte: low, $lte: high} }).toArray();
    },

    async getHouseById(id) {
        if (!id) throw '(HOUSE) You must provide house id';

        const houseCollection = await houses();
        if(typeof id === 'string'){
            id = ObjectId.createFromHexString(id);
        }
        const house = await houseCollection.findOne({_id: id});
        if (!house) throw 'House not found';
        return house;
    },

    async addHouse(address, statement, userId, lat, lng, roomType, price, image) {
        if (!address || typeof address !== 'string') throw '(HOUSE) You must provide house address';
        if (!statement || typeof statement !== 'string') throw '(HOUSE) You must provide statement';
        if (!userId) throw '(HOUSE) You must provide user id';
        if (!lat || typeof lat !== 'number') throw '(HOUSE) You must provide lat';
        if (!lng || typeof lng !== 'number') throw '(HOUSE) You must provide lng';
        if (!roomType || typeof roomType !== 'string') throw '(HOUSE) You must provide room type';
        if (!price || typeof price !== 'number') throw '(HOUSE) You must provide price';
        if (!image || typeof image !== 'string') throw '(HOUSE) You must provide image';

        let imgs = [];
        imgs.push(image);

        const d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        if(month < 10){
            month = "0" + month;
        }
        if(day < 10){
            day = "0" + day;
        }
        const date = d.getFullYear() + "-" + month + "-" + day;

        const houseCollection = await houses();
        const user = await users.getUserById(userId);
        const newHouse = {
            address: address,
            postedDate: date,
            statement: statement,
            user: {
                _id: userId,
                username: `${user.username}`
            },
            lat: lat,
            lng: lng,
            roomType: roomType,
            price: price,
            images: imgs,
            storedByUsers: [],
            comments: []
        };
        const insertInfo = await houseCollection.insertOne(newHouse);
        const houseId = insertInfo.insertedId + "";
        await users.addHouseToUser(userId, houseId, address);
        return await this.getHouseById(insertInfo.insertedId);
    },

    async addHouseForSeeding(address, statement, postedDate, userId, lat, lng, roomType, price) {
        if (!address || typeof address !== 'string') throw '(HOUSE) You must provide house address';
        if (!statement || typeof statement !== 'string') throw '(HOUSE) You must provide statement';
        if (!postedDate || typeof postedDate !== 'string') throw '(HOUSE) You must provide post date';
        if (!userId) throw '(HOUSE) You must provide user id';
        if (!lat || typeof lat !== 'number') throw '(HOUSE) You must provide lat';
        if (!lng || typeof lng !== 'number') throw '(HOUSE) You must provide lng';
        if (!roomType || typeof roomType !== 'string') throw '(HOUSE) You must provide room type';
        if (!price || typeof price !== 'number') throw '(HOUSE) You must provide price';

        const houseCollection = await houses();
        const user = await users.getUserById(userId);
        const newHouse = {
            address: address,
            postedDate: postedDate,
            statement: statement,
            user: {
                _id: userId,
                username: `${user.username}`
            },
            lat: lat,
            lng: lng,
            roomType: roomType,
            price: price,
            images: [],
            storedByUsers: [],
            comments: []
        };
        const insertInfo = await houseCollection.insertOne(newHouse);
        const houseId = insertInfo.insertedId + "";
        await users.addHouseToUser(userId, houseId, address);
        return await this.getHouseById(insertInfo.insertedId);
    },

    async updateHouse(id, newHouse) {
        if (!id) throw '(HOUSE) You must provide house id';
        if (!newHouse || typeof(newHouse) !== 'object') throw '(USER) You must provide newHouse';

        const houseCollection = await houses();
        let updatedHouse = await this.getHouseById(id);

        const d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        if(month < 10){
            month = "0" + month;
        }
        if(day < 10){
            day = "0" + day;
        }
        updatedHouse.postedDate = d.getFullYear() + "-" + month + "-" + day;
        
        if (newHouse.statement) updatedHouse.statement = newHouse.statement;
        if (newHouse.roomType)  updatedHouse.roomType  = newHouse.roomType;
        if (newHouse.price)     updatedHouse.price     = newHouse.price;
        if (newHouse.images)    updatedHouse.images    = newHouse.images;

        await houseCollection.updateOne({_id: ObjectId.createFromHexString(id)}, {$set: updatedHouse});
        return await this.getHouseById(id);
    },

    async removeHouse(id) {
        if (!id) throw '(HOUSE) You must provide house id';

        const houseCollection = await houses();
        const house = await this.getHouseById(id);
        await users.removeHouseFromUser(house.user._id, id);
        const deletionInfo = await houseCollection.removeOne({_id: ObjectId.createFromHexString(id)});
        if (deletionInfo.deletedCount === 0) throw `Could not delete house with id of ${id}`
        return house;
    },

    async addCommentToHouse(houseId, commentId, userId, username, commentDate, text) {
        if (!houseId) throw '(HOUSE) You must provide house id';
        if (!commentId) throw '(HOUSE) You must provide comment id';
        if (!userId) throw '(HOUSE) You must provide user id';
        if (!username || typeof username !== 'string') throw '(HOUSE) You must provide username';
        if (!commentDate || typeof commentDate !== 'string') throw '(HOUSE) You must provide comment date';
        if (!text || typeof text !== 'string') throw '(HOUSE) You must provide text';

        const houseCollection = await houses();
        if(typeof houseId === 'string'){
            houseId = ObjectId.createFromHexString(houseId);
        }
        const updateInfo = await houseCollection.updateOne(
            {_id: houseId},
            {$addToSet: {
                comments: {
                    _id: commentId,
                    userId: userId,
                    username: username,
                    commentDate: commentDate, 
                    text: text
                }}
            }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add comment to house';
        return await this.getHouseById(houseId);
    },

    async removeCommentFromHouse(houseId, commentId){
        if (!houseId) throw '(HOUSE) You must provide house id';
        if (!commentId) throw '(HOUSE) You must provide comment id';

        const houseCollection = await houses();
        if(typeof houseId === 'string'){
            houseId = ObjectId.createFromHexString(houseId);
        }
        const updateInfo = await houseCollection.updateOne({_id: houseId}, {$pull: {comments: {_id: commentId}}});
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to delete comment from house';
        return await this.getHouseById(houseId);
    },

    async storedByUser(houseId, userId) {
        const houseCollection = await houses();
        if(typeof houseId === 'string'){
            houseId = ObjectId.createFromHexString(houseId);
        }
        const house = await this.getHouseById(houseId);
        const updateInfo = await houseCollection.updateOne(
            {_id: houseId},
            {$addToSet: {storedByUsers: {_id: userId}}}
        );
        await users.userStoreHouse(userId, houseId + "", house.address);
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add store';
        return await this.getHouseById(houseId);
    },

    async removeStoreByUser(houseId, userId){
        if (!houseId) throw '(HOUSE) You must provide house id';
        if (!userId) throw '(HOUSE) You must provide user id';

        const houseCollection = await houses();
        await users.userRemoveStoredHouse(userId, houseId);
        if(typeof houseId === 'string'){
            houseId = ObjectId.createFromHexString(houseId);
        }
        const updateInfo = await houseCollection.updateOne(
            {_id: houseId}, 
            {$pull: {storedByUsers: {_id: userId}}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to remove store';
        return await this.getHouseById(houseId);
    }
};