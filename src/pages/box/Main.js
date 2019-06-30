// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {Route, withRouter} from "react-router-dom";

//strings
import {
  ROUTE_THREAD,
  ROUTE_ADD_CONTACT,
  ROUTE_CONTACTS,
} from "../../constants/routes";
import strings from "../../constants/localization";

//actions
import {contactAdding, contactListShowing} from "../../actions/contactActions";
import {threadMessageGetList} from "../../actions/threadActions";

//components
import MainHead from "./MainHead";
import MainMessagesFetcher from "./MainMessagesFetcher";
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
    threadShowing: store.threadShowing,
    chatRouterLess: store.chatRouterLess
  };
})
class Main extends Component {
  constructor(props) {
    super(props);
    this.onContactListShow = this.onContactListShow.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
  }

  componentDidUpdate(oldProps) {
  }

  onContactListShow() {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactListShowing(true));
    if (!chatRouterLess) {
      history.push(ROUTE_CONTACTS);
    }
  }

  onAddMember() {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactAdding(true));
    if (!chatRouterLess) {
      history.push(ROUTE_ADD_CONTACT);
    }
  }

  render() {
    const {threadId, threadFetching} = this.props;

    if (!threadId && !threadFetching) {
      return (
        <Container className={style.Main}>
          <Container className={style.Main__Cover}/>
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
    return (
      <Route path={[ROUTE_THREAD, ""]}
             render={props => {
               return (
                 <Container className={style.Main}>
                   <Container className={style.Main__Cover}/>
                   <MainHead/>
                   <MainMessagesFetcher/>
                   <MainFooter/>
                 </Container>
               )
             }}>
      </Route>
    );
  }
}

export default withRouter(Main);
