// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import ReactDOMServer from "react-dom/server";
import classnames from "classnames";

//strings

//actions

//components
import Container from "../../../../uikit/src/container";

//styling
import emojiStyle from "../../../styles/utils/emoji.scss";
import style from "../../../styles/pages/box/MainFooterEmojiIcons.scss";
import oneoneImage from "../../../styles/images/_common/oneone.png";

const emojies = [
  {
    columns: 26,
    rows: 7,
    size: 30,
    scale: 1.5,
    name: "common-telegram"
  }];

@connect()
export default class MainFooterEmojiIcons extends Component {

  constructor() {
    super();
  }

  componentDidUpdate(prevProps) {
  }

  onEmojiClick(el, emoji, e) {
    e.preventDefault();
    e.stopPropagation();
    const {setInputText} = this.props;
    const classNames = classnames({
      [emojiStyle.emoji]: true,
      [emojiStyle["emoji-inline"]]: true,
      [emojiStyle[`emoji-${emoji.name}`]]: true
    });
    const img = <img className={classNames}
                     src={oneoneImage}
                     style={{backgroundPosition: `${el.x / emoji.scale}px ${el.y / emoji.scale}px`}}/>;
    setInputText(ReactDOMServer.renderToStaticMarkup(img), true);
  }

  calculations() {
    const emojiesArray = [];
    for (const emoji of emojies) {
      const {rows, columns, size, name} = emoji;
      const emojiObject = {
        info: emoji,
        emojies: []
      };
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          emojiObject.emojies.push({
            x: -(j * size),
            y: -(i * size)
          })
        }
      }
      emojiesArray.push(emojiObject);
    }

    return emojiesArray;
  }

  render() {
    const emojies = this.calculations();
    const classNames = classnames({
      [emojiStyle.emoji]: true,
      [style.MainFooterEmojiIcons__Button]: true
    });
    return (
      <Container inline className={style.MainFooterEmojiIcons} relative onClick={this.onClick}>
        {emojies.map(emoji => (
          emoji.emojies.map(el => (
            <Container className={style.MainFooterEmojiIcons__Icon} onClick={this.onEmojiClick.bind(this, el, emoji.info)}>
              <Container className={`${emojiStyle[`emoji-${emoji.info.name}`]} ${classNames}`}
                         style={{backgroundPosition: `${el.x}px ${el.y}px`}}/>
            </Container>
          ))
        ))}
      </Container>
    );
  }
}