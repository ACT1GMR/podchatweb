import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  contactGetList,
} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading, Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Gap from "../../../../uikit/src/gap";
import {InputText} from "../../../../uikit/src/input";
import {MdSearch, MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/ModalContactList.scss";
import styleVar from "../../../styles/variables.scss";
import {ContactListSelective} from "./_component/contactList";


export const statics = {
  count: 15,
  userType: {
    ALL: "ALL",
    HAS_POD_USER: "HAS_POD_USER",
    NOT_POD_USER: "NOT_POD_USER"
  }
};

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

@connect(store => {
  return {
    contacts: store.contactGetList.contacts,
    contactsHasNext: store.contactGetList.hasNext,
    contactsNextOffset: store.contactGetList.nextOffset,
    contactsFetching: store.contactGetList.fetching,
    contactsPartialFetching: store.contactGetListPartial.fetching,
    chatInstance: store.chatInstance.chatSDK
  };
})
export default class ModalContactList extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.state = {
      query: null
    };
  }

  componentDidUpdate({isShow: oldIsShow, chatInstance: oldChatInstance}) {
    const {chatInstance, dispatch, isShow} = this.props;
    const {searchInput} = this.state;
    if (oldChatInstance !== chatInstance) {
      dispatch(contactGetList(0, statics.count, searchInput));
    }
    if (oldIsShow !== isShow) {
      if (chatInstance) {
        dispatch(contactGetList(0, statics.count, searchInput));
      }
    }
    if (searchInput) {
      const current = this.inputRef.current;
      if (current) {
        this.inputRef.current.focus();
      }
    }
  }

  componentDidMount() {
    const {dispatch, chatInstance} = this.props;
    if (chatInstance) {
      dispatch(contactGetList(null, null, null, true));
      dispatch(contactGetList(0, statics.count));
    }
  }

  onSearchQueryChange(e) {
    const {dispatch} = this.props;
    const {query} = this.state;
    dispatch(contactGetList(0, statics.count, query));
    this.setState({
      query: e.target ? e.target.value : e
    });
  }

  onScrollBottomThreshold() {
    const {contactsNextOffset, dispatch} = this.props;
    const {query} = this.state;
    dispatch(contactGetList(contactsNextOffset, statics.count, query));
  }

  render() {
    const {contacts, isShow, smallVersion, chatInstance, onClose, onAdd, onSelect, contactsHasNext, contactsFetching, contactsPartialFetching, FooterFragment, LeftActionFragment} = this.props;
    const {searchInput, query} = this.state;
    return (
      <Modal isOpen={isShow} onClose={onClose} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.contactList}</Heading>
          <Container relative>
            <Container centerRight>
              <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorGrayDark}/>
            </Container>
            <InputText className={style.ModalContactList__Input} onChange={this.onSearchQueryChange} value={query}
                       placeholder={strings.search} ref={this.inputRef}/>
            <Container centerLeft>
              <Gap x={5}>
                {
                  query && query.trim() ?

                    <MdClose size={styleVar.iconSizeMd}
                             color={styleVar.colorGrayDark}
                             style={{cursor: "pointer"}}
                             onClick={this.onSearchQueryChange.bind(this, "")}/>
                    : ""

                }
              </Gap>
            </Container>
          </Container>

        </ModalHeader>

        <ModalBody threshold={5}
                   onScrollBottomThresholdCondition={contactsHasNext && !contactsPartialFetching}
                   onScrollBottomThreshold={this.onScrollBottomThreshold}>

          {contacts.length ?
            <Container relative>
              <ContactListSelective invert
                                    hasUser={false}
                                    AvatarTextFragment={AvatarTextFragment}
                                    LeftActionFragment={LeftActionFragment}
                                    onSelect={onSelect}
                                    contacts={contacts}/>
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
              contactsFetching || !chatInstance ?
                <Container centerTextAlign className={style.ModalContactList__Loading}>
                  <Loading hasSpace><LoadingBlinkDots/></Loading>
                  <Text>{strings.waitingForContact}...</Text>
                </Container>
                :
                <Container centerTextAlign className={style.ModalContactList__Loading}>
                  <Text>{strings.noContactPleaseAddFirst}</Text>
                  <Button text onClick={onAdd.bind(this)}>{strings.add}</Button>
                </Container>
          }
        </ModalBody>

        <ModalFooter>
          <FooterFragment/>
        </ModalFooter>

      </Modal>
    )
  }
}