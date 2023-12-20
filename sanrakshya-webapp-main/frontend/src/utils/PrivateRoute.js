import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const PrivateRoute = () => {
    let {user} = useContext(AuthContext)
    return(
        // If user is not authenticated, redirect to login, else continue with the request
        user ? <Outlet/> : <Navigate to ='/login'/>
    )
}

export default PrivateRoute;