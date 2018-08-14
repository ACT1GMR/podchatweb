import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactAdd, contactAdding, contactChatting, contactListShowing} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import {InputText} from "raduikit/src/input";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import Message from "raduikit/src/message";
import Container from "raduikit/src/container";


//styling

@connect(store => {
  return {
    isAdding: store.contactAdding.isAdding,
    contactAdd: store.contactAdd.contact,
    contactAddPending: store.contactAdd.fetching,
    contactAddError: store.contactAdd.fetching
  };
})
export default class BoxModalAddContact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobilePhone: "",
      firstName: "",
      lastName: ""
    }
  }

  componentDidUpdate(oldProps) {
    const {contactAdd, isAdding, dispatch} = this.props;
    if (this.props.contactAdd) {
      if (oldProps.contactAdd !== this.props.contactAdd) {
        if (isAdding) {
          if (contactAdd.linkedUser) {
            dispatch(contactAdding(false));
            dispatch(contactListShowing(false));
            dispatch(contactChatting(contactAdd));
          }
        }
      }
    }
  }

  onSubmit() {
    const {mobilePhone, firstName, lastName} = this.state;
    this.props.dispatch(contactAdd(mobilePhone, firstName, lastName));
  }

  onCancel() {
    this.props.dispatch(contactAdding(false));
  }

  onFieldChange(field, event) {
    this.setState({
      [field]: event.target.value
    })
  }

  render() {
    const {isAdding, contactAdd, contactAddPending, contactAddError} = this.props;
    const {mobilePhone, firstName, lastName} = this.state;
    return (
      <Modal isOpen={isAdding} onClose={this.onCancel.bind(this)}>

        <ModalHeader>
          <Heading h3>{strings.addContact}</Heading>
        </ModalHeader>

        <ModalBody>
          <InputText phone max={11} onChange={this.onFieldChange.bind(this, "mobilePhone")}
                     value={mobilePhone}
                     placeholder={strings.mobilePhone}/>
          <InputText max={10} onChange={this.onFieldChange.bind(this, "firstName")} placeholder={strings.firstName} value={firstName}/>
          <InputText max={10} onChange={this.onFieldChange.bind(this, "lastName")} placeholder={strings.lastName}  value={lastName}/>
        </ModalBody>

        <ModalFooter>
          <Button loading={contactAddPending} onClick={this.onSubmit.bind(this)}>{strings.add}</Button>
          <Button onClick={this.onCancel.bind(this)}>{strings.cancel}</Button>
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
