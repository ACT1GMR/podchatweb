// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/loading/LoadingBlinkDots.scss'
import classnames from "classnames";

export default class LoadingBlinkDots extends Component {

  static defaultProps = {
    invert: false,
    large: false,
    xLarge: false,
    small: false,
    src: null
  };

  constructor() {
    super();
  }

  render() {
    let {invert, large, xLarge, small} = this.props;
    const classNames = classnames({"LoadingBlinkDots--Invert": large, "LoadingBlinkDots--lg": xLarge, "LoadingBlinkDots--xlg": xLarge, "LoadingBlinkDots--sm": small});
    return (
      <p className={`LoadingBlinkDots ${classNames}`}><span className="LoadingBlinkDots__Dot"/><span className="LoadingBlinkDots__Dot"/><span className="LoadingBlinkDots__Dot"/></p>
    );
  }
}