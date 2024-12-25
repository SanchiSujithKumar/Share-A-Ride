const Ride = require('../models/Ride');
const EventEmitter = require('events');
const changeEmitter = new EventEmitter();

changeEmitter.setMaxListeners(100);

const getRides = async (req, res) => {
    try {
        const rides = await Ride.find({"gender": {$in : ["both", req.session.user.gender]}});
        res.json({valid : true, rides});
    } catch (err) {
        res.json({valid: false, message: 'Failed to fetch rides'});
    }
};

const longPollRides = async (req, res) => {
    const waitForChange = new Promise((resolve) => {
        changeEmitter.once("ridesChanged", resolve);
    });
    await waitForChange;
    try {
        const rides = await Ride.find({"gender": {$in : ["both", req.session.user.gender]}});
        res.json({valid : true, rides});
    } catch (err) {
        res.json({valid: false, message: 'Failed to fetch rides'});
    }
};

const createRide = async (req, res) => {
    const { origin, destination, departureTime, genderSpecific ,maxVacancies } = req.body;
    
    var passengers = [];
    passengers.push(req.session.user);
    
    totalVacancies = parseInt(maxVacancies);
    time = new Date(departureTime);
    
    try {
        const ride = new Ride({ 
            origin: origin, 
            destination: destination,
            gender: genderSpecific,
            departureTime: time,
            seatsAvailable: totalVacancies, 
            sharedWith: passengers 
        });
        await ride.save();
        changeEmitter.emit("ridesChanged");
        res.json({ success: true });
    }
    catch (err) {
        res.json({ success: false, message: 'Ride creation failed' });
    }
};

const joinRide = async (req, res) => {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    try {
        ride.seatsAvailable -= 1;
        ride.sharedWith.push(req.session.user._id);
        await ride.save();
        changeEmitter.emit("ridesChanged");
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Ride joining failed' });
    }
};

const leaveRide = async (req, res) => {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    try {
        const ind = ride.sharedWith.indexOf(req.session.user._id);
        if(ind == -1){
            return res.json({ success: false, message: 'User not in ride'});
        }
        ride.sharedWith.splice(ind,1);
        ride.seatsAvailable += 1;
        if(ride.sharedWith.length == 0){
            await Ride.deleteOne({_id: rideId});
        }
        else{
            await ride.save();
        }
        changeEmitter.emit("ridesChanged");
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Ride leaving failed' });
    }
}

module.exports = {
    getRides,
    longPollRides,
    createRide,
    joinRide,
    leaveRide
};