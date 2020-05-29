import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {types} from "../constants/messageTypes";

//actions
import {
  threadGoToMessageId,
  threadMessageGetListByTypes, threadModalThreadInfoShowing,
} from "../actions/threadActions";

//UI components
import Container from "../../../uikit/src/container";

//UI components

//styling
import style from "../../styles/pages/box/ModalThreadInfoMessageTypes.scss";
import Text from "../../../uikit/src/typography/Text";
import strings from "../constants/localization";
import Loading, {LoadingBlinkDots} from "../../../uikit/src/loading";
import Image from "../../../uikit/src/image";
import Shape, {ShapeCircle} from "../../../uikit/src/shape";
import styleVar from "../../styles/variables.scss";
import {
  MdArrowDownward,
  MdPlayArrow,
  MdClose
} from "react-icons/md";
import {BoxModalMediaFragment} from "./index";
import ReactDOMServer from "react-dom/server";

@connect()
export default class ModalThreadInfoMessageTypes extends Component {

  constructor(props) {
    super(props);
    if (!props.defaultTab) {
      this.initRequest("picture", true);
    }
    this.createButton();
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    const {setOnScrollBottomThreshold, setScrollBottomThresholdCondition} = props;
    setOnScrollBottomThreshold(this.onScrollBottomThreshold);
    setScrollBottomThresholdCondition(false);
    this.state = {
      activeTab: props.defaultTab || "picture",
      defaultTab: props.defaultTab,
      loading: true,
      messages: [],
      hasNext: true
    }
  }

  createButton() {
    window.modalMediaRef.getFancyBox().defaults.btnTpl.goto =
      `<button data-fancybox-fb class="fancybox-button fancybox-button--goto" title="${strings.gotoMessage}">
        <svg viewBox="0 0 28 28">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </button>`
  }

  initRequest(tab, isJustConstructed) {
    const {thread, dispatch, setScrollBottomThresholdCondition, onTabSelect, defaultTab} = this.props;
    if (isJustConstructed !== true) {
      if(this.state.activeTab === tab) {
        return;
      }
      if (onTabSelect) {
        onTabSelect(tab);
      }
      setScrollBottomThresholdCondition(false);
      this.setState({
        activeTab: tab,
        partialLoading: false,
        loading: true,
        hasNext: false,
        nextOffset: 0,
        messages: []
      });
    }
    if (defaultTab === tab) {
      return
    }
    dispatch(threadMessageGetListByTypes(thread.id, types[tab], 25, 0)).then(result => {
      setScrollBottomThresholdCondition(result.hasPrevious);
      this.setState({
        loading: false,
        messages: result.messages,
        nextOffset: result.nextOffset,
        hasNext: result.hasPrevious
      });
      if (isJustConstructed !== true) {
        document.getElementById("message-types-tab").scrollIntoView();
      }
    });
  }

  onScrollBottomThreshold() {
    const {activeTab, messages, nextOffset, hasNext, partialLoading} = this.state;
    const {thread, setScrollBottomThresholdCondition, dispatch} = this.props;
    if (!hasNext) {
      return;
    }
    if (partialLoading) {
      return;
    }
    this.setState({
      partialLoading: true
    });
    dispatch(threadMessageGetListByTypes(thread.id, types[activeTab], 25, nextOffset)).then(result => {
      setScrollBottomThresholdCondition(result.hasPrevious);
      this.setState({
        partialLoading: false,
        messages: messages.concat(result.messages),
        nextOffset: result.nextOffset,
        hasNext: result.hasPrevious
      });
    });
  }

