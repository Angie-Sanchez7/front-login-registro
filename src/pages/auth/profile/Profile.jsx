import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { isLength, isMatch } from '../../../utils/validation'
import { showSuccessMsg, showErrMsg } from '../../../utils/notification'
import {
  fetchAllUsers,
  dispatchGetAllUsers
} from '../../../redux/actions/usersAction'
import { Input } from '../../../componentes/input/Input'
import './Profile.css'
const initialState = {
  name: '',
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

function Profile () {
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)

  const users = useSelector(state => state.users)

  const { user, isAdmin } = auth
  const [data, setData] = useState(initialState)
  const { name, password, cf_password, err, success } = data

  const [avatar, setAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [callback, setCallback] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then(res => {
        dispatch(dispatchGetAllUsers(res))
      })
    }
  }, [token, isAdmin, dispatch, callback])

  const handleChange = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const changeAvatar = async e => {
    e.preventDefault()
    try {
      const file = e.target.files[0]

      if (!file)
        return setData({ ...data, err: 'No files were uploaded.', success: '' })

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: 'Size too large.', success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setData({
          ...data,
          err: 'File format is incorrect.',
          success: ''
        })

      let formData = new FormData()
      formData.append('file', file)

      setLoading(true)
      const res = await axios.post('/api/upload_avatar', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })

      setLoading(false)
      setAvatar(res.data.url)
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const updateInformation = () => {
    try {
      axios.patch(
        'http://localhost:3005/api/update',
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar
        },
        {
          headers: { Authorization: token }
        }
      )

      setData({ ...data, err: '', success: 'Updated Success!' })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: 'La contrase??a debe tener al menos 6 caracteres',
        success: ''
      })

    if (!isMatch(password, cf_password))
      return setData({
        ...data,
        err: 'Las contrase??as no coinciden',
        success: ''
      })

    try {
      axios.post(
        'http://localhost:3005/api/reset',
        { password },
        {
          headers: { Authorization: token }
        }
      )

      setData({ ...data, err: '', success: 'Actualizacion exitosa!' })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const handleUpdate = () => {
    if (name || avatar) updateInformation()
    if (password) updatePassword()
  }

  const handleDelete = async id => {
    try {
      if (user._id !== id) {
        if (window.confirm('Are you sure you want to delete this account?')) {
          setLoading(true)
          await axios.delete(`http://localhost:3005/api/delete/${id}`, {
            headers: { Authorization: token }
          })
          setLoading(false)
          setCallback(!callback)
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  return (
    <>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      {loading && <h3>Loading.....</h3>}
      <div className='container-all-information'>
        <div className='container-main-profile'>
          <div className='container-profile'>
            <h2 className='title-profile'>
              {isAdmin ? 'PERFIL ADMINISTRADOR' : 'PERFIL USUARIO'}
            </h2>

            <div className='container-image'>
              <img
                className='profile-image'
                src={avatar ? avatar : user.avatar}
                alt=''
              />
              <input
                type='file'
                name='file'
                id='file_up'
                onChange={changeAvatar}
              />
            </div>
            <div className='container-info-profile'>
              <div className='form-group'>
                <Input
                  label='Nombre'
                  placeholder='Tu nombre'
                  name='name'
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
              <div className='form-group'>
                <Input
                  label='Email'
                  placeholder='Tu email'
                  name='email'
                  value={user.email}
                  disabled
                />
              </div>
              <div className='form-group'>
                <Input
                  type='password'
                  label='Nueva contrase??a'
                  placeholder='Tu password'
                  name='password'
                  value={password}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className='form-group'>
                <Input
                  type='password'
                  label='Confirmar contrase??a'
                  placeholder='Tu password'
                  name='cf_password'
                  value={cf_password}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
            <button
              className='profile-button-update'
              disabled={loading}
              onClick={handleUpdate}
            >
              Actualizar
            </button>
          </div>

          {isAdmin ? (
            <div className='container-main-admin'>
              <div className='container-info-admin table-responsive'>
                <h2 className='title-profile-user'>USUARIOS</h2>
                <table className='table-info-students table table-striped table-responsive'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NOMBRE</th>
                      <th>CORREO ELECTRONICO</th>
                      <th>ADMIN</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.role === 1 ? (
                            <i className='fas fa-check' title='Admin'></i>
                          ) : (
                            <i className='fas fa-times' title='User'></i>
                          )}
                        </td>
                        <td>
                          <Link to={`/edit_user/${user.id}`}>
                            <i
                              className='fas fa-edit icon-edit'
                              title='Edit'
                            ></i>
                          </Link>
                          <i
                            className='fas fa-trash-alt'
                            title='Remove'
                            onClick={() => handleDelete(user.id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to='/create_user'>
                  <button
                    className='profile-button-createUser'
                    disabled={loading}
                    onClick={handleUpdate}
                  >
                    Crear usuario
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
