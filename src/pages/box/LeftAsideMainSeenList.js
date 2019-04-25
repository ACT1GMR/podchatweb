// src/
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {messageGetSeenList} from "../../actions/messageActions";

//UI components

//styling
import Container from "../../../../uikit/src/container";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import {avatarNameGenerator} from "../../utils/helpers";
import {Text} from "../../../../uikit/src/typography";
import strings from "../../constants/localization";
import Message from "../../../../uikit/src/message";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import {threadCreate} from "../../actions/threadActions";

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    leftAsideShowing: store.threadLeftAsideShowing
  }
})
export default class LeftAsideMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seenList: null
    }
  }

  componentDidUpdate(oldProps) {
    const {leftAsideShowing: oldLeftAsideShowing} = oldProps;
    const {leftAsideShowing} = this.props;
    const {data, isShowing} = leftAsideShowing;
    const {data: oldData} = oldLeftAsideShowing;
    if (isShowing) {
      if (data) {
        if (!oldData || oldData !== data) {
          this.getMessageSeenList(data);
        }
      }
    }
  }

  onStartChat(id) {
    this.props.dispatch(threadCreate(id, null, null, "TO_BE_USER_ID"));
  }


  getMessageSeenList(messageId) {
    const {dispatch} = this.props;
    this.setState({
      seenList: null,
      seeListLoading: true
    });
    dispatch(messageGetSeenList(messageId)).then(result => {
      this.setState({
        seenList: result,
        seeListLoading: false
      })
    })
  }


  render() {
    const {seenList, seeListLoading} = this.state;
    return (
      <Container relative>
        {seeListLoading ?
          <Container relative userSelect="none">
            <Container topCenter>
              <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
            </Container>
          </Container>
          : seenList && seenList.length ?
            <List>
              {seenList.map(el => (
                <ListItem key={el.id} selection invert>
                  <Container relative onClick={this.onStartChat.bind(this, el.id)}>
                    <Container maxWidth="calc(100% - 75px)">
                      <Avatar>
                        <AvatarImage src={el.image}
                                     text={avatarNameGenerator(el.name).letter}
                                     textBg={avatarNameGenerator(el.name).color}/>
                        <AvatarName>
                          {el.name}
                        </AvatarName>
                      </Avatar>
                    </Container>
                  </Container>
                </ListItem>
              ))}
            </List>
            :
            <Container relative>
              <Container topCenter>
                <Message>{strings.noBodyReadMessage}</Message>
              </Container>
            </Container>
        }
      </Container>
    )
  }
}
