import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";
import {ROUTE_CREATE_GROUP, ROUTE_THREAD, ROUTE_ADD_CONTACT} from "../../constants/routes";

//actions
import {contactAdding, contactGetList, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadCreate} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import {Button} from "../../../../uikit/src/button";
import {Heading, Text} from "../../../../uikit/src/typography";
import List, {ListItem} from "../../../../uikit/src/list";
import {InputText} from "../../../../uikit/src/input";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";

//styling
import {MdArrowForward} from "react-icons/lib/md";

const constants = {
  GROUP_NAME: "GROUP_NAME",
  SELECT_CONTACT: "SELECT_CONTACT"
};

@connect(store => {
  return {
    contactModalCreateGroup: store.contactModalCreateGroupShowing,
    contacts: store.contactGetList.contacts,
    contactsFetching: store.contactGetList.fetching,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess
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
    const {isShow, dispatch, match, chatInstance} = this.props;
    if (chatInstance) {
      dispatch(contactGetList());
    }
    if (!isShow) {
      if (match.path === ROUTE_CREATE_GROUP) {
        dispatch(contactModalCreateGroupShowing(true));
      }
    }
  }

  componentDidUpdate(oldProps) {
    const {dispatch, chatInstance} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      dispatch(contactGetList());
    }
  }

  onNext() {
    this.setState({
      step: constants.GROUP_NAME
    });
  }

  onCreate(groupName, isChannel) {
    const {dispatch, chatRouterLess, history} = this.props;
    dispatch(threadCreate(this.state.threadContacts, null, groupName, null, isChannel));
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    this.onClose(false, true);
  }

  onClose(e, noHistory) {
    const {dispatch, chatRouterLess, history} = this.props;
    dispatch(contactModalCreateGroupShowing(false));
    this.setState({
      step: constants.SELECT_CONTACT,
      threadContacts: []
    });
    if (!chatRouterLess) {
      if (!noHistory) {
        history.push("/");
      }
    }
  }

  onAdd() {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactAdding(true));
    if (!chatRouterLess) {
      history.push(ROUTE_ADD_CONTACT);
    }
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
    const {contacts, contactModalCreateGroup, smallVersion, chatInstance, contactsFetching} = this.props;
    const {threadContacts, step, groupName} = this.state;
    const {isShowing, isChannel} = contactModalCreateGroup;
    const showLoading = contactsFetching;

    let filteredContacts = contacts.filter(e => e.hasUser);
    return (
      <Modal isOpen={isShowing} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{step === constants.SELECT_CONTACT ? strings.selectContacts : isChannel ? strings.createGroup(true) : strings.createGroup()}</Heading>
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
              showLoading || !chatInstance ?
                <Container centerTextAlign>
                  <Loading hasSpace><LoadingBlinkDots/></Loading>
                  <Text>{strings.waitingForContact}...</Text>
                </Container>
                :
                <Container centerTextAlign>
                  <Text>{strings.noContactPleaseAddFirst}</Text>
                  <Button text onClick={this.onAdd.bind(this)}>{strings.add}</Button>
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
            <Button text onClick={this.onCreate.bind(this, groupName, isChannel)}>{strings.createGroup(isChannel)}</Button>
          }
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}

export default withRouter(ModalCreateGroup);
