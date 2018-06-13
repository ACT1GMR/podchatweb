export const stateObject = (state, response, payloadKey) => {
  if (state === "PENDING") {
    return {fetching: true};
  }
  if (state === "REJECTED") {
    return {fetching: false, fetched: false, error: response};
  }
  return {fetching: false, fetched: true, [payloadKey]: response};
};
