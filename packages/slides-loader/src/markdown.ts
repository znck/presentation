import Markdown from '@vuepress/markdown';
import HighlightLines from './highlight-lines';
import Snippet from './snippet';

export function md(source: string): string {
  const MD = Markdown({
    lineNumbers: true,
    beforeInstantiate(config: any) {
      Markdown.removePlugin(config, Markdown.PLUGINS.TOC);
      Markdown.removePlugin(config, Markdown.PLUGINS.ANCHOR);
      Markdown.removePlugin(config, Markdown.PLUGINS.HOIST_SCRIPT_STYLE);
      Markdown.removePlugin(config, Markdown.PLUGINS.LINE_NUMBERS);
      Markdown.removePlugin(config, Markdown.PLUGINS.HIGHLIGHT_LINES);
      Markdown.removePlugin(config, Markdown.PLUGINS.PRE_WRAPPER);
      Markdown.removePlugin(config, Markdown.PLUGINS.SNIPPET);

      config
        .plugin('snippet')
        .use(Snippet)
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
