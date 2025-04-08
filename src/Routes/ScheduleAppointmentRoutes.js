import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isInPatient, isScheduleAppointmentStaff } from '../Authentication/Index'




export default function ScheduleAppointmentRoutes() {

  let auth = {"token": isScheduleAppointmentStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
