/** Lightweight, human-readable hints for common regex tokens. */
export function explainPattern(pattern) {
  if (!pattern) return ['Enter a regular expression to see hints.']

  const hints = []
  if (pattern.includes('^')) hints.push('^ anchors to the start of a line.')
  if (pattern.includes('$')) hints.push('$ anchors to the end of a line.')
  if (/\(\?<[^>]+>/.test(pattern)) hints.push('Uses named capture groups (?<name>…).')
  if (/\(\?:/.test(pattern)) hints.push('Contains a non-capturing group (?:…).')
  if (/\(\?=/.test(pattern)) hints.push('Uses a positive lookahead (?=…).')
  if (/\(\?!/.test(pattern)) hints.push('Uses a negative lookahead (?!…).')
  if (/\\d/.test(pattern)) hints.push('\\d matches any digit (0–9).')
  if (/\\w/.test(pattern)) hints.push('\\w matches word characters [A-Za-z0-9_].')
  if (/\\s/.test(pattern)) hints.push('\\s matches whitespace.')
  if (/\+/.test(pattern)) hints.push('+ means one or more of the preceding atom.')
  if (/\*/.test(pattern)) hints.push('* means zero or more of the preceding atom.')
  if (/\?/.test(pattern) && !/\(\?/.test(pattern)) hints.push('? makes the preceding atom optional.')
  if (/\{/.test(pattern)) hints.push('{n,m} specifies repetition bounds.')
  if (/\[/.test(pattern)) hints.push('[…] defines a character class.')
  if (pattern.includes('|')) hints.push('| alternates between two patterns.')

  if (!hints.length) hints.push('Custom pattern — matches depend on flags and input text.')
  return hints
}
