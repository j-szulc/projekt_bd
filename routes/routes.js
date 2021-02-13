const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

router.get('/say-something', controllers.saySomething);
router.get('/pools', controllers.pools);
router.get('/poolInfo', controllers.poolInfo);
router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/reserve', controllers.reserve);
router.get('/list', controllers.list);
router.get('/timetable', controllers.timetable);
router.get('/validToken', controllers.validToken);

module.exports = router;