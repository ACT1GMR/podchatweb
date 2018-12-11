import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";

//actions
import {contactAdding, contactGetList, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadModalListShowing, threadCreate} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import List, {ListItem} from "../../../../uikit/src/list";
import {InputText} from "../../../../uikit/src/input";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import {MdArrowForward} from "react-icons/lib/md";

//styling
import {avatarNameGenerator} from "../../utils/helpers";
import {ROUTE_ADD_CONTACT, ROUTE_CREATE_GROUP, ROTE_THREAD} from "../../constants/routes";

const constants = {
  GROUP_NAME: "GROUP_NAME",
  SELECT_CONTACT: "SELECT_CONTACT"
};

@connect(store => {
  return {
    isShow: store.contactModalCreateGroupShowing.isShow,
    contacts: store.contactGetList.contacts
  };
}, null, null, {withRef: true})
class ModalCreateGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      threadContacts: [],
      groupName: "",
      step: constants.SELECT_CONTACT
    };
    this.onAdd = this.onAdd.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const {isShow, dispatch, match} = this.props;
    dispatch(contactGetList());
    if(!isShow) {
      if(match.path === ROUTE_CREATE_GROUP) {
        dispatch(contactModalCreateGroupShowing(true));
      }
    }
  }

  onNext() {
    this.setState({
      step: constants.GROUP_NAME
    });
  }

  onCreate(groupName) {
    const {dispatch, history} = this.props;
    dispatch(threadCreate(this.state.threadContacts, null, groupName));
    history.push(ROTE_THREAD);
    this.onClose(false, true);
  }

  onClose(e, noHistory) {
    const {dispatch, history} = this.props;
    dispatch(contactModalCreateGroupShowing(false));
    this.setState({
      step: constants.SELECT_CONTACT,
      threadContacts: []
    });
    if(!noHistory){
      history.push("/");
    }
  }

  onAdd() {

  }

  onSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.push(id);
    this.setState({
      threadContacts: contactsClone
    });
  }

  onDeSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.splice(contactsClone.indexOf(id), 1);
    this.setState({
      threadContacts: contactsClone
    });
  }

  groupNameChange(event) {
    this.setState({
      groupName: event.target.value
    })
  }

  render() {
    const {contacts, isShow, smallVersion} = this.props;
    const {threadContacts, step, groupName} = this.state;

    let filteredContacts = contacts.filter(e => e.hasUser);
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalHeader>
          <Heading h3>{strings.selectContacts}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.SELECT_CONTACT ?
            contacts.length ?
              <List>
                {filteredContacts.map(el => (
                  <ListItem key={el.id} invert selection activeWithTick multiple
                            active={threadContacts.indexOf(el.id) > -1}
                            onSelect={this.onSelect.bind(this, el.id)}
                            onDeselect={this.onDeSelect.bind(this, el.id)}>
                    <Container>

                      <Avatar>
                        <AvatarImage src={el.image} text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                     textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                        <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                      </Avatar>

                    </Container>
                  </ListItem>
                ))}
              </List>
              :
              <Container center>
                <Button text onClick={this.onAdd}>{strings.add}</Button>
              </Container>
            :
            <InputText onChange={this.groupNameChange.bind(this)}
                       value={groupName}
                       placeholder={strings.groupName}/>
          }


        </ModalBody>

        <ModalFooter>
          {step === constants.SELECT_CONTACT ?
            threadContacts.length > 1 ?
              <Button text onClick={this.onNext.bind(this)}>
                <MdArrowForward/>
              </Button>
              : ""
            :
            <Button text onClick={this.onCreate.bind(this, groupName)}>{strings.createGroup}</Button>
          }
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}

export default withRouter(ModalCreateGroup);
