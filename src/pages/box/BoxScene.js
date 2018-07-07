// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {MdChat, MdDone} from 'react-icons/lib/md'

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
import Container from "../../../ui_kit/components/container";

@connect(store => {
  return {
    threadId: store.thread.thread.id
  };
})
export default class BoxScene extends Component {

  constructor() {
    super();
  }

  componentDidUpdate(nextProps) {
    if (this.props.threadId) {
      this.props.dispatch(getThreadMessageList(this.props.threadId));
    }
  }

  render() {
    const {threadId} = this.props;
    if (!threadId) {
      return (
        <section className="BoxScene">
          <Container center={true} centerTextAlign={true}>
            <Message large={true}>{strings.pleaseStartAThreadFirst}</Message>
            <MdChat size={48} style={{color: "#f58220"}}/>
          </Container>
        </section>
      );
    }
    return (
      <section className="BoxScene">
        <BoxSceneMessages/>
        <BoxSceneInput/>
      </section>
    );
  }
}