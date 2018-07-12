import React, {Component} from "react";
import style from "../../styles/modules/shape/ShapeCircle.scss";
import classnames from "classnames";

export default class ShapeCircle extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.ShapeCircle}>
        {this.props.children}
      </div>
    );
  }
}
