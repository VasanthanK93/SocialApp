var mongoose = require("mongoose")

const Schema = mongoose.Schema;

var DraftSchema = new Schema({
    Subject: String,
    Content: String,
    createdBy: String,
    createdDate: Date,
    modifiedBy : String,
    modifiedDate : Date,
    status : String
})

module.exports = mongoose.model('Draft', DraftSchema)