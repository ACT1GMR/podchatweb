import React, {Component} from "react";
import '../../styles/modules/container/index.scss'
import classnames from "classnames";

export default class Container extends Component {

  static defaultProps = {
    maxWidth: false,
    inline: false,
    leftTextAlign: false,
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
    const {inline, leftTextAlign, maxWidth, relative, absolute, centerLeft, centerRight, center, bottomRight, bottomLeft, bottomCenter, topRight, topLeft, topCenter, inSpace} = this.props;
    const classNames = classnames({
      "Container--inline": inline,
      "Container--relative": relative,
      "Container--absolute": absolute,
      "Container--centerLeft": centerLeft,
      "Container--centerRight": centerRight,
      "Container--center": center,
      "Container--bottomRight": bottomRight,
      "Container--bottomLeft": bottomLeft,
      "Container--bottomCenter": bottomCenter,
      "Container--topRight": topRight,
      "Container--topLeft": topLeft,
      "Container--topCenter": topCenter,
      "Container--inSpace": inSpace,
      'u-leftTextAlign': leftTextAlign
    });
    return (
      <div className={`Container ${classNames}`} style={{maxWidth: `${maxWidth ? `${maxWidth}` : 'auto'}`}}>
        {this.props.children}
      </div>
    );
  }
}

export {}
