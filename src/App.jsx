import { useState } from 'react'
import './App.css'
import AuthComponent from './Components/AuthComponent'
import WebAuthnComponent from './Components/WebAuthnComponent'

function App() {
  return (
    <div className="App">
      Hello
      <WebAuthnComponent />
    </div>
  )
}

export default App
