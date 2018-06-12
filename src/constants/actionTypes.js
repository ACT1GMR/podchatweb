// src/js/constants/actionTypes.js
const buildPromiseMessage = (base, type) =>{
  if(!type) {
    return base;
  }
  if(type === "ERROR") {
    return `${base}_REJECTED`;
  }
  if(type === "FETCHED") {
    return `${base}_FULFILLED`;
  }
  if(type === 'PENDING'){
    return `${base}_PENDING`;
  }
};

export const SEND_MESSAGE = buildPromiseMessage.bind(null, "SEND_MESSAGE");
export const GET_CONTACT_LIST = buildPromiseMessage.bind(null, "GET_CONTACT_LIST");
export const GET_THREAD_MESSAGE_LIST = buildPromiseMessage.bind(null, "GET_THREAD_MESSAGE_LIST");
export const CREATE_THREAD = buildPromiseMessage.bind(null, "CREATE_THREAD");