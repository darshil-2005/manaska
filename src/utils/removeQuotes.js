export function unquote(str) {
  // Check if it's a valid string with at least 2 chars
  if (typeof str !== 'string' || str.length < 2) {
    return str;
  }

  // Check if it both starts AND ends with a double quote
  if (str.startsWith('"') && str.endsWith('"')) {
    // Return the "inside" of the string
    return str.slice(1, -1);
  }
  
  // If the checks fail, return the original string
  return str;
}
