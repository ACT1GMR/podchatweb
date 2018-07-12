import LoadingSpinner from "./LoadingSpinner";
import LoadingBlinkDots from "./LoadingBlinkDots";
import React, {Component} from "react";
import style from "../../styles/modules/loading/index.scss";
import classnames from "classnames";

export default class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.Loading}>
        {this.props.children}
      </div>
    );
  }
}

export {LoadingSpinner, LoadingBlinkDots};
