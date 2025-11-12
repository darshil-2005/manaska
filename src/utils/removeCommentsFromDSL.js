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
