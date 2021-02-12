const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

router.get('/say-something', controllers.saySomething);
router.get('/pools', controllers.pools);
router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/reserve', controllers.login);

module.exports = router;