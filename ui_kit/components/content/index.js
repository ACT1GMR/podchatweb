import React, {Component} from "react";
import '../../styles/modules/content/index.scss'
import classnames from "classnames";
import ContentFooter from "./ContentFooter"

export default class Content extends Component {

  static defaultProps = {
    hasBackground: false,
    borderRadius: 0
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {borderRadius, hasBackground} = this.props;
    const classNames = classnames({"Content--hasBackground": hasBackground});
    return (
      <div className={`Content ${classNames}`} style={{borderRadius: borderRadius}}>
        {this.props.children}
      </div>
    );
  }
}

export {ContentFooter}
