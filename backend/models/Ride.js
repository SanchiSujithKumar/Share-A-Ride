const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RideSchema = new Schema({
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    gender: { 
        type: String, 
        required: true 
    },
    departureTime: {
        type: Date,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Ride', RideSchema);