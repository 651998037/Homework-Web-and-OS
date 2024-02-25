const express = require('express');
const router = express.Router();
const deploy37Controller = require('../controllers/deploy37Controller');
// const validator = require('../controllers/validator');

router.get('/deploy37/list', deploy37Controller.show37);

router.get('/deploy37/add', deploy37Controller.add)
router.post('/deploy37/add',deploy37Controller.add37);

router.get('/editdeploy37/:did_de',deploy37Controller.edit37);
router.post('/editdeploy37/:did_de',deploy37Controller.editPost37);

router.get('/deletedeploy37/:did_de', deploy37Controller.delete);

router.post('/deletedeploy37/:did_de',deploy37Controller.delete37);

router.get('/deploy37/Dist', deploy37Controller.Dist);


module.exports = router;