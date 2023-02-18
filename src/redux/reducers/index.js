import { combineReducers } from "redux";
import auth from "./authReducer";
import peer from "./peerReducer";
import socket from "./socketReducer";
import online from './onlineReducer'
import theme from "./themeReducer";
import alert from './alertReducer'
import call from "./callReducer";

export default combineReducers({
  auth,
  peer,
  socket,
  online,
  theme,
  alert,
  call
});