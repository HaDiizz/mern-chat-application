import { PEER } from "../types";

const peerReducer = (state = null, action) => {
  switch (action.type) {
    case PEER:
      return action.payload;
    default:
      return state;
  }
};

export default peerReducer;