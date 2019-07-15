// src/box/_component/contactList
import React from "react";
import {avatarNameGenerator} from "../../../utils/helpers";

//components
import List, {ListItem} from "../../../../../uikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "../../../../../uikit/src/avatar";
import Container from "../../../../../uikit/src/container";

//styling

function getName(contact) {
  if (contact.contactName) {
    return contact.contactName;
  }
  if (contact.name) {
    return contact.name;
  }
  if (contact.firstName) {
    return `${contact.firstName}${contact.lastName ?  ` ${contact.lastName}` : ""}`;
  }

}

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
                  onSelect={onSelect ? () => onSelect(el.id, el) : null}
                  onDeselect={onDeselect ? () => onDeselect(el.id, el) : null}
                  invert={invert}
                  active={activeList && activeList.indexOf(el.id) > -1}>
          <Container relative>
            <Avatar>
              <AvatarImage src={el.image} text={avatarNameGenerator(getName(el)).letter}
                           textBg={avatarNameGenerator(getName(el)).color}/>
              <AvatarName maxWidth="150px">{getName(el)}</AvatarName>
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

