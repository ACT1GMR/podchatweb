import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadMetaUpdate
} from "../../actions/threadActions";
import {chatUploadImage} from "../../actions/chatActions";

//UI components
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import {InputText} from "../../../../uikit/src/input";

//styling
import {MdCameraAlt} from "react-icons/lib/md";
import styleVar from "./../../../styles/variables.scss";
import style from "../../../styles/pages/box/ModalThreadInfoGroupSettings.scss";

@connect(null, null, null, {withRef: true})
export default class ModalThreadInfoGroupSettings extends Component {

  constructor(props) {
    super(props);
    this.onGroupImageChange = this.onGroupImageChange.bind(this);
    this.groupNameChange = this.groupNameChange.bind(this);
    this.state = {
      groupName: ""
    };
  }

  componentDidMount() {
    const {thread} = this.props;
    const {metadata} = thread;
    const metaObject = metadata ? JSON.parse(metadata) : {};
    this.setState({
      groupName: thread.title,
      groupDesc: thread.description,
      image: thread.image
    });
  }

  onGroupImageChange(evt) {
    this.props.dispatch(chatUploadImage(evt.target.files[0], this.props.thread.id, image =>
      this.setState({
        image
      })
    ));
  }

  groupNameChange(event) {
    this.setState({
      groupName: event.target.value
    });
  }

  groupDescChange(event) {
    this.setState({
      groupDesc: event.target.value
    });
  }

  saveSettings() {
    const {groupDesc, image, groupName} = this.state;
    const {thread} = this.props;
    const baseObject = {
      description: groupDesc, image, title: groupName
    };
    if (image) {
      baseObject.image = image;
    }
    this.props.dispatch(threadMetaUpdate(baseObject, thread.id));
  }

  render() {
    const {groupName, groupDesc, image} = this.state;
    const {thread} = this.props;
    const isChannel = thread.type === 8;
    return (
      <Container>
        <Container relative>

          <Container>
            <Avatar>
              <Container relative inline
                         className={style.ModalThreadInfoGroupSettings__ImageContainer}>
                <Container className={style.ModalThreadInfoGroupSettings__ImageOverlay}>
                  <input className={style.ModalThreadInfoGroupSettings__FileInput} type="file"
                         onChange={this.onGroupImageChange}
                         accept="image/*"/>
                  <Container center>
                    <MdCameraAlt size={styleVar.iconSizeLg} color={styleVar.colorWhite}
                                 className={style.ModalThreadInfoGroupSettings__ImageIcon}/>
                  </Container>
                </Container>
                <AvatarImage src={image} size="xlg" text={avatarNameGenerator(thread.title).letter} textBg={avatarNameGenerator(thread.title).color}/>
              </Container>
              <AvatarName>
                <InputText onChange={this.groupNameChange.bind(this)}
                           value={groupName}
                           placeholder={strings.groupName(isChannel)}/>
              </AvatarName>
            </Avatar>
          </Container>
          <InputText onChange={this.groupDescChange.bind(this)}
                     value={groupDesc}
                     placeholder={strings.groupDescription(isChannel)}/>
        </Container>

      </Container>
    )
  }
}
