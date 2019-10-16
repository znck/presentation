import MarkdownIt from 'markdown-it'
// @ts-ignore
import Prism from 'markdown-it-prism'

const MD = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  linkify: false,
})

MD.use(Prism, { plugins: ['line-numbers'] })

export function md(source: string): string {
  return MD.render(source)
}
