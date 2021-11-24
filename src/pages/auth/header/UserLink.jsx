import { Link } from 'react-router-dom'

const UserLink = ({ user, handleLogout }) => {
  return (
    <li className='container-menu-headerLogin'>
      <Link to='#' className='avatar'>
        <img src={user.avatar} alt='' /> {user.name}{' '}
        <i className='fas fa-angle-down'></i>
      </Link>
      <ul className='container-menu-links'>
        <li>
          <Link className='link-profile' to='/profile'>
            Profile
          </Link>
        </li>
        <li>
          <Link className='link-logOut' to='/' onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </li>
  )
}

export default UserLink
