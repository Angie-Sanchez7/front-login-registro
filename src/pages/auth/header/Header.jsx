import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserLink from './UserLink'
import logo from '../../../assets/logos/programateLogo.png'
import './Header.css'

function Header () {
  const auth = useSelector(state => state.auth)

  const { user, isLogged } = auth

  const handleLogout = async () => {
    try {
      localStorage.removeItem('firstLogin')
      localStorage.removeItem('loggedAgoraUser')
      window.location.href = '/'
    } catch (err) {
      window.location.href = '/'
    }
  }

  const transForm = {
    transform: isLogged ? 'translateY(-5px)' : 0
  }

  return (
    <header className='header-login'>
      <img className='logo-header-login' src={logo} alt='logo' />

      <ul style={transForm}>
        {isLogged ? (
          <UserLink user={user} handleLogout={handleLogout} />
        ) : (
          <li>
            <Link to='/login'>
              <i className='fas fa-user icon-signIn'></i> Sign in
            </Link>
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header
