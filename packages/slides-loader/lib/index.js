'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fm = _interopDefault(require('front-matter'));
var MarkdownIt = _interopDefault(require('markdown-it'));
var Prism = _interopDefault(require('markdown-it-prism'));

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

const MD = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    linkify: false,
});
MD.use(Prism, { plugins: ['line-numbers'] });
function md(source) {
    return MD.render(source);
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
function renderAttributes(attrs) {
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
