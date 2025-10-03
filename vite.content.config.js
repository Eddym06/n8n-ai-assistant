import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function afterBuildCopy() {
  return {
    name: 'after-build-copy-content',
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

      // Duplicate first CSS file to deterministic names used in manifest
      try {
        const cssFiles = fs.existsSync(assetsDir)
          ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'))
          : [];
        if (cssFiles.length > 0) {
          const cssSrc = path.join(assetsDir, cssFiles[0]);
          try { fs.copyFileSync(cssSrc, path.join(assetsDir, 'content.css')); } catch {}
        } else {
          // Fallback: crear un placeholder vacío para que Chrome no falle al cargar el CSS del manifest
          try { fs.writeFileSync(path.join(assetsDir, 'content.css'), '/* placeholder css for content script */'); } catch {}
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
      },
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  plugins: [afterBuildCopy()]
});
