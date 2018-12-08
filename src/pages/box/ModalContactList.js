import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  contactListShowing,
  contactAdding,
  contactGetList,
  contactChatting,
  contactRemove,
  contactEdit
} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import {MdClose, MdDelete, MdSearch, MdEdit} from "react-icons/lib/md";

//styling
import {threadCreate} from "../../actions/threadActions";
import {chatModalPrompt} from "../../actions/chatActions";

import style from "../../../styles/pages/box/ModalContactList.scss";
import styleVar from "../../../styles/variables.scss";
import Gap from "../../../../uikit/src/gap";
import {InputText} from "../../../../uikit/src/input";
import {avatarNameGenerator} from "../../utils/helpers";

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
    contacts: store.contactGetList.contacts
  };
}, null, null, {withRef: true})
export default class ModalContactList extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      searchInput: false
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.isShow !== this.props.isShow) {
      this.props.dispatch(contactGetList());
    }
    if (this.state.searchInput) {
      const current = this.inputRef.current;
      if (current) {
        this.inputRef.current.focus();
      }
    }
  }

  componentDidMount() {
    this.props.dispatch(contactGetList());
  }

  onAdd() {
    this.props.dispatch(contactAdding(true));
    this.onContactSearchClick(false);
  }

  onRemove(contact, e) {
    e.stopPropagation();
    this.onClose();
    const {dispatch} = this.props;
    const text = strings.areYouSureAboutDeletingContact(`${contact.firstName} ${contact.lastName}`);
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      dispatch(contactRemove(contact.id));
      dispatch(chatModalPrompt());
      dispatch(contactListShowing(true));
    }, () => dispatch(contactListShowing(true))));
  }

  onEdit(contact, e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    dispatch(contactAdding(true, {
      firstName: contact.firstName,
      lastName: contact.lastName,
      mobilePhone: contact.cellphoneNumber
    }));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(contactListShowing(false));
    this.onContactSearchClick(false);
    this.onSearchQueryChange("");
  }

  onStartChat(contact) {
    this.props.dispatch(contactChatting(contact));
    this.props.dispatch(threadCreate(contact.id));
    this.onClose();
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
    const {contacts, isShow, smallVersion} = this.props;
    const {searchInput, query} = this.state;
    let contactsFilter = contacts;
    if (searchInput) {
      contactsFilter = isContains('firstName|lastName|cellphoneNumber', query, contacts);
    }
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

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
                    <Avatar>
                      <AvatarImage src={el.linkedUser && el.linkedUser.image}
                                   text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                   textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                      <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                    </Avatar>

                    <Container centerLeft>
                      {el.hasUser ?
                        <Container className={style.ModalContactList__ActionButtonContainer}>
                          <Container className={style.ModalContactList__ActionButton}
                                     onClick={this.onEdit.bind(this, el)}>
                            <MdEdit size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
                          </Container>
                          <Container className={style.ModalContactList__ActionButton} inline
                                     onClick={this.onRemove.bind(this, el)}>
                            <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
                          </Container>
                        </Container>
                        : <Button text disabled>{strings.isNotPodUser}</Button>
                      }
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
              <Container center>
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
