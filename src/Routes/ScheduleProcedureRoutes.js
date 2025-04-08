import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient, isLabStaff, isScheduleProcedureStaff } from '../Authentication/Index'




export default function ScheduleProcedureRoutes() {

  let auth = {"token": isScheduleProcedureStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
