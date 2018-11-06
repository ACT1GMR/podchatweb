// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadModalThreadInfoShowing} from "../../actions/threadActions";

//UI components
import {Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/MainHeadThreadInfo.scss";
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
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  render() {
    const {thread, smallVersion} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.MainHeadThreadInfo]: true,
        [style["MainHeadThreadInfo--smallVersion"]]: smallVersion
      });
      return (
        <Container className={classNames} onClick={this.onShowInfoClick} relative>
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
      )
    }
    return ""
  }
}
