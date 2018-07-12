// src/list/List.
import React, {Component} from "react";
import style from "../../styles/modules/loading/LoadingSpinner.scss";

export default class LoadingSpinner extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className={style.LoadingSpinner}>
      </div>
    );
  }
}