// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

//strings
import strings from "../../constants/localization";

//actions
import {contactAdding, contactListShowing} from "../../actions/contactActions";
import {threadCreate, threadMessageGetList, threadShowing} from "../../actions/threadActions";

//components
import MainHead from "./MainHead";
import MainMessages from "./MainMessages";
import MainFooter from "./MainFooter";
import ModalContactList from "./ModalContactList";
import ModalAddContact from "./ModalAddContact";
import ModalThreadList from "./ModalThreadList";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalThreadInfo from "./ModalThreadInfo";
import ModalImageCaption from "./ModalImageCaption";
import ModalMedia from "./ModalMedia";
import Message from "raduikit/src/message";
import Gap from "raduikit/src/gap";
import {MdChat} from "react-icons/lib/md";
import Button from "raduikit/src/button";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/Main.scss";
import styleVar from "../../../styles/variables.scss";


@connect(store => {
  return {
    threadId: store.thread.thread.id,
    threadFetching: store.thread.fetching
  };
})
export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    if (this.props.threadId) {
      this.props.dispatch(threadMessageGetList(this.props.threadId));
    }
  }

  render() {
    const {threadId, threadFetching} = this.props;
    const popups = (
      <section>
        <ModalContactList/>
        <ModalAddContact/>
        <ModalThreadList/>
        <ModalCreateGroup/>
        <ModalThreadInfo/>
        <ModalMedia/>
        <ModalImageCaption/>
      </section>
    );

    return (
      <Switch>
        <Route path="/" exact render={e => {
          return (
            <Container className={style.Main}>
              <Container center centerTextAlign>
                <Message size="lg">{strings.pleaseStartAThreadFirst}</Message>
                <Gap y={10} block/>
                <MdChat size={48} style={{color: styleVar.colorAccent}}/>
                <Container>
                  <Button outlined
                          onClick={() => this.props.dispatch(contactAdding(true))}>{strings.addContact}</Button>
                  <Button outlined
                          onClick={() => this.props.dispatch(contactListShowing(true))}>{strings.contactList}</Button>
                </Container>
              </Container>
              {popups}
            </Container>
          );
        }}/>
        <Route path="/:threadId" render={e => <MainBody popups={popups} match={e}/>}/>
      </Switch>
    );
  }
}

@connect(store => {
  return {
    threadId: store.thread.thread.id,
    threadFetching: store.thread.fetching
  };
})
class MainBody extends React.Component {

  componentDidMount() {
    const {threadId, threadFetching, match} = this.props;
    if (!threadId && !threadFetching) {
      this.props.dispatch(threadCreate(+match.match.params.threadId));
      this.props.dispatch(threadShowing(true));
    }
  }

  render() {
    const {popups} = this.props;
    return (
      <Container className={style.Main}>
        <MainHead/>
        <MainMessages/>
        <MainFooter/>
        {popups}
      </Container>
    );
  }

}