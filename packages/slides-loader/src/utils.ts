export function hoist(source: string, tagRE = /^(style|script)/) {
  let index = 0;

  const hoists: string[] = [];
  let isCodeBlock = false;

  while (index < source.length) {
    if (source[index] === '`' && source.substr(index).startsWith('```')) {
      index += 2;
      isCodeBlock = !isCodeBlock;
    } else if (!isCodeBlock && source[index] === '<') {
      const match = tagRE.exec(source.substr(index + 1));

      if (match) {
        const start = index;
        const endTag = `</${match[0]}>`;
        let i = index + 1;

        while (i < source.length) {
          if (source[i] === '<' && source[i + 1] === '/' && source.substr(i).startsWith(endTag)) break;
          ++i;
        }

        if (i >= source.length) {
          throw new Error('Expect ' + endTag + '. Not found');
        }

        hoists.push(source.substr(start, i - start + endTag.length));

        source = source.substr(0, index) + source.substr(i + endTag.length);
      }
    }

    ++index;
  }

  return {
    source,
    hoists,
  };
}
