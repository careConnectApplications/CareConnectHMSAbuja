import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient, isLabStaff } from '../Authentication/Index'




export default function LabRoutes() {

  let auth = {"token": isLabStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
