import urls from "../constants/urls";

/**
 * build url baseی on url category base URL, URL, params and query string
 * @param base - URL group name
 * @param url - URL have to join to base URL of group name
 * @param params
 * @param query
 * @returns {string}
 */
function buildUrl(base, url, params, query) {
  let paramUrl = "", queryString = "";
  if(query) {
    queryString = Object.keys(query).map(key => key + "=" + query[key]).join("&");
    queryString = `?${queryString}`
  }
  if(params) {
    paramUrl = `/${paramUrl}`;
    if(queryString) {
      paramUrl = `${paramUrl}/`
    }
  }
  return `${urls[base].baseUrl}/${url}${paramUrl}${queryString}`;
}