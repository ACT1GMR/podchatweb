import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";
import {ROUTE_ADD_CONTACT, ROUTE_CONTACTS, ROUTE_THREAD} from "../../constants/routes";

//actions
import {
  contactListShowing,
  contactAdding,
  contactGetList,
  contactChatting,
  contactRemove,
  contactUnblock
} from "../../actions/contactActions";
import {threadCreate} from "../../actions/threadActions";
import {chatModalPrompt, chatRouterLess} from "../../actions/chatActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading, Text} from "../../../../uikit/src/typography";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Gap from "../../../../uikit/src/gap";
import {InputText} from "../../../../uikit/src/input";

//styling
import {MdClose, MdDelete, MdSearch, MdEdit, MdPersonAdd} from "react-icons/lib/md";

import style from "../../../styles/pages/box/ModalContactList.scss";
import styleVar from "../../../styles/variables.scss";

function isContains(flds, keyword, arr) {
  const fields = flds.split('|');
  if (!keyword || !keyword.trim()) {
    return arr;
  }

  return arr.filter(item => {
    for (const field of fields) {
      const value = item[field];
      if (value) {
        if (value.indexOf(keyword) > -1) {
          return true;
        }
      }
    }
  })

}

@connect(store => {
  return {
    isShow: store.contactListShowing.isShow,
    contacts: store.contactGetList.contacts,
    contactsFetching: store.contactGetList.fetching,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess
  };
}, null, null, {withRef: true})
class ModalContactList extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      searchInput: false
    };
  }

  componentDidUpdate(oldProps) {
    const {chatInstance, dispatch} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      dispatch(contactGetList());
    }
    if (oldProps.isShow !== this.props.isShow) {
      if (chatInstance) {
        dispatch(contactGetList());
      }
    }
    if (this.state.searchInput) {
      const current = this.inputRef.current;
      if (current) {
        this.inputRef.current.focus();
      }
    }
  }

  componentDidMount() {
    const {match, dispatch, isShow, chatInstance} = this.props;
    if (chatInstance) {
      dispatch(contactGetList());
    }
    if (!isShow) {
      if (match.path === ROUTE_CONTACTS) {
        dispatch(contactListShowing(true));
      }
    }
  }

  onAdd() {
    const {chatRouterLess, history} = this.props;
    this.props.dispatch(contactAdding(true));
    this.onContactSearchClick(false);
    if(!chatRouterLess){
      history.push(ROUTE_ADD_CONTACT);
    }
  }

  onUnblock(contact, e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    const text = strings.areYouSureAboutUnblockingContact(`${contact.firstName} ${contact.lastName}`);
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      dispatch(contactUnblock(contact.blockId));
      dispatch(chatModalPrompt());
      dispatch(contactGetList());
    }, () => dispatch(contactListShowing(true))), strings.unBlock);
  }

  onClose(e, noHistory) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactListShowing(false));
    this.onContactSearchClick(false);
    this.onSearchQueryChange("");
    if(!chatRouterLess){
      if (!noHistory) {
        history.push("/");
      }
    }
  }

  onStartChat(contact) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactChatting(contact));
    dispatch(threadCreate(contact.id));
    this.onClose(true);
    if(!chatRouterLess){
      history.push(ROUTE_THREAD);
    }
  }

  onContactSearchClick(isOpen) {
    this.setState({
      searchInput: isOpen
    });
  }

  onSearchQueryChange(e) {
    this.setState({
      query: e.target ? e.target.value : e
    });
  }

  render() {
    const {contacts, isShow, smallVersion, contactsFetching, chatInstance} = this.props;
    const {searchInput, query} = this.state;
    const showLoading = contactsFetching;
    let contactsFilter = contacts;
    if (searchInput) {
      contactsFilter = isContains("firstName|lastName|cellphoneNumber", query, contacts);
    }
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion} userSelect="none">

        <ModalHeader>
          <Container relative>
            {
              searchInput ?
                <Container>
                  <InputText className={style.ModalContactList__Input} onChange={this.onSearchQueryChange} value={query}
                             placeholder={strings.search} ref={this.inputRef}/>

                  <Container centerLeft>
                    <Gap x={5}>
                      <MdClose size={styleVar.iconSizeMd} color={styleVar.colorPrimaryLight}
                               onClick={this.onContactSearchClick.bind(this, false)}/>
                    </Gap>
                  </Container>
                </Container>
                :
                <Container>
                  <Heading h3>{strings.contactList}</Heading>
                  <Container centerLeft>
                    <Gap x={5}>
                      <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorPrimaryLight}
                                onClick={this.onContactSearchClick.bind(this, true)}/>
                    </Gap>
                  </Container>
                </Container>
            }


          </Container>

        </ModalHeader>

        <ModalBody>
          {contactsFilter.length ?
            <List>
              {contactsFilter.map(el => (
                <ListItem key={el.id} selection invert>
                  <Container relative onClick={el.hasUser && this.onStartChat.bind(this, el)}>

                    <Container maxWidth="calc(100% - 75px)">
                      <Avatar>
                        <AvatarImage src={el.linkedUser && el.linkedUser.image}
                                     text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                     textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                        <AvatarName>
                          {el.firstName} {el.lastName}
                          {
                            (!el.hasUser || el.blockId)
                            &&
                            <AvatarText>
                              <Text size="xs" inline
                                    color={el.blockId ? "red" : "accent"}>{el.blockId ? strings.blocked : strings.isNotPodUser}</Text>
                            </AvatarText>
                          }

                        </AvatarName>
                      </Avatar>
                    </Container>
                  </Container>
                </ListItem>
              ))}
            </List>
            :
            searchInput ?
              <Container relative>
                <Gap y={5}>
                  <Container topCenter>
                    <Message>{strings.thereIsNoContactWithThisKeyword(query)}</Message>
                  </Container>
                </Gap>
              </Container>
              :
              showLoading || !chatInstance ?
                <Container centerTextAlign className={style.ModalContactList__Loading}>
                  <Loading hasSpace><LoadingBlinkDots/></Loading>
                  <Text>{strings.waitingForContact}...</Text>
                </Container>
                :
                <Container centerTextAlign className={style.ModalContactList__Loading}>
                  <Text>{strings.noContactPleaseAddFirst}</Text>
                  <Button text onClick={this.onAdd.bind(this)}>{strings.add}</Button>
                </Container>
          }

        </ModalBody>

        <ModalFooter>
          <Button text onClick={this.onAdd.bind(this)}>{strings.add}</Button>
          <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}

export default withRouter(ModalContactList);