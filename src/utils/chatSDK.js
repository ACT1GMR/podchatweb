import PodChat from "podchat";
import {promiseDecorator} from "./decorators";

const errorCodes = {
  CLIENT_NOT_AUTH: 21,
  CLIENT_UNAUTHORIZED: 6200
};
export default class ChatSDK {

  constructor(props) {
    this.params = {
      socketAddress: props.config.local ? "ws://172.16.106.26:8003/ws" : "wss://chat-sandbox.pod.land/ws", // {**REQUIRED**} Socket Address
      ssoHost: props.config.local ? "http://172.16.110.76" : "https://accounts.pod.land", // {**REQUIRED**} Socket Address
      ssoGrantDevicesAddress: "/oauth2/grants/devices", // {**REQUIRED**} Socket Address
      platformHost: props.config.local ? "http://172.16.106.26:8080/hamsam" : "https://sandbox.pod.land:8043/srv/basic-platform", // {**REQUIRED**} Platform Core Address
      fileServer: "https://sandbox.pod.land:8443", // {**REQUIRED**} File Server Address
      serverName: "chat-server", // {**REQUIRED**} Server to to register on
      token: null, // {**REQUIRED**} SSO Token Zamani
      wsConnectionWaitTime: 500, // Time out to wait for socket to get ready after open
      connectionRetryInterval: 5000, // Time interval to retry registering device or registering server
      connectionCheckTimeout: 10000, // Socket connection live time on server
      messageTtl: 10000, // Message time to live
      reconnectOnClose: true, // auto connect to socket after socket close
      asyncLogging: {
        onFunction: true, // log main actions on console
        // onMessageReceive: true, // log received messages on console
        // onMessageSend: true // log sent messaged on console
      },
      ...props.config
    };
    this.user = null;
    this.chatAgent = new PodChat(this.params);
    this.onThreadEvents = props.onThreadEvents;
    this.onMessageEvents = props.onMessageEvents;
    this.onChatReady = props.onChatReady;
    this._onMessageEvents();
    this._onThreadEvents();
    this._onChatReady();
    this._onChatError();
  }

