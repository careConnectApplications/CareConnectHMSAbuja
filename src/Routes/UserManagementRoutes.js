import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isBillingStaff, isUserManagerStaff, } from '../Authentication/Index'




export default function UserManagementRoutes() {

  let auth = {"token": isUserManagerStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
