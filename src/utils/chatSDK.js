function buildThreadMessage(count) {
  let messages = [];
  for (let o = 0; o <= count; o++) {
    messages.push({
      message: "Im testing chat api",
      byMe: false,
      "participant": {
        "id": 21,
        "name": "sa.zamani",
        "lastSeen": 1528542748709
      }
    });
  }
  return messages
}

export default ({
  sendMessage: (e, params) => {
    e({
      message: params,
      byMe: true,
      "participant": {
        "id": 21,
        "name": "Behnam",
        "lastSeen": 1528542748709
      }
    });
  },
  getContactList: e => {
    e([
      {firstName: 'بهنام', lastName: 'سالاری نیا', id: 'ghiO'},
      {firstName: 'محمد', lastName: 'باقری', id: 'fooLam'}
    ]);
  },
  createThread: (e, params) => {
    if (params === 'fooLam') {
      e({threadId: 'ahGo'});
    } else {
      e({threadId: 'fdgr'});
    }
  },
  getThreadMessageList: (e, params) => {
    if (params === 'ahGo') {
      return e(buildThreadMessage(5));
    }
    e(buildThreadMessage(3));
  },
})