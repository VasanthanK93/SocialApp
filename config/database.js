const mongoose = require("mongoose")
const mongodb = 'mongodb://localhost/SocialApp'

mongoose.connect(mongodb, { useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;