const express = require('express');
const router = express.Router();
const device37Controller = require('../controllers/device37Controller');
// const validator = require('../controllers/validator');

router.get('/device37/list', device37Controller.show37);

router.get('/device37/add', device37Controller.add)
router.post('/device37/add',device37Controller.add37);

router.get('/editdevice37/:did',device37Controller.edit37);
router.post('/editdevice37/:did',device37Controller.editPost37);

router.get('/deletedevice37/:did', device37Controller.delete);

router.post('/deletedevice37/:did',device37Controller.delete37);



module.exports = router;