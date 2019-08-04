import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {ROUTE_ADD_CONTACT, ROUTE_CONTACTS, ROUTE_THREAD} from "../../constants/routes";

//actions
import {
  contactAdd,
  contactAdding,
  contactChatting,
  contactListShowing
} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {InputText} from "../../../../uikit/src/input";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import Message from "../../../../uikit/src/message";
import Container from "../../../../uikit/src/container";
import {chatRouterLess} from "../../actions/chatActions";


//styling

@connect(store => {
  return {
    isShowing: store.contactAdding.isShowing,
    contactEdit: store.contactAdding.contactEdit,
    contactAdd: store.contactAdd.contact,
    contactAddPending: store.contactAdd.fetching,
    contactAddError: store.contactAdd.fetching,
    chatRouterLess: store.chatRouterLess
  };
}, null, null, {withRef: true})
class ModalAddContact extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      notEnteredFirstOrFamilyName: false,
      notEnteredMobilePhone: false,
      mobilePhone: "",
      firstName: "",
      lastName: ""
    }
  }

  componentDidMount() {
    const {isShowing, match, dispatch, contactEdit} = this.props;
    if (!isShowing) {
      if (match.path === ROUTE_ADD_CONTACT) {
        dispatch(contactAdding(true));
      }
    }
    if (contactEdit) {
      this.setState({
        mobilePhone: contactEdit.mobilePhone,
        firstName: contactEdit.firstName,
        lastName: contactEdit.lastName
      });
    }
  }

  componentDidUpdate(oldProps) {
    const {chatRouterLess, contactAdd, contactEdit, isShowing, dispatch, history} = this.props;
    if (contactEdit) {
      if (contactEdit !== oldProps.contactEdit) {
        this.setState({
          mobilePhone: contactEdit.mobilePhone,
          firstName: contactEdit.firstName,
          lastName: contactEdit.lastName
        });
        return;
      }
    }
    if (contactAdd) {
      if (oldProps.contactAdd !== contactAdd) {
        if (isShowing) {
          if (!contactEdit) {
            if (contactAdd.linkedUser) {
              this.onClose();
              dispatch(contactListShowing(false));
              dispatch(contactChatting(contactAdd));
              if (!chatRouterLess) {
                history.push(ROUTE_THREAD);
              }
            }
          } else {
            if (!chatRouterLess) {
              history.push(ROUTE_CONTACTS);
            }
            dispatch(contactListShowing(true));
          }
        }
      }
    }
  }

  onSubmit(e) {
    if(e) {
      e.preventDefault();
    }
    const {mobilePhone, firstName, lastName} = this.state;
    if (!mobilePhone) {
      return this.setState({
        notEnteredMobilePhone: true
      });
    }
    if (!firstName || !firstName.trim()) {
      if (!lastName || !lastName.trim()) {
        return this.setState({
          notEnteredFirstOrFamilyName: true
        });
      }
    }
    const {contactEdit, dispatch} = this.props;
    dispatch(contactAdd(mobilePhone, firstName, lastName, contactEdit));
    this.setState({
      notEnteredFirstOrFamilyName: false,
      notEnteredMobilePhone: false
    });

  }

  onClose(e, noHistory) {
    const {chatRouterLess, history, dispatch} = this.props;
    dispatch(contactAdding(false));
    this.setState({
      mobilePhone: "",
      firstName: "",
      lastName: ""
    });
    if (!chatRouterLess) {
      if (!noHistory) {
        history.push("/");
      }
    }
  }

  onFieldChange(field, event) {
    this.setState({
      notEnteredFirstOrFamilyName: false,
      [field]: event.target.value
    });
  }

  render() {
    const {isShowing, contactAdd, contactAddPending, smallVersion, contactEdit} = this.props;
    const {mobilePhone, firstName, lastName, notEnteredFirstOrFamilyName, notEnteredMobilePhone} = this.state;
    return (
      <Modal isOpen={isShowing} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{contactEdit ? strings.editContact(contactEdit) : strings.addContact}</Heading>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={this.onSubmit}>
            {!contactEdit &&
            <InputText phone max={11} onChange={this.onFieldChange.bind(this, "mobilePhone")}
                       value={mobilePhone}
                       placeholder={`${strings.mobilePhone} ( ${strings.required} )`}/>
            }
            <InputText max={15} onChange={this.onFieldChange.bind(this, "firstName")}
                       placeholder={`${strings.firstName} ( ${strings.required} )`}
                       value={firstName}/>
            <InputText max={15} onChange={this.onFieldChange.bind(this, "lastName")} placeholder={strings.lastName}
                       value={lastName}/>
            <input type="submit" style={{display: "none"}}/>
          </form>

        </ModalBody>

        <ModalFooter>
          <Button text loading={contactAddPending}
                  onClick={this.onSubmit}>{contactEdit ? strings.edit : strings.add}</Button>
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
          {((contactAdd && !contactAdd.linkedUser) || notEnteredFirstOrFamilyName || notEnteredMobilePhone) &&

          <Container inline>
            <Message warn>
              {notEnteredFirstOrFamilyName ? strings.firstOrFamilyNameIsRequired : notEnteredMobilePhone ? strings.mobilePhoneIsRequired : strings.isNotPodUser}
            </Message>
          </Container>

          }

        </ModalFooter>

      </Modal>
    )
  }
}

export default withRouter(ModalAddContact);