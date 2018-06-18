// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {setChatInstance} from "../../actions/chatActions";

//components
import BoxContactList from "./BoxContactList";
import BoxScene from "./BoxScene";

//styling
import '../../../styles/pages/box/index.scss'

@connect(store => {
  return {
    chatInstance: store.chat.chatSDK
  };
})
export default class Box extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.dispatch(setChatInstance("232"))
  }

  render() {
    if (!this.props.chatInstance) {
      return <div className="Box">
        {strings.boiledEgg}
      </div>
    }
    return (
      <div className="Box">
        <BoxContactList/>
        <BoxScene/>
      </div>
    );
  }
}