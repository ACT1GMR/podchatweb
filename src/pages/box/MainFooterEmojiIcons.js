// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import ReactDOMServer from "react-dom/server";
import classnames from "classnames";
import emojiRegex from "emoji-regex";

//strings

//actions

//components
import Container from "../../../../uikit/src/container";

//styling
import emojiStyle from "../../../styles/utils/emoji.scss";
import style from "../../../styles/pages/box/MainFooterEmojiIcons.scss";
import oneoneImage from "../../../styles/images/_common/oneone.png";
import {mobileCheck} from "../../utils/helpers";
import {emoji, emojiCategories, emojiCatSpriteName, emojiSpriteMeta} from "../../constants/emoji";

function generatePosition(index) {
  const {columns, size} = emojiSpriteMeta;
  const currentColumn = Math.floor(index / columns);
  return {
    x: index > 0 ? -(index * size) : 0,
    y: -(currentColumn * size)
  };
}

function buildEmojiIcon(sizeX, sizeY, catName, emoji) {
  const {scale} = emojiSpriteMeta;
  const classNames = classnames({
    [emojiStyle.emoji]: true,
    [emojiStyle["emoji-inline"]]: true,
    [emojiStyle[`emoji-${catName}`]]: true
  });
  const img = <img className={classNames}
                   alt={emoji}
                   src={oneoneImage}
                   style={{backgroundPosition: `${+sizeX / scale}px ${+sizeY / scale}px`}}/>;

  return ReactDOMServer.renderToStaticMarkup(img);
}

export function codeEmoji(html) {
  if (!html) {
    return html;
  }
  return html.replace(/<img class="emoji.+?>/g, img => {
    return /alt="(.+?)"/g.exec(img)[1];
  });
}

export function decodeEmoji(string) {
  if (!string) {
    return string;
  }
  let decodedEmoji = string.replace(emojiRegex(), match => {
    let index = 0;
    for (const catEmoji of  emojiCategories[0]) {
      const plainEmoji = emoji[catEmoji][0];
      if (plainEmoji === match) {
        const {x, y} = generatePosition(index);
        return buildEmojiIcon(x, y, emojiCatSpriteName[0], match)
      }
      index++;
    }
    return match;
  });

  return decodedEmoji.replace(/:emoji#.+?:/g, match => {
    const realMatch = match.substring(1, match.length - 1);
    const split = realMatch.split("#");
    if (!split[2]) {
      return string;
    }
    const size = split[2].split("*");
    return buildEmojiIcon(size[0], size[1], split[1]);
  });
}

@connect()
export default class MainFooterEmojiIcons extends Component {

  constructor(props) {
    super(props);
    window.foosa = emojiRegex;
  }

  onEmojiClick(emoji, e) {
    e.preventDefault();
    e.stopPropagation();
    const {setInputText, focusInputNode} = this.props;
    setInputText(buildEmojiIcon(emoji.x, emoji.y, emojiCatSpriteName[emoji.cat], emoji.emoji), true);
    if (!mobileCheck()) {
      setTimeout(focusInputNode, 20);
    }
  }

  calculations() {
    const emojiArray = [];
    let index = 0;
    const {rows, columns, size} = emojiSpriteMeta;
    for (const emojiCat of emojiCategories[0]) {
      const plainEmojiObject = emoji[emojiCat];
      emojiArray.push({
        cat: 0,
        emoji: plainEmojiObject[0],
        name: plainEmojiObject[1][0],
        ...generatePosition(index)
      });
      index++;
    }
    return emojiArray;
  }

  render() {
    const emojiArray = this.calculations();
    const classNames = classnames({
      [emojiStyle.emoji]: true,
      [style.MainFooterEmojiIcons__Button]: true
    });
    return (
      <Container inline className={style.MainFooterEmojiIcons} relative>
        {emojiArray.map(emoji => (
          <Container key={emoji.emoji} className={style.MainFooterEmojiIcons__Icon}
                     onClick={this.onEmojiClick.bind(this, emoji)}>
            <Container className={`${emojiStyle[`emoji-${emojiCatSpriteName[emoji.cat]}`]} ${classNames}`}
                       title={emoji.name}
                       style={{backgroundPosition: `${emoji.x}px ${emoji.y}px`}}/>
          </Container>
        ))}
      </Container>
    );
  }
}