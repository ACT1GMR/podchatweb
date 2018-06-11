import chatSDK from 'react';

function createPromise(method, params) {
  return new Promise((resolve, reject) => {
    chatSDK[method]((error, response) => {
      if (error) {
        return reject(error);
      }
      response(response);
    }, params);
  });
}

export default class {
  static sendMessage(text, userId) {
    return createPromise('sendMessage', text, userId);
  }

  static getContactList() {
    return createPromise('getContactList');
  }

  static createThread(userId) {
    return createPromise('createThread', userId);
  }
}