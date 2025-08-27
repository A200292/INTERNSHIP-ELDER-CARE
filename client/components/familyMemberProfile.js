// components/FamilyProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileContainer from "./components/ProfileContainer";

export default function FamilyProfile({ userId }) {
  const [family, setFamily] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then(res => setFamily(res.data));
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        name: e.target.name.value,
        roleDetails: {
          family_member: {
            phone: e.target.phone.value,
            relationshipToElder: e.target.relationship.value,
            linkedElderIds: [] // Add logic if needed
          }
        }
      };
      await axios.put(`/api/users/${userId}`, updates);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!family) return <p>Loading...</p>;

  const familyDetails = family.roleDetails.family_member || {};

  return (
    <ProfileContainer role="Family Member">
      <form className="profile-form" onSubmit={handleUpdate}>
        <input type="text" name="name" defaultValue={family.name} className="input" placeholder="Full Name" />
        <input type="text" name="phone" defaultValue={familyDetails.phone || ""} className="input" placeholder="Phone" />
        <input type="text" name="relationship" defaultValue={familyDetails.relationshipToElder || ""} className="input" placeholder="Relationship to Elder" />
        <button className="btn">Update Profile</button>
      </form>
    </ProfileContainer>
  );
}
