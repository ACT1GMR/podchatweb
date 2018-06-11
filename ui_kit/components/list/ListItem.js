// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/list/ListItem.scss'

class ListItem extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <li className="ListItem ListItem--selection">
        {this.props.children}
      </li>
    );
  }
}

export default ListItem;