// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {ROTE_THREAD_INFO} from "../../constants/routes";

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
    thread: store.thread.thread,
    threadShowing: store.threadShowing,
    participantsFetching: store.threadParticipantList.fetching,
  };
})
class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  render() {
    const {thread, smallVersion, participantsFetching} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.MainHeadThreadInfo]: true,
        [style["MainHeadThreadInfo--smallVersion"]]: smallVersion
      });
      return (
        <Link to={ROTE_THREAD_INFO}>
          <Container className={classNames} onClick={this.onShowInfoClick} relative>
            <Avatar>
              <AvatarImage src={thread.image} text={avatarNameGenerator(thread.title).letter}
                           textBg={avatarNameGenerator(thread.title).color}/>
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
        </Link>
      )
    }
    return "";
  }
}

export default withRouter(BoxHeadThreadInfo);