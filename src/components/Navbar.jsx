import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';

const Navbar = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <>
      <div className='pt-5 place-content-center sm:place-content-end flex gap-8'>
        {auth.user ? (
          <>
            <img
              className='medium-avatar'
              src={auth.user.avatar}
              alt='avatar'
            />
            <p>{auth.user.username}</p>
            <button
              onClick={() => dispatch(logout())}
              className='btn btn-danger uppercase'
            >
              Logout
            </button>
          </>
        ) : (
          <button>Login</button>
        )}
      </div>
    </>
  );
};

export default Navbar;
