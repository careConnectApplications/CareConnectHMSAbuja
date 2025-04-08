import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isClinicalReport, } from '../Authentication/Index'




export default function ClinicalReportRoutes() {

  let auth = {"token": isClinicalReport()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
