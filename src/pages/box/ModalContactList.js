import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactListShowing, contactAdding, contactGetList, contactChatting} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import {Button} from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import List, {ListItem} from "raduikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import {MdClose, MdSearch} from "react-icons/lib/md";

//styling
import {threadCreate} from "../../actions/threadActions";

import style from "../../../styles/pages/box/ModalContactList.scss";
import styleVar from "../../../styles/variables.scss";
import Gap from "raduikit/src/gap";
import {InputText} from "raduikit/src/input";
import {avatarNameGenerator} from "../../utils/helpers";

function isContains(flds, keyword, arr) {
  const fields = flds.split('|');
  if(!keyword || !keyword.trim()) {
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
})
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

  onClose() {
    this.props.dispatch(contactListShowing(false));
    this.onContactSearchClick(false);
    this.onSearchQueryChange("")
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
                  <Container relative>
                    <Avatar>
                      <AvatarImage src={el.linkedUser && el.linkedUser.image} text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter} textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                      <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                    </Avatar>

                    <Container absolute centerLeft>
                      {el.hasUser ? (
                        <Button onClick={this.onStartChat.bind(this, el)} text>
                          {strings.startChat}
                        </Button>
                      ) : (
                        <Button text disabled>{strings.isNotPodUser}</Button>
                      )}
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
