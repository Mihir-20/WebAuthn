import React, { useState } from 'react';
import axios from 'axios';

function Authentication({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userName, setUserName] = useState('');

  async function handleAuthButtonClick() {
    setIsAuthenticating(true);

    try {
      const publicKey = {
        challenge: new Uint8Array(32),
        allowCredentials: [
          {
            type: 'public-key',
            id: new Uint8Array(16),
            transports: ['usb', 'nfc', 'ble'],
          },
        ],
        userVerification: 'required',
      };

      const credential = await navigator.credentials.get({ publicKey });

      console.log('Credential:', credential);

      const response = await axios.post('/login', { credential });

      console.log('Server response:', response);

      setUserName(response.data.name);
      onLogin();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div>
      <h2>Authenticate with WebAuthn</h2>
      <button
        className="WebAuthnButton"
        onClick={handleAuthButtonClick}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? 'Authenticating...' : 'Authenticate with WebAuthn'}
      </button>

      {errorMessage && <p className="WebAuthnError">{errorMessage}</p>}
    </div>
  );
}


export default Authentication;
