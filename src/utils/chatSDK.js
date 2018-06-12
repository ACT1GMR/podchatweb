export default ({
  sendMessage: e=>{
    e({a: 2});
  },
  getContactList: e=>{
    e([{a: 2}]);
  },
  createThread: e=>{
    e({a: 2});
  },
  getThreadMessageList: e=>{
    e({a: 2});
  },
})