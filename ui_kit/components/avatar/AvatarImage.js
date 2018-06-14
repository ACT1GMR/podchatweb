// src/list/List.
import React, {Component} from "react";
import '../../styles/modules/avatar/AvatarImage.scss'
import classnames from "classnames";

export default class AvatarImage extends Component {

  static defaultProps = {
    small: false,
    large: false,
    xLarge: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {small, large, xLarge} = this.props;
    const sizeClassNames = classnames({'AvatarImage--sm': small, 'AvatarImage--lg': large, 'AvatarImage--xlg': xLarge});

    return (
      <img className={`AvatarImage ${sizeClassNames}`}/>
    );
  }
}