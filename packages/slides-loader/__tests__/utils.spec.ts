import deindent from 'de-indent';
import { hoist } from '../src/utils';

describe('hoist', () => {
  test('style block', () => {
    const { source, hoists } = hoist(
      deindent(`
        # some text

        <style scoped>
          h1 {
            content: "<script></script>";
          }
        </style>

        ## some more content
      `)
    );

    expect(source.trim()).toBe(
      deindent(`
        # some text

        

        ## some more content
      `).trim()
    )
    expect(hoists.length).toBe(1);
    expect(hoists[0]).toBe(
      deindent(`
        <style scoped>
          h1 {
            content: "<script></script>";
          }
        </style>
      `).trim()
    );
  });
  test('script block', () => {
    const { source, hoists } = hoist(
      deindent(`
        # some text

        <script>
          const foo = '<style></style>';
        </script>

        ## some more content
      `)
    );

    expect(source.trim()).toBe(
      deindent(`
        # some text



        ## some more content
      `).trim()
    )
    expect(hoists.length).toBe(1);
    expect(hoists[0]).toBe(
      deindent(`
        <script>
          const foo = '<style></style>';
        </script>
      `).trim()
    );
  });
});
