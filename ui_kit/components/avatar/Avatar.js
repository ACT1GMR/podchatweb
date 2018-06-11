// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/Avatar.scss'

class Avatar extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <ul className="Avatar">
        {this.props.children}
      </ul>
    );
  }
}

export default Avatar;