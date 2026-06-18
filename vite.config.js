import { defineConfig } from 'vite';

// ============================================================
//  Vite 主配置
// ============================================================
export default defineConfig({
  root: '.',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // 所有图片都作为独立文件输出（不内联 base64）
  },
});
