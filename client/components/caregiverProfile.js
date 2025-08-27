// components/CaregiverProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileContainer from "./components/ProfileContainer";

export default function CaregiverProfile({ userId }) {
  const [caregiver, setCaregiver] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then(res => setCaregiver(res.data));
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        name: e.target.name.value,
        roleDetails: {
          caregiver: {
            phone: e.target.phone.value,
            certifications: e.target.certifications.value.split(",").map(s => s.trim()),
            assignedElders: [], // Add logic if you want editable
            availability: [] // Add logic if needed
          }
        }
      };
      await axios.put(`/api/users/${userId}`, updates);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!caregiver) return <p>Loading...</p>;

  const caregiverDetails = caregiver.roleDetails.caregiver || {};

  return (
    <ProfileContainer role="Caregiver">
      <form className="profile-form" onSubmit={handleUpdate}>
        <input type="text" name="name" defaultValue={caregiver.name} className="input" placeholder="Full Name" />
        <input type="text" name="phone" defaultValue={caregiverDetails.phone || ""} className="input" placeholder="Phone" />
        <input type="text" name="certifications" defaultValue={(caregiverDetails.certifications || []).join(", ")} className="input" placeholder="Certifications (comma separated)" />
        <button className="btn">Update Profile</button>
      </form>
    </ProfileContainer>
  );
}
