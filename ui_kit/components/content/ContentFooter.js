// src/list/List.
import React, {Component} from "react";
import style from "../../styles/modules/content/ContentFooter.scss";

export default class ContentFooter extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.ContentFooter}>
        {this.props.children}
      </div>
    );
  }
}