import React, {Component} from "react";
import '../../styles/modules/container/index.scss'
import classnames from "classnames";

export default class Container extends Component {

  static defaultProps = {
    maxWidth: false,
    inline: false,
    leftTextAlign: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {inline, leftTextAlign, maxWidth} = this.props;
    const classNames = classnames({"Container--inline": inline, 'u-leftTextAlign': leftTextAlign});
    return (
      <div className={`Content ${classNames}`} style={{maxWidth: `${maxWidth ? `${maxWidth}%` : 'auto'}`}}>
        {this.props.children}
      </div>
    );
  }
}

export {}
