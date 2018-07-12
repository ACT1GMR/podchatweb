// src/list/List.
import React, {Component} from "react";
import classnames from "classnames";
import style from "../../styles/modules/list/ListItem.scss";

export default class ListItem extends Component {

  static defaultProps = {
    selection: false,
    active: false,
    onClick: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {selection, active} = this.props;
    let classNames = classnames({[style["ListItem--selection"]]: selection, [style["ListItem--active"]]: active});
    if (classNames) classNames = ` ${classNames}`;
    return (
      <li className={`${style.ListItem}${classNames}`} onClick={this.props.onClick}>
        {this.props.children}
      </li>
    );
  }
}
