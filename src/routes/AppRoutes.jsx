import React from 'react'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Route, Routes, Navigate, Outlet } from 'react-router'

import {LoginPage} from "../pages/LoginPage"
import {AdminDashboard} from "../pages/AdminPages/AdminDashboard"
import { EditUser } from '../pages/AdminPages/EditUser'
import { CreateUser } from '../pages/AdminPages/CreateUser'

import { OfficeDashboard } from '../pages/OfficePages/OfficeDashboard'
import { CreateWork } from '../pages/OfficePages/CreateWork'
import { EditWork } from '../pages/OfficePages/EditWork'

import { WorkerDashboard } from '../pages/WorkerPages/WorkerDashboard'
import { WorkerWorkDetailed } from '../pages/WorkerPages/WorkerWorkDetailed'

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
        {/* Rutas de office protegidas */}
        <Route path="office" element={<ProtectedRoute allowedRoles={["office"]}><Outlet /></ProtectedRoute>}>
            <Route path="dashboard" element={<OfficeDashboard />} />
            <Route path="createWork" element={<CreateWork />} />
            <Route path="editWork/:id" element={<EditWork />} />
        </Route>
        {/* Rutas de worker protegidas */}
        <Route path="worker" element={<ProtectedRoute allowedRoles={["worker"]}><Outlet /></ProtectedRoute>}>
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="work" element={<WorkerWorkDetailed />} />
            {/* <Route path="updateWork" element={<EditWork />} /> */}
        </Route>
        <Route path='/*' element={<Navigate to={'/'} />} />
    </Routes>
  )
}
