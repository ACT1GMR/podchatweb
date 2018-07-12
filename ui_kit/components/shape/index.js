import React, {Component} from "react";
import style from "../../styles/modules/shape/index.scss";
import classnames from "classnames";
import ShapeCircle from "./ShapeCircle";

export default class Shape extends Component {

  static defaultProps = {
    small: false,
    large: false,
    xLarge: false,
    colorAccent: false,
    colorPrimary: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {small, large, xLarge, colorAccent, colorPrimary} = this.props;
    let classNames = classnames({
      [style["Shape--sm"]]: small,
      [style["Shape--lg"]]: large,
      [style["Shape--xlg"]]: xLarge,
      [style["Shape--colorAccent"]]: colorAccent,
      [style["Shape--colorPrimary"]]: colorPrimary
    });
    if (classNames) classNames = ` ${classNames}`;
    return (
      <div className={`${style.Shape}${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {ShapeCircle}
