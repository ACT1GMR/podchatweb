// src/list/Avatar.scss
import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {signOut, retry} from "podauth";
import {isContains} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions

//UI components
import {MdClose} from "react-icons/lib/md";
import Container from "../../../../uikit/src/container";
import {InputText} from "../../../../uikit/src/input";

//styling
import style from "../../../styles/pages/box/AsidSearch.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import {chatSearchResult} from "../../actions/chatActions";
import classnames from "classnames";

@connect(store => {
  return {
    threads: store.threads.threads,
    contacts: store.contactGetList.contacts,
    chatSearchShow: store.chatSearchShow
  };
})
class AsideSearch extends Component {

  constructor(props) {
    super(props);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onClearSearchClick = this.onClearSearchClick.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      query: ""
    }
  }

  componentDidUpdate(oldProps) {
    const {chatSearchShow} = this.props;
    if (chatSearchShow) {
      if (!oldProps.chatSearchShow) {
        if (this.inputRef.current) {
          this.inputRef.current.focus();
        }
      }
    } else {
      if (oldProps.chatSearchShow) {
        if (this.inputRef.current) {
          this.onClearSearchClick();
        }
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
      return this.search(value.slice());
    }

    this.toSearchTimoutId = setTimeout(e => {
      clearTimeout(this.toSearchTimoutId);
      this.search(value);
    }, 750);
  }

  search(query) {
    const {threads, contacts, dispatch} = this.props;
    if (query) {
      let filteredThreads = [];
      let filteredContacts;
      if (threads) {
        if (threads.length) {
          for (const thread of threads) {
            if (!thread.title) {
              continue;
            }
            if (thread.title.indexOf(query) > -1) {
              filteredThreads.push(thread);
            }
          }
        }
        if (contacts && contacts.length) {
          filteredContacts = isContains("firstName|lastName|cellphoneNumber", query, contacts);
        }
        dispatch(chatSearchResult(true, filteredThreads, filteredContacts));
      }
    } else {
      dispatch(chatSearchResult());
    }
  }

  onClearSearchClick() {
    this.setState({
      query: ""
    });
    this.props.dispatch(chatSearchResult());
  }

  render() {
    const {chatSearchShow} = this.props;
    const {query} = this.state;
    const iconSize = styleVar.iconSizeMd.replace("px", "");
    const classNames = classnames({
      [style.AsideSearch]: true,
      [style["AsideSearch--show"]]: chatSearchShow
    });
    return (
      <Container className={classNames} ref={this.container} relative>
        <InputText className={style.AsideSearch__InputContainer} inputClassName={style.AsideSearch__Input}
                   onChange={this.onSearchQueryChange} value={query} placeholder={strings.search} ref={this.inputRef}/>
        {query && query.slice() &&
        <Container centerLeft>
          <MdClose size={iconSize}
                   className={utilsStlye["u-clickable"]}
                   onClick={this.onClearSearchClick}
                   style={{color: styleVar.colorAccent, marginLeft: "20px"}}/>
        </Container>

        }
      </Container>
    )
  }
}

export default withRouter(AsideSearch);