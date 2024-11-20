import React, { useState, useEffect } from "react";
import { BACKEND_API_URL } from "./Constants";
import "./MyProfile.css";

const MyProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setNewUsername(data.user.username);
      } else {
        console.error("Failed to fetch user information.");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setIsEditing(false);
        console.log("Username updated successfully.");
      } else {
        console.error("Failed to update username.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (localStorage.getItem("authToken") === null) {
    return (
        <div className="invalid-user">
            <h2>Access Denied</h2>
            <p>You must log in to view your MyProfile.</p>
        </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">My Profile</h1>
      {userInfo ? (
        <div className="profile-card">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p>
            <strong>Username:</strong>
            {isEditing ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="profile-input"
              />
            ) : (
              <span> {userInfo.username}</span>
            )}
          </p>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleUpdateUsername} className="profile-button save-button">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="profile-button cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="profile-button edit-button">
                Edit Username
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading user information...</p>
      )}
    </div>
  );
};

export default MyProfile;
