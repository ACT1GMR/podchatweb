// src/box/_component/contactList
import React from "react";
import {avatarNameGenerator} from "../../../utils/helpers";

//components
import List, {ListItem} from "../../../../../uikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "../../../../../uikit/src/avatar";
import Container from "../../../../../uikit/src/container";
import AvatarText from "../../../../../uikit/src/avatar/AvatarText";

//styling

function getName(contact) {
  if (contact.contactName) {
    return contact.contactName;
  }
  if (contact.name) {
    return contact.name;
  }
  if (contact.firstName) {
    return `${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ""}`;
  }

  if (contact.lastName) {
    return contact.lastName;
  }

}

function getImage(contact) {
  if (contact.linkedUser) {
    return contact.linkedUser.image;
  }
  if (contact.image) {
    return contact.image;
  }
  return "";
}

export function ContactList(props) {
  const {hasUser, contacts, activeList, onSelect, onDeselect, activeWithTick, selection, invert, multiple, LeftActionFragment, AvatarTextFragment} = props;
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
              <AvatarImage src={getImage(el)} text={avatarNameGenerator(getName(el)).letter}
                           textBg={avatarNameGenerator(getName(el)).color}/>
              <AvatarName maxWidth="150px">
                {getName(el)}
                {
                  AvatarTextFragment &&
                  <AvatarText>
                    <AvatarTextFragment contact={el}/>
                  </AvatarText>
                }

              </AvatarName>
            </Avatar>

            {LeftActionFragment ?
              <Container absolute centerLeft>
                <LeftActionFragment contact={el}/>
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

