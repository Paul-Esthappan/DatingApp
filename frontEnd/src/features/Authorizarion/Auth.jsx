import React from 'react'
import Login from '../../pages/LoginPage/Login';


function Auth() {
  const isSigninPage = window.location.pathname.includes('signin')
 
  return (
    <div>
      <Login isSignInPage={isSigninPage} />
    </div>
  )
}

export default Auth