const natural = require('natural');
const _ = require('lodash');

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

    const textCopy = text.slice(0);
    const textWithoutSigns = signs.map(({ regex, value }) => textCopy.replace(regex, value));
    const lowerCaseTextWithoutSpaces = textWithoutSigns.toLowerCase().replace(/ /g, '');

    const contextMatches = getMatchingContext(context, lowerCaseTextWithoutSpaces);

    console.log(contextMatches);

    return contextMatches.length ?
      lowerCaseTextWithoutSpaces.replace(contextMatches[0].substring, contextMatches[0].contextWord) :
      lowerCaseTextWithoutSpaces;
  }
}

function getMatchingContext(context, translation) {
  const unsortedContext = context
    .map(contextWord => ({
        contextWord,
        ...natural.LevenshteinDistance(contextWord.toLowerCase(), translation, { search: true })
    }))
    .filter(match => match.substring.length > 2)
    .filter(match => match.distance < 2);

  return _.sortBy(unsortedContext, [
    'distance',
    (context) => - context.substring.length
  ]);
}
