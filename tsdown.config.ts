import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    extended: 'src/extended/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    tsgo: true,
  },
  clean: true,
  treeshake: true,
  minify: true,
  publint: true,
});
