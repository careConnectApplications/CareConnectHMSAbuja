import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isOutPatient } from '../Authentication/Index'




export default function OutPatientRoutes() {

  let auth = {"token": isOutPatient()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
