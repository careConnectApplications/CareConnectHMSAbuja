import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient, isRadiologyStaff } from '../Authentication/Index'




export default function RadiologyRoutes() {

  let auth = {"token": isRadiologyStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
