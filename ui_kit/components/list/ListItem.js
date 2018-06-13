// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/list/ListItem.scss'

export default class ListItem extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <li className="ListItem ListItem--selection" onClick={this.props.onClick}>
        {this.props.children}
      </li>
    );
  }
}
