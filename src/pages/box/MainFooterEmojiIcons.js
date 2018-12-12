// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import ReactDOMServer from 'react-dom/server';

//strings

//actions
import {
  messageSendFile
} from "../../actions/messageActions";

//components
import Container from "../../../../uikit/src/container";
import {MdSentimentVerySatisfied} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainFooterEmojiIcons.scss";

const emojies =
  {
    columns: 26,
    rows: 7,
    size: 30
  };

@connect(store => {
  return {};
})
export default class MainFooterEmojiIcons extends Component {

  constructor() {
    super();
  }

  componentDidUpdate(prevProps) {
  }

  onEmojiClick(el) {
    const {setInputText} = this.props;
    const img = <img className={style.EmojiIcon}
                     style={{backgroundPosition: `${el.x / 1.5}px ${el.y / 1.5}px`}}/>;
    setInputText(ReactDOMServer.renderToStaticMarkup(img));
  }

  calculations() {
    const {rows, columns, size} = emojies;
    const emojiesArray = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        emojiesArray.push({
          x: -(j * size),
          y: -(i * size)
        })
      }
    }
    return emojiesArray;
  }

  render() {
    const {onEmojiClick} = this.props;
    const emojies = this.calculations();
    return (
      <Container inline className={style.MainFooterEmojiIcons} relative onClick={this.onClick}>
        {emojies.map(el => (
          <Container className={style.MainFooterEmojiIcons__Icon} onClick={this.onEmojiClick.bind(this, el)}>
            <Container className={style.MainFooterEmojiIcons__Button}
                       style={{backgroundPosition: `${el.x}px ${el.y}px`}}/>
          </Container>
        ))}
      </Container>
    );
  }
}