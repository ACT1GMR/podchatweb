// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/list/List.scss'

export default class List extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <ul className="List">
        {this.props.children}
      </ul>
    );
  }
}