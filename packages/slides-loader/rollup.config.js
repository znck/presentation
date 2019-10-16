import ts from 'rollup-plugin-typescript2';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [ts({ tsconfig: 'tsconfig.build.json' })],
  external: ['front-matter', 'markdown-it', 'markdown-it-prism']
};
