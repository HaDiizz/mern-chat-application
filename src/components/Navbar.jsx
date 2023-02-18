import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { setTheme } from '../redux/reducers/themeReducer';
import { BsSun, BsMoonStarsFill } from 'react-icons/bs';

const Navbar = () => {
  const { auth } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <>
      <div className='pt-5 place-content-center sm:place-content-end flex gap-8'>
        {auth.user ? (
          <>
            <div className='form-check form-switch m-2' style={{ zIndex: '1' }}>
              {theme === 'dark' ? (
                <BsMoonStarsFill
                  style={{ cursor: 'pointer', color: 'yellow' }}
                  onClick={() =>
                    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
                  }
                />
              ) : (
                <BsSun
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
                  }
                />
              )}
              {/* <input
                    id="theme"
                    type="checkbox"
                    className="form-check-input"
                    style={{cursor: "pointer"}}
                    checked={theme === 'dark' ? true : false}
                    onChange={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
                  />
                  <label htmlFor="dark-mode">{theme === 'dark' ? 'Dark' : 'Light'}</label> */}
            </div>
            <img
              className='medium-avatar'
              src={auth.user.avatar}
              alt='avatar'
              style={{ zIndex: '1' }}
            />
            <p style={{ zIndex: '1' }}>{auth.user.username}</p>
            <span
              style={{ zIndex: '1', cursor:'pointer' }}
              onClick={async () => {
                await dispatch(logout());
                window.location.href = '/';
              }}
              className='text-red-500 mr-5'
            >
              Logout
            </span>
          </>
        ) : (
          <button style={{zIndex: "1"}}>Login</button>
        )}
      </div>
    </>
  );
};

export default Navbar;
