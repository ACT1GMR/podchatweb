import React, {Component} from "react";
import style from "../../styles/modules/container/index.scss"
import utilsStyle from "../../styles/utils/index.scss"
import classnames from "classnames";

export default class Container extends Component {

  static defaultProps = {
    maxWidth: false,
    inline: false,
    leftTextAlign: false,
    centerTextAlign: false,
    relative: false,
    absolute: false,
    centerLeft: false,
    centerRight: false,
    center: false,
    bottomRight: false,
    bottomLeft: false,
    bottomCenter: false,
    topRight: false,
    topLeft: false,
    topCenter: false,
    inSpace: false,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {inline, leftTextAlign, centerTextAlign, maxWidth, relative, absolute, centerLeft, centerRight, center, bottomRight, bottomLeft, bottomCenter, topRight, topLeft, topCenter, inSpace} = this.props;
    let classNames = classnames({
      [style["Container--inline"]]: inline,
      [style["Container--relative"]]: relative,
      [style["Container--absolute"]]: absolute,
      [style["Container--centerLeft"]]: centerLeft,
      [style["Container--centerRight"]]: centerRight,
      [style["Container--center"]]: center,
      [style["Container--bottomRight"]]: bottomRight,
      [style["Container--bottomLeft"]]: bottomLeft,
      [style["Container--bottomCenter"]]: bottomCenter,
      [style["Container--topRight"]]: topRight,
      [style["Container--topLeft"]]: topLeft,
      [style["Container--topCenter"]]: topCenter,
      [style["Container--inSpace"]]: inSpace,
      [utilsStyle["u-leftTextAlign"]]: leftTextAlign,
      [utilsStyle["u-centerTextAlign"]]: centerTextAlign
    });
    if (classNames) classNames = ` ${classNames}`;
    return (
      <div className={`${style.Container}${classNames}`} style={{maxWidth: `${maxWidth ? `${maxWidth}` : "auto"}`}}>
        {this.props.children}
      </div>
    );
  }
}

export {}
