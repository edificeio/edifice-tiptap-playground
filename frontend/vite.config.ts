/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }: { mode: string }) => {
  // Checking environement files
  const envFile = loadEnv(mode, process.cwd());
  const envs = { ...process.env, ...envFile };
  const hasEnvFile = Object.keys(envFile).length;

  // Proxy variables
  const headers = hasEnvFile
    ? {
        'set-cookie': [
          `oneSessionId=${envs.VITE_ONE_SESSION_ID}`,
          `XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
        ],
        'Cache-Control': 'public, max-age=300',
      }
    : {};

  const proxyObj = hasEnvFile
    ? {
        target: envs.VITE_RECETTE,
        changeOrigin: true,
        headers: {
          cookie: `oneSessionId=${envs.VITE_ONE_SESSION_ID};authenticated=true; XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
        },
      }
    : {
        target: 'http://localhost:8090',
        changeOrigin: false,
      };

  /* Replace "/" the name of your application (e.g : blog | mindmap | collaborativewall) */
  return defineConfig({
    base: mode === 'production' ? '/tiptap' : '',
    root: __dirname,
    cacheDir: './node_modules/.vite/playground',

    server: {
      proxy: {
        '/applications-list': proxyObj,
        '/resources-applications': proxyObj,
        '/conf/public': proxyObj,
        '^/(?=help-1d|help-2d)': proxyObj,
        '^/(?=assets)': proxyObj,
        '^/(?=theme|locale|i18n|skin)': proxyObj,
        '^/(?=auth|appregistry|cas|userbook|directory|communication|conversation|portal|session|timeline|workspace|infra)':
          proxyObj,
        '/blog': proxyObj,
        '/explorer': proxyObj,
        '/mindmap': proxyObj,
        '/pocediteur': proxyObj,
        '/video': proxyObj,
        // needed for linker (behaviours)
        '/actualites/linker/infos': proxyObj,
        '/collaborativewall/list/all': proxyObj,
        '/community/listallpages': proxyObj,
        '/exercizer/subjects-scheduled': proxyObj,
        '/formulaire/forms/linker': proxyObj,
        '/forum/categories': proxyObj,
        '/homeworks/list': proxyObj,
        '/magneto/boards/editable': proxyObj,
        '/mindmap/list/all': proxyObj,
        '/pages/list/all': proxyObj,
        '/poll/list/all': proxyObj,
        '/scrapbook/list/all': proxyObj,
        '/timelinegenerator/timelines': proxyObj,
        '/wiki/listallpages': proxyObj,
      },
      port: 4200,
      headers,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      headers,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: false,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      assetsDir: 'public',
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        external: ['edifice-ts-client'],
        output: {
          inlineDynamicImports: true,
          paths: {
            'edifice-ts-client': '/assets/js/edifice-ts-client/index.js',
          },
        },
      },
    },

    test: {
      watch: false,
      globals: true,
      cache: {
        dir: './node_modules/.vitest/playground',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      setupFiles: ['./src/mocks/setup.vitest.tsx'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './coverage/playground',
        provider: 'v8',
      },
    },
  });
};
