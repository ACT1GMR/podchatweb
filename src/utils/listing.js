function createParams(threadId, offset, loadAfter, query, count) {
  const isOffset = offset && (offset + "").length < 19;
  return {
    threadId,
    offset: isOffset ? offset + 1 : null,
    toTimeFull: isOffset ? null : loadAfter ? null : offset,
    fromTimeFull: isOffset ? null : loadAfter ? offset : null,
    order: isOffset ? "DESC" : loadAfter ? "ASC" : "DESC",
    query,
    count
  }
}

function _getThreadHistory(chatSDK, threadId, count, offsetOrTimeNanos, loadAfter, query) {
  return chatSDK.getThreadMessageList(createParams(threadId, offsetOrTimeNanos, loadAfter, query, count));
}

export function getThreadHistory() {
  return _getThreadHistory.apply(null, arguments);
}

export function getThreadHistoryByQuery(chatSDK, threadId, query, count) {
  return _getThreadHistory(chatSDK, threadId, count, null, null, query);
}

export function getThreadHistoryInMiddle(chatSDK, threadId, timeNano, count) {
  return new Promise((resolve, reject) => {
    _getThreadHistory(chatSDK, threadId, count, timeNano + count, true).then(afterResult => {
      _getThreadHistory(chatSDK, threadId, count, timeNano, false).then(beforeResult => {
        resolve({
          threadId,
          messagesCount: afterResult.contentCount + beforeResult.contentCount,
          hasNext: afterResult.hasNext,
          hasPrevious: beforeResult.hasPrevious,
          messages: [...afterResult.messages, ...beforeResult.messages]
        });
      }, reject);
    }, reject);
  })
}

