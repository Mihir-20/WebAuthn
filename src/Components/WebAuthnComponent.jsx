import React, { useState } from "react";
import base64url from 'base64url';
import axios from "axios";


function WebAuthnComponent() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function createCredential() {
    setIsAuthenticating(true);

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

      console.log("Credential:", credential);
      // Verify credential and grant access to your application

      const publicKeyCredential = {
        id: credential.id,
        rawId: base64url.encode(credential.rawId),
        response: {
          attestationObject: base64url.encode(
            new Uint8Array(credential.response.attestationObject)
          ),
          clientDataJSON: base64url.encode(
            new Uint8Array(credential.response.clientDataJSON)
          ),
        },
        type: credential.type,
      };

      const response = await axios.post("https://webauthn.io/demo/verify", {
        publicKeyCredential,
      });

      if (response.data.success) {
        console.log("Authentication successful");
        setErrorMessage("");
      } else {
        console.log("Authentication failed");
        setErrorMessage("Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  function handleClick() {
    if (typeof window.PublicKeyCredential !== "function") {
      setErrorMessage("WebAuthn not supported on this browser");
    } else {
      createCredential();
    }
  }

  return (
    <div className="WebAuthnComponent">
      <button
        className="WebAuthnButton"
        onClick={handleClick}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? "Authenticating..." : "Authenticate with WebAuthn"}
      </button>
      {errorMessage && <p className="WebAuthnError">{errorMessage}</p>}
    </div>
  );
}

export default WebAuthnComponent;
