// src/list/List.
import React, {Component} from "react";
import classnames from "classnames";
import '../../styles/modules/avatar/AvatarName.scss'

export default class AvatarName extends Component {

  static defaultProps = {
    textInvert: false,
    bottom: false,
    small: false,
    large: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {textInvert, bottom} = this.props;
    let {small, large, xLarge} = this.props;
    const sizeClassNames = classnames({'AvatarName--sm': small, 'AvatarName--lg': large});
    const classNames = classnames({"AvatarName--invert": textInvert, "AvatarName--bottom": bottom});
    return (
      <p className={`AvatarName ${classNames} ${sizeClassNames}`}>{this.props.children}</p>
    );
  }
}