// src/list/List.
import React, {Component} from "react";
import style from "../../styles/modules/loading/LoadingBlinkDots.scss";
import classnames from "classnames";

export default class LoadingBlinkDots extends Component {

  static defaultProps = {
    invert: false,
    large: false,
    xLarge: false,
    small: false,
    src: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {invert, large, xLarge, small} = this.props;
    let classNames = classnames({
      [style["LoadingBlinkDots--Invert"]]: invert,
      [style["LoadingBlinkDots--lg"]]: large,
      [style["LoadingBlinkDots--xlg"]]: xLarge,
      [style["LoadingBlinkDots--sm"]]: small
    });
    if (classNames) classNames = ` ${classNames}`;
    return (
      <p className={`${style.LoadingBlinkDots}${classNames}`}><span className={style.LoadingBlinkDots__Dot}/><span className={style.LoadingBlinkDots__Dot}/><span className={style.LoadingBlinkDots__Dot}/></p>
    );
  }
}