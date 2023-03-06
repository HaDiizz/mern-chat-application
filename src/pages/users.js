import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDataAPI } from '../utils/fetchData';

const Users = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth.token && auth.user.role !== 'admin') return navigate('/');
  }, [auth.token, auth.user.role, navigate]);

  useEffect(() => {
    const fetchDataUsers = async () => {
      const res = await getDataAPI('users', auth.token);
      setUsers(res.data.users);
    };
    fetchDataUsers();
  }, [auth.token]);

  return (
    <div className='pt-5 container'>
      <h1
        className='text-2xl uppercase text-secondary pb-5 text-center tracking-widest'
        style={{ zIndex: '1', position: 'relative' }}
      >
        Users
      </h1>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <span
          className='btn btn-primary flex'
          onClick={async () => {
            await navigate('/');
            await navigate(0);
          }}
        >
          Back
        </span>
      </div>
      <div className='table-responsive pt-3'>
        <table
          className='table dark:text-white'
          style={{ zIndex: '1', position: 'relative' }}
        >
          <thead>
            <tr>
              <th scope='col'>Avatar</th>
              <th scope='col'>Username</th>
              <th scope='col'>Role</th>
              <th scope='col'>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users?.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.avatar}
                      className='medium-avatar'
                      alt='avatar'
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <span className='badge rounded-pill text-bg-danger'>
                        {user.role}
                      </span>
                    ) : (
                      <span className='badge rounded-pill text-bg-success'>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>{user.createdAt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
