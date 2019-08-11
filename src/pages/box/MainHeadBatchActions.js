// /src/pages/MainHeadBatchActions

import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {isChannel, isMyThread} from "./Main";

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
import Gap from "../../../../uikit/src/gap";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";

//styling
import {MdForward, MdDelete} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainHeadBatchActions.scss";
import styleVar from "./../../../styles/variables.scss";
import {deleteForAllCondition} from "./MainMessagesMessage";

@connect(store => {
  return {
    user: store.user.user,
    smallVersion: store.chatSmallVersion
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
    const {dispatch, threadCheckedMessageList: message, user, thread} = this.props;
    const isBatchMessage = message instanceof Array;
    const text = strings.areYouSureAboutDeletingMessage(isBatchMessage ? message.length : null);
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      const {threadCheckedMessageList: message, dispatch} = this.props;
      if (message instanceof Array) {
        for (const msg of message) {
          dispatch(messageDelete(msg.id, deleteForAllCondition(msg, user, thread)));
        }
      } else {
        dispatch(messageDelete(message.id, deleteForAllCondition(message, user, thread)));
      }
      dispatch(chatModalPrompt());
      dispatch(threadSelectMessageShowing(false));
      dispatch(threadCheckedMessageList(null, null, true));
    }));
  }

  render() {
    const {smallVersion, threadCheckedMessageList, thread, user} = this.props;
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
            {(!isChannel(thread) || isMyThread(thread, user)) &&
              <Container className={style.MainHeadBatchActions__DeleteContainer} inline onClick={this.onDelete}>
                <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
              </Container>
            }

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
