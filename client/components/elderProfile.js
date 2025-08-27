// components/ElderProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileContainer from "./components/ProfileContainer";

export default function ElderProfile({ userId }) {
  const [elder, setElder] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((res) => setElder(res.data));
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        name: e.target.name.value,
        roleDetails: {
          elder: {
            dateOfBirth: e.target.dateOfBirth.value,
            phone: e.target.phone.value,
            medicalConditions: e.target.medicalConditions.value.split(",").map(s => s.trim()),
            medications: e.target.medications.value.split(",").map(s => s.trim()),
            emergencyContactIds: [] // Add logic if you want editable
          }
        }
      };
      await axios.put(`/api/users/${userId}`, updates);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!elder) return <p>Loading...</p>;

  const elderDetails = elder.roleDetails.elder || {};

  return (
    <ProfileContainer role="Elder">
      <form className="profile-form" onSubmit={handleUpdate}>
        <input type="text" name="name" defaultValue={elder.name} className="input" placeholder="Full Name" />
        <input type="text" name="phone" defaultValue={elderDetails.phone || ""} className="input" placeholder="Phone" />
        <input type="date" name="dateOfBirth" defaultValue={elderDetails.dateOfBirth?.split("T")[0] || ""} className="input" />
        <input type="text" name="medicalConditions" defaultValue={(elderDetails.medicalConditions || []).join(", ")} className="input" placeholder="Medical Conditions (comma separated)" />
        <input type="text" name="medications" defaultValue={(elderDetails.medications || []).join(", ")} className="input" placeholder="Medications (comma separated)" />
        <button className="btn">Update Profile</button>
      </form>
    </ProfileContainer>
  );
}
