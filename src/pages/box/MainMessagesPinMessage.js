import React, {Component} from "react";
import {connect} from "react-redux";

//components
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";

//styling
import {
  MdClose,
  MdBookmarkOutline,
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessagesPinMessage.scss";
import styleVar from "../../../styles/variables.scss";

@connect(store => {
  return {};
})
export default class MainMessagesPinMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {messageVo} = this.props;
    return <Container className={style.MainMessagesPinMessage}>

        <Container centerRight className={style.MainMessagesPinMessage__Message}>
          <Container className={style.MainMessagesPinMessage__MessageIcon}>
            <MdBookmarkOutline size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
          </Container>
          <Container>
          <Text isHTML>
            {messageVo.text}
          </Text>
          </Container>
        </Container>

        <Container centerLeft className={style.MainMessagesPinMessage__CloseIcon}>
          <MdClose size={styleVar.iconSizeMd} color={styleVar.colorTextLight}/>
        </Container>
    </Container>
  }
}