import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');
  const [authenticatorData, setAuthenticatorData] = useState(null);
  const [clientDataJSON, setClientDataJSON] = useState(null);

  async function handleRegisterButtonClick() {
    setIsRegistering(true);

    try {
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: {
          name: "WebAuthn.io Demo",
        },
        user: {
          id: new Uint8Array(32),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
        },
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({ publicKey });
      console.log('Credential:', credential);

      const { id, rawId, response } = credential;
      const { clientDataJSON, authenticatorData } = response;

      const data = {
        name,
        id: id,
        rawId: Array.from(new Uint8Array(rawId)).join(),
        clientDataJSON: JSON.stringify(clientDataJSON),
        authenticatorData: Array.from(new Uint8Array(authenticatorData)).join(),
      };

      await axios.post('http://localhost:5000/register', data);
      setName('');
      setRegistrationErrorMessage('');
      setAuthenticatorData(authenticatorData);
      setClientDataJSON(clientDataJSON);
    } catch (error) {
      console.error('Error:', error);
      setRegistrationErrorMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <div>
      {authenticatorData && clientDataJSON && (
        <p>
          Successfully registered {name}'s fingerprint! Use the fingerprint to login from now on.
        </p>
      )}

      {!authenticatorData && !clientDataJSON && (
        <div>
          <h2>Register</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <button
              className="WebAuthnButton"
              onClick={handleRegisterButtonClick}
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Register with WebAuthn'}
            </button>
          </form>

          {registrationErrorMessage && (
            <p className="WebAuthnError">{registrationErrorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RegistrationForm;
