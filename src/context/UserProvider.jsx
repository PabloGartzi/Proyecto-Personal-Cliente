import React, { useState } from 'react'
import { UserContext } from './UserContext'

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState()
        
    const logout = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, setUser, logout, mensaje: 'Hola Mundo' }}>
      {children}
    </UserContext.Provider>
  )
}