  buildComponent(type, message) {
    const {dispatch} = this.props;
    const idMessage = `${message.id}-message-types-${type}`
    const gotoMessage = () => {
      dispatch(threadModalThreadInfoShowing());
      window.modalMediaRef.close();
      dispatch(threadGoToMessageId(message.time));
    };
    if (type === "picture") {
      const onFancyBoxClick = e => {
        //window.modalMediaRef.getFancyBox().open()
        setTimeout(e => {
          document.getElementsByClassName("fancybox-button--goto")[0].addEventListener("click", gotoMessage);
        }, 200)
      };
      return (
        <Container className={style.ModalThreadInfoMessageTypes__ImageContainer} data-fancybox key={idMessage}
                   onClick={onFancyBoxClick}>
          <BoxModalMediaFragment
            options={{buttons: ["goto", "slideShow",  "close"], caption: message.message}}
            link={"https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg"}>
            <Image className={style.ModalThreadInfoMessageTypes__Image}
                   setOnBackground
                   src={"https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg"}/>
          </BoxModalMediaFragment>

        </Container>
      )
    } else if (type === "file" || type === "sound" || type === "video") {
      return (
        <Container className={style.ModalThreadInfoMessageTypes__FileContainer} onClick={gotoMessage} key={idMessage}>
          <Container>
            <Text wordWrap="breakWord" bold>
              {type === "file" ? "ghablmale.zip" : type === "sound" ? "ghablmale-sound.mp3" : "ghablmale-video.mp4"}
            </Text>
            <Text size="xs" color="gray">1.5MB</Text>
          </Container>
          <Container centerLeft onClick={e => e.stopPropagation()}>
            {type === "video" ?
              <video controls id={`video-${idMessage}`} style={{display: "none"}}
                     src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"/> :
              type === "sound" ? <audio controls id={idMessage} style={{display: "none"}}
                                        src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3"/> : ""
            }
            {type === "file" ?
              <MdArrowDownward style={{cursor: "pointer"}} color={styleVar.colorAccent} size={styleVar.iconSizeSm}/>
              :
              <Text link={`#video-${id}`} linkClearStyle data-fancybox>
                <MdPlayArrow style={{cursor: "pointer"}} color={styleVar.colorAccent} size={styleVar.iconSizeSm}/>
              </Text>

            }
          </Container>
        </Container>
      )
    }
    return 1;
  }

  render() {
    const {activeTab, loading, messages, partialLoading} = this.state;
    const {defaultTab, children} = this.props;
    const tabs = Object.keys(types);
    if (defaultTab) {
      tabs.unshift(defaultTab);
    }
    const tabItemClassNames = activeTabItem => classnames({
      [style["ModalThreadInfoMessageTypes__TabItem"]]: true,
      [style["ModalThreadInfoMessageTypes__TabItem--active"]]: activeTabItem === activeTab,
    });

    const messageContainerClassNames = mode => classnames({
      [style["ModalThreadInfoMessageTypes__MessageContainer"]]: true,
      [style[`ModalThreadInfoMessageTypes__MessageContainer--${mode}`]]: true,
    });

    return (
      <Container className={style.ModalThreadInfoMessageTypes}>
        <Container className={style.ModalThreadInfoMessageTypes__Tab} id="message-types-tab">
          {
            tabs.map(key => (
              <Container className={tabItemClassNames(key)} onClick={this.initRequest.bind(this, key)}>
                <Text>{strings.messageTypes[key]}</Text>
              </Container>
            ))
          }
        </Container>

        {defaultTab && defaultTab === activeTab ? children :
          <Container className={style.ModalThreadInfoMessageTypes__Content} relative>
            {loading ?
              <Container center>
                <Loading><LoadingBlinkDots size="sm"/></Loading>
              </Container> :
              <Fragment>
                <Container className={messageContainerClassNames(activeTab)}>
                  {
                    messages.length > 0 ?
                      messages.map(message => (
                        this.buildComponent(activeTab, message)
                      ))
                      :
                      <Container center>
                        <Text size="sm">{strings.noResult}</Text>
                      </Container>
                  }

                </Container>
                {
                  partialLoading &&
                  <Container centerTextAlign>
                    <Loading><LoadingBlinkDots size="sm"/></Loading>
                  </Container>
                }
              </Fragment>

            }
          </Container>}

      </Container>
    )
  }
}

