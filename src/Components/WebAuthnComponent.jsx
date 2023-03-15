import React, { useState } from 'react';

// const { navigator } = window;
const publicKeyCredential = window.PublicKeyCredential;

function WebAuthnComponent() {
  const [errorMessage, setErrorMessage] = useState('');

  async function createCredential() {
    try {
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: {
          name: "My Web App"
        },
        user: {
          id: new Uint8Array(32),
          name: "mihir20.osl@gmail.com",
          displayName: "Mihir"
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform"
        }
      };
      const credential = await navigator.credentials.create({
        publicKey
      });
      console.log('Credential:', credential);
      // Verify credential and grant access to your application
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    }
  }

  function handleClick() {
    createCredential();
  }

  return (
    <div>
      <button onClick={handleClick}>Authenticate</button>
      {errorMessage && <p>{errorMessage}</p>}
      {!publicKeyCredential && <p>not exist</p>}
    </div>
  );
}

export default WebAuthnComponent;
