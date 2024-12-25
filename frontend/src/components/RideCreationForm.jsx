import React, { useState } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const RideCreationForm = ({user}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDetails, setFormDetails] = useState({
    origin: "pc",
    destination: "walmi",
    departureTime: "",
    genderSpecific: "both",
    maxVacancies: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { origin, destination, departureTime, genderSpecific,maxVacancies } = formDetails;

    // Validate origin and destination
    if (origin === destination) {
      newErrors.origin = "Origin and Destination cannot be the same.";
    }

    // Validate max vacancies
    if (!maxVacancies || maxVacancies < 1) {
      newErrors.maxVacancies = "Vacancies must be at least 1.";
    }

    // Validate departure time
    const selectedDate = new Date(departureTime);
    const currentDate = new Date();
    if (!departureTime || selectedDate <= currentDate) {
      newErrors.departureTime = "Departure time must be in the future.";
    }

    // Validate gender specific
    if(genderSpecific !== "both" && genderSpecific !== user.gender){
      newErrors.genderSpecific = "genderSpecific must be same as your or both boy and girl";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      var message = "Please fix the following errors before submitting the form:\n";
      if (validationErrors.origin)
        message+= validationErrors.origin + "\n" ;
      if (validationErrors.departureTime)
        message+= validationErrors.departureTime + "\n" ;
      if (validationErrors.genderSpecific)
        message+= validationErrors.genderSpecific + "\n" ;
      if (validationErrors.maxVacancies)
        message+= validationErrors.maxVacancies + "\n" ;
      alert(message);
      return;
    }

    const response = await fetch("http://localhost:5000/ride/rides", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formDetails),
    });
    const data = await response.json();
    if (!data.success) 
        alert("Ride creation failed.");
    closeModal(); // Close the modal after successful submission
  };
  
  return (
    <div>
      <button onClick={openModal}>Start a new Ride</button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "400px",
            backgroundColor: "grey",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2>Enter Details about the Ride</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Origin:</label>
            <select
              name="origin"
              value={formDetails.origin}
              onChange={handleChange}
            >
              <option value="pc">PC</option>
              <option value="walmi">Walmi</option>
              <option value="dharwad">Dharwad new Bustand</option>
            </select>
          </div>
          <div>
            <label>Destination:</label>
            <select
              name="destination"
              value={formDetails.destination}
              onChange={handleChange}
            >
              <option value="pc">PC</option>
              <option value="walmi">Walmi</option>
              <option value="dharwad">Dharwad new Bustand</option>
            </select>
          </div>
          <div>
            <label>Departure Time:</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formDetails.departureTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Gender Specific:</label>
            <select
              name="genderSpecific"
              value={formDetails.genderSpecific}
              onChange={handleChange}
            >
              <option value="Male">Only Boys</option>
              <option value="Female">Only Girls</option>
              <option value="both">Both Boys and Girls</option>
            </select>
          </div>
          <div>
            <label>Max Vacancies:</label>
            <input
              type="number"
              name="maxVacancies"
              value={formDetails.maxVacancies}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button type="submit">Submit</button>
            <button type="button" onClick={closeModal} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default RideCreationForm;
