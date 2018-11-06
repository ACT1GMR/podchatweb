// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadShowing, threadLeftAsideShowing, threadSelectMessageShowing} from "../../actions/threadActions";
import {threadModalThreadInfoShowing, threadCheckedMessageList} from "../../actions/threadActions";

//UI components
import {MdChevronLeft, MdSearch, MdDone, MdClose} from "react-icons/lib/md";
import Container from "raduikit/src/container";
import MainHeadThreadInfo from "./MainHeadThreadInfo";
import MainHeadBatchActions from "./MainHeadBatchActions";
import {Text} from "raduikit/src/typography";

//styling
import style from "../../../styles/pages/box/MainHead.scss";
import styleVar from "./../../../styles/variables.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import classnames from "classnames";

const statics = {};

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    threadShowing: store.threadShowing,
    threadSelectMessageShowing: store.threadSelectMessageShowing,
    threadCheckedMessageList: store.threadCheckedMessageList
  };
})
export default class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
    this.onThreadHide = this.onThreadHide.bind(this);
    this.onLeftAsideShow = this.onLeftAsideShow.bind(this);
    this.onSelectMessagesHide = this.onSelectMessagesHide.bind(this);
    this.onSelectMessagesShow = this.onSelectMessagesShow.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  onThreadHide(e) {
    e.stopPropagation();
    this.props.dispatch(threadShowing(false));
  }

  onLeftAsideShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true));
  }

  onSelectMessagesShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadSelectMessageShowing(true));
  }


  onSelectMessagesHide(e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
  }

  render() {
    const {thread, smallVersion, threadSelectMessageShowing, threadCheckedMessageList} = this.props;
    if (thread.id) {
      const classNames = classnames({
        [style.MainHead]: true,
        [style["MainHead--smallVersion"]]: smallVersion
      });
      return (
        <Container className={classNames} onClick={this.onShowInfoClick} relative>
          {
            threadSelectMessageShowing ? <MainHeadBatchActions/> : <MainHeadThreadInfo/>
          }
          <Container centerLeft>

            {
              threadSelectMessageShowing &&
              <Container>
                <Container inline>
                  <Text color="gray" light>{ strings.messagesCount(threadCheckedMessageList.length)}</Text>
                </Container>
                <Container className={style.MainHead__SearchContainer} inline onClick={this.onSelectMessagesHide}>
                  <MdClose size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                </Container>

              </Container>
            }

            {
              !threadSelectMessageShowing &&
              <Container>
                <Container className={style.MainHead__SearchContainer} inline onClick={this.onSelectMessagesShow}>
                  <MdDone size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                </Container>
                <Container className={style.MainHead__SearchContainer} inline onClick={this.onLeftAsideShow}>
                  <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                </Container>
                <Container className={style.MainHead__BackContainer} inline onClick={this.onThreadHide}>
                  <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                </Container>
              </Container>
            }

          </Container>
        </Container>
      )
    }
    return ""
  }
}
