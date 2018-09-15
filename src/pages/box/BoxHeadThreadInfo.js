// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {threadModalCreateGroupShowing, threadShowing} from "../../actions/threadActions";
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadModalThreadInfoShowing} from "../../actions/threadActions";


//UI components
import {MdChevronLeft} from "react-icons/lib/md";
import {Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/BoxHeadThreadInfo.scss";
import styleVar from "./../../../styles/variables.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import classnames from "classnames";

const statics = {};

@connect(store => {
  return {
    thread: store.thread.thread,
    threadShowing: store.threadShowing
  };
})
export default class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
    this.onThreadHide = this.onThreadHide.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  onThreadHide(e) {
    e.stopPropagation();
    this.props.dispatch(threadShowing(false));
  }

  render() {
    const {thread, threadShowing} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.BoxHeadThreadInfo]: true,
        [style["BoxHeadThreadInfo--isThreadShow"]]: threadShowing
      });
      return (
        <Container className={classNames} onClick={this.onShowInfoClick} relative>
          <Container>
            <Avatar>
              <AvatarImage src={thread.image ? thread.image : defaultAvatar}/>
              <AvatarName>
                <Text size="lg" invert>{thread.title}</Text>
                {thread.group ?
                  <Text size="xs" invert>{thread.participantCount} {strings.member}</Text>
                  :
                  <Text size="xs" invert>{strings.you}, {thread.title}</Text>
                }
              </AvatarName>
            </Avatar>
          </Container>
          <Container className={style.BoxHeadThreadInfo__Back} centerLeft onClick={this.onThreadHide}>
            <MdChevronLeft size={styleVar.iconSizeLg} color={styleVar.colorWhite}/>
          </Container>
        </Container>
      )
    }
    return ""
  }
}
