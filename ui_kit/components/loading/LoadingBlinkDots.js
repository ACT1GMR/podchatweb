// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/loading/LoadingBlinkDots.scss'
import classnames from "classnames";

export default class LoadingBlinkDots extends Component {

  static defaultProps = {
    invert: false
  };

  constructor() {
    super();
  }

  render() {
    let {invert} = this.props;
    const classNames = classnames({"LoadingBlinkDots--Invert": invert});
    return (
      <p className={`LoadingBlinkDots ${classNames}`}><span className="LoadingBlinkDots__Dot"/><span className="LoadingBlinkDots__Dot"/><span className="LoadingBlinkDots__Dot"/></p>
    );
  }
}