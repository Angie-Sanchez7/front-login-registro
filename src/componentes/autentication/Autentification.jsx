import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../../pages/auth/login/Login'
import ForgotPassword from '../../pages/auth/forgotPassword/ForgotPassword'
import ResetPassword from '../../pages/auth/resetPassword/ResetPassword'
import NotFound from '../notFound/NotFound'
import Landing from '../../componentes/landing/Landing'
import Profile from '../../pages/auth/profile/Profile'
import EditUser from '../../pages/auth/profile/EditUser'
import Register from '../../pages/auth/register/Register'
import Header from '../../pages/auth/header/Header'
import ActivationEmail from '../../pages/auth/activationEmail/ActivationEmail'

function Autentification () {
  const auth = useSelector(state => state.auth)
  const { isLogged, isAdmin } = auth
  return (
    <Router>
      <Header/>
      <Routes>
        <Route
          path='/login'
          element={isLogged ? <NotFound /> : <Login />}
          exact
        />
        <Route path= '/register' element={<Register/>} exact/>
        <Route path='/forgot_password' element={<ForgotPassword />} exact />
        <Route
          path='/profile'
          element={isLogged ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path='/edit_user/:id'
          element={isAdmin ? <EditUser /> : <NotFound />}
          exact
        />
        <Route path= '/create_user' element={<Register/>} exact/>
        <Route
          path='/user/reset/:token'
          element={isLogged ? <NotFound /> : <ResetPassword />}
          exact
        />
        <Route path='/' element={isLogged ? <Landing/> : <Login/>}
          exact/>
          <Route path= '/user/activate/:activation_token' element={<ActivationEmail/>} exact/>
      </Routes>
    </Router>
  )
}
export default Autentification
