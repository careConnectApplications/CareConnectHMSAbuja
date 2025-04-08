import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isBillingStaff, } from '../Authentication/Index'




export default function BillingRoutes() {

  let auth = {"token": isBillingStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
