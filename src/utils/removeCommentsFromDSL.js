/**
 * @brief
 * Removes inline and full-line comments from a DSL script.
 *
 * @details
 * This function processes the input DSL code and strips all comments that begin
 * with "//", including both whole-line and inline comments.
 *
 * @param code
 * The DSL script to process.
 * @return 
 * The script with all "//" comments removed.
 *
 * @note
 * Only inline and whole line comments that start with "//" are removed.
 *
 * @author
 * Darshil Gandhi (202301056)
 */

export function removeCommentsFromDSL(code) {
  let result = "";
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inRegex = false;

  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];

    if ((inSingle || inDouble || inTemplate) && c === '\\') {
      result += c + next;
      i++;
      continue;
    }

    if (!inDouble && !inTemplate && !inRegex && c === "'" ) {
      inSingle = !inSingle;
      result += c;
      continue;
    }

    if (!inSingle && !inTemplate && !inRegex && c === '"') {
      inDouble = !inDouble;
      result += c;
      continue;
    }

    if (!inSingle && !inDouble && !inRegex && c === '`') {
      inTemplate = !inTemplate;
      result += c;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate && c === '/' && next && next !== '/' && next !== '*') {
      inRegex = !inRegex;
      result += c;
      continue;
    }

    if (inRegex) {
      result += c;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate && c === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      result += '\n';
      continue;
    }

    result += c;
  }

  return result;
}
