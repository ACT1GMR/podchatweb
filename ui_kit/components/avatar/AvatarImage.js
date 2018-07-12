// src/list/List.
import React, {Component} from "react";
import style from "../../styles/modules/avatar/AvatarImage.scss";
import classnames from "classnames";

export default class AvatarImage extends Component {

  static defaultProps = {
    small: false,
    large: false,
    xLarge: false,
    src: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {src, small, large, xLarge} = this.props;
    let classNames = classnames({[style["AvatarImage--sm"]]: small, [style["AvatarImage--lg"]]: large, [style["AvatarImage--lg"]]: xLarge});
    if (classNames) classNames = ` ${classNames}`;
    return (
      <div className={`${style.AvatarImage}${classNames}`}>
        <img src={src} className={style.AvatarImage__image}/>
      </div>
    );
  }
}