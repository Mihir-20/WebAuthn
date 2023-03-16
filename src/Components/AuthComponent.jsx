import React, { useState } from 'react';
import { create } from '@github/webauthn-json';
import base64url from 'base64url';

function AuthComponent() {
  // state to hold credential id and public key returned by Web Authentication API
  const [credentialId, setCredentialId] = useState('');
  const [publicKey, setPublicKey] = useState('');

  let show;
  if (window.PublicKeyCredential) {
    show = "PublicKeyCredential: yes"
  } else {
    show = "PublicKeyCredential: no"
  }

  // function to handle the Web Authentication API process
  async function handleAuthenticate() {
    try {
      // create a new public key credential
      const publicKeyCredential = await create({
        // specify the type of public key credential we support
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7, // ECDSA with SHA-256
          },
          {
            type: 'public-key',
            alg: -257, // RSASSA-PKCS1-v1_5 with SHA-256
          },
        ],
        // require user verification (i.e. biometric authentication)
        userVerification: 'required',
      });

      // extract the credential id and public key from the response
      setCredentialId(base64url.encode(publicKeyCredential.rawId));
      setPublicKey(base64url.encode(publicKeyCredential.response.publicKey));

      // send the credential id and public key to the server for verification
      const response = await fetch('/verify', {
        method: 'POST',
        body: JSON.stringify({
          credentialId: credentialId,
          publicKey: publicKey,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // handle the server response here
      console.log(response);
    } catch (err) {
      // handle any errors here
      console.error(err);
    }
  }

  return (
    <div>
      {show}
      <button onClick={handleAuthenticate}>Authenticate</button>
    </div>
  );
}

export default AuthComponent;