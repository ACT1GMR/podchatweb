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
    this.onFileUploadEvents = props.onFileUploadEvents;
    this.onChatReady = props.onChatReady;
    this.onChatState = props.onChatState;
    this.onChatError = props.onChatError;
    this._onMessageEvents();
    this._onThreadEvents();
    this._onFileUploadEvents();
    this._onChatReady();
    this._onChatState();
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

  _onFileUploadEvents() {
    this.chatAgent.on("fileUploadEvents", (msg) => {
      this.onFileUploadEvents(msg);
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

  _onChatState() {
    this.chatAgent.on("chatState", e => {
      this.onChatState(e);
    });
  }

  _onChatError() {
    this.chatAgent.on("error", (response) => {
      if (this.onChatError) {
        this.onChatError(response.error);
      }
    });
  }

  setToken(token) {
    this.chatAgent.setToken(token);
  }

  reconnect() {
    this.chatAgent.reconnect();
  }

  @promiseDecorator
  createThread(resolve, reject, params, threadName, idType) {
    let invitees = [{"id": params, "idType": idType || "TO_BE_USER_CONTACT_ID"}];
    const isGroup = params instanceof Array;
    if (isGroup) {
      invitees = [];
      for (const param of params) {
        invitees.push({"id": param, "idType": idType || "TO_BE_USER_CONTACT_ID"})
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
  getMessageById(resolve, reject, threadId, id) {
    this.chatAgent.getHistory({threadId, id}, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.history[0]);
      }
    });
  }

  @promiseDecorator
  getThreadMessageListByQuery(resolve, reject, threadId, query, count) {
    if (typeof query === "string" && !query.slice()) {
      return resolve({
        messages: [],
        threadId: threadId,
        messagesCount: 0,
        hasNext: false,
        reset: true
      });
    }

    const getThreadHistoryParams = {
      count: count || 50,
      order: "ASC",
      query: query,
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
  getThreadMessageList(resolve, reject, threadId, offset, count) {
    const getThreadHistoryParams = {
      count: 50,
      offset: offset || 0,
      threadId: threadId
    };
    this.chatAgent.getHistory(getThreadHistoryParams, (result) => {
      if (!this._onError(result, reject)) {
        const rslt = result.result;
        rslt.failed.forEach(item => {
          item.participant = this.user;
          item.hasError = true
        });
        return resolve({
          messages: rslt.history.concat(rslt.failed.concat(rslt.sending.concat(rslt.uploading))),
          threadId: threadId,
          messagesCount: rslt.contentCount,
          hasPrevious: rslt.hasNext,
          hasNext: false
        });
      }
    });
  }

  @promiseDecorator
  getThreadMessageListPartial(resolve, reject, threadId, messageTime, loadAfter, count) {
    const getThreadHistoryParams = {
      count: count || 50,
      threadId: threadId,
      toTimeFull: messageTime
    };
    if (loadAfter) {
      getThreadHistoryParams.fromTimeFull = messageTime;
      getThreadHistoryParams.order = "ASC";
      delete getThreadHistoryParams.toTimeFull;
    }
    this.chatAgent.getHistory(getThreadHistoryParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({
          messages: loadAfter ? result.result.history.reverse() : result.result.history,
          threadId: threadId,
          messagesCount: result.result.contentCount,
          hasNext: loadAfter ? result.result.hasNext : null,
          hasPrevious: loadAfter ? null : result.result.hasNext
        });
      }
    });
  }

  @promiseDecorator
  getThreadMessageListByMessageId(resolve, reject, threadId, messageTime) {
    let baseGetThreadHistoryParams = {
      count: 50,
      threadId: threadId
    };

    let historyMessageArray = [];
    this.getThreadMessageListPartial(threadId, messageTime, true, 25).then(result => {
      historyMessageArray = [...historyMessageArray, ...result.messages];
      const hasNext = result.hasNext;
      this.getThreadMessageListPartial(threadId, messageTime, false, 25).then(result => {
        historyMessageArray = [...historyMessageArray, ...result.messages];
        resolve({...result, ...{messages: historyMessageArray, hasNext, hasPrevious: result.hasPrevious}});
      }, reject);
    }, reject);
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

    const obj = this.chatAgent.sendTextMessage(sendChatParams, {
      onSent: (result) => {
        this._onError(result, reject);
      }
    });
    resolve({
      ...obj, ...{
        participant: this.user,
        time: Date.now() * Math.pow(10, 6),
        message: content,
        newMessage: true
      }
    })
  }

  @promiseDecorator
  sendFileMessage(resolve, reject, file, threadId, caption) {
    const sendChatParams = {
      threadId,
      file
    };
    if (caption) {
      sendChatParams.content = caption;
    }
    const obj = this.chatAgent.sendFileMessage(sendChatParams, {
      onSent: result => {
        this._onError(result, reject);
      }
    });
    resolve({
      ...obj, ...{
        newMessage: true,
        message: caption,
        fileUniqueId: obj.content.file.uniqueId,
        time: Date.now() * Math.pow(10, 6),
        metadata: {
          file: {
            mimeType: file.type,
            originalName: file.name,
            link: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            size: file.size
          }
        }
      }
    })
  }

  @promiseDecorator
  cancelFileUpload(resolve, reject, uniqueId, threadId) {
    const cancelFileUploadParams = {
      uniqueId,
      threadId
    };
    resolve(cancelFileUploadParams);
    this.chatAgent.cancelFileUpload(cancelFileUploadParams);
  }

  @promiseDecorator
  uploadImage(resolve, reject, image, threadId) {
    const params = {
      image: image,
      threadId
    };
    this.chatAgent.uploadImage(params, result => {
      if (!this._onError(result, reject)) {
        const image = result.result;
        resolve(`${this.params.fileServer}/nzh/image?imageId=${image.id}&hashCode=${image.hashCode}`);
      }
    });
  }

  @promiseDecorator
  updateThreadInfo(resolve, reject, customparams, threadId) {
    const params = {
      threadId,
      ...customparams
    };
    this.chatAgent.updateThreadInfo(params, result => {
      if (!this._onError(result, reject)) {
        return resolve(result);
      }
    });
  }

  @promiseDecorator
  renameThread(resolve, reject, newName, threadId) {
    const params = {
      title: newName,
      threadId
    };
    this.chatAgent.renameThread(params, result => {
      if (!this._onError(result, reject)) {
        return resolve();
      }
    });
  }

  @promiseDecorator
  muteThread(resolve, reject, threadId, mute) {
    const params = {
      subjectId: threadId
    };
    this.chatAgent[mute ? "muteThread" : "unMuteThread"](params, result => {
      if (!this._onError(result, reject)) {
        return resolve(threadId);
      }
    });
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
  deleteMessage(resolve, reject, messageId, deleteForAll) {
    const deleteMessageParams = {
      messageId,
      deleteForAll
    };
    this.chatAgent.deleteMessage(deleteMessageParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }

  @promiseDecorator
  forwardMessage(resolve, reject, threadId, messageId) {
    const sendChatParams = {
      subjectId: threadId,
      content: JSON.stringify(messageId instanceof Array ? messageId : [messageId])
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
  seenMessage(resolve, reject, messageId, ownerId, threadId) {
    resolve({messageId, threadId});
    this.chatAgent.seen({messageId, ownerId}, (result) => {
      this._onError(result, reject)
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
  blockContact(resolve, reject, threadId, block) {
    const blockContactParam = {
      threadId,
    };
    this.chatAgent[block ? "block" : "unblock"](blockContactParam, (result) => {
      if (!this._onError(result, reject)) {
        return resolve();
      }
    });
  }

  @promiseDecorator
  getBlockList(resolve, reject) {
    const getContactsParams = {
      count: 50,
      offset: 0
    };
    this.chatAgent.getBlocked(getContactsParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.blockedUsers);
      }
    });
  }

  @promiseDecorator
  removeContact(resolve, reject, contactId) {
    const removeContactParam = {id: contactId};
    this.chatAgent.removeContacts(removeContactParam, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }

  @promiseDecorator
  unblockContact(resolve, reject, blockId) {
    const unblockContactParam = {blockId};
    this.chatAgent.unblock(unblockContactParam, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }


  @promiseDecorator
  leaveThread(resolve, reject, threadId) {
    const leaveThreadParam = {threadId};
    this.chatAgent.leaveThread(leaveThreadParam, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }

  @promiseDecorator
  spamPvThread(resolve, reject, threadId) {
    const reportSpamPv = {threadId};
    this.chatAgent.spamPvThread(reportSpamPv, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
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
        this.getBlockList(getContactsParams).then(blockedResult => {
          return resolve(result.result.contacts.concat(blockedResult));
        });
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
  getMessageSeenList(resolve, reject, messageId) {
    const params = {
      messageId
    };

    this.chatAgent.getMessageSeenList(params, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
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
        return resolve(result.result.thread.participants);
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
        return resolve(participants);
      }
    });
  }


};