// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {getThreadMessageList} from "../../actions/threadActions";

//components
import Message from "../../../ui_kit/components/message";
import BoxSceneInput from './BoxSceneInput';
import BoxSceneMessages from './BoxSceneMessages';

//styling
import '../../../styles/pages/box/BoxScene.scss'

@connect(store => {
  return {
    threadId: store.thread.thread.threadId
  };
})
export default class BoxScene extends Component {

  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.threadId !== nextProps.threadId) {
      this.props.dispatch(getThreadMessageList(nextProps.threadId));
    }
    return true;
  }

  render() {
    const {threadId} = this.props;
    if (!threadId) {

      return <section className="BoxScene"><Message>{strings.pleaseStartAThreadFirst}</Message></section>
    }
    return (
      <section className="BoxScene">
        <BoxSceneMessages/>
        <BoxSceneInput/>
      </section>
    );
  }
}