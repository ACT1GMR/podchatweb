// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {Route, withRouter} from "react-router-dom";

//strings
import {
  ROUTE_THREAD,
  ROUTE_THREAD_INFO,
  ROUTE_ADD_CONTACT,
  ROUTE_CONTACTS,
  ROUTE_CREATE_GROUP
} from "../../constants/routes";
import strings from "../../constants/localization";

//actions
import {contactAdding, contactListShowing} from "../../actions/contactActions";
import {threadMessageGetList} from "../../actions/threadActions";

//components
import MainHead from "./MainHead";
import MainMessages from "./MainMessages";
import MainFooter from "./MainFooter";
import Message from "../../../../uikit/src/message";
import Gap from "../../../../uikit/src/gap";
import {MdChat} from "react-icons/lib/md";
import {Button} from "../../../../uikit/src/button";
import Container from "../../../../uikit/src/container";

//styling
import style from "../../../styles/pages/box/Main.scss";
import styleVar from "../../../styles/variables.scss";


@connect(store => {
  return {
    threadId: store.thread.thread.id,
    threadFetching: store.thread.fetching,
    threadShowing: store.threadShowing
  };
})
class Main extends Component {
  constructor(props) {
    super(props);
    this.onContactListShow = this.onContactListShow.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.threadId !== this.props.threadId) {
      this.props.dispatch(threadMessageGetList(this.props.threadId));
    }
  }

  onContactListShow(){
    const {history, dispatch} = this.props;
    dispatch(contactListShowing(true));
    history.push(ROUTE_CONTACTS);
  }

  onAddMember(){
    const {history, dispatch} = this.props;
    dispatch(contactAdding(true));
    history.push(ROUTE_ADD_CONTACT);
  }

  render() {
    const {threadId, threadFetching} = this.props;

    if (!threadId && !threadFetching) {
      return (
        <Container className={style.Main}>
          <Container center centerTextAlign>
            <Message size="lg">{strings.pleaseStartAThreadFirst}</Message>
            <Gap y={10} block/>
            <MdChat size={48} style={{color: styleVar.colorAccent}}/>
            <Container>
              <Button outlined onClick={this.onAddMember}>{strings.addContact}</Button>
              <Button outlined onClick={this.onContactListShow}>{strings.contactList}</Button>
            </Container>
          </Container>
        </Container>
      );
    }
    const regex = new RegExp(`${ROUTE_THREAD}|${ROUTE_THREAD_INFO}|${ROUTE_ADD_CONTACT}|${ROUTE_CREATE_GROUP}`);
    return (
      <Route exact path={regex} render={props => {
        return (
          <Container className={style.Main}>
            <MainHead/>
            <MainMessages/>
            <MainFooter/>
          </Container>
        )
      }}>
      </Route>
    );
  }
}

export default withRouter(Main);
