import { ONLINE, OFFLINE, UPDATE_USER_ACTIVE_DATE } from "../types";

const onlineReducer = (state = [], action) => {
  switch (action.type) {
    case ONLINE:
      return [...state, action.payload];
    case OFFLINE:
      return state.filter(item => item.id !== action.payload)
    case UPDATE_USER_ACTIVE_DATE:
      return state.map(data => {
        let newData = {...data};
        newData.activeDate = action.payload;
        return newData;
      });
    default:
      return state;
  }
};

export default onlineReducer;