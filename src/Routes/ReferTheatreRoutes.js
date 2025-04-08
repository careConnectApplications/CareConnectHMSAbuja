import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient, isLabStaff, isTheatreStaff} from '../Authentication/Index'




export default function ReferTheaterRoutes() {

  let auth = {"token": isTheatreStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
