import PodChat from "podchat-browser";
import {promiseDecorator} from "./decorators";
import React from "react";
import {getNow} from "./helpers";
import Cookies from "js-cookie";
import {THREAD_ADMIN} from "../constants/privilege";
import {types} from "../constants/messageTypes";

const errorCodes = {
  CLIENT_NOT_AUTH: 21,
  CLIENT_UNAUTHORIZED: 6200
};
export default class ChatSDK {

  constructor(props) {
    this.params = {
      socketAddress: props.config.local ? "ws://172.16.106.26:8003/ws" : "wss://chat-sandbox.pod.ir/ws", // {**REQUIRED**} Socket Address
      ssoHost: props.config.local ? "http://172.16.110.76" : "https://accounts.pod.ir", // {**REQUIRED**} Socket Address
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
      enableCache: false,
      httpUploadRequestTimeout: 0,
      fullResponseObject: true,
      dynamicHistoryCount: true,
      asyncLogging: {
        onFunction: true, // log main actions on console
        // onMessageReceive: true, // log received messages on console
        // onMessageSend: true // log sent messaged on console
      },
      ...props.config
    };
    this.user = {};
    this.chatAgent = new PodChat(this.params);
    this.onThreadEvents = props.onThreadEvents;
    this.onMessageEvents = props.onMessageEvents;
    this.onContactsEvents = props.onContactsEvents;
    this.onFileUploadEvents = props.onFileUploadEvents;
    this.onSystemEvents = props.onSystemEvents;
    this.onChatReady = props.onChatReady;
    this.onChatState = props.onChatState;
    this.onChatError = props.onChatError;
    this._onMessageEvents();
    this._onThreadEvents();
    this._onContactsEvents();
    this._onFileUploadEvents();
    this._onSystemEvents();
    this._onChatReady();
    this._onChatState();
    this._onChatError();
    window.chatAgent = this.chatAgent;
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
        reject(response.errorMessage);
        return true;
      }
    }
  }

  _onThreadEvents() {
    this.chatAgent.on("threadEvents", res => {
      this.onThreadEvents(res, res.type);
    });
  }

  _onMessageEvents() {
    this.chatAgent.on("messageEvents", (msg) => {
      this.onMessageEvents(msg.result.message, msg.type);
    });
  }

  _onContactsEvents() {
    this.chatAgent.on("contactEvents", (msg) => {
      this.onContactsEvents(msg.result.contacts, msg.type);
    });
  }

  _onFileUploadEvents() {
    this.chatAgent.on("fileUploadEvents", (msg) => {
      this.onFileUploadEvents(msg);
    });
  }

  _onSystemEvents() {
    this.chatAgent.on("systemEvents", (msg) => {
      this.onSystemEvents(msg);
    });
  }

  _onChatReady() {
    this.chatAgent.on("chatReady", e => {
      this.onChatReady(this);

      const {onTokenExpire, expireTokenTimeOut} = this.params;
      if (onTokenExpire) {
        setInterval(e => {
          onTokenExpire();
        }, expireTokenTimeOut || (1000 * 60 * 10));
      }
    });
  }

  clearCache() {
    this.chatAgent.deleteCacheDatabases();
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

  logout() {
    this.chatAgent && this.chatAgent.logout();
  }

  @promiseDecorator
  createThread(resolve, reject, id, idType, type, other) {
    let invitees = [{"id": id, "idType": idType || "TO_BE_USER_CONTACT_ID"}];
    const isGroup = id instanceof Array;
    if (isGroup) {
      invitees = [];
      for (const singleId of id) {
        invitees.push({"id": singleId, "idType": "TO_BE_USER_CONTACT_ID"})
      }
    }
    let createThreadParams = {
      type: type || "NORMAL",//: isChannel ? "CHANNEL" : isGroup ? "OWNER_GROUP" : "NORMAL",
      invitees
    };
    if (other) {
      createThreadParams = {...createThreadParams, ...other};
    }
    this.chatAgent.createThread(createThreadParams, result => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.thread);
      }
    });
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
  getThreadMessageList(resolve, reject, params) {
    this.chatAgent.getHistory(params, (result) => {
      if (!this._onError(result, reject)) {
        const rslt = result.result;
        rslt.failed.forEach(item => {
          item.participant = this.user;
          item.hasError = true
        });
        const {hasNext, contentCount, nextOffset} = result.result;
        let realHasPrevious = (!params.fromTimeFull && !params.toTimeFull) || params.toTimeFull ? hasNext ? hasNext : false : "UNKNOWN";
        let realHasNext = params.fromTimeFull ? hasNext ? hasNext : false : (!params.fromTimeFull && !params.toTimeFull) ? false : "UNKNOWN";
        return resolve({
          threadId: params.threadId,
          nextOffset,
          contentCount,
          messages: rslt.history.concat(rslt.failed.concat(rslt.sending.concat(rslt.uploading))),
          hasNext: realHasNext,
          hasPrevious: realHasPrevious
        });
      }
    });
  }

  @promiseDecorator
  getThreadUnreadMentionedMessageList(resolve, reject, threadId, params) {
    this.chatAgent.getUnreadMentionedMessages({threadId, ...params}, result => {
      if (!this._onError(result, reject)) {
        return resolve({threadId, messages: result.result.history.reverse()});
      }
    });
  }

  @promiseDecorator
  getThreadInfo(resolve, reject, params) {
    this.getThreads(null, null, null, {...params, cache: false}).then(result => {
      if (!this._onError(result, reject)) {
        return resolve(result.threads[0]);
      }
    })
  }

  @promiseDecorator
  getThreads(resolve, reject, offset, count, name, params) {
    let getThreadsParams = {
      count,
      offset
    };
    if (typeof name === "string") {
      if (name.trim()) {
        getThreadsParams.name = name;
      }
    }
    if (params) {
      getThreadsParams = {...getThreadsParams, ...params};
    }
    this.chatAgent.getThreads(getThreadsParams, (result) => {
      if (!this._onError(result, reject)) {
        const {threads, hasNext, nextOffset} = result.result;
        threads.forEach(e => e.draftMessage = Cookies.get(e.id));
        return resolve({threads, hasNext, nextOffset});
      }
    });
  }

  @promiseDecorator
  getThreadAdmins(resolve, reject, threadId) {
    let getThreadAdmins = {
      threadId
    };
    this.chatAgent.getThreadAdmins(getThreadAdmins, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.participants.filter(e => e.roles.indexOf(THREAD_ADMIN.toLowerCase()) > -1));
      }
    });
  }

  @promiseDecorator
  setAdmin(resolve, reject, userId, threadId, params) {
    let setAdminParams = {
      admins: [{
        userId, roles: [
          'post_channel_message',
          'edit_message_of_others',
          'delete_message_of_others',
          'add_new_user',
          'remove_user',
          'thread_admin',
          'add_rule_to_user',
          'remove_role_from_user',
          'read_thread',
          'edit_thread'
        ]
      }, ...{params: params || {}}],
      threadId
    };
    this.chatAgent.setAdmin(setAdminParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }

  @promiseDecorator
  removeAdmin(resolve, reject, userId, threadId, params) {
    let setAdminParams = {
      threadId,
      admins: [{
        userId, roles: [
          'post_channel_message',
          'edit_message_of_others',
          'delete_message_of_others',
          'add_new_user',
          'remove_user',
          'thread_admin',
          'add_rule_to_user',
          'remove_role_from_user',
          'edit_thread'
        ]
      }, ...{params: params || {}}],

    };
    this.chatAgent.removeAdmin(setAdminParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result);
      }
    });
  }

  @promiseDecorator
  sendMessage(resolve, reject, content, threadId, other) {
    let sendChatParams = {
      content,
      threadId,
      messageType: "TEXT"
    };
    if (other) {
      sendChatParams = {...sendChatParams, ...other};
    }
    const obj = this.chatAgent.sendTextMessage(sendChatParams);
    resolve({
      ...obj, ...{
        participant: this.user,
        time: getNow() * Math.pow(10, 6),
        message: content,
      }
    })
  }

  @promiseDecorator
  sendFileMessage(resolve, reject, file, threadId, caption, other) {
    let sendChatParams = {
      threadId,
      file
    };
    if (caption) {
      sendChatParams.content = caption;
    }
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.match(/mp4|ogg|3gp|ogv/);
    const isAudio = file.type.match(/audio.*/);
    const messageType =  isImage ? types.picture : isVideo ? types.video : isAudio ? types.sound : types.file;
    if (other) {
      sendChatParams = {...sendChatParams, ...other};
    }
    const obj = this.chatAgent.sendFileMessage({...sendChatParams, messageType: messageType.toUpperCase()}, {
      onSent: result => {
        this._onError(result, reject);
      }
    });
    const commonParams = {
      ...obj, ...{
        message: caption,
        time: getNow() * Math.pow(10, 6),
        fileObject: file,
        metadata: {
          file: {
            mimeType: file.type,
            originalName: file.name,
            size: file.size
          }
        }
      }
    };

    if (isImage) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      return image.onload = function (result) {
        commonParams.metadata.file.link = image.src;
        commonParams.metadata.file.width = result.target.width;
        commonParams.metadata.file.height = result.target.height;
        return resolve(commonParams);
      };
    }
    resolve(commonParams);
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
  cancelMessage(resolve, reject, uniqueId) {
    const cancelMessageParams = {
      uniqueId
    };
    resolve(cancelMessageParams);
    this.chatAgent.cancelMessage(uniqueId);
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
  replyMessage(resolve, reject, content, repliedTo, threadId, repliedMessage) {
    const sendChatParams = {
      threadId,
      repliedTo,
      content
    };
    const obj = this.chatAgent.replyMessage(sendChatParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({
          result, ...{
            message: content, participant: {}
          }
        });
      }
    });
    const {metadata, participant, time, message} = repliedMessage;
    resolve({
      ...obj, ...{
        replyInfo: {
          message: message,
          metadata: metadata,
          participant: participant,
          repliedToMessageId: repliedTo,
          repliedToMessageTime: time,
          messageType: 0,
        },
        time: getNow() * Math.pow(10, 6),
        message: content,
      }
    });
  }

  @promiseDecorator
  replyFileMessage(resolve, reject, file, threadId, repliedTo, content, repliedMessage) {
    const sendChatParams = {
      threadId,
      repliedTo,
      file,
      content
    };
    const obj = this.chatAgent.replyFileMessage(sendChatParams, result => {
      if (!this._onError(result, reject)) {
        return resolve({
          result, ...{
            message, participant: {}
          }
        });
      }
    });
    const {metadata, participant, time, message} = repliedMessage;
    resolve({
      ...obj, ...{
        replyInfo: {
          message: message,
          metadata: metadata,
          participant: participant,
          repliedToMessageId: repliedTo,
          repliedToMessageTime: time,
          messageType: 0,
        },
        time: getNow() * Math.pow(10, 6),
        message: content,
        fileObject: file,
        metadata: {
          file: {
            mimeType: file.type,
            originalName: file.name,
            link: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            size: file.size
          }
        }
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
  startTyping(resolve, reject, threadId) {
    const startTypingParams = {threadId};
    this.chatAgent.startTyping(startTypingParams);
  }

  @promiseDecorator
  stopTyping(resolve, reject, threadId) {
    this.chatAgent.stopTyping();
  }

  @promiseDecorator
  addContact(resolve, reject, addBy, firstName, lastName) {
    const addContactParams = {
      firstName,
      lastName,
      [isNaN(addBy) ? "username" : "cellphoneNumber"]: addBy
    };
    this.chatAgent.addContacts(addContactParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.contacts[0]);
      }
    });
  }

  @promiseDecorator
  updateContact(resolve, reject, contactId, updateObject) {
    const editContactParams = {
      id: contactId,
      ...updateObject
    };
    this.chatAgent.updateContacts(editContactParams, (result) => {
      if (!this._onError(result, reject)) {
        return resolve(result.result.contacts[0]);
      }
    });
  }

  @promiseDecorator
  searchContact(resolve, reject, query) {
    this.chatAgent.searchContacts(query, result => {
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
  getContactList(resolve, reject, offset, count, name) {
    const getContactsParams = {
      offset,
      count
    };
    if (typeof name === "string") {
      if (name.trim()) {
        getContactsParams.query = name;
      }
    }
    this.chatAgent.getContacts(getContactsParams, result => {
      if (!this._onError(result, reject)) {
        const {contacts, hasNext, nextOffset} = result.result;
        return resolve({contacts, hasNext, nextOffset, offset});
      }
    });
  }

  @promiseDecorator
  getThreadParticipantList(resolve, reject, threadId, offset, count, name) {
    const getParticipantsParams = {
      count,
      offset,
      threadId
    };
    if (typeof name === "string") {
      if (name.trim()) {
        getParticipantsParams.name = name;
      }
    }
    this.chatAgent.getThreadParticipants(getParticipantsParams, result => {
      if (!this._onError(result, reject)) {
        const {participants, hasNext, nextOffset} = result.result;
        return resolve({threadId, participants, hasNext, nextOffset});
      }
    });
  }


  @promiseDecorator
  getThreadParticipantRoles(resolve, reject, threadId) {
    this.chatAgent.getParticipantRoles({threadId}, (result) => {
      if (!this._onError(result, reject)) {
        return resolve({threadId, roles: result.result});
      }
    });
  }

  @promiseDecorator
  pinThread(resolve, reject, threadId) {
    this.chatAgent.pinThread({
      subjectId: threadId
    });
  }

  @promiseDecorator
  unpinThread(resolve, reject, threadId) {
    this.chatAgent.unPinThread({
      subjectId: threadId

    });
  }

  @promiseDecorator
  pinMessage(resolve, reject, messageId, notifyAll) {
    const params = {
      messageId,
      notifyAll
    };
    this.chatAgent.pinMessage(params);
  }

  @promiseDecorator
  unPinMessage(resolve, reject, messageId) {
    const params = {
      messageId
    };
    this.chatAgent.unPinMessage(params);
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
        return resolve(participants);
      }
    });
  }
};