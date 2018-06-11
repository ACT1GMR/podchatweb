// src/list/List.scss.js
import React, {Component} from "react";
import { connect } from "react-redux";
import {List, ListItem} from '../../../ui_kit/components/list'
const mapStateToProps = state => {
  return { articles: state.articles };
};

class BoxRightNav extends Component {

  constructor() {
    super();

  }

  render() {
    return (
      <List>
        {this.props.articles.map(el => (
          <ListItem key={el.id}>   {el.title}</ListItem>
        ))}
      </List>
    );
  }
}

const connectedBoxRightNav = connect(mapStateToProps)(BoxRightNav);
export default connectedBoxRightNav;