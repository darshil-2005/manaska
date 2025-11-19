/**
 * @brief
 * Remove quotes from around the string if the string is quoted.
 * 
 * @param
 * Any kind of string.
 * @return
 * Unquoted version fo that string.
 *
 * @author
 * Darshil Gandhi (202301056)
 */

export function unquote(str) {

  if (typeof str !== 'string' || str.length < 2) {
    return str;
  }

  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}
