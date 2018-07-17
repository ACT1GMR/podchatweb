// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization"

//actions
import {getThreadInfo} from "../../actions/threadActions";

//UI components

//styling
import style from "../../../styles/pages/box/BoxHeadSearch.scss";

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadId: store.thread.thread.id
  };
})
export default class BoxMenu extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {menuItems} = this.props;
    return (
      <section className={style.BoxMenu}>
      </section>
    )
  }
}
