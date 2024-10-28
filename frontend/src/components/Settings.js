import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [user, setUser] = useState({ displayName: '', email: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/user')
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .catch((error) => console.error('Failed to load user info:', error));
  }, []);

  const handleSave = () => {
    fetch('http://localhost:5000/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log('User updated', data))
      .catch((error) => console.error('Update failed:', error));
  };

  return (
    <div className="settings">
      <h2>Profile Settings</h2>
      <input
        type="text"
        value={user.displayName}
        onChange={(e) => setUser({ ...user, displayName: e.target.value })}
        placeholder="Display Name"
      />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};
