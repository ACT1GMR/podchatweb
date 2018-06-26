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
      token: ~navigator.userAgent.indexOf('Firefox') ? "fc602b4caf7742398239d38832e27cf6" : "658dcf43c0434638a6a36ad0fe9d8d3d", // {**REQUIRED**} SSO Token Zamani
      wsConnectionWaitTime: 500, // Time out to wait for socket to get ready after open
      connectionRetryInterval: 5000, // Time interval to retry registering device or registering server
      connectionCheckTimeout: 90000, // Socket connection live time on server
      connectionCheckTimeoutThreshold: 20000, // Socket Ping time threshold
      messageTtl: 10000, // Message time to live
      reconnectOnClose: true, // auto connect to socket after socket close
      asyncLogging: {
        onFunction: true, // log main actions on console
        // onMessageReceive: true, // log received messages on console
        // onMessageSend: true // log sent messaged on console
      },
      ...props.config
    };
    this.chatAgent = new PodChat(params);
    this.onNewThread = props.onNewThread;
    this.onMessage = props.onMessage;
    this.onChatReady = props.onChatReady;
    this._onMessage();
    this._onNewThread();
    this._onChatReady();
  }

  _onNewThread() {
    this.chatAgent.on("newThread", e => {
      this.onNewThread(e);
    });
  }

  _onMessage() {
    this.chatAgent.on("message", (msg) => {
      const params = {
        messageId: msg.messageId,
        owner: msg.owner
      };
      this.onMessage(msg);
    });
  }

  _onChatReady() {
    this.chatAgent.on("chatReady", e => {
      this.onChatReady(this)
    });
  }


  @promiseDecorator
  getContactList(resolve, reject, params) {
    const getContactsParams = {
      count: 50,
      offset: 0
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
      threadId: params
    };
    this.chatAgent.getHistory(getThreadHistoryParams, function (result) {
      if (!errorHandling(result, reject)) {
        for(let history of result.result.history) {
          history.threadId = params;
        }
        return resolve(result.result.history);
      }
    });
  }

  @promiseDecorator
  getThreads(resolve, reject) {
    const getThreadsParams = {
      count: 50,
      offset: 0
    };
    this.chatAgent.getThreads(getThreadsParams, function (result) {
      if (!errorHandling(result, reject)) {
        return resolve(result.result.threads);
      }
    });
  }

  @promiseDecorator
  sendMessage(resolve, reject, content, threadId) {
    const sendChatParams = {
      threadId,
      content
    };

    this.chatAgent.sendTextMessage(sendChatParams, {
      onSent: function (result) {
        if (!errorHandling(result, reject)) {
          return resolve({
            result, ...{
              message: content, participant: {}
            }
          });
        }
      }
    });
  }

  @promiseDecorator
  getUserInfo(resolve, reject) {
    this.chatAgent.getUserInfo((result) => {
      if (!errorHandling(result, reject)) {
        return resolve(result.result.user);
      }
    });
  }

};