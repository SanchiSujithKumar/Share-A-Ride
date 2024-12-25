const express = require('express');
const { createUser, loginUser, logoutUser, isLoggedIn } = require('../controllers/userCtrl');

const router = express.Router();

router.post('/register', createUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/isLoggedIn', isLoggedIn);

module.exports = router;