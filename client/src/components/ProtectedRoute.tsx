import { RootState } from '@/app/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute:React.FC = () => {
    const {isAuthenticated} = useSelector((state:RootState)=> state.user)
  if(!isAuthenticated) {
    return <Navigate to='/login' />
  }

  return < Outlet />
}

export default ProtectedRoute