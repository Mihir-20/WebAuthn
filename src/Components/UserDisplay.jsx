import React from 'react';

function UserDisplay(props) {
  return (
    <div>
      <h2>Welcome, {props.name}!</h2>
    </div>
  );
}

export default UserDisplay;
