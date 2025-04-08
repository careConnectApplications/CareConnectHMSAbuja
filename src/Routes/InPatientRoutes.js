import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient } from '../Authentication/Index'




export default function InPatientRoutes() {

  let auth = {"token": isInPatient()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
