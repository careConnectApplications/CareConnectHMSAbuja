import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../Authentication/Index'




export default function PrivateRoutes() {

  let auth = {"token": isAuthenticated()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/"/>
  )
}
