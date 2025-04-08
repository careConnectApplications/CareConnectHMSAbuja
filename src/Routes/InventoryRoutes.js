import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isInventoryStaff, isPharmacyStaff } from '../Authentication/Index'




export default function InventoryRoutes() {

  let auth = {"token": isInventoryStaff()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
