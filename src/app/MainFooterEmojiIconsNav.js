// src/list/BoxScene.jss
import React, {Component} from "react";
import classnames from "classnames";

//strings

//actions

//components
import Container from "../../../uikit/src/container";
import {
  FaRegSmileBeam,
  FaRegClock,
  FaCity
} from "react-icons/fa";
import {
  GiFruitTree
} from "react-icons/gi";
import {
  IoIosBuild
} from "react-icons/io";
import {
  FiHash
} from "react-icons/fi";

//styling
import style from "../../styles/pages/box/MainFooterEmojiIconsNav.scss";
import styleVar from "../../styles/variables.scss";
import Strings from "../constants/localization";
import isElementVisible from "../utils/dom";
import Cookies from "js-cookie";
import {emojiCookieName} from "../constants/emoji";

function haveFrequentlyUsed() {
  return !!Cookies.get(emojiCookieName);
}

export default class MainFooterEmojiIconsNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentActiveTab: "recent"
    }
  }

  onNavClick(currentActiveTab) {
    document.getElementById(currentActiveTab).scrollIntoView();
  }

  onScroll(e, target) {
    const {currentActiveTab} = this.state;
    const keys = Object.keys(Strings.emojiCatNames);
    if (haveFrequentlyUsed()) {
      keys.unshift("recent");
    }
    for (const key of keys) {
      if (isElementVisible(document.getElementById(key))) {
        if (currentActiveTab === key) {
          break;
        }
        this.setState({
          currentActiveTab: key
        });
      }
    }
    if (haveFrequentlyUsed()) {
      setTimeout(() => {
        if (target) {
          if (target.scrollTop <= 0) {
            const {currentActiveTab} = this.state;
            if (currentActiveTab !== keys[0]) {
              this.setState({
                currentActiveTab: keys[0]
              });
            }
          }
        }
      }, 30);
    }
  }

  render() {
    const {currentActiveTab} = this.state;
    const classNames = classnames({
      [style.MainFooterEmojiIconsNav]: true
    });
    const itemClassNames = classnames({
      [style.MainFooterEmojiIconsNav__Item]: true
    });
    const iconsConfig = (nav) => ({
      size: styleVar.iconSizeMd,
      color: nav === currentActiveTab ? styleVar.colorAccent : styleVar.colorBackgroundDark
    });
    const correctEmojiCatName = [
      {nav: "people", icon: <FaRegSmileBeam {...iconsConfig("people")}/>},
      {nav: "nature", icon: <GiFruitTree {...iconsConfig("nature")}/>},
      {nav: "things", icon: <IoIosBuild {...iconsConfig("things")}/>},
      {nav: "cityAndTraffic", icon: <FaCity {...iconsConfig("cityAndTraffic")}/>},
      {nav: "numbersClockAndLang", icon: <FiHash {...iconsConfig("numbersClockAndLang")}/>},
    ];
    if (haveFrequentlyUsed()) {
      correctEmojiCatName.unshift({nav: "recent", icon: <FaRegClock {...iconsConfig("recent")}/>});
    }
    return (
      <Container className={classNames}>
        {
          correctEmojiCatName.map(correctEmojiCat => (
            <Container className={itemClassNames}
                       onClick={this.onNavClick.bind(this, correctEmojiCat.nav)}>
              {correctEmojiCat.icon}
              {correctEmojiCat.nav === currentActiveTab &&
              <Container className={style.MainFooterEmojiIconsNav__ActiveItem}/>}
            </Container>
          ))
        }
      </Container>
    )
  }
}