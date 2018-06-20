// src/actions/messageActions.js
import {GET_USER} from "../constants/actionTypes";

export const getUser = (chatSDK) => {
  return (dispatch) => {
    dispatch({
      type: GET_USER(),
      payload: chatSDK.getUserInfo()
    });
  }
};
