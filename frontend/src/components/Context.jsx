import React, { useContext, useEffect, useState } from 'react';

const Context = ({user}) => {

  const [rides, setRides] = useState([]);

  useEffect(() => {

    const fetchRides = async () => {
      const response = await fetch('http://localhost:5000/ride/rides', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await response.json();
      if(!data.valid){
        console.log('Failed to fetch rides');
        return;
      }
      setRides(data.rides);
      longfetchRides();
    };

    const longfetchRides = async () => {
      const response = await fetch('http://localhost:5000/ride/long-poll-rides', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await response.json();
      if(data.valid){
        setRides(data.rides);
        longfetchRides();
      }
      else{
        console.log('Failed to fetch rides');
      }
    };

    fetchRides();
  }, []);

  const joinRideCheck = (seatsAvailable, rideId) => {
    if(seatsAvailable > 0){
      joinRide(rideId);
    }
    else{
      console.log('No seats available');
    }
  };

  const joinRide = async (rideId) => {
    const response = await fetch('http://localhost:5000/ride/join-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({rideId}),
      }
    );
    const data = await response.json();
    if(!data.success){
      console.log('Failed to join ride'+rideId);
    }
  };

  const leaveRide = async (rideId) => {
    const response = await fetch('http://localhost:5000/ride/leave-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({rideId}),
      }
    );
    const data = await response.json();
    if(!data.success){
      console.log('Failed to leave ride'+rideId);
    }
  };

  return (
    <div>
      <h1>Available Rides</h1>
      <ul>
        {rides.map(ride => (
          <li key={ride._id}>
            {ride.origin} - {ride.destination} - {ride.departureTime} - {ride.gender} - {ride.seatsAvailable}  seats available
            {ride.sharedWith.indexOf(user._id) >= 0 ? (
              <button onClick={() => leaveRide(ride._id)}>Leave Ride</button>
            ) : (
              <button onClick={() => joinRideCheck(ride.seatsAvailable, ride._id)}>Join Ride</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Context;