// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {MdChat, MdDone} from "react-icons/lib/md"

//strings
import strings from "../../constants/localization"

//actions
import {threadMessageGetList} from "../../actions/threadActions";

//components
import Message from "../../../../uikit/src/message";
import Container from "../../../../uikit/src/container";
import BoxSceneInput from "./BoxSceneInput";
import BoxSceneMessages from "./BoxSceneMessages";
import BoxModalAddContact from "./BoxModalAddContact";

//styling
import style from "../../../styles/pages/box/BoxScene.scss";


@connect(store => {
  return {
    threadId: store.thread.thread.id
  };
})
export default class BoxScene extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(nextProps) {
    if (this.props.threadId) {
      this.props.dispatch(threadMessageGetList(this.props.threadId));
    }
  }

  render() {
    const {threadId} = this.props;
    if (!threadId) {
      return (
        <section className={style.BoxScene}>
          <Container center={true} centerTextAlign={true}>
            <Message large={true}>{strings.pleaseStartAThreadFirst}</Message>
            <MdChat size={48} style={{color: "#f58220"}}/>
          </Container>
          <BoxModalAddContact/>
        </section>
      );
    }
    return (
      <section className={style.BoxScene}>
        <BoxSceneMessages/>
        <BoxSceneInput/>
        <BoxModalAddContact/>
      </section>
    );
  }
}