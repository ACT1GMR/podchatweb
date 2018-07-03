import React, {Component} from "react";
import '../../styles/modules/shape/index.scss'
import classnames from "classnames";
import ShapeCircle from './ShapeCircle';

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
    const sizeClassNames = classnames({
      'Shape--sm': small,
      'Shape--lg': large,
      'Shape--xlg': xLarge,
      'Shape--colorAccent': colorAccent,
      'Shape--colorPrimary': colorPrimary
    });
    return (
      <div className={`Shape ${sizeClassNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {ShapeCircle}
