import '../_base';
import React, {Component} from "react";
import ListItem from './ListItem'
import '../../styles/modules/list/index.scss'

export default class List extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <ul className="List">
        {this.props.children}
      </ul>
    );
  }
}

export {ListItem};