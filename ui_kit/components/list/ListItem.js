// src/list/List.
import React, {Component} from "react";
import classnames from "classnames";
import '../../styles/modules/list/ListItem.scss'

export default class ListItem extends Component {

  static defaultProps = {
    selection: false,
    leftTextAlign: false,
    active: false,
    onClick: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {selection, leftTextAlign, active} = this.props;
    const classNames = classnames({"ListItem--selection": selection, "ListItem--active": active});
    return (
      <li className={`ListItem ${classNames}`} onClick={this.props.onClick}>
        {this.props.children}
      </li>
    );
  }
}
