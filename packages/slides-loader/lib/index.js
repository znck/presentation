'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fm = _interopDefault(require('front-matter'));
var Markdown = _interopDefault(require('@vuepress/markdown'));
var fs = _interopDefault(require('fs'));

function hoist(source, tagRE = /^(style|script)/) {
    let index = 0;
    const hoists = [];
    let isCodeBlock = false;
    while (index < source.length) {
        if (source[index] === '`' && source.substr(index).startsWith('```')) {
            index += 2;
            isCodeBlock = !isCodeBlock;
        }
        else if (!isCodeBlock && source[index] === '<') {
            const match = tagRE.exec(source.substr(index + 1));
            if (match) {
                const start = index;
                const endTag = `</${match[0]}>`;
                let i = index + 1;
                while (i < source.length) {
                    if (source[i] === '<' && source[i + 1] === '/' && source.substr(i).startsWith(endTag))
                        break;
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

// Modified from https://github.com/egoist/markdown-it-highlight-lines
const RE = /{([\d,-]+)}/;
const wrapperRE = /^<pre .*?><code>/;
var HighlightLines = (md) => {
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx, options] = args;
        const token = tokens[idx];
        if (!token.lineNumbers) {
            let rawInfo = token.info;
            if (!rawInfo || !RE.test(rawInfo)) {
                token.lineNumbers = [];
            }
            else {
                const langName = rawInfo.replace(RE, '').trim();
                // ensure the next plugin get the correct lang.
                token.info = langName;
                const parsed = RE.exec(rawInfo);
                token.lineNumbers = (parsed ? parsed[1] : '')
                    .split(',')
                    .filter(Boolean)
                    .map(v => v.split('-').map(v => parseInt(v, 10)));
            }
        }
        const code = options.highlight(token.content, token.info);
        const rawCode = code.replace(wrapperRE, '');
        const LOC = rawCode.split('\n').length;
        return `<FencedCode :loc="${LOC}" :highlights="${JSON.stringify(token.lineNumbers)}" lang=${JSON.stringify(token.info || 'text')}>${code}</FencedCode>`;
    };
};

function snippet(md, options = {}) {
    const root = options.root || process.cwd();
    function parser(state, startLine, endLine, silent) {
        const CH = '<'.charCodeAt(0);
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        // if it's indented more than 3 spaces, it should be a code block
        if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
        }
        for (let i = 0; i < 3; ++i) {
            const ch = state.src.charCodeAt(pos + i);
            if (ch !== CH || pos + i >= max)
                return false;
        }
        if (silent) {
            return true;
        }
        const start = pos + 3;
        const end = state.skipSpacesBack(max, pos);
        const rawPath = state.src
            .slice(start, end)
            .trim()
            .replace(/^@/, root);
        const filename = rawPath.split(/[{\s]/).shift();
        const content = fs.existsSync(filename) ? fs.readFileSync(filename).toString() : 'Not found: ' + filename;
        const meta = rawPath.replace(filename, '');
        state.line = startLine + 1;
        const token = state.push('fence', 'code', 0);
        token.info = filename.split('.').pop() + meta;
        token.content = content;
        token.markup = '```';
        token.map = [startLine, startLine + 1];
        token.isSnippet = true;
        return true;
    }
    md.block.ruler.before('fence', 'snippet', parser);
}

function md(source) {
    const MD = Markdown({
        lineNumbers: true,
        beforeInstantiate(config) {
            Markdown.removePlugin(config, Markdown.PLUGINS.TOC);
            Markdown.removePlugin(config, Markdown.PLUGINS.ANCHOR);
            Markdown.removePlugin(config, Markdown.PLUGINS.HOIST_SCRIPT_STYLE);
            Markdown.removePlugin(config, Markdown.PLUGINS.LINE_NUMBERS);
            Markdown.removePlugin(config, Markdown.PLUGINS.HIGHLIGHT_LINES);
            Markdown.removePlugin(config, Markdown.PLUGINS.PRE_WRAPPER);
            Markdown.removePlugin(config, Markdown.PLUGINS.SNIPPET);
            config
                .plugin('snippet')
                .use(snippet)
                .end();
            config
                .plugin('highlight-lines-dynamic')
                .use(HighlightLines)
                .end();
        },
    });
    const result = MD.render(source);
    return result.html;
}

const SlidesLoader = rawSource => {
    const { attributes: { defaults = {}, ...attributes }, body, } = fm(rawSource.toString().trim());
    const { hoists, source } = hoist(body);
    const sources = source.split(/<!--\s*slide(?:: (?:.*?)|\s*)-->/).filter(item => Boolean(item.trim()));
    const components = sources
        .map((rawSource, index) => {
        const { attributes, body } = fm(rawSource.trim());
        const { hoists, source } = hoist(body, /^notes/);
        const { layout, ...props } = { ...defaults, ...attributes };
        const children = [md(source)];
        return [
            {
                tag: 'template',
                props: {
                    [`#${index}`]: true,
                },
                children: layout
                    ? [
                        {
                            tag: layout,
                            props,
                            children,
                        },
                    ]
                    : children,
            },
            ...(hoists.length
                ? [
                    {
                        tag: 'template',
                        props: {
                            [`#notes-${index}`]: true,
                        },
                        children: hoists.map(md),
                    },
                ]
                : []),
        ];
    })
        .reduce((acc, item) => acc.concat(item), []);
    const output = render({
        tag: 'template',
        props: {},
        children: [
            {
                tag: 'VS',
                props: attributes,
                children: [...components, '<slot />'],
            },
        ],
    }) +
        '\n\n' +
        hoists.join('\n\n') +
        '\n';
    return output;
};
function render(element) {
    if (typeof element === 'string')
        return element;
    return (`<${element.tag}${renderAttributes(element.props)}>\n` +
        `${indent(element.children.map(render).join('\n'))}\n` +
        `</${element.tag}>`);
}
function indent(source) {
    return source;
    // return '  ' + source
    //   .split(/\n/)
    //   .map(line => '  ' + line)
    //   .join('\n');
}
function renderAttributes(attrs = {}) {
    const props = Object.entries(attrs);
    if (!props.length)
        return '';
    return (' ' +
        props
            .map(([key, value]) => value === true
            ? key
            : typeof value === 'string'
                ? `${key}=${JSON.stringify(value)}`
                : typeof value === 'object'
                    ? `${key}=${JSON.stringify(JSON.stringify(value))}`
                    : `:${key}="${JSON.stringify(value)}"`)
            .join(' '));
}

module.exports = SlidesLoader;
