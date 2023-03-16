import React, { useState } from 'react';

function WebAuthnComponent() {
  const [errorMessage, setErrorMessage] = useState('');

  async function createCredential() {
    try {
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: {
          name: 'WebAuthn',
          id: 'auth.me',
        },
        user: {
          id: new Uint8Array(32),
          name: 'mihir20.osl@gmail.com',
          displayName: 'Mihir',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
        },
        attestation: 'direct',
      };

      const credential = await navigator.credentials.create({
        publicKey,
      });

      console.log('Credential:', credential);
      // Verify credential and grant access to your application
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    }
  }

  function handleClick() {
    if (typeof window.PublicKeyCredential !== 'function') {
      setErrorMessage('WebAuthn not supported on this browser');
    } else {
      createCredential();
    }
  }

  return (
    <div className="WebAuthnComponent">
      <button className="WebAuthnButton" onClick={handleClick}>
        Authenticate with WebAuthn
      </button>
      {errorMessage && <p className="WebAuthnError">{errorMessage}</p>}
    </div>
  );
}

export default WebAuthnComponent;
