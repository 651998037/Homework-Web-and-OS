const express = require('express');
const router = express.Router();
const site37Controller = require('../controllers/site37Controller');
// const validator = require('../controllers/validator');

router.get('/site37/list', site37Controller.show37);

router.get('/site37/add', site37Controller.add)
router.post('/site37/add',site37Controller.add37);

router.get('/editsite37/:sid',site37Controller.edit37);
router.post('/editsite37/:sid',site37Controller.editPost37);

router.get('/deletesite37/:sid', site37Controller.delete);

router.post('/deletesite37/:sid',site37Controller.delete37);



module.exports = router;