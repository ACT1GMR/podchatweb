// src/actions/index.js
import { ADD_ARTICLE } from "../constants/action-types";
import chatSDKWrapper from "../utils/chat-sdk-wrapper";

export const sendMessageService = article => {
  chatSDKWrapper.sendMessage(messageSent)
};

export const messageSent = article => {
  chatSDKWrapper.sendMessage()
};
