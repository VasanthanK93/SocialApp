var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var users = require('./routes/userroutes.js')
var social = require('./routes/socaialroutes.js')
var commentpost = require('./routes/commentsroutes.js')
var mongoose = require('./config/database.js')
var multer = require('multer')
var jwt = require("jsonwebtoken")

app.set('secretkey', 'socialapp')

mongoose.connection.on('error', console.error.bind(console, 'Mongoose Connection Error'))

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
  })
  const upload = multer({ storage: storage })

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.get('/', function (req, res) {
    res.json({ "app": "Social App" });
});

app.use('/users', users)

app.use('/socialpost', validateUser, social)

app.use('/commentpost',commentpost)

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'],
        req.app.get('secretkey'), function (err, decoded) {
            if (err) {
                res.json({ Status: "error", message: err.message, data: null })
            } else {
                req.body.userid = decoded.id;
                next();
            }
        })
}

// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "Something looks wrong !!!" });
});

app.listen(2993, function () { console.log('Node server listening on port 2993'); });