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
      ssoHost: "http://172.16.110.76", // {**REQUIRED**} Socket Address
      ssoGrantDevicesAddress: "/oauth2/grants/devices", // {**REQUIRED**} Socket Address
      serverName: "chat-server", // {**REQUIRED**} Server to to register on
      token: null, // {**REQUIRED**} SSO Token Zamani
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
    this.onThreadEvents = props.onThreadEvents;
    this.onMessageEvents = props.onMessageEvents;
    this.onChatReady = props.onChatReady;
    this._onMessageEvents();
    this._onThreadEvents();
    this._onChatReady();
  }

  _onThreadEvents() {
    this.chatAgent.on("threadEvents", res => {
      this.onThreadEvents(res.result.thread, res.type);
    });
  }

  _onMessageEvents() {
    this.chatAgent.on("messageEvents", (msg) => {
      this.onMessageEvents(msg.result.message, msg.type);
    });
  }

  _onChatReady() {
    this.chatAgent.on("chatReady", e => {
      this.onChatReady(this);
      this.getContactList()
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
  getThreadMessageList(resolve, reject, threadId, offset) {
    const getThreadHistoryParams = {
      count: 50,
      offset: offset || 0,
      threadId: threadId
    };
    this.chatAgent.getHistory(getThreadHistoryParams, function (result) {
      if (!errorHandling(result, reject)) {
        for (let history of result.result.history) {
          history.threadId = threadId;
        }
        return resolve({
          messages: result.result.history,
          messagesCount: result.result.contentCount,
          hasNext: result.result.hasNext
        });
      }
    });
  }

  @promiseDecorator
  getThreads(resolve, reject, threadIds) {
    let getThreadsParams = {
      count: 50,
      offset: 0
    };
    if (threadIds) {
      getThreadsParams = {...getThreadsParams, threadIds};
    }

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
  editMessage(resolve, reject, content, threadId) {
    const sendChatParams = {
      threadId,
      content
    };

    this.chatAgent.editMessage(sendChatParams, {
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
  seenMessage(resolve, reject, messageId, ownerId) {
    this.chatAgent.seen({messageId, ownerId}, function (result) {
      if (!errorHandling(result, reject)) {
        return resolve(result);
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

  @promiseDecorator
  getThreadInfo(resolve, reject, threadId) {
    this.getThreads([threadId]).then(result => {
      if (!errorHandling(result, reject)) {
        return resolve(result[0]);
      }
    })
  }

  @promiseDecorator
  addContact(resolve, reject, cellphoneNumber, firstName, lastName, email) {
    const addContactParams = {
      firstName,
      lastName,
      cellphoneNumber,
      email
    };
    this.chatAgent.addContacts(addContactParams, function (result) {
      if (!errorHandling(result, reject)) {
        return resolve(result.result.contacts[0]);
      }
    });
  }


  @promiseDecorator
  getContactList(resolve, reject, name) {
    const getContactsParams = {
      count: 50,
      offset: 0
    };

    if (typeof name === "string") {
      getContactsParams.name = name;
    }
    this.chatAgent.getContacts(getContactsParams, function(result) {
      if (!errorHandling(result, reject)) {
        return resolve(result.result.contacts);
      }
    });
  }



};