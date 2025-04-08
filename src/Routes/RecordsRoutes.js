import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isRecordStaff } from '../Authentication/Index'




export default function RecordsRoutes() {

  let auth = {"token": isRecordStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
