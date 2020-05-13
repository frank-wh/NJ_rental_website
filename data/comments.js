const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = require('./users');
const houses = require('./houses');
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    async getAllComments() {
        const commentCollection = await comments();
        const commentList = await commentCollection.find({}).toArray();
        if (!commentList) throw 'No users in system!';
        return commentList;
    },

    async getCommentById(id) {
        const commentCollection = await comments();
        if(typeof id === 'string'){
            id = ObjectId.createFromHexString(id);
        }
        const comment = await commentCollection.findOne({_id: id});
        if (!comment) throw 'User not found';
        return comment;
    },

    async addComment(userId, houseId, text) {
        if (!userId) throw 'You must provide userId';
        if (!houseId) throw 'You must provide houseId';
        if(typeof userId === 'string'){
            userId = ObjectId.createFromHexString(userId);
        }
        if(typeof houseId === 'string'){
            houseId = ObjectId.createFromHexString(houseId);
        }

        const commentCollection = await comments();
        const user = await users.getUserById(userId);
        const house = await houses.getHouseById(houseId);

        if (!user) throw 'User not found';
        if (!house) throw 'House not found';

        const d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        if(month < 10){
            month = "0" + month;
        }
        else if(day < 10){
            day = "0" + day;
        }
        const date = d.getFullYear() + "-" + month + "-" + day;

        const newComment = {
            user: {
                _id: userId,
                username: `${user.username}`
            },
            house: {
                _id: houseId,
                houseInfo: `${house.houseInfo}`
            },
            commentDate: date,
            text: text
        };
        const insertInfo = await commentCollection.insertOne(newComment);
        const id = insertInfo.insertedId + "";
        await users.addCommentToUser(userId, id, house.houseInfo, date, text);
        await houses.addCommentToHouse(houseId, id, user.username, date, text);
        return await this.getCommentById(insertInfo.insertedId);
    },

    async removeComment(id) {
        if (!id) throw  'You must provide id';
        if(typeof id === 'string'){
            id = ObjectId.createFromHexString(id);
        }
        const commentCollection = await comments();
        const comment = await this.getCommentById(id);

        if (!comment) throw 'Comment not found';

        await users.removeCommentFromUser(comment.user._id, id);
        await houses.removeCommentFromHouse(comment.house._id, id);
        const deletionInfo = await commentCollection.removeOne({_id: ObjectId.createFromHexString(id)});
        if (deletionInfo.deletedCount === 0) throw `Could not delete comment with id of ${id}`
        return;
    }
};