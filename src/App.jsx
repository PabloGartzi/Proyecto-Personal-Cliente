import { useState } from 'react'

import { UserProvider } from "./context/UserProvider"
import {AppRoutes} from "./routes/AppRoutes"

import './App.css'


function App() {
  const [count, setCount] = useState(0)
  return (
    <UserProvider>
      <div className='container pt-3'>
        <p className='h1'>Front APP</p>
        <hr />
        <AppRoutes/>
      </div>
    </UserProvider>
  )
}

export default App
