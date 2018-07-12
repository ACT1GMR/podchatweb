import React, {Component} from "react";

import "./../_base";
import AvatarImage from "./AvatarImage";
import AvatarName from "./AvatarName";
import AvatarText from "./AvatarText";
import style from "../../styles/modules/avatar/index.scss";
import utilsStyle from "../../styles/utils/index.scss";
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
    let classNames = classnames({[style["Avatar--left"]]: left, [utilsStyle["u-leftTextAlign"]]: left});
    if (classNames) classNames = ` ${classNames}`;
    return (
      <div className={`${style.Avatar}${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {AvatarText, AvatarName, AvatarImage}
