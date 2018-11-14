// src/box/_component/contactList
import React from "react";
import {avatarNameGenerator} from "../../../utils/helpers";

//components
import List, {ListItem} from "raduikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling

export function ContactList(props) {
  const {hasUser, contacts, activeList, onSelect, onDeselect, activeWithTick, actions, selection, invert, multiple} = props;
  let filterContacts = [...contacts];
  if (hasUser) {
    filterContacts = filterContacts.filter(e => e.hasUser);
  }
  return (
    <List>
      {filterContacts.map(el => (
        <ListItem key={el.id}
                  activeWithTick={activeWithTick}
                  selection={selection}
                  multiple={multiple}
                  onSelect={onSelect ? () => onSelect(el.id) : null}
                  onDeselect={onDeselect ? () => onDeselect(el.id) : null}
                  invert={invert}
                  active={activeList && activeList.indexOf(el.id) > -1}>
          <Container relative>
            <Avatar>
              <AvatarImage src={el.image} text={avatarNameGenerator(el.name ? el.name  : `${el.firstName} ${el.lastName}`).letter} textBg={avatarNameGenerator(el.name ? el.name  : `${el.firstName} ${el.lastName}`).color}/>
              <AvatarName>{el.name ? el.name  : `${el.firstName} ${el.lastName}`}</AvatarName>
            </Avatar>

            {actions ?
              <Container absolute centerLeft>
                {actions(el)}
              </Container>
              : ""}

          </Container>
        </ListItem>
      ))}
    </List>
  )
}

export function ContactListSelective(props) {
  let newProps = {...{activeWithTick: true, selection: true, multiple: true, hasUser: true}, ...props};
  return ContactList(newProps);
}

