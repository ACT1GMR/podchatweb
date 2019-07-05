import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//actions
import {
  threadModalThreadInfoShowing,
  threadParticipantList,
} from "../../actions/threadActions";
import {ROUTE_THREAD_INFO} from "../../constants/routes";

//UI components
import Gap from "../../../../uikit/src/gap";
import Container from "../../../../uikit/src/container";
import Divider from "../../../../uikit/src/divider";

//UI components
import ModalThreadInfoGroup from "./ModalThreadInfoGroup";
import ModalThreadInfoPerson from "./ModalThreadInfoPerson";

//styling
import style from "./../../../styles/pages/box/ModalThreadInfo.scss";

function GapFragment() {
  return (
    <Container className={style.ModalThreadInfo__GapContainer}>
      <Gap y={20} block>
        <Divider thick={5} color="background" shadowInset/>
      </Gap>
    </Container>
  )
}

@connect(store => {
  return {
    user: store.user.user,
    isShow: store.threadModalThreadInfoShowing,
    participants: store.threadParticipantList.participants,
    participantsFetching: store.threadParticipantList.fetching,
    thread: store.thread.thread,
    contacts: store.contactGetList.contacts,
    chatRouterLess: store.chatRouterLess
  };
}, null, null, {withRef: true})
class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const {thread, dispatch, match, isShow} = this.props;
    if (thread.id) {
      dispatch(threadParticipantList(thread.id));
      if (!isShow) {
        if (match.path === ROUTE_THREAD_INFO) {
          dispatch(threadModalThreadInfoShowing(true));
        }
      }
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

  onClose(dontGoBack) {
    const {dispatch, chatRouterLess, history} = this.props;
    dispatch(threadModalThreadInfoShowing());
    if (dontGoBack === true) {
      return;
    }
    if (!chatRouterLess) {
      history.goBack();
    }
  }

  render() {
    const {participants, contacts, isShow, thread, user, smallVersion, participantsFetching, history} = this.props;
    const isGroup = thread.group;
    const commonProps = {
      participants,
      contacts,
      isShow,
      thread,
      user,
      onClose: this.onClose,
      smallVersion,
      participantsFetching,
      history,
      GapFragment
    };
    return isGroup ? <ModalThreadInfoGroup {...commonProps}/> : <ModalThreadInfoPerson {...commonProps}/>;
  }
}

export default withRouter(ModalThreadInfo);