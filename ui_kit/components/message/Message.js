// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/message/Message.scss'

export default class Message extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="Message">
        {this.props.children}
      </div>
    );
  }
}