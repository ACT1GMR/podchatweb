// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadSelectMessageShowing,
  threadModalListShowing, threadCheckedMessageList
} from "../../actions/threadActions";
import {messageDelete} from "../../actions/messageActions";
import {chatModalPrompt} from "../../actions/chatActions";

//UI components
import {MdForward, MdDelete} from "react-icons/lib/md";
import Gap from "../../../../uikit/src/gap";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";

//styling
import style from "../../../styles/pages/box/MainHeadBatchActions.scss";
import styleVar from "./../../../styles/variables.scss";




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
    const {dispatch, threadCheckedMessageList: message} = this.props;
    const isBatchMessage = message instanceof Array;
    const text = strings.areYouSureAboutDeletingMessage(isBatchMessage ? message.length : null);
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      const {threadCheckedMessageList: message, dispatch} = this.props;
      if (message instanceof Array) {
        for (const msg of message) {
          dispatch(messageDelete(msg.id, msg.editable));
        }
      } else {
        dispatch(messageDelete(message.id, message.editable));
      }
      dispatch(chatModalPrompt());
      dispatch(threadSelectMessageShowing(false));
      dispatch(threadCheckedMessageList(null, null, true));
    }));
  }

  render() {
    const {smallVersion, threadCheckedMessageList} = this.props;
    const classNames = classnames({
      [style.MainHeadBatchActions]: true,
      [style["MainHeadBatchActions--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} centerRight>

        {threadCheckedMessageList && threadCheckedMessageList.length ?
          <Container>
            <Container className={style.MainHeadBatchActions__ForwardContainer} inline onClick={this.onForward}>
              <MdForward size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
            </Container>
            <Container className={style.MainHeadBatchActions__DeleteContainer} inline onClick={this.onDelete}>
              <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
            </Container>
          </Container> :
          <Container>
            <Gap x={10}>
              <Text invert>{strings.selectMessage}</Text>
            </Gap>
          </Container>
        }

      </Container>
    )

  }
}
