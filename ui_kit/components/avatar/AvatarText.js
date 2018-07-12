// src/list/List.
import React, {Component} from "react";
import style from "../../styles/modules/avatar/AvatarText.scss";

export default class AvatarText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p className={style.AvatarText}>{this.props.children}</p>
    );
  }
}