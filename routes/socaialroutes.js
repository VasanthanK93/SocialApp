const express = require('express');
const router = express.Router();
const socialController = require('../app/api/controllers/socialController.js');
var multer  = require('multer');
var randtoken = require('rand-token');
var path = require('path');
var token=randtoken.generate(12);
var upload = multer({ dest: ('./image')})

router.post('/postcontent',upload.single('image'), socialController.postContent);
router.post('/savecontentdraft', socialController.saveDraft);
router.get('/getsavedDraft',socialController.getDraftContent)
router.get('/getpostedContent',socialController.getPostedContent )
router.post('/addlike',socialController.addLike)
router.post('/adddislike',socialController.addDislike)
router.post('/removelike',socialController.removeLike)
router.post('/removedislike',socialController.removeDislike)

module.exports = router;
