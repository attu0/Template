import { useState } from 'react'
import Hero from './components/Hero.jsx'
import Navbar from './components/MainNavbar.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar/>
      <Hero/>
    </div>
  )
}

export default App
