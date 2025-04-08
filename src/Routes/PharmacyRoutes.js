import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isPharmacyStaff } from '../Authentication/Index'




export default function PharmacyRoutes() {

  let auth = {"token": isPharmacyStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
