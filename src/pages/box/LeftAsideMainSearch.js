// src/
import React, {Component} from "react";
import {connect} from "react-redux";
import date from "../../utils/date";
import {mobileCheck} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {threadLeftAsideShowing, threadSearchMessage, threadGoToMessageId} from "../../actions/threadActions";

//UI components
import {InputText} from "../../../../uikit/src/input";
import {Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";
import List, {ListItem} from "../../../../uikit/src/list";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Message from "../../../../uikit/src/message";

//styling

function datePetrification(time) {
  const correctTime = time / Math.pow(10, 6);
  return date.isToday(correctTime) ? date.format(correctTime, "HH:mm") : date.isWithinAWeek(correctTime) ? date.format(correctTime, "dddd HH:mm") : date.format(correctTime, "YYYY-MM-DD  HH:mm");
}

@connect(store => {
  return {
    leftAsideShowing: store.threadLeftAsideShowing,
    thread: store.thread.thread,
    threadSearchMessagePending: store.threadSearchMessage.fetching,
    threadSearchMessages: store.threadSearchMessage.messages.messages,
    threadSearchMessagesReset: store.threadSearchMessage.messages.reset
  }
})
export default class LeftAsideMainSearch extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      query: ""
    }
  }

  componentDidMount(oldProps) {
    this.setState({query: ""});
    this.search("");
    this.inputRef.current.focus();
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

  onSearchItemClicked(messageTime, messageId) {
    const {smallVersion, dispatch, thread} = this.props;
    if (smallVersion || mobileCheck()) {
      dispatch(threadLeftAsideShowing(false));
    }
    dispatch(threadGoToMessageId(thread.id, messageTime, messageId));
  }

  render() {
    const {query} = this.state;
    const {threadSearchMessages, threadSearchMessagePending, threadSearchMessagesReset} = this.props;
    return (
      <Container>
        <InputText onChange={this.onSearchQueryChange} value={query} placeholder={strings.search} ref={this.inputRef}/>
        {threadSearchMessagePending ?
          (
            <Container relative userSelect="none">
              <Container topCenter>
                <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
              </Container>
            </Container>
          )
          :
          threadSearchMessages && threadSearchMessages.length ? (
              <List>
                {threadSearchMessages.map(el => (
                  <ListItem key={el.id} onSelect={this.onSearchItemClicked.bind(this, el.time, el.id)} selection invert>
                    <Container relative userSelect="none">
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
