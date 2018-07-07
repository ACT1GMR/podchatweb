import React, {Component} from "react";
import '../../styles/modules/message/index.scss'
import classnames from "classnames";

export default class Message extends Component {

  static defaultProps = {
    small: false,
    large: false,
    xLarge: false,
    src: null
  };

  constructor() {
    super();
  }

  render() {
    const {small, large, xLarge} = this.props;
    const sizeClassNames = classnames({'Message--sm': small, 'Message--lg': large, 'Message--xlg': xLarge});
    return (
      <div className={`Message ${sizeClassNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {}
