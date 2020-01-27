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
  threadParticipantList
} from "../../actions/threadActions";

//components
import Container from "../../../../uikit/src/container";
import Scroller from "../../../../uikit/src/scroller";

//styling
import style from "../../../styles/pages/box/MainFooterInputParticipants.scss";
import {ContactList} from "./_component/contactList";
import ModalBody from "../../../../uikit/src/modal/ModalBody";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Gap from "../../../../uikit/src/gap";

export const constants = {
  count: 20
};


@connect()
export default class extends Component {

  constructor(props) {
    super(props);
    this.hasNextParticipants = false;
    this.requesting = false;
    this.nextParticipantOffset = 0;
    this.searchParticipantTimeout = null;
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onContactSelect = this.onContactSelect.bind(this);
    this.state = {
      participants: []
    };
  }

  _reset() {
    this.hasNextParticipants = false;
    this.nextParticipantOffset = 0;
    this.setState({
      participants: []
    });
  }

  componentDidMount() {
    this._reset();
    this.getParticipantList();
  }

  shouldComponentUpdate(nextProps) {
    const {filterString: newFilterString, thread} = nextProps;
    const {filterString} = this.props;
    if (newFilterString !== filterString) {
      this._reset();
      this.requesting = true;
      clearTimeout(this.searchParticipantTimeout);
      this.searchParticipantTimeout = setTimeout(e => {
        this.requesting = false;
        clearTimeout(this.searchParticipantTimeout);
        this.getParticipantList(newFilterString);
      }, 750);
    }
    return true;
  }

  componentDidUpdate(prevProps) {

  }

  onScrollBottomThreshold() {
    if (this.hasNextParticipants) {
      this.getParticipantList();
    }
  }

  onContactSelect(contactId, contact) {
    const {onSelect} = this.props;
    if (onSelect) {
      onSelect(contact);
    }
  }

  getParticipantList(query) {
    if (this.requesting) {
      return;
    }
    const {thread, filterString, dispatch} = this.props;
    dispatch(threadParticipantList(thread.id, this.nextParticipantOffset, constants.count, query || filterString, true)).then(result => {
      this.requesting = false;
      const {participants} = this.state;
      const {participants: nextParticipants, hasNext, nextOffset} = result;
      this.nextParticipantOffset = nextOffset;
      this.hasNextParticipants = hasNext;
      this.setState({
        participants: participants.concat(nextParticipants)
      });
    });
    this.requesting = true;
  }

  render() {
    const {participants} = this.state;
    return (
      <Scroller className={style.MainFooterInputParticipants}
                threshold={5}
                onScrollBottomThresholdCondition={this.hasNextParticipants}
                onScrollBottomThreshold={this.onScrollBottomThreshold}>
        {this.requesting && <Container>
          <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
        </Container>}
        <ContactList contacts={participants} onSelect={this.onContactSelect} selection invert/>
      </Scroller>
    );
  }
}