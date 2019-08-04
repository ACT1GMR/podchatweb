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
  contactUnblock, contactRemove
} from "../../actions/contactActions";
import {threadCreate} from "../../actions/threadActions";

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
import {MdClose, MdSearch} from "react-icons/lib/md";

import style from "../../../styles/pages/box/ModalContactList.scss";
import styleVar from "../../../styles/variables.scss";
import {ContactListSelective} from "./_component/contactList";
import {chatModalPrompt} from "../../actions/chatActions";


export const statics = {
  count: 15
};

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

function PartialLoadingFragment() {
  return (
    <Container bottomCenter centerTextAlign style={{zIndex: 1}}>
      <Loading><LoadingBlinkDots size="sm"/></Loading>
    </Container>
  )
}

function AvatarTextFragment({contact}) {
  return <Text size="xs" inline
               color={contact.blocked ? "red" : "accent"}>{contact.blocked ? strings.blocked : contact.linkedUser ? "" : strings.isNotPodUser}</Text>;
}

function LeftActionFragment(onRemoveContact, {contact}) {
  return !contact.linkedUser &&
    <Container>
      <Button onClick={onRemoveContact.bind(null, contact)} text size="sm">
        {strings.remove}
      </Button>
    </Container>
}

@connect(store => {
  return {
    isShow: store.contactListShowing,
    contacts: store.contactGetList.contacts,
    contactsHasNext: store.contactGetList.hasNext,
    contactsNextOffset: store.contactGetList.nextOffset,
    contactsFetching: store.contactGetList.fetching,
    contactsPartialFetching: store.contactGetListPartial.fetching,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess
  };
}, null, null, {withRef: true})
class ModalContactList extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.inputRef = React.createRef();
    this.scroller = React.createRef();
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.removeContact = this.removeContact.bind(this);
    this.state = {
      searchInput: false
    };
  }

  componentDidUpdate(oldProps) {
    const {chatInstance, dispatch} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      dispatch(contactGetList(statics.offset, statics.count));
    }
    if (oldProps.isShow !== this.props.isShow) {
      if (chatInstance) {
        dispatch(contactGetList(0, statics.count));
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
      dispatch(contactGetList(0, statics.count));
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
    if (!chatRouterLess) {
      history.push(ROUTE_ADD_CONTACT);
    }
  }

  onClose(e, noHistory) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactListShowing());
    this.onContactSearchClick(false);
    this.onSearchQueryChange("");
    if (!chatRouterLess) {
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
    if (!chatRouterLess) {
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

  onScrollBottomThreshold() {
    const {contactsNextOffset, dispatch} = this.props;
    dispatch(contactGetList(contactsNextOffset, statics.count));
  }

  removeContact(contact, e) {
    if (e) {
      e.stopPropagation();
    }
    const {dispatch} = this.props;
    const text = strings.areYouSureAboutDeletingContact();
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      dispatch(contactRemove(contact.id));
      dispatch(chatModalPrompt());
    }, () => dispatch(contactListShowing(true))));
  }

  render() {
    const {contacts, isShow, smallVersion, contactsFetching, chatInstance, contactsHasNext, contactsPartialFetching} = this.props;
    const {searchInput, query} = this.state;
    const showLoading = contactsFetching;
    let contactsFilter = contacts;
    if (searchInput) {
      contactsFilter = isContains("firstName|lastName|cellphoneNumber", query, contactsFilter);
    }
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

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

        <ModalBody threshold={5}
                   onScrollBottomThresholdCondition={contactsHasNext && !contactsPartialFetching}
                   onScrollBottomThreshold={this.onScrollBottomThreshold}>

          {contactsFilter.length ?
            <Container relative>
              <ContactListSelective hasUser={false}
                                    AvatarTextFragment={AvatarTextFragment}
                                    LeftActionFragment={LeftActionFragment.bind(null, this.removeContact)}
                                    invert
                                    onSelect={this.onStartChat.bind(this)}
                                    contacts={contactsFilter}/>
              {contactsPartialFetching && <PartialLoadingFragment/>}
            </Container>

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

const exportDefault = withRouter(ModalContactList);
export {isContains, exportDefault as default};