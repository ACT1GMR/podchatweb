// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import sanitizeHTML from "sanitize-html";
import {mobileCheck} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {
  messageEditing,
  messageSend,
  messageEdit,
  messageReply,
  messageForward, messageSendOnTheFly
} from "../../actions/messageActions";
import {
  threadCreateWithUserWithMessage,
  threadEmojiShowing,
  threadIsSendingMessage,
  threadParticipantList
} from "../../actions/threadActions";

//components
import Container from "../../../../uikit/src/container";


//styling
import style from "../../../styles/pages/box/MainFooterInputParticipants.scss";

export const constants = {
  count: 20
};


@connect()
export default class extends Component {

  constructor() {
    super();
  }


  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {filterString: newFilterString} = nextProps;
    const {filterString} = this.props;
    dispatch(threadParticipantList(thread.id, participantsNextOffset, constants.count, query));
  }

  componentDidUpdate(prevProps) {

  }

  getParticipantList(participantsNextOffset, query) {
    const {thread} = this.props;
    dispatch(threadParticipantList(thread.id, participantsNextOffset, constants.count, query)).then(list => {
      this.setState({
        list
      })
    })
  }

  render() {
    const {filterString} = this.props;
    return (
      <Container className={style.MainFooterInputParticipants}>

      </Container>
    );
  }
}