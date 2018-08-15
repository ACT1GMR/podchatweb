// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadCreate, threadGetList} from "../../actions/threadActions";

//UI components
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../rad_uikit/src/avatar";
import List, {ListItem} from "raduikit/src/list";
import Shape, {ShapeCircle} from "raduikit/src/shape";
import Container from "raduikit/src/container";
import LoadingBlinkDots from "raduikit/src/loading/LoadingBlinkDots";
import Loading from "raduikit/src/loading";
import Divider from "raduikit/src/Divider";
import {Text} from "../../../../rad_uikit/src/typography";
import Gap from "raduikit/src/gap";
import date from "../../utils/date"

//styling
import style from "../../../styles/pages/box/BoxThreads.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png"
import Message from "raduikit/src/message";

function sliceMessage(message) {
  if (message.length >= 15) {
    return `${message.slice(0, 15)}...`;
  }
  return message;
}

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadsFetching: store.threadList.fetching,
    threadId: store.thread.thread.id
  };
})
export default class BoxThreads extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick.bind(this);
    this.state = {activeThread: null};
  }

  componentDidMount() {
    this.props.dispatch(threadGetList());
  }

  onThreadClick(thread) {
    this.props.dispatch(threadCreate(null, thread));
    this.setState({
      activeThread: thread.id
    })
  }

  render() {
    const {threads, threadsFetching} = this.props;
    const {activeThread} = this.state;
    if (threadsFetching) {
      return (
        <section className={style.BoxThreads}>
          <Loading hasSpace><LoadingBlinkDots invert rtl/></Loading>
        </section>
      )
    } else {
      if (!threads.length) {
        return (
          <section className={style.BoxThreads}>
            <Container center>
              <Message invert size="lg">{strings.thereIsNoChat}</Message>
            </Container>
          </section>
        )
      }
      return (
        <section className={style.BoxThreads}>
          <List>
            {threads.map(el => (
              <ListItem key={el.id} onSelect={this.onThreadClick.bind(this, el)} selection
                        active={activeThread === el.id}>
                <Container relative>
                  <Avatar>
                    <AvatarImage src={el.image ? el.image : defaultAvatar}/>
                    <AvatarName invert>
                      {el.title}
                      <AvatarText>
                        {el.group ?
                          el.lastMessage ?
                            <Container>
                              <Text size="sm" inline bold color="accent">{el.lastParticipantName}: </Text>
                              <Text size="sm" inline color="gray" dark>{sliceMessage(el.lastMessage)}</Text>
                              <Container centerLeft>
                                <Text size="xs" color="gray"
                                      bold>{date.prettifySince(el.lastMessageVO.time - Date.now())}</Text>
                              </Container>
                            </Container>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAGroup(el.lastParticipantName))}</Text>
                          :
                          el.lastMessage ?
                            <Container>
                              <Text size="sm" inline color="gray" dark>{sliceMessage(el.lastMessage)}</Text>
                            </Container>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAChat(el.lastParticipantName))}</Text>
                        }
                      </AvatarText>
                    </AvatarName>
                  </Avatar>
                  {el.unreadCount && activeThread !== el.id ?
                    <Container absolute centerLeft>
                      <Shape colorAccent>
                        <ShapeCircle>{el.unreadCount}</ShapeCircle>
                      </Shape>
                    </Container> : ""}
                </Container>

              </ListItem>
            ))}
          </List>
        </section>
      );
    }
  }
};
