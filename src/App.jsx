import React, { useState } from 'react';
import axios from 'axios';
import RegistrationForm from './Components/RegistrationForm';
import AuthApp from './Components/Authentication';
import UserDisplay from './Components/UserDisplay';


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [registered, setRegistered] = useState(false)
  const [name, setName] = useState('');


  async function handleRegistration(data) {
    try {
      const response = await axios.post('/register', data);
      setRegistered(true);
      setName(response.data.name);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  async function handleLogin() {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
  
      const publicKey = {
        challenge,
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
  
      setName(response.data.name);
      setAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  


  return (
    <div className="App">
      {!registered && <RegistrationForm onRegistration={handleRegistration} />}
      {!authenticated && <AuthApp onLogin={handleLogin} />}
      {authenticated && <UserDisplay name={name} />}
    </div>
  );
}


export default App;
