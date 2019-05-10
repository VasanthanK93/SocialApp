const express = require('express');
const router = express.Router();
const socialController = require('../app/api/controllers/socialController.js')

router.post('/addcomments',socialController.addComments)

module.exports = router;