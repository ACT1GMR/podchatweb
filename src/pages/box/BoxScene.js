// src/list/BoxScene.jss
import React, {Component} from "react";
import { connect } from "react-redux";
import '../../../styles/pages/box/BoxScene.scss'

const mapStateToProps = state => {
  return { articles: state.articles };
};
class BoxScene extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="list-group list-group-flush">
        {this.props.articles.map(el => (
          <li className="list-group-item" key={el.id}>
            {el.title}
          </li>
        ))}
      </div>
    );
  }
}

const List = connect(mapStateToProps)(BoxScene);
export default List;