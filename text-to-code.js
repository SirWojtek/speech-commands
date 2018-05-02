const natural = require('natural');

signs = [
  { regex: /dot/gi, value: '.' },
  { regex: /bracket/gi, value: '(' },
  { regex: /end bracket/gi, value: ')' },
  { regex: /semicolon/gi, value: ';' },
];

module.exports = {
  textToCode: ({ text, context }) => {
    const validContext = context
      .filter(Boolean)
      .filter(word => word.length > 2);
    let result = text.slice(0);

    signs.forEach(({ regex, value }) => result.replace(regex, value));

    result = result.toLowerCase().replace(/ /g, '');

    const contextMatches = validContext.map(contextWord => ({
        contextWord,
        result: natural.LevenshteinDistance(contextWord.toLowerCase(), result, { search: true })
    }))
    .filter(match => match.result.substring.length > 2)
    .filter(match => match.result.distance < 2)
    .sort(match => match.result.distance);

    // TODO: sort first by distance then by match length

    console.log(contextMatches);

    if (contextMatches.length) {
      result = result.replace(contextMatches[0].result.substring, contextMatches[0].contextWord);
    }

    return result;
  }
}
