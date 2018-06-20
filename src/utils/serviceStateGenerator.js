export const stateObject = (state, response, payloadKey) => {
  let object;
  if (state === "PENDING") {
    object = {fetching: true};
  } else if (state === "REJECTED") {
    object = {fetching: false, fetched: false, error: response};
  } else {
    object = {fetching: false, fetched: true};
  }
  if (response) {
    object = {...object, [payloadKey]: response}
  }
  return object;
};
