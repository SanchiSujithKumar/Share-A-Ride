const express = require('express');

const { getRides, longPollRides, createRide, joinRide, leaveRide } = require('../controllers/rideCtrl');

const router = express.Router();

router.post('/rides', createRide);

router.get('/rides', getRides);

router.get('/long-poll-rides', longPollRides);

router.post('/join-ride', joinRide);

router.post('/leave-ride', leaveRide);

module.exports = router;