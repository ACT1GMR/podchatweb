// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/loading/Loading.scss'

export default class Loading extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="Loading">
        {this.props.children}
      </div>
    );
  }
}