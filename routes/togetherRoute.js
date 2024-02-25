const express = require('express');
const router = express.Router();
const togetherController = require('../controllers/togetherController');
// const validator = require('../controllers/validator');

router.get('/together/list', togetherController.show37);

router.get('/together/add', togetherController.add)
router.post('/together/add',togetherController.add37);

router.get('/edittogether/:sid',togetherController.edit37);
router.post('/edittogether/:sid',togetherController.editPost37);

router.get('/deletetogether/:sid', togetherController.delete);

router.post('/deletetogether/:sid',togetherController.delete37);



module.exports = router;