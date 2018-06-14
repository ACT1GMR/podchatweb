// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/Avatar.scss'
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
    const classNames = classnames({"Avatar--left": left});
    return (
      <div className={`Avatar ${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}