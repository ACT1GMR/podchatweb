import PodChat from "podchat";
import {promiseDecorator} from "./decorators";

function errorHandling(response, reject) {
  if (response.hasError) {
    if (reject) {
      return reject(response.errorMessage);
    }
  }
}

export default class ChatSDK {

  constructor(props) {
    const params = {
      socketAddress: "ws://172.16.106.26:8003/ws", // {**REQUIRED**} Socket Address
      ssoHost: "172.16.110.76", // {**REQUIRED**} Socket Address
      ssoGrantDevicesAddress: "/oauth2/grants/devices", // {**REQUIRED**} Socket Address
      serverName: "chat-server", // {**REQUIRED**} Server to to register on
      // token: "c0866c4cc5274ea7ada6b01575b19d24", // {**REQUIRED**} SSO Token Zamani
      // token: "afa51d8291dc4072a0831d3a18cb5030", // {**REQUIRED**} SSO Token Barzegar
      // token: "ed4be26a60c24ed594e266a2181424c5",  //  {**REQUIRED**} SSO Token Abedi
      //token: "e4f1d5da7b254d9381d0487387eabb0a",  // {**REQUIRED**} SSO Token Felfeli
      //token: "bebc31c4ead6458c90b607496dae25c6",  // {**REQUIRED**} SSO Token Alexi
      wsConnectionWaitTime: 500, // Time out to wait for socket to get ready after open
      connectionRetryInterval: 5000, // Time interval to retry registering device or registering server
      connectionCheckTimeout: 90000, // Socket connection live time on server
      connectionCheckTimeoutThreshold: 20000, // Socket Ping time threshold
      messageTtl: 5000, // Message time to live
      reconnectOnClose: true, // auto connect to socket after socket close
      consoleLogging: {
        onFunction: true, // log main actions on console
        onMessageReceive: true, // log received messages on console
        onMessageSend: true // log sent messaged on console
      },
      ...props.config
    };
    this.chatAgent = new PodChat(params);
    this.onNewThread = props.onNewThread;
    this.onNewThread = props.onMessage;
    this.onChatReady = props.onChatReady;
    this._onMessage();
    this._onNewThread();
    this._onChatReady();
  }

  _onNewThread() {
    this.chatAgent.on("newThread", e => {

    });
  }

  _onMessage() {
    this.chatAgent.on("message", function (msg) {
      const params = {
        messageId: msg.messageId,
        owner: msg.owner
      };
      callback(params);
    });
  }

  _onChatReady() {
    this.chatAgent.on("chatReady", e => this.onChatReady(this));
  }


  @promiseDecorator
  getContactList(resolve, reject, params) {
    const getContactsParams = {
      count: 50,
      offset: 0,
      params
    };
    this.chatAgent.getContacts(getContactsParams, function (contactsResult) {
      if (!errorHandling(contactsResult, reject)) {
        return resolve(contactsResult.result.contacts);
      }
    });
  }

  @promiseDecorator
  createThread(resolve, reject, params) {
    const createThreadParams = {
      "title": "Thread Title Sample",
      "type": "NORMAL",
      "invitees":
        [{"id": params, "idType": "TO_BE_USER_CONTACT_ID"}]
    };
    this.chatAgent.createThread(createThreadParams);
  }

  @promiseDecorator
  getThreadMessageList(resolve, reject, params) {
    const getThreadHistoryParams = {
      count: 50,
      offset: 0,
      threadId: null,
      ...params
    };
    this.chatAgent.getThreadHistory(getThreadHistoryParams, function (result) {
      if (!errorHandling(result, reject)) {
        return resolve(result.result.history);
      }
    });
  }

  @promiseDecorator
  sendMessage(resolve, reject, params) {
    const sendChatParams = {
      threadId: null,
      content: null,
      ...params
    };

    this.chatAgent.send(sendChatParams, {
      onSent: function (result) {
        if (!errorHandling(result, reject)) {
          return resolve(result);
        }
      }
    });
  }
};