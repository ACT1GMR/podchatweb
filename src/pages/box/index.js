// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {setChatInstance} from "../../actions/chatActions";
import {getUser} from "../../actions/userActions";

//components
import BoxThreads from "./BoxThreads";
import BoxScene from "./BoxScene";

//styling
import '../../../styles/pages/box/index.scss'

@connect(store => {
  return {
    chatInstance: store.chat.chatSDK,
    user: store.user.user
  };
})
export default class Box extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.dispatch(setChatInstance());
  }

  componentWillUpdate(chatInstance){
    if(chatInstance.chatInstance && !this.props.user) {
      this.props.dispatch(getUser(chatInstance.chatInstance));
    }
  }

  render() {
    if (!this.props.chatInstance || !this.props.user) {
      return (
      <div className="Box">
        {strings.waitingForChatInstance}
      </div>
      );
    }
    return (
      <div className="Box">
        <BoxThreads/>
        <BoxScene/>
      </div>
    );
  }
}