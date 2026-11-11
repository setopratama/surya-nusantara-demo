import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://surya-nusantara.pages.dev',
  server: {
    host: true,
    port: 4321,
  },
});
