import { combineReducers } from "redux";
import auth from "./authReducer";
import peer from "./peerReducer";
import socket from "./socketReducer";
import online from './onlineReducer'

export default combineReducers({
  auth,
  peer,
  socket,
  online
});