// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/content/ContentFooter.scss'

export default class ContentFooter extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="ContentFooter">
        {this.props.children}
      </div>
    );
  }
}