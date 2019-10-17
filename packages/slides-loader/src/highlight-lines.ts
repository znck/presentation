// Modified from https://github.com/egoist/markdown-it-highlight-lines

const RE = /{([\d,-]+)}/;
const wrapperRE = /^<pre .*?><code>/;

export default (md: any) => {
  md.renderer.rules.fence = (...args: any[]) => {
    const [tokens, idx, options] = args;
    const token = tokens[idx];

    if (!token.lineNumbers) {
      let rawInfo = token.info;

      if (!rawInfo || !RE.test(rawInfo)) {
        token.lineNumbers = [];
      } else {
        const langName = rawInfo.replace(RE, '').trim();
        // ensure the next plugin get the correct lang.
        token.info = langName;

        const parsed = RE.exec(rawInfo);

        token.lineNumbers = (parsed ? parsed![1] : '')
          .split(',')
          .filter(Boolean)
          .map(v => v.split('-').map(v => parseInt(v, 10)));
      }
    }

    const code = options.highlight(token.content, token.info);
    const rawCode = code.replace(wrapperRE, '');
    const LOC = rawCode.split('\n').length;

    return `<FencedCode :loc="${LOC}" :highlights="${JSON.stringify(token.lineNumbers)}" lang=${JSON.stringify(
      token.info || 'text'
    )}>${code}</FencedCode>`;
  };
};
