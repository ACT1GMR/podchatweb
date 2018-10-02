import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {
  threadModalThreadInfoShowing,
  threadParticipantList,
} from "../../actions/threadActions";

//UI components
import ModalThreadInfoGroup from "./ModalThreadInfoGroup"
import ModalThreadInfoPerson from "./ModalThreadInfoPerson"

@connect(store => {
  return {
    user: store.user.user,
    isShow: store.threadModalThreadInfoShowing.isShow,
    participants: store.threadParticipantList.participants,
    thread: store.thread.thread,
    contacts: store.contactGetList.contacts
  };
})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const {thread, dispatch} = this.props;
    if (thread.id) {
      dispatch(threadParticipantList(thread.id));
    }
  }

  componentDidUpdate(oldProps) {
    const {thread, dispatch} = this.props;
    if (thread.id) {
      if (oldProps.thread.id !== thread.id) {
        dispatch(threadParticipantList(thread.id));
      }
    }
  }

  onClose() {
    this.props.dispatch(threadModalThreadInfoShowing(false));
  }

  render() {
    const {participants, contacts, isShow, thread, user} = this.props;
    const isGroup = thread.group;
    const commonProps = {participants, contacts, isShow, thread, user, onClose: this.onClose};
    return isGroup ? <ModalThreadInfoGroup {...commonProps}/> : <ModalThreadInfoPerson {...commonProps}/>;
  }
}
