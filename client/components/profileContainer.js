// components/ProfileContainer.jsx
import React from "react";

export default function ProfileContainer({ children, role }) {
  return (
    <div className="profile-page">
      <h1 className="profile-title">{role} Profile</h1>
      <div className="profile-content">{children}</div>
    </div>
  );
}
