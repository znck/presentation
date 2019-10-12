import MarkdownIt from 'markdown-it'

const MD = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  linkify: false,
})

export function md(source: string): string {
  return MD.render(source)
}
