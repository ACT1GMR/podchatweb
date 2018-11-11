// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {
  threadShowing,
  threadLeftAsideShowing,
  threadSelectMessageShowing,
  threadModalListShowing
} from "../../actions/threadActions";
import {threadModalThreadInfoShowing} from "../../actions/threadActions";

//UI components
import {MdForward, MdDelete} from "react-icons/lib/md";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/MainHeadBatchActions.scss";
import styleVar from "./../../../styles/variables.scss";
import classnames from "classnames";
import {messageModalDeletePrompt} from "../../actions/messageActions";

const statics = {};

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    threadShowing: store.threadShowing,
    threadCheckedMessageList: store.threadCheckedMessageList
  };
})
export default class MainHeadBatchActions extends Component {

  constructor(props) {
    super(props);
    this.onForward = this.onForward.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onForward(e) {
    e.stopPropagation();
    const {dispatch, threadCheckedMessageList} = this.props;
    dispatch(threadModalListShowing(true, threadCheckedMessageList));
  }

  onDelete(e) {
    e.stopPropagation();
    const {dispatch, threadCheckedMessageList} = this.props;
    dispatch(messageModalDeletePrompt(true, threadCheckedMessageList));
  }

  render() {
    const {smallVersion} = this.props;
    const classNames = classnames({
      [style.MainHeadBatchActions]: true,
      [style["MainHeadBatchActions--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} centerRight>

        <Container className={style.MainHeadBatchActions__ForwardContainer} inline onClick={this.onForward}>
          <MdForward size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
        </Container>
        <Container className={style.MainHeadBatchActions__DeleteContainer} inline onClick={this.onDelete}>
          <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
        </Container>

      </Container>
    )

  }
}
