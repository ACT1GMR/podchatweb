// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreate, threadGetList, threadMessageGetList} from "../../actions/threadActions";

//UI components
import BoxHeadMenu from "./BoxHeadMenu";
import BoxHeadSearch from "./BoxHeadSearch";

//styling
import style from "../../../styles/pages/box/BoxHead.scss";

export default class BoxHead extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className={style.BoxHead}>
        <BoxHeadMenu/>
        <BoxHeadSearch/>
      </section>
    )
  }
}
