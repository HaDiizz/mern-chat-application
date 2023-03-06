import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux'

const Signup = () => {
  const dispatch = useDispatch()
  const initialState = {
    username: '',
    password: '',
    avatar: ''
  }
  const [userData, setUserData] = useState(initialState)
  const [notify, setNotify] = useState("")
  const { username, password } = userData
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    setUserData({
      ...userData,
      avatar: file
    })
    if (file.size > 1024 * 1024) {
      setNotify("ไฟล์เกินขนาด 1 MB")
      return ;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setNotify("อนุญาตเฉพาะไฟล์ jpeg/png เท่านั้น")
      return
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setNotify("กรอกข้อมูลให้ครบก่อนจ้า")
      return;
    }
    dispatch(register(userData))
    return;
  };

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  return (
    <div className='h-screen w-full flex flex-wrap justify-center'>
    <div className='flex flex-col items-center justify-center' style={{zIndex: "1"}}>
      <h1 className='text-4xl uppercase'>Sign Up</h1><br/>
      <form onSubmit={handleSubmit}>
        {notify}
        <div className='form-group'>
          <label>Username</label>
          <input
            className='form-control'
            type='text'
            placeholder='Username'
            required
            name='username'
            onChange={handleChangeInput}
          />
        </div><br/>
        <div className='form-group'>
          <label>Password</label>
          <input
            className='form-control'
            type='password'
            placeholder='Password'
            name='password'
            required
            onChange={handleChangeInput}
          /><br/>
        </div>
        <div className='form-group'>
          <label>Avatar</label>
          <input
            className='form-control'
            type='file'
            // required
            accept="image/*"
            onChange={handleUploadAvatar}
          /><br/>
        </div>
        <div className='form-group'>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='btn text-white bg-neutral-800 hover:text-white hover:bg-neutral-500'
            >
              Sign Up
            </button>
          </div>

          <p className='my-3'>
           Have an account already?
            <Link
              style={{
                color: 'orange',
                paddingLeft: '5px',
                textDecoration: 'none',
              }}
              to='/login'
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Signup