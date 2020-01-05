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
import {mobileCheck} from "../../utils/helpers";

const emojies = [
  {
    columns: 26,
    rows: 7,
    size: 30,
    scale: 1.5,
    name: "common-telegram"
  }];

function buildEmojiIcon(sizeX, sizeY, name) {
  const string = `${name}#${sizeX}*${sizeY}`;
  let scale;
  for (const emoji of emojies) {
    if (emoji.name === name) {
      scale = emoji.scale;
    }
  }
  const classNames = classnames({
    [emojiStyle.emoji]: true,
    [emojiStyle["emoji-inline"]]: true,
    [emojiStyle[`emoji-${name}`]]: true
  });
  const img = <img className={classNames}
                   name={string}
                   src={oneoneImage}
                   style={{backgroundPosition: `${+sizeX / scale}px ${+sizeY / scale}px`}}/>;

  return ReactDOMServer.renderToStaticMarkup(img);
}

export function codeEmoji(html) {
  if (!html) {
    return html;
  }
  return html.replace(/<img class="emoji.+?>/g, img => {
    const name = img.match(/name=".+?"/)[0];
    const split = name.split("=")[1];
    return `:emoji#${split.substring(1, split.length - 1)}:`;
  });
}

export function decodeEmoji(string) {
  if (!string) {
    return string;
  }
  return string.replace(/:emoji#.+?:/g, match => {
    const realMatch = match.substring(1, match.length - 1);
    const split = realMatch.split("#");
    if(!split[2]) {
      return string;
    }
    const size = split[2].split("*");
    return buildEmojiIcon(size[0], size[1], split[1]);
  });
}

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
    const {setInputText, focusInputNode} = this.props;
    setInputText(buildEmojiIcon(el.x, el.y, emoji.name), true);
    if (!mobileCheck()) {
      setTimeout(focusInputNode, 20);
    }
  }

  calculations() {
    const emojiesArray = [];
    for (const emoji of emojies) {
      const {rows, columns, size} = emoji;
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
            <Container key={`${emoji.name}-${el.x}${el.y}`} className={style.MainFooterEmojiIcons__Icon}
                       onClick={this.onEmojiClick.bind(this, el, emoji.info)}>
              <Container className={`${emojiStyle[`emoji-${emoji.info.name}`]} ${classNames}`}
                         style={{backgroundPosition: `${el.x}px ${el.y}px`}}/>
            </Container>
          ))
        ))}
      </Container>
    );
  }
}