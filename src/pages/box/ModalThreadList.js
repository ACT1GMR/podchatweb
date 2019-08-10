import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {threadGetList, threadModalListShowing} from "../../actions/threadActions";
import {threadCreate} from "../../actions/threadActions";
import {messageEditing} from "../../actions/messageActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import {Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";
import {ContactSearchFragment, NoResultFragment, PartialLoadingFragment} from "./ModalContactList";

//styling

const constants = {
  forwarding: "FORWARDING",
  count: 50
};

@connect(store => {
  return {
    threads: store.threads.threads,
    threadsNextOffset: store.threads.nextOffset,
    threadsHasNext: store.threads.hasNext,
    isShow: store.threadModalListShowing.isShowing,
    message: store.threadModalListShowing.message,
    user: store.user.user
  };
}, null, null, {withRef: true})
export default class ModalThreadList extends Component {

  constructor(props) {
    super(props);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.state = {
      remainingThreadsNextOffset: 0,
      remainingThreadsHasNext: false,
      remainingThreadsPartialFetching: false,
      remainingThreads: [],
      query: null
    }
  }

  componentDidUpdate({threadsNextOffset: oldThreadsNextOffset, isShow: oldIsShow}) {
    const {threadsHasNext, threadsNextOffset, threads, isShow} = this.props;
    if (oldThreadsNextOffset !== threadsNextOffset || isShow !== oldIsShow) {
      this.setState({
        remainingThreadsHasNext: threadsHasNext,
        remainingThreadsNextOffset: threadsNextOffset,
        remainingThreads: threads
      });
    }
  }

  onSend(thread) {
    const {dispatch, message} = this.props;
    dispatch(threadCreate(null, thread));
    dispatch(messageEditing(message, constants.forwarding, thread.id));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(threadModalListShowing(false));
    this.setState({
      remainingThreadsNextOffset: 0,
      remainingThreadsHasNext: false,
      remainingThreadsPartialFetching: false,
      remainingThreads: [],
      query: null
    });
  }

  _directThreadListRequest(contactsNextOffset, onSearch, query) {
    const {dispatch, threads: oldThreads} = this.props;
    dispatch(threadGetList(contactsNextOffset || 0, constants.count, query, true))
      .then(({threads, nextOffset, hasNext}) => {
        const {remainingThreads} = this.state;
        let realThreads = remainingThreads.concat(threads);
        if (onSearch) {
          if (!query || !query.trim()) {
            realThreads = oldThreads
          } else {
            realThreads = threads
          }
        }
        this.setState({
          remainingThreadsNextOffset: nextOffset,
          remainingThreadsHasNext: hasNext,
          remainingThreads: realThreads,
          remainingThreadsPartialFetching: false
        });
      });
  }

  onScrollBottomThreshold() {
    const {remainingThreadsNextOffset} = this.state;
    this.setState({
      remainingThreadsPartialFetching: true
    });
    this._directThreadListRequest(remainingThreadsNextOffset, false, this.state.query);
  }

  render() {
    const {isShow, smallVersion, user} = this.props;
    const {query, remainingThreadsHasNext, remainingThreadsPartialFetching, remainingThreads} = this.state;
    const realThreads = remainingThreads.filter(thread => !thread.group || thread.type !== 8 || thread.inviter.id === user.id);

    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.forwardTo}</Heading>
          <ContactSearchFragment onSearchInputChange={query => this.setState({query})}
                                 onSearchChange={query => this._directThreadListRequest(0, true, query)} query={query}/>
        </ModalHeader>

        <ModalBody threshold={5}
                   onScrollBottomThresholdCondition={remainingThreadsHasNext && !remainingThreadsPartialFetching}
                   onScrollBottomThreshold={this.onScrollBottomThreshold}>
          {realThreads.length ?
            <Container relative>
              <List>
                {realThreads.map(el => (
                  <ListItem key={el.id} selection invert onSelect={this.onSend.bind(this, el)}>
                    <Container relative>

                      <Avatar>
                        <AvatarImage src={el.image} text={avatarNameGenerator(el.title).letter}
                                     textBg={avatarNameGenerator(el.title).color}/>
                        <AvatarName>{el.title}</AvatarName>
                      </Avatar>

                    </Container>
                  </ListItem>
                ))}
              </List>
              {remainingThreadsPartialFetching && <PartialLoadingFragment/>}
            </Container>
            : <NoResultFragment>{ query && query.trim() ? strings.thereIsNoThreadsWithThisKeyword(query) : strings.thereIsNoChat}</NoResultFragment>
          }

        </ModalBody>

        <ModalFooter>
          <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
