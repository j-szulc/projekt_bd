const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

router.get('/say-something', controllers.saySomething);
router.get('/pools', controllers.pools);
router.get('/login', controllers.login);

module.exports = router;