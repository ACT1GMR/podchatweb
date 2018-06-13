// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/AvatarName.scss'

export default class AvatarName extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <p className="AvatarName">{this.props.children}</p>
    );
  }
}