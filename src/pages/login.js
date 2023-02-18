import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch()
  const initialState = {
    username: '',
    password: '',
  };
  const [userData, setUserData] = useState(initialState);
  const { username, password } = userData;
  const [notify, setNotify] = useState("")
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setNotify("กรอกข้อมูลให้ครบก่อนจ้า")
      return;
    }
    dispatch(login(userData))
    return;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  return (
    <div className='h-screen w-full flex flex-wrap justify-center gap-x-10'>
      <div className='flex flex-col items-center justify-center' style={{zIndex: "1"}}>
        <h1 className='text-4xl uppercase'>Login</h1><br/>
        <form onSubmit={handleSubmit}>
          {notify}
          <div className='form-group'>
            <label>Username</label>
            <input
              className='form-control'
              name="username"
              type='text'
              placeholder='Username'
              required
              onChange={handleChangeInput}
            />
          </div><br/>
          <div className='form-group'>
            <label>Password</label>
            <input
              className='form-control'
              name="password"
              type='password'
              placeholder='Password'
              required
              onChange={handleChangeInput}
            /><br/>
          </div>
          <div className='form-group'>
            <div className='flex justify-center'>
            <button
              type='submit'
              className='btn text-white bg-neutral-800 hover:text-white hover:bg-neutral-500'
            >
              Login
            </button>
            </div>

            <p className='my-3'>
              Not sign up yet?
              <Link
                style={{
                  color: 'blue',
                  paddingLeft: '5px',
                  textDecoration: 'none',
                }}
                to='/signup'
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
