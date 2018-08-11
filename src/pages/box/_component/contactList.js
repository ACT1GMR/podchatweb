export function contactList(props) {
  const {hasUser, contacts, onSelect, actions} = props;
  let filterContacts = [...contacts];
  if(hasUser) {
    filterContacts = filterContacts.filter(e=>e.hasUser);
  }
  return (
    <List>
      {filterContacts.map(el => (
        <ListItem key={el.id} selection invert onSelect={onSelect ? onSelect() : e=>{}}>
          <Container relative>
            <Avatar>
              <AvatarImage src={el.image ? el.image : defaultAvatar}/>
              <AvatarName>{el.firstName} {el.lastName}</AvatarName>
            </Avatar>

            {actions ?
              <Container absolute centerLeft>
                {actions}
              </Container>
              : ""}

          </Container>
        </ListItem>
      ))}
    </List>
  )
}