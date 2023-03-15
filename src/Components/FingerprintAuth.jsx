import React, { useState } from 'react';
import { Authenticator, Login } from 'react-webauthn';
import { preformatMakeCredReq, publicKeyCredentialToJSON } from 'webauthn-json';

const FingerprintAuth = () => {
  const [credential, setCredential] = useState(null);

  const handleLogin = async () => {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKey = {
      challenge,
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      timeout: 60000,
    };

    const cred = await navigator.credentials.create({ publicKey });
    const credJson = publicKeyCredentialToJSON(cred);
    setCredential(credJson);
  };

  return (
    <div>
      {credential ? (
        <p>Fingerprint data saved successfully.</p>
      ) : (
        <Authenticator onAuthenticate={handleLogin}>
          <Login />
        </Authenticator>
      )}
    </div>
  );
};

export default FingerprintAuth;
