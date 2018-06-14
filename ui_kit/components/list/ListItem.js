// src/list/List.
import React, {Component} from "react";
import classnames from "classnames";
import '../../styles/modules/list/ListItem.scss'

export default class ListItem extends Component {

  static defaultProps = {
    selection: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {selection} = this.props;
    const classNames = classnames({"ListItem--selection": selection});
    return (
      <li className={`ListItem ${classNames}`} onClick={this.props.onClick}>
        {this.props.children}
      </li>
    );
  }
}
