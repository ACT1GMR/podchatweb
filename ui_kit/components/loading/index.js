import LoadingSpinner from './LoadingSpinner'
import LoadingBlinkDots from './LoadingBlinkDots'
import React, {Component} from "react";
import '../../styles/modules/loading/index.scss'
import classnames from "classnames";

export default class Loading extends Component {

  static defaultProps = {
    invert: false
  };

  constructor() {
    super();
  }

  render() {
    const {invert} = this.props;
    const classNames = classnames({"Loading--invert": invert});
    return (
      <div className={`Loading ${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}

export {LoadingSpinner, LoadingBlinkDots};
