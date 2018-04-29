
signs = [
  { regex: /dot/gi, value: '.' },
  { regex: /bracket/gi, value: '(' },
  { regex: /end bracket/gi, value: ')' },
  { regex: /semicolon/gi, value: ';' },
];


module.exports = {
  textToCode: ({ text }) => {
    const result = text.slice(0);
    signs.forEach(({ regex, value }) => result.replace(regex, value));
    return result.toLowerCase().replace(/ /g, '');
  }
}
