// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";
import {withRouter} from "react-router-dom";
import {getTitle, LastMessageFragment} from "./AsideThreads";

//strings
import strings from "../../constants/localization";
import {ROUTE_THREAD} from "../../constants/routes";

//actions
import {chatSearchResult} from "../../actions/chatActions";
import {contactChatting} from "../../actions/contactActions";
import {threadCreateWithExistThread, threadCreateWithUser} from "../../actions/threadActions";

//UI components
import {MdGroup, MdRecordVoiceOver} from "react-icons/lib/md";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import List, {ListItem} from "../../../../uikit/src/list";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";

//styling
import styleVar from "../../../styles/variables.scss";
import style from "../../../styles/pages/box/AsideThreads.scss";

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
    dispatch(threadCreateWithExistThread(thread));
    dispatch(chatSearchResult());
  }

  onStartChat(contact) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactChatting(contact));
    dispatch(threadCreateWithUser(contact.id));
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    dispatch(chatSearchResult());
  }

  render() {
    const {chatSearchResult} = this.props;
    const {filteredThreads, filteredContacts} = chatSearchResult;
    let contactsFilter;
    if (filteredContacts) {
      contactsFilter = filteredContacts.filter(e => e.linkedUser);
    }
    return (
      <Container>
        <Gap y={8} x={5}>
          <Text bold color="accent">{strings.conversations}</Text>
        </Gap>
        {filteredThreads && filteredThreads.length ?
          <Container>
            <List>
              {filteredThreads.map(el => (

                <ListItem key={el.id} onSelect={this.onThreadClick.bind(this, el)} selection>
                  <Container relative>
                    <Avatar className={style.AsideThreads__AvatarContainer}>
                      <AvatarImage src={el.image} customSize="50px" text={avatarNameGenerator(el.title).letter}
                                   textBg={avatarNameGenerator(el.title).color}/>
                      <AvatarName invert>
                        {el.group &&
                        <Container inline>
                          {el.type === 8 ?
                            <MdRecordVoiceOver size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                            :
                            <MdGroup size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                          }
                          <Gap x={2}/>
                        </Container>
                        }
                        {getTitle(el.title)}
                        <AvatarText>
                          <LastMessageFragment thread={el}/>
                        </AvatarText>
                      </AvatarName>
                    </Avatar>
                    {el.unreadCount ?
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
          </Container> :
          <Container relative centerTextAlign>
            <Gap y="8" x="5">
              <Text size="sm" color="gray">{strings.noResult}</Text>
            </Gap>
          </Container>
        }
        <Gap y="8" x="5">
          <Text bold color="accent">{strings.contacts}</Text>
        </Gap>
        {contactsFilter && contactsFilter.length ?
          <Container>

            <List>
              {contactsFilter.map(el => (
                <ListItem key={el.id} selection>
                  <Container relative onClick={this.onStartChat.bind(this, el)}>

                    <Container maxWidth="calc(100% - 75px)">
                      <Avatar>
                        <AvatarImage src={el.linkedUser.image}
                                     text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                     textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                        <AvatarName invert>
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
          </Container> :
          <Container relative centerTextAlign>
            <Gap y="8" x="5">
              <Text size="sm" color="gray">{strings.noResult}</Text>
            </Gap>
          </Container>
        }

      </Container>
    );
  }
}

export default withRouter(AsideThreadsSearchResult);
