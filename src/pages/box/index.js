// src/list/messageActions.js
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle } from "../../actions/messageActions";
import BoxRightNav from "./BoxContactList";
import BoxScene from "./BoxScene";
import '../../../styles/pages/box/index.scss';

const mapDispatchToProps = dispatch => {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
};

const classNames = {
  box: 'Box',
  boxRightNav: 'Box__rightNav',
  boxScene: 'Box__scene'
};

class ConnectedForm extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={classNames.box}>
        <BoxRightNav className={classNames.boxRightNav}/>
        <BoxScene className={classNames.boxScene}/>
      </div>
    );
  }
}
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
export default Form;