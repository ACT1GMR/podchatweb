// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {MdChat, MdDone} from "react-icons/lib/md";

//strings
import strings from "../../constants/localization"

//actions
import {threadMessageGetList} from "../../actions/threadActions";
import {contactAdding, contactListShowing} from "../../actions/contactActions";


//components
import Message from "raduikit/src/message";
import Container from "raduikit/src/container";
import BoxSceneInput from "./BoxSceneInput";
import BoxSceneMessages from "./BoxSceneMessages";
import BoxModalAddContact from "./BoxModalAddContact";
import BoxModalContactList from "./BoxModalContactList";
import BoxModalThreadList from "./BoxModalThreadList";
import Button from "raduikit/src/button";

import Gap from "raduikit/src/gap";

//styling
import style from "../../../styles/pages/box/BoxScene.scss";
import styleVar from "../../../styles/variables.scss";


@connect(store => {
  return {
    threadId: store.thread.thread.id,
    threadFetching: store.thread.fetching
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
    const {threadId, threadFetching} = this.props;
    const popups = (
      <section>
        <BoxModalContactList/>
        <BoxModalAddContact/>
        <BoxModalThreadList/>
      </section>
    );
    if (!threadId && !threadFetching) {
      return (
        <section className={style.BoxScene}>
          <Container center centerTextAlign>
            <Message large>{strings.pleaseStartAThreadFirst}</Message>
            <Gap y={10} block/>
            <MdChat size={48} style={{color: styleVar.colorAccent}}/>
            <Container>
              <Button outlined onClick={()=> this.props.dispatch(contactAdding(true))}>{strings.addContact}</Button>
              <Button outlined onClick={()=> this.props.dispatch(contactListShowing(true))}>{strings.contactList}</Button>
            </Container>
          </Container>
          {popups}
        </section>
      );
    }
    return (
      <section className={style.BoxScene}>
        <BoxSceneMessages/>
        <BoxSceneInput/>
        {popups}
      </section>
    );
  }
}