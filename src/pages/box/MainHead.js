// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {threadShowing, threadLeftAsideShowing} from "../../actions/threadActions";
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadModalThreadInfoShowing} from "../../actions/threadActions";


//UI components
import {MdChevronLeft, MdSearch} from "react-icons/lib/md";
import {Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/MainHead.scss";
import styleVar from "./../../../styles/variables.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import classnames from "classnames";

const statics = {};

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    threadShowing: store.threadShowing
  };
})
export default class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
    this.onThreadHide = this.onThreadHide.bind(this);
    this.onLeftAsideShow = this.onLeftAsideShow.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  onThreadHide(e) {
    e.stopPropagation();
    this.props.dispatch(threadShowing(false));
  }

  onLeftAsideShow(e){
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true));
  }

  render() {
    const {thread, threadShowing, smallVersion} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.MainHead]: true,
        [style["MainHead--smallVersion"]]: smallVersion,
        [style["MainHead--isThreadShow"]]: threadShowing
      });
      return (
        <Container className={classNames} onClick={this.onShowInfoClick} relative>
          <Container className={style.MainHead__ThreadInfoContainer}>
            <Avatar>
              <AvatarImage src={thread.image ? thread.image : defaultAvatar}/>
              <AvatarName>
                <Text size="lg" invert overflow="ellipsis">{thread.title}</Text>
                {thread.group ?
                  <Text size="xs" invert overflow="ellipsis">{thread.participantCount} {strings.member}</Text>
                  :
                  <Text size="xs" invert overflow="ellipsis">{strings.you}, {thread.title}</Text>
                }
              </AvatarName>
            </Avatar>
          </Container>
          <Container centerLeft onClick={this.onLeftAsideShow}>
            <Container className={style.MainHead__SearchContainer} inline>
              <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorWhite} className={style.MainHead__SearchButton}/>
            </Container>
            <Container className={style.MainHead__BackContainer} inline onClick={this.onThreadHide}>
              <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorWhite} className={style.MainHead__BackButton}/>
            </Container>
          </Container>
        </Container>
      )
    }
    return ""
  }
}
