import LoadingSpinner from './LoadingSpinner'
import React, {Component} from "react";
import '../../styles/modules/loading/index.scss'

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

export {LoadingSpinner}
