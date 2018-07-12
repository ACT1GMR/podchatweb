// src/list/List.
import React, {Component} from "react";
import classnames from "classnames";
import style from "../../styles/modules/avatar/AvatarName.scss";

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
    const {textInvert, bottom, small, large, xLarge} = this.props;
    let classNames = classnames({
      [style["AvatarName--invert"]]: textInvert,
      [style["AvatarName--bottom"]]: bottom,
      [style["AvatarName--sm"]]: small,
      [style["AvatarName--lg"]]: large
    });
    if (classNames) classNames = ` ${classNames}`;
    return (
      <p className={`${style.AvatarName}${classNames}`}>{this.props.children}</p>
    );
  }
}