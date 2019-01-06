import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";

//actions
import {contactAdd, contactAdding, contactChatting, contactListShowing} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {InputText} from "../../../../uikit/src/input";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import Message from "../../../../uikit/src/message";
import Container from "../../../../uikit/src/container";
import {ROUTE_ADD_CONTACT, ROUTE_CONTACTS, ROTE_THREAD} from "../../constants/routes";


//styling

@connect(store => {
  return {
    isShowing: store.contactAdding.isShowing,
    contactEdit: store.contactAdding.contactEdit,
    contactAdd: store.contactAdd.contact,
    contactAddPending: store.contactAdd.fetching,
    contactAddError: store.contactAdd.fetching
  };
}, null, null, {withRef: true})
class ModalAddContact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobilePhone: "",
      firstName: "",
      lastName: ""
    }
  }

  componentDidMount() {
    const {contactEdit, isShowing, match, dispatch} = this.props;
    if (contactEdit) {
      this.setState({
        mobilePhone: contactEdit.mobilePhone,
        firstName: contactEdit.firstName,
        lastName: contactEdit.lastName
      });
    }
    if (!isShowing) {
      if (match.path === ROUTE_ADD_CONTACT) {
        dispatch(contactAdding(true));
      }
    }
  }

  componentDidUpdate(oldProps) {
    const {contactAdd, isShowing, dispatch, contactEdit, history} = this.props;
    if (contactAdd) {
      if (oldProps.contactAdd !== contactAdd) {
        if (isShowing) {
          if (!contactEdit) {
            if (contactAdd.linkedUser) {
              this.onClose();
              dispatch(contactListShowing(false));
              dispatch(contactChatting(contactAdd));
              history.push(ROTE_THREAD);
            }
          } else {
            history.push(ROUTE_CONTACTS);
            dispatch(contactListShowing(true));
          }
        }
      }
    }
  }

  onSubmit() {
    const {mobilePhone, firstName, lastName} = this.state;
    const {contactEdit} = this.props;
    this.props.dispatch(contactAdd(mobilePhone, firstName, lastName, contactEdit));
  }

  onClose(e, noHistory) {
    const {history, dispatch} = this.props;
    dispatch(contactAdding(false));
    this.setState({
      mobilePhone: "",
      firstName: "",
      lastName: ""
    });
    if (!noHistory) {
      history.push("/");
    }
  }

  onFieldChange(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    const {isShowing, contactAdd, contactAddPending, smallVersion, contactEdit} = this.props;
    const {mobilePhone, firstName, lastName} = this.state;
    return (
      <Modal isOpen={isShowing} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalHeader>
          <Heading h3>{contactEdit ? strings.editContact(contactEdit) : strings.addContact}</Heading>
        </ModalHeader>

        <ModalBody>
          <InputText phone max={11} onChange={this.onFieldChange.bind(this, "mobilePhone")}
                     value={mobilePhone}
                     placeholder={strings.mobilePhone}/>
          <InputText max={10} onChange={this.onFieldChange.bind(this, "firstName")} placeholder={strings.firstName}
                     value={firstName}/>
          <InputText max={10} onChange={this.onFieldChange.bind(this, "lastName")} placeholder={strings.lastName}
                     value={lastName}/>
        </ModalBody>

        <ModalFooter>
          <Button text loading={contactAddPending}
                  onClick={this.onSubmit.bind(this)}>{contactEdit ? strings.edit : strings.add}</Button>
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
          {contactAdd && !contactAdd.linkedUser &&
          (
            <Container inline>
              <Message warn>
                {strings.isNotPodUser}
              </Message>
            </Container>
          )
          }

        </ModalFooter>

      </Modal>
    )
  }
}

export default withRouter(ModalAddContact);