import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function afterBuildCopy() {
  return {
    name: 'after-build-copy',
    writeBundle() {
      // Copy manifest.json
      try {
        if (fs.existsSync('manifest.json')) {
          fs.copyFileSync('manifest.json', path.join('dist', 'manifest.json'));
        }
      } catch {}

      // Ensure assets dir
      const assetsDir = path.join('dist', 'assets');
      try { fs.mkdirSync(assetsDir, { recursive: true }); } catch {}

      // Copy background and pageBridge
      try {
        const bgSrc = path.resolve('src/background.js');
        if (fs.existsSync(bgSrc)) fs.copyFileSync(bgSrc, path.join(assetsDir, 'background.js'));
      } catch {}
      try {
        const bridgeSrc = path.resolve('src/pageBridge.js');
        if (fs.existsSync(bridgeSrc)) fs.copyFileSync(bridgeSrc, path.join(assetsDir, 'pageBridge.js'));
      } catch {}

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

      // Duplicate first CSS file to deterministic names used in manifest and pages
      try {
        const cssFiles = fs.existsSync(assetsDir)
          ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'))
          : [];
        if (cssFiles.length > 0) {
          const cssSrc = path.join(assetsDir, cssFiles[0]);
          for (const name of ['content.css', 'popup.css', 'options.css']) {
            try { fs.copyFileSync(cssSrc, path.join(assetsDir, name)); } catch {}
          }
        }
      } catch {}

      // Copy icons
      try {
        const srcIcons = path.resolve('icons');
        const dstIcons = path.resolve('dist/icons');
        if (fs.existsSync(srcIcons)) {
          fs.mkdirSync(dstIcons, { recursive: true });
          for (const f of fs.readdirSync(srcIcons)) {
            fs.copyFileSync(path.join(srcIcons, f), path.join(dstIcons, f));
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
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, 'src/content/index.html'),
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        options: path.resolve(__dirname, 'src/options/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      }
    }
  },
  plugins: [afterBuildCopy()]
});
