import { loader } from 'webpack';
import fm from 'front-matter';
import { hoist } from './utils';
import { md } from './markdown';

const SlidesLoader: loader.Loader = rawSource => {
  const {
    attributes: { defaults = {}, ...attributes },
    body,
  } = fm(rawSource.toString().trim());
  const { hoists, source } = hoist(body);
  const sources = source.split(/<!--\s*slide(?:: (?:.*?)|\s*)-->/).filter(item => Boolean(item.trim()));
  const components: Element[] = sources
    .map((rawSource, index) => {
      const { attributes, body } = fm(rawSource.trim());
      const { hoists, source } = hoist(body, /^notes/);
      const { layout, ...props } = { ...defaults, ...attributes } as any;
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

  const output =
    render({
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

interface Element {
  tag: string;
  props: Record<string, unknown>;
  children: (Element | string)[];
}

function render(element: Element | string): string {
  if (typeof element === 'string') return element;

  return (
    `<${element.tag}${renderAttributes(element.props)}>\n` +
    `${indent(element.children.map(render).join('\n'))}\n` +
    `</${element.tag}>`
  );
}

function indent(source: string): string {
  return source
    .split(/\n/)
    .map(line => '  ' + line)
    .join('\n');
}

function renderAttributes(attrs: Record<string, unknown>): string {
  const props = Object.entries(attrs);

  if (!props.length) return '';

  return (
    ' ' +
    props
      .map(([key, value]) =>
        value === true
          ? key
          : typeof value === 'string'
          ? `${key}=${JSON.stringify(value)}`
          : typeof value === 'object'
          ? `${key}=${JSON.stringify(JSON.stringify(value))}`
          : `:${key}="${JSON.stringify(value)}"`
      )
      .join(' ')
  );
}

export default SlidesLoader;
