// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization"

//actions
import {threadCreate, threadGetList, threadMessageGetList, getThreadInfo} from "../../actions/threadActions";

//UI components
import Menu, {MenuItem} from "../../../../uikit/src/menu";
import BoxModal from "./BoxModal"

//styling
import style from "../../../styles/pages/box/BoxMenu.scss";
import Container from "../../../../uikit/src/container";

@connect(store => {
  return {
    contactList: store.contactList.contacts
  };
})
export default class BoxModal extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <BoxModal>
        <Container>

        </Container>
      </BoxModal>
    )
  }
}