  _onError(response, reject) {
    if (response.hasError) {
      const onTokenExpire = this.params.onTokenExpire;
      if (onTokenExpire) {
        if (response.errorCode === errorCodes.CLIENT_NOT_AUTH || response.errorCode === errorCodes.CLIENT_UNAUTHORIZED) {
          onTokenExpire();
        }
      }
      if (reject) {
        return reject(response.errorMessage);
      }
    }
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
      this.getContactList();
      const {onTokenExpire, expireTokenTimeOut} = this.params;
      if (onTokenExpire) {
        setInterval(e => {
          onTokenExpire();
        }, expireTokenTimeOut || (1000 * 60 * 10));
      }
    });
  }

  _onChatError() {
    this.chatAgent.on("error", (response) => {
      this._onError(response.error);
    });
  }

  setToken(token) {
    this.chatAgent.setToken(token);
  }

  updateToken(token) {
    this.chatAgent.setToekn(token);
  }

  @promiseDecorator
  createThread(resolve, reject, params, threadName) {
    let invitees = [{"id": params, "idType": "TO_BE_USER_CONTACT_ID"}];
    const isGroup = params instanceof Array;
    if (isGroup) {
      invitees = [];
      for (const param of params) {
        invitees.push({"id": param, "idType": "TO_BE_USER_CONTACT_ID"})
      }
    }
    const createThreadParams = {
      type: isGroup ? "OWNER_GROUP" : "NORMAL",
      invitees
    };
    if (threadName) {
      createThreadParams.title = threadName;
    }
    this.chatAgent.createThread(createThreadParams);
  }

  @promiseDecorator
  getThreadMessageList(resolve, reject, threadId, offset) {
    const getThreadHistoryParams = {
      count: 50,
      offset: offset || 0,
      threadId: threadId
    };
    this.chatAgent.getHistory(getThreadHistoryParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({
          messages: result.result.history,
          threadId: threadId,
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
    this.chatAgent.getThreads(getThreadsParams, (result) => {
      if (!this._onError(result, reject)) {
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

    const uniqueId = this.chatAgent.sendTextMessage(sendChatParams, {
      onSent: (result) => {
        this._onError(result, reject);
      }
    });
    resolve({
      ...uniqueId, ...{
        threadId,
        message: content,
        participant: this.user
      }
    })
  }

  @promiseDecorator
  sendFileMessage(resolve, reject, file, threadId) {
    const sendChatParams = {
      threadId,
      file,
      uniqueId: Math.random().toString(36).substring(7)
    };

    const uniqueId = this.chatAgent.sendFileMessage(sendChatParams, {
      onSent: result => {
        this._onError(result, reject);
      }
    });
    resolve({
      ...{uniqueId}, ...{
        threadId,
        type: "file",
        participant: this.user,
        metaData: {
          file:{
            mimeType: file.type,
            originalName: file.name,
            link: URL.createObjectURL(file),
            size: file.size
          }
        }
      }
    })
  }

  @promiseDecorator
  editMessage(resolve, reject, content, messageId) {
    const sendChatParams = {
      messageId,
      content
    };
    this.chatAgent.editMessage(sendChatParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({
          result, ...{
            message: content, participant: {}
          }
        });
      }
    });
  }

  @promiseDecorator
  forwardMessage(resolve, reject, threadId, messageId) {
    const sendChatParams = {
      subjectId: threadId,
      content: JSON.stringify([messageId])
    };
    this.chatAgent.forwardMessage(sendChatParams, {
      onSent() {

      }
    });
  }

  @promiseDecorator
  replyMessage(resolve, reject, content, repliedTo, threadId) {
    const sendChatParams = {
      threadId,
      repliedTo,
      content
    };
    this.chatAgent.replyMessage(sendChatParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({
          result, ...{
            message: content, participant: {}
          }
        });
      }
    });
  }

  @promiseDecorator
  seenMessage(resolve, reject, messageId, ownerId) {
    this.chatAgent.seen({messageId, ownerId}, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result);
      }
    });
  }

  @promiseDecorator
  getUserInfo(resolve, reject) {
    this.chatAgent.getUserInfo((result) => {
      if (!this._onError(result, reject)) {
        this.user = result.result.user;
        return resolve(result.result.user);
      }
    });
  }

  @promiseDecorator
  getThreadInfo(resolve, reject, threadId) {
    this.getThreads([threadId]).then(result => {
      if (!this._onError(result, reject)) {
        return resolve(result[0]);
      }
    })
  }

  @promiseDecorator
  addContact(resolve, reject, cellphoneNumber, firstName, lastName) {
    const addContactParams = {
      firstName,
      lastName,
      cellphoneNumber
    };
    this.chatAgent.addContacts(addContactParams, (result) => {
      if (!this._onError(result, reject)) {
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
    this.chatAgent.getContacts(getContactsParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.contacts);
      }
    });
  }

  @promiseDecorator
  getThreadParticipantList(resolve, reject, threadId) {
    const getParticipantsParams = {
      count: 50,
      offset: 0,
      threadId
    };

    this.chatAgent.getThreadParticipants(getParticipantsParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.participants);
      }
    });
  }

  @promiseDecorator
  addParticipants(resolve, reject, threadId, contacts) {
    const addParticipantParams = {
      threadId,
      contacts
    };

    this.chatAgent.addParticipants(addParticipantParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.thread);
      }
    });
  }

  @promiseDecorator
  removeParticipants(resolve, reject, threadId, participants) {
    const removeParticipantParams = {
      threadId,
      participants
    };

    this.chatAgent.removeParticipants(removeParticipantParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.thread);
      }
    });
  }





};