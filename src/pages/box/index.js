// src/list/messageActions.js
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle } from "../../actions/messageActions";
import BoxContactList from "./BoxContactList";
import BoxScene from "./BoxScene";
import '../../../styles/pages/box/index.scss';

const mapDispatchToProps = dispatch => {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
};

const classNames = {
  box: 'Box'
};

class ConnectedForm extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={classNames.box}>
        <BoxContactList/>
        <BoxScene/>
      </div>
    );
  }
}
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
export default Form;