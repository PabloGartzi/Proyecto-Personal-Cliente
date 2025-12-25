import React from 'react'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Route, Routes, Navigate, Outlet } from 'react-router'

import {LoginPage} from "../pages/LoginPage"
import {AdminDashboard} from "../pages/AdminPages/AdminDashboard"
import { EditUser } from '../pages/AdminPages/EditUser'
import { CreateUser } from '../pages/AdminPages/CreateUser'
//import { LayoutPublic } from '../pages/LayoutPublic'

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginPage />}/>
      {/* Rutas de admin protegidas */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]}><Outlet /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="editUser/:id" element={<EditUser />} />
            <Route path="createUser" element={<CreateUser />} />
        </Route>
        <Route path='/*' element={<Navigate to={'/'} />} />
    </Routes>
  )
}
