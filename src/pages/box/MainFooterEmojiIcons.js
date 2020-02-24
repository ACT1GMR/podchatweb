// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import ReactDOMServer from "react-dom/server";
import classnames from "classnames";
function emojiRegex(){
  return /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
}

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