const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if (!userList) throw 'No users in system!';
        return userList;
    },

    async getUserById(id) {
        if (!id) throw '(USER) You must provide user id';

        const userCollection = await users();
        if(typeof id === 'string'){
            id = ObjectId.createFromHexString(id);
        }
        const user = await userCollection.findOne({_id: id});
        if (!user) throw 'User not found';
        return user;
    },

    async getUserByName(name) {
        if (!name || typeof name !== 'string') throw '(USER) You must provide name';

        const userCollection = await users();
        const user = await userCollection.findOne({username: name});
        if (!user) throw 'User not found';
        return user;
    },
    
    async getUserByEmail(email) {
        if (!email || typeof email !== 'string') throw '(USER) You must provide email';

        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw 'User not found';
        return user;
    },

    async addUser(username, email, phoneNumber, password) {
        if (!username || typeof username !== 'string') throw '(USER) You must provide username';
        if (!email || typeof email !== 'string') throw '(USER) You must provide email';
        if (!phoneNumber || typeof phoneNumber !== 'string') throw '(USER) You must provide phoneNumber';
        if (!password || typeof password !== 'string') throw '(USER) You must provide password';

        const userCollection = await users();
        const newUser = {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            houseLists: [],
            storedHouses: [],
            comments: []
        }; 
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Insert failed!';
        return await this.getUserById(insertInfo.insertedId);
    },

    async updateUser(id, newUser){
        if (!id) throw '(USER) You must provide user id';
        if (!newUser || typeof(newUser) !== 'object') throw '(USER) You must provide new user';

        const userCollection = await users();
        let user = await this.getUserById(id);

        if (newUser.email) user.email = newUser.email;
        if (newUser.phoneNumber) user.phoneNumber = newUser.phoneNumber;
        if (newUser.password) user.password = newUser.password;

        const updatedInfo = await userCollection.updateOne({_id: ObjectId.createFromHexString(id)}, {$set: user});
        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) throw 'user update failed';
        return await this.getUserById(id);
    },
    
    async removeUser(id){
        if (!id) throw 'You must provide an id to search for';

        const userCollection = await users();
        if(typeof id === 'string'){
            id = ObjectId.createFromHexString(id);
        }
        const deletionInfo = await userCollection.deleteOne({_id: id});
        if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${id}`;
        return true;
    },
    
    async addHouseToUser(userId, houseId, address){
        if (!userId) throw '(USER) You must provide user id';
        if (!houseId) throw '(USER) You must provide house id';
        if (!address || typeof address !== 'string') throw '(USER) You must provide house address';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId},
            {$addToSet: {
                houseLists: {
                    _id: houseId, 
                    address: address,
                }}
            }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'House added to user failed';
        return await this.getUserById(userId);
    },
    
    async removeHouseFromUser(userId, houseId){
        if (!userId) throw '(USER) You must provide user id';
        if (!houseId) throw '(USER) You must provide house id';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId}, 
            {$pull: {houseLists: {_id: houseId}}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'House deleted from user failed';
        return await this.getUserById(userId);
    },

    async addCommentToUser(userId, commentId, houseId, address, commentDate, text) {
        if (!userId) throw '(USER) You must provide user id';
        if (!commentId) throw '(USER) You must provide comment id';
        if (!houseId) throw '(USER) You must provide house id';
        if (!address || typeof address !== 'string') throw '(USER) You must provide house address';
        if (!commentDate || typeof commentDate !== 'string') throw '(USER) You must provide comment date';
        if (!text || typeof text !== 'string') throw '(USER) You must provide text';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId},
            {$addToSet: {
                comments: {
                    _id: commentId,
                    houseId: houseId,
                    address: address,
                    commentDate: commentDate, 
                    text: text
                }}
            }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add comment to user';
        return await this.getUserById(userId);
    },

    async removeCommentFromUser(userId, commentId){
        if (!userId) throw '(USER) You must provide user id';
        if (!commentId) throw '(USER) You must provide comment id';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId}, 
            {$pull: {comments: {_id: commentId}}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to delete comment from user';
        return await this.getUserById(userId);
    },

    async userStoreHouse(userId, houseId, address) {
        if (!userId) throw '(USER) You must provide user id';
        if (!houseId) throw '(USER) You must provide house id';
        if (!address || typeof address !== 'string') throw '(USER) You must provide house address';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId},
            {$addToSet: {
                storedHouses: {
                    _id: houseId, 
                    address: address
                }}
            }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'USER Failed (store house)';
        return await this.getUserById(userId);
    },

    async userRemoveStoredHouse(userId, houseId){
        if (!userId) throw '(USER) You must provide user id';
        if (!houseId) throw '(USER) You must provide house id';

        const userCollection = await users();
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        const updateInfo = await userCollection.updateOne(
            {_id: userId}, 
            {$pull: {storedHouses: {_id: houseId}}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'USER Failed (remove stored house)';
        return await this.getUserById(userId);
    }
};