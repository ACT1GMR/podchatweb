// src/
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadLeftAsideShowing, threadSearchMessage, threadGoToMessageId} from "../../actions/threadActions";

//UI components
import {InputText} from "../../../../uikit/src/input";
import {Text} from "../../../../uikit/src/typography";

//styling
import style from "../../../styles/pages/box/LeftAsideMain.scss";
import Container from "../../../../uikit/src/container";
import List, {ListItem} from "../../../../uikit/src/list";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Message from "../../../../uikit/src/message";
import date from "../../utils/date";
import {mobileCheck} from "../../utils/helpers";
import classnames from "classnames";

function datePetrification(time) {
  return date.isToday(time) ? date.format(time, "HH:mm") : date.isWithinAWeek(time) ? date.format(time, "dddd HH:mm") : date.format(time, "YYYY-MM-DD  HH:mm");
}

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    threadSearchMessagePending: store.threadSearchMessage.fetching,
    threadSearchMessages: store.threadSearchMessage.messages.messages,
    threadSearchMessagesReset: store.threadSearchMessage.messages.reset,
    leftAsideShowing: store.threadLeftAsideShowing
  }
})
export default class LeftAsideMain extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      query: ""
    }
  }

  componentDidUpdate(oldProps) {
    const {leftAsideShowing: oldLeftAsideShowing, thread: oldThread} = oldProps;
    const {leftAsideShowing, thread} = this.props;
    if (oldThread !== thread) {
      return this.props.dispatch(threadLeftAsideShowing(false));
    }
    if (oldLeftAsideShowing) {
      if (!leftAsideShowing) {
        this.setState({query: ""});
        this.search("");
      }
    } else {
      if (leftAsideShowing) {
        this.inputRef.current.focus();
      }
    }
  }

  onSearchQueryChange(event) {
    const value = event.target.value;
    this.setState({
      query: value
    });
    clearTimeout(this.toSearchTimoutId);
    if (!value.slice()) {
      return this.search(value);
    }
    this.toSearchTimoutId = setTimeout(e => {
      clearTimeout(this.toSearchTimoutId);
      this.search(value);
    }, 750);
  }

  search(query) {
    const {thread} = this.props;
    this.props.dispatch(threadSearchMessage(thread.id, query));
  }

  onSearchItemClicked(messageId) {
    const {smallVersion, dispatch, thread} = this.props;
    if (smallVersion || mobileCheck()) {
      dispatch(threadLeftAsideShowing(false));
    }
    dispatch(threadGoToMessageId(thread.id, messageId));
  }

  render() {
    const {query} = this.state;
    const {threadSearchMessages, threadSearchMessagePending, threadSearchMessagesReset, smallVersion} = this.props;
    const classNames = classnames({
      [style.LeftAsideMain]: true,
      [style["LeftAsideMain--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} ref={this.container}>
        <InputText onChange={this.onSearchQueryChange} value={query} placeholder={strings.search} ref={this.inputRef}/>
        {threadSearchMessagePending ?
          (
            <Container relative>
              <Container topCenter>
                <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
              </Container>
            </Container>
          )
          :
          threadSearchMessages && threadSearchMessages.length ? (
              <List>
                {threadSearchMessages.map(el => (
                  <ListItem key={el.id} onSelect={this.onSearchItemClicked.bind(this, el.id)} selection invert>
                    <Container relative>
                      <Container inline>
                        <Text wordWrap="breakWord"
                              size="sm">{el.message.length > 30 ? `${el.message.slice(0, 30)}...` : el.message}</Text>
                        <Text wordWrap="breakWord"
                              color="gray"
                              size="sm">{datePetrification(el.time)}</Text>
                      </Container>
                      <Container inline centerLeft>
                        <Text wordWrap="breakWord"
                              size="sm">{el.participant.name}</Text>
                      </Container>
                    </Container>
                  </ListItem>
                ))}
              </List>
            ) :
            <Container relative>
              <Container topCenter>
                <Message>{!threadSearchMessagesReset ? strings.noResult : strings.searchSomething}</Message>
              </Container>
            </Container>
        }

      </Container>
    )
  }
}
