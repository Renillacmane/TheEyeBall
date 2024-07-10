var express = require('express');
var UserModel = require('../models/user');

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {

    const users = await UserModel.find({});

    res.json(users);
});

module.exports = router;


