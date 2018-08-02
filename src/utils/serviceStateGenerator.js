export const stateObject = (state, response, payloadKey) => {
  let object;
  if (state === "PENDING") {
    object = {fetching: true , fetched: false, error: false};
  } else if (state === "REJECTED") {
    object = {fetching: false, fetched: false, error: response};
  } else {
    object = {fetching: false, fetched: true, error: false};
  }
  if(payloadKey){
    object = {...object, [payloadKey]: response};
  }
  return object;
};
