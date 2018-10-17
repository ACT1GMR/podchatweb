// src/
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadLeftAsideShowing} from "../../actions/threadActions";

//UI components
import {Text} from "raduikit/src/typography";
import {MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/LeftAsideHead.scss";
import styleVar from "./../../../styles/variables.scss";
import Container from "raduikit/src/container";
import utilsStlye from "../../../styles/utils/utils.scss";
import classnames from "classnames";

const statics = {
  headMenuSize: 59
};

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion
  }
})
export default class LeftAsideHead extends Component {

  constructor(props) {
    super(props);
    this.onLeftAsideHide = this.onLeftAsideHide.bind(this);
  }

  onLeftAsideHide() {
    this.props.dispatch(threadLeftAsideShowing(false));
  }

  render() {
    const {smallVersion} = this.props;
    const iconSize = styleVar.iconSizeMd.replace("px", "");
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    const classNames = classnames({
      [style.LeftAsideHead]: true,
      [style["LeftAsideHead--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} ref={this.container}>
        <Container inline onClick={this.onLeftAsideHide}>
          <MdClose size={iconSize}
                   className={utilsStlye["u-clickable"]}
                   onClick={this.onLeftAsideHide}
                   style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        </Container>
        <Container inline>
          <Text invert>{strings.searchMessages}</Text>
        </Container>
      </Container>
    )
  }
}
