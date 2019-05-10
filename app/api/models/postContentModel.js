var mongoose = require("mongoose")

const Schema = mongoose.Schema

var commentSchema = new Schema({
    comments : String,
    createdDate : Date,
    createdBy : String
})


var imageSchema = new Schema({
    data : Buffer,
    contentType : String
    });


var socialSchema = new Schema({
    postID : String,
    subject : String,
    content : String,
    likes : Number,
    dislikes : Number,
    createdDate : Date,
    modifiedDate : Date,
    createdBy : String,
    modifiedBy : String,
    comments : [commentSchema],
    status : String,
    image : String

})


module.exports = mongoose.model('Posts', socialSchema)