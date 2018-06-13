export default ({
  sendMessage: (e, params) => {
    e({text: params});
  },
  getContactList: e => {
    e([
      {firstName: 'behnam', lastName: 'salarinia', id: 'ghiO'},
      {firstName: 'mohammad', lastName: 'bagheri', id: 'ghiO'}

    ]);
  },
  createThread: e => {
    e({threadId: 'ahGo'});
  },
  getThreadMessageList: e => {
    e([{text: "Im testing chat api"}, {text: "Im testing chat api"}, {text: "Im testing chat api"}]);
  },
})