// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {ROUTE_THREAD, ROUTE_THREAD_INFO} from "../../constants/routes";

//actions
import {threadModalThreadInfoShowing} from "../../actions/threadActions";

//UI components
import {Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";

//styling
import style from "../../../styles/pages/box/MainHeadThreadInfo.scss";
import classnames from "classnames";
import {avatarNameGenerator} from "../../utils/helpers";

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    chatRouterLess: store.chatRouterLess,
    thread: store.thread.thread,
    threadShowing: store.threadShowing,
    participantsFetching: store.threadParticipantList.fetching
  };
})
class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
  }

  onShowInfoClick() {
    const {chatRouterLess, history} = this.props;
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD_INFO);
    }
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  render() {
    const {thread, smallVersion} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.MainHeadThreadInfo]: true,
        [style["MainHeadThreadInfo--smallVersion"]]: smallVersion
      });
      const typingText = thread.isTyping && thread.isTyping.isTyping ? `${strings.typing(thread.title)}...` : "";
      return (
        <Container className={classNames} onClick={this.onShowInfoClick} relative>
          <Avatar>
            <AvatarImage src={thread.image} text={avatarNameGenerator(thread.title).letter}
                         textBg={avatarNameGenerator(thread.title).color}/>
            <AvatarName>
              <Text size="lg" invert overflow="ellipsis">{thread.title}</Text>
              {thread.group ?
                <Text size="xs" invert overflow="ellipsis">{thread.participantCount} {strings.member}</Text>
                :
                <Text color={typingText ? "yellow" : null} size="xs" invert
                      overflow="ellipsis">{typingText ? typingText : `${strings.you}, ${thread.title}`}</Text>
              }
            </AvatarName>
          </Avatar>

        </Container>
      )
    }
    return "";
  }
}

export default withRouter(BoxHeadThreadInfo);