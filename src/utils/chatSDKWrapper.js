import chatSDK from './chatSDK';

function createPromise(method, params) {
  return new Promise((resolve, reject) => {
    chatSDK[method]((response, error) => {
      resolve(response);
      if (error) {
        return reject(error);
      }
    }, params);
  });
}

export default class {
  static sendMessage(text, threadId) {
    return createPromise('sendMessage', text, threadId);
  }

  static getContactList() {
    return createPromise('getContactList');
  }

  static createThread(userId) {
    return createPromise('createThread', userId);
  }

  static getThreadMessageList(threadId) {
    return createPromise('getThreadMessageList', threadId);
  }
}