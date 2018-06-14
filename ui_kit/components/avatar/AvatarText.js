// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/AvatarText.scss'

export default class AvatarText extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <p className="AvatarText">{this.props.children}</p>
    );
  }
}