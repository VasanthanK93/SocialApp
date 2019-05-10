var multer = require('multer')
var fs = require('fs')

var path = require('path');
var randtoken = require('rand-token');//var upload = require('../upload.js')
var postContentModel = require('../models/postContentModel.js')
var draftContentModel = require('../models/draftContentModel.js')
var counterModel = require('../models/counterModel.js')

module.exports = {
    postContent: async (req, res) => {
        try {

            // var newItem = new item()
            // newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
            // newItem.img.contentType = 'image/png'

            //var image = newItem.save();
            var postid = await counterModel.findOneAndUpdate({ "id": "postid" }, { $inc: { sequence_value: 1 } });
            var vurl = "";
            if (req.file != "" && req.file != undefined) {
                var oldpath = req.file.path;
                var token = randtoken.generate(8);
                var newpath = path.join(__dirname, '../image/' + req.file.originalname);

                var filepath = `http://localhost:2993/api/image/`;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                var vurl = filepath + req.file.originalname;
            }

            let postContent = {
                postID: postid.sequence_value,
                subject: req.body.subject,
                content: req.body.content,
                likes: 0,
                dislikes: 0,
                createdDate: new Date(),
                modifiedDate: new Date(),
                createdBy: req.body.createdBy,
                ModifiedBy: req.body.ModifiedBy,
                Comments: [],
                status: req.body.status,
                image: vurl
            }
            console.log("VBK");

            let createPost = await postContentModel.create(postContent)

            return res.json({ status: "success", message: "Your Content is posted successfully!!!", data: createPost })
        }
        catch (err) {
            res.send(err);
        }

    },

    saveDraft: async (req, res) => {
        try {
            let postDraft = new draftContentModel(req.body)
            let createDraft = await draftContentModel.create(postDraft)

            return res.json({ status: "success", message: "Your Content is saved in Draft", data: createDraft })
        }
        catch (err) {
            res.send(err)
        }

    },

    getDraftContent: async (req, res) => {
        try {
            let userID = req.query.userID
            let getDraft = await draftContentModel.find({ createdBy: userID })
            if (!getDraft) {
                return res.json({ status: "success", message: "No Draft is saved by you", data: getDraft })
            } else {
                return res.json({ status: "success", message: "list of Draft is Displayed", data: getDraft })
            }

        } catch (err) {
            res.send(err)
        }

    },

    getPostedContent: async (req, res) => {
        try {           
            let postContent = await postContentModel.find({})
            if (!postContent) {
                return res.json({ status: "success", message: "No post is saved by you", data: postContent })
            } else {
                return res.json({ status: "success", message: "list of post is Displayed", data: postContent })
            }

        } catch (err) {
            res.send(err)
        }

    },

    addLike: async (req, res) => {
        try {
            var postID = req.query.postID
            let postContent = await postContentModel.findOneAndUpdate({ postID: postID }, { $inc: { likes: 1 } });
            if (!postContent) {
                return res.json({ status: "error", message: "No post is available for the postid", data: postContent })
            } else {
                return res.json({ status: "success", message: "like has been updated for the postid", data: postContent })
            }

        } catch (err) {
            res.send(err)
        }
    },

    addDislike: async (req, res) => {
        try {
            var postID = req.query.postID
            let postContent = await postContentModel.findOneAndUpdate({ postID: postID }, { $inc: { dislikes: 1 } });
            if (!postContent) {
                return res.json({ status: "success", message: "No post is available for the postid", data: postContent })
            } else {
                return res.json({ status: "success", message: "dislike has been updated for the postid", data: postContent })
            }

        } catch (err) {
            res.send(err)
        }
    },

    addComments: async (req, res) => {
        try {
            var postID = req.query.postID,
                Comments = {
                    comments : req.body.comments,
                    createdDate : new Date(),
                    createdBy : req.body.createdBy
                }
            let postContent = await postContentModel.findOneAndUpdate({ postID: postID }, { $push: { comments: Comments } });
            console.log(postContent);
            
            if (!postContent) {
                return res.json({ status: "success", message: "No post is saved by you", data: postContent })
            } else {
                return res.json({ status: "success", message: "list of post is Displayed", data: postContent })
            }

        } catch (err) {
            res.send(err)
        }
    },

    removeLike: async (req, res) => {
        try {
            var postID = req.query.postID
            let postData = await postContentModel.find({ postID: postID })
            if (!postData) {
                return res.json({ status: "error", message: "No post is available for the postid", data: postContent })
            } else if (postData.likes == 0) {
                return res.json({ status: "error", message: "No likes available for the postid", data: postContent })
            } else {
                let postContent = await postContentModel.findOneAndUpdate({ postID: postID }, { $inc: { likes: -1 } });
                return res.json({ status: "success", message: "like has been updated for the postid", data: postContent })
            }


        } catch (err) {
            res.send(err)
        }
    },

    removeDislike: async (req, res) => {
        try {
            var postID = req.query.postID
            let postData = await postContentModel.find({ postID: postID })
            if (!postData) {
                return res.json({ status: "error", message: "No post is available for the postid", data: postContent })
            } else if (postData.dislikes == 0) {
                return res.json({ status: "error", message: "No dislikes available for the postid", data: postContent })
            }else{
                let postContent = await postContentModel.findOneAndUpdate({ postID: postID }, { $inc: { dislikes: -1 } });
                return res.json({ status: "success", message: "dislike has been updated for the postid", data: postContent })
            }

        } catch (err) {
            res.send(err)
        }
    }

}
