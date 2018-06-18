import React, {Component} from "react";

import './../_base';
import AvatarImage from './AvatarImage'
import AvatarName from './AvatarName'
import AvatarText from './AvatarText'
import '../../styles/modules/avatar/index.scss'
import classnames from "classnames";

export default class Avatar extends Component {

  static defaultProps = {
    left: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {left} = this.props;
    const classNames = classnames({"Avatar--left": left, "u-clearfix": left});
    return (
      <div className={`Avatar ${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {AvatarText, AvatarName, AvatarImage}
