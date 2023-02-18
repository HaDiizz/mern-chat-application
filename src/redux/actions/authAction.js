import { postDataAPI } from '../../utils/fetchData';
import { AUTH, ALERT } from '../types';
import { imageUpload } from '../../utils/imageUpload';

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } });
    const res = await postDataAPI('login', data);

    dispatch({
      type: AUTH,
      payload: { token: res.data.access_token, user: res.data.user },
    });
    localStorage.setItem('firstLogin', true);

    dispatch({ type: ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem('firstLogin');
  if (firstLogin) {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await postDataAPI('refresh_token');
      dispatch({
        type: AUTH,
        payload: { token: res.data.access_token, user: res.data.user },
      });

      dispatch({ type: ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  }
};

export const register = (data) => async (dispatch) => {
  try {
    const { avatar } = data;
    let media;

    if (avatar) media = await imageUpload([avatar]);
    dispatch({ type: ALERT, payload: { loading: true } });
    const res = await postDataAPI('register', {
      ...data,
      avatar: avatar ? media[0].url : '',
    });
    dispatch({
      type: AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem('firstLogin', true);
    dispatch({
      type: ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem('firstLogin');
    await postDataAPI('logout');
    await dispatch({ type: ALERT, payload: { success: 'Logout Success' } });
    // window.location.href = '/';
  } catch (err) {
    dispatch({
      type: ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};
