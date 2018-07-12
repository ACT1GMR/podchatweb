import React, {Component} from "react";
import style from "../../styles/modules/content/index.scss";
import classnames from "classnames";
import ContentFooter from "./ContentFooter";

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
    let classNames = classnames({[style["Content--hasBackground"]]: hasBackground});
    if (classNames) classNames = ` ${classNames}`;
    return (
      <div className={`${style.Content}${classNames}`} style={{borderRadius: borderRadius}}>
        {this.props.children}
      </div>
    );
  }
}

export {ContentFooter}
