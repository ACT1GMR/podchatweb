import React, {Fragment} from "react";
import List, {ListItem} from "../../../../../uikit/src/list";
import {Text, Heading} from "../../../../../uikit/src/typography";
import Gap from "../../../../../uikit/src/gap";
import strings from "../../../constants/localization";
import {deleteForAllCondition} from "../MainMessagesMessage";
import {messageDelete} from "../../../actions/messageActions";
import {chatModalPrompt} from "../../../actions/chatActions";
import {threadCheckedMessageList, threadSelectMessageShowing} from "../../../actions/threadActions";

export function MessageDeletePrompt(props) {
  const {message, dispatch, thread, user} = props;

  const isBatchMessage = message instanceof Array;
  let isAbleToRemoveForAll = !isBatchMessage ? deleteForAllCondition(message, user, thread) : true;
  let isThereAnyThatYouCanRemoveForOther = false;
  if (isBatchMessage) {
    for (const msg of message) {
      const result = deleteForAllCondition(msg, user, thread);
      if (isAbleToRemoveForAll) {
        if (!result) {
          isAbleToRemoveForAll = result;
        }
      }
      if (result) {
        if (!isThereAnyThatYouCanRemoveForOther) {
          isThereAnyThatYouCanRemoveForOther = true;
        }
      }
    }
  }
  function deleteMessage(forMeOnly, abort, removeIfYouCanForBothSide) {
    dispatch(chatModalPrompt());
    if (abort) {
      dispatch(threadSelectMessageShowing(false));
      dispatch(threadCheckedMessageList(null, null, true));
      return;
    }
    if (isBatchMessage) {
      for (const msg of message) {
        dispatch(messageDelete(msg.id, forMeOnly ? false : removeIfYouCanForBothSide ? deleteForAllCondition(msg, user, thread) : true));
      }
    } else {
      dispatch(messageDelete(message.id, !forMeOnly));
    }
    if (isBatchMessage) {
      dispatch(threadSelectMessageShowing(false));
      dispatch(threadCheckedMessageList(null, null, true));
    }
  }

  return (
    <Fragment>
      <Text
        size="lg">{isBatchMessage && message.length > 1 ? strings.howWeShouldDeleteThisMessageForYou(message.length) : strings.howWeShouldDeleteThisMessageForYou()}؟</Text>
      <Gap y={5}/>
      <List>

        <ListItem key="for-me"
                  selection={true}
                  invert={true}
                  onSelect={deleteMessage.bind(null, true)}>
          <Text bold color="accent">{strings.forMeOnly}</Text>

        </ListItem>

        {(isThereAnyThatYouCanRemoveForOther || isAbleToRemoveForAll) &&
        <ListItem key="for-others-also"
                  color="accent"
                  selection={true}
                  invert={true}
                  onSelect={isThereAnyThatYouCanRemoveForOther && !isAbleToRemoveForAll ? deleteMessage.bind(null, false, false, true) : deleteMessage.bind(null)}>
          <Text bold
                color="accent">{isThereAnyThatYouCanRemoveForOther && !isAbleToRemoveForAll ? strings.removeMessageThatYouCanDeleteForAll : strings.forMeAndOthers}</Text>

        </ListItem>
        }

        <ListItem key="i-canceled"
                  color="accent"
                  selection={true}
                  invert={true}
                  onSelect={deleteMessage.bind(null, false, true)}>
          <Text bold color="accent">{strings.iCanceled}</Text>

        </ListItem>
      </List>
    </Fragment>
  )
}