import React, {Component} from "react";
import '../../styles/modules/shape/ShapeCircle.scss'
import classnames from "classnames";

export default class ShapeCircle extends Component {

  static defaultProps = {

  };

  constructor(props) {
    super(props);
  }

  render() {
    const {} = this.props;
    const classNames = classnames({});
    return (
      <div className={`ShapeCircle ${classNames}`}>
        {this.props.children}
      </div>
    );
  }
}
