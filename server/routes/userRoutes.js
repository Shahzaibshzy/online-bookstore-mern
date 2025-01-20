const express = require('express');
const { registerUser, loginUser,getUser } = require('../controller/userController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUser);
module.exports = router;
