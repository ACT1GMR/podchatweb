// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactAdd, contactAdding} from "../../actions/contactActions";

//UI components
import Menu, {MenuItem} from "../../../../uikit/src/menu";

//styling
import style from "../../../styles/pages/box/BoxMenu.scss";
import Container from "../../../../uikit/src/container";
import {InputText} from "../../../../uikit/src/input";

@connect(store => {
  return {
    isAdding: store.contactAdding.isAdding
  };
})
export default class BoxModalAddContact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobilePhone: null,
      firstName: null,
      lastName: null,
      isOpen: this.props.isAdding
    }
  }

  onSubmit() {
    const {phoneNumber, firstName, lastName} = this.props;
    this.props.dispatch(contactAdd(phoneNumber, firstName, lastName));
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
    const {isAdding} = this.props;
    return (
      <Modal isOpen={isAdding}>
        <ModalHeader>
          <Heading h3>${strings.addContact}</Heading>
        </ModalHeader>
        <form onSubmit={this.onSubmit.bind(this)}>
          <ModalBody>
            <InputText phone max={11} onChange={this.onFieldChange.bind(this, "mobilePhone")}/>
            <InputText max={10} onChange={this.onFieldChange.bind(this, "firstName")}/>
            <InputText max={10} onChange={this.onFieldChange.bind(this, "lastName")}/>
          </ModalBody>
          <ModalFooter>
            <Button submit onClick={this.onClick.bind(this)}>{strings.add}</Button>
            <Button onClick={this.onCancel.bind(this)}>{strings.cancel}</Button>
          </ModalFooter>
        </form>
      </Modal>
    )
  }
}
