// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/Avatar.scss'

export default class Avatar extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="Avatar">
        {this.props.children}
      </div>
    );
  }
}