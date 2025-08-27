// components/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileContainer from "./components/ProfileContainer";

export default function AdminProfile({ userId }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(res => setAdmin(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        name: e.target.name.value,
        roleDetails: {
          admin: {
            permissions: e.target.permissions.value
              .split(",")
              .map(s => s.trim()),
            managedUsers: [] // Optional: add logic to manage users
          }
        }
      };
      await axios.put(`/api/users/${userId}`, updates);
      alert("Admin profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!admin) return <p>Loading...</p>;

  const adminDetails = admin.roleDetails.admin || {};

  return (
    <ProfileContainer role="Admin">
      <form className="profile-form" onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          defaultValue={admin.name}
          className="input"
          placeholder="Full Name"
        />
        <input
          type="text"
          name="permissions"
          defaultValue={(adminDetails.permissions || []).join(", ")}
          className="input"
          placeholder="Permissions (comma separated)"
        />
        {/* Optional: Show managed users */}
        <div className="managed-users">
          <label>Managed Users IDs:</label>
          <ul>
            {(adminDetails.managedUsers || []).map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
        <button className="btn">Update Profile</button>
      </form>
    </ProfileContainer>
  );
}
