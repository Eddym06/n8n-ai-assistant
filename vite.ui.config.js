import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function afterBuildCopyUI() {
  return {
    name: 'after-build-copy-ui',
    writeBundle() {
      // Copy manifest.json (if not already there)
      try {
        if (fs.existsSync('manifest.json')) {
          fs.copyFileSync('manifest.json', path.join('dist', 'manifest.json'));
        }
      } catch {}

      // Ensure assets dir
      const assetsDir = path.join('dist', 'assets');
      try { fs.mkdirSync(assetsDir, { recursive: true }); } catch {}

      // Place popup/options HTML under dist/src/... to match manifest paths
      try {
        const makeHtml = (name) => {
          const built = path.resolve(`dist/${name}.html`);
          const outDir = path.resolve(`dist/src/${name}`);
          if (fs.existsSync(built)) {
            fs.mkdirSync(outDir, { recursive: true });
            fs.copyFileSync(built, path.join(outDir, 'index.html'));
          }
        };
        makeHtml('popup');
        makeHtml('options');
      } catch {}

      // Duplicate a css file for popup/options
      try {
        const cssFiles = fs.existsSync(assetsDir)
          ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'))
          : [];
        if (cssFiles.length > 0) {
          const cssSrc = path.join(assetsDir, cssFiles[0]);
          for (const name of ['popup.css', 'options.css']) {
            try { fs.copyFileSync(cssSrc, path.join(assetsDir, name)); } catch {}
          }
        } else {
          // Fallback: placeholders para evitar errores de carga
          for (const name of ['popup.css', 'options.css']) {
            try { fs.writeFileSync(path.join(assetsDir, name), '/* placeholder css */'); } catch {}
          }
        }
      } catch {}
    }
  };
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        options: path.resolve(__dirname, 'src/options/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  plugins: [afterBuildCopyUI()]
});
