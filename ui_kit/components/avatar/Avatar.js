// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/Avatar.scss'
import classnames from "classnames";

export default class Avatar extends Component {


  static defaultProps = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {left} = this.props;
    const classNames = classnames({});
    return (
      <div className={`Avatar ${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}