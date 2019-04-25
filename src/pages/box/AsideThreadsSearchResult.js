// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {ROUTE_THREAD} from "../../constants/routes";

//actions
import {chatSearchResult} from "../../actions/chatActions";
import {contactChatting} from "../../actions/contactActions";
import {threadCreate} from "../../actions/threadActions";

//UI components
import {MdGroup} from "react-icons/lib/md";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import List, {ListItem} from "../../../../uikit/src/list";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Container from "../../../../uikit/src/container";
import {Heading, Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";

//styling
import style from "../../../styles/pages/box/AsideThreadsSearchResult.scss";

@connect(store => {
  return {};
})
class AsideThreadsSearchResult extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick.bind(this);
  }


  onThreadClick(thread) {
    const {chatRouterLess, history, dispatch} = this.props;
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    dispatch(threadCreate(null, thread));
    dispatch(chatSearchResult());
  }

  onStartChat(contact) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactChatting(contact));
    dispatch(threadCreate(contact.id));
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    dispatch(chatSearchResult());
  }

  render() {
    const {chatSearchResult} = this.props;
    const {filteredThreads, filteredContacts} = chatSearchResult;
    return (
      <Container>
        {filteredThreads && filteredThreads.length &&
        <Container>
          <Heading h1>{strings.conversations}</Heading>
          <List>
            {filteredThreads.map(el => (
              <ListItem onSelect={this.onThreadClick.bind(this, el)} selection
                        active={activeThread === el.id}>

                <Container relative>
                  <Avatar>
                    <AvatarImage src={el.image} customSize="50px" text={avatarNameGenerator(el.title).letter}
                                 textBg={avatarNameGenerator(el.title).color}/>
                    <AvatarName invert>
                      {el.group &&
                      <Container inline>
                        <MdGroup size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                        <Gap x={2}/>
                      </Container>
                      }
                      {getTitle(el.title)}
                      <AvatarText>
                        {el.group ?
                          el.lastMessage || el.lastMessageVO ?
                            <Container>
                              <Text size="sm" inline color="accent">{el.lastParticipantName}: </Text>
                              {isFile(el.lastMessageVO) ?
                                <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                                :
                                <Text isHTML size="sm" inline color="gray" dark
                                      sanitizeRule={sanitizeRule}>{sliceMessage(el.lastMessage)}</Text>
                              }
                            </Container>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAGroup(el.lastParticipantName), 30)}</Text>
                          :
                          el.lastMessage || el.lastMessageVO ?
                            isFile(el.lastMessageVO) ?
                              <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                              :
                              <Text isHTML size="sm" inline color="gray"
                                    sanitizeRule={sanitizeRule}
                                    dark>{sliceMessage(el.lastMessage, 30)}</Text>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAChat(el.lastParticipantName), 35)}</Text>
                        }
                        {el.lastMessageVO || el.time ?
                          <Container topLeft>
                            <Text size="xs"
                                  color="gray">{prettifyMessageDate(el.time || el.lastMessageVO.time)}</Text>
                          </Container>
                          : ""}

                      </AvatarText>
                    </AvatarName>
                  </Avatar>
                  {el.unreadCount && activeThread !== el.id ?
                    <Container absolute centerLeft>
                      <Gap y={10} block/>
                      <Shape color="accent">
                        <ShapeCircle>{el.unreadCount}</ShapeCircle>
                      </Shape>
                    </Container> : ""}
                </Container>
              </ListItem>
            ))}
          </List>
        </Container>
        }

        {filteredContacts && filteredContacts.length &&
        <Container>
          <Heading h1>{strings.contacts}</Heading>
          <List>
            {filteredContacts.map(el => (
              <ListItem key={el.id} selection invert>
                <Container relative onClick={el.hasUser && this.onStartChat.bind(this, el)}>

                  <Container maxWidth="calc(100% - 75px)">
                    <Avatar>
                      <AvatarImage src={el.linkedUser.image}
                                   text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                   textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                      <AvatarName>
                        {el.firstName} {el.lastName}
                        {
                          el.blocked
                          &&
                          <AvatarText>
                            <Text size="xs" inline
                                  color="red">{strings.blocked}</Text>
                          </AvatarText>
                        }

                      </AvatarName>
                    </Avatar>
                  </Container>
                </Container>
              </ListItem>
            ))}
          </List>
        </Container>
        }

      </Container>
    );
  }
}

export default withRouter(AsideThreadsSearchResult);
