import { useState } from 'react'

import { UserProvider } from "./context/UserProvider"
import {AppRoutes} from "./routes/AppRoutes"

import './App.css'


function App() {
  const [count, setCount] = useState(0)
  return (
    <UserProvider>
        <AppRoutes/>
    </UserProvider>
  )
}

export default App
